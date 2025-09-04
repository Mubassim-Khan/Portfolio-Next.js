import PDFDocument from "pdfkit";
import path from "path";
import { createCanvas } from "canvas";
const Chart = (await import("chart.js/auto")).default;


export async function generateReportPDF(reportData: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = createCanvas(600, 300);
      
      const labels: string[] = reportData.projects.map(
        (p: any) => p.projectName
      );
      const dataPoints: number[] = reportData.projects.map(
        (p: any) => p.uptimePct ?? 0
      );

      const fontPath = path.join(
        process.cwd(),
        "public",
        "CentraNo2-Medium.ttf"
      );
      const logoPath = path.join(process.cwd(), "assets", "images", "logo.png");

      const doc = new PDFDocument({ size: "A4", margin: 50, font: fontPath });

      const chunks: Buffer[] = [];

      // Force font at doc creation
      doc.registerFont("Custom", fontPath);
      doc.font("Custom"); // ⬅️ immediately set it so Helvetica never gets used

      doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // ==========================
      //  PAGE 1: COVER PAGE
      // ==========================
      // Logo
      try {
        doc.image(logoPath, doc.page.width / 2 - 40, 50, { width: 80 });
      } catch (err) {
        console.warn("Logo not found, skipping...");
      }

      // Title
      doc.moveDown(6);
      doc.fontSize(25).text("Portfolio Dashboard | Monitoring Report", {
        align: "center",
      });

      doc.moveDown(2);
      doc
        .fontSize(12)
        .text(
          `Generated on: ${new Date(reportData.generatedAt).toLocaleString()}`,
          {
            align: "center",
          }
        );

      const r = reportData.range;
      doc.moveDown(0.5);
      doc
        .fontSize(12)
        .text(
          `Date range: ${new Date(r.start).toLocaleString()} — ${new Date(
            r.end
          ).toLocaleString()}`,
          { align: "center" }
        );

      doc.addPage();

      // ==========================
      //  PAGE 2: TABLE OF CONTENTS
      // ==========================
      doc
        .fontSize(23)
        .text("Table of Contents", { underline: true, align: "center" });
      doc.moveDown(1);

      const tocEntries = [
        { title: "Summary", id: "summary" },
        { title: `Projects (${reportData.projects.length})`, id: "projects" },
        { title: "Incidents", id: "incidents" },
        { title: "Logs", id: "logs" },
        { title: "Visuals", id: "visuals" },
      ];

      tocEntries.forEach((entry) => {
        const y = doc.y;
        doc
          .fontSize(12)
          .fillColor("black")
          .text(entry.title, {
            link: "#" + entry.id,
            underline: true,
            align: "left",
          });
        doc.moveDown(0.5);
      });

      doc.addPage();

      // ==========================
      //  PAGE 3+: CONTENT
      // ==========================

      // ---- Summary ----
      doc.addNamedDestination("summary");
      doc
        .fontSize(23)
        .fillColor("black")
        .text("Summary", { underline: true, align: "center" });
      doc.moveDown(0.5);

      const t = reportData.totals;
      doc
        .fontSize(11)
        .list([
          `Projects: ${t.projects}`,
          `Total checks: ${t.totalChecks}`,
          `Average uptime (avg of projects): ${Number(
            t.overallUptime || 0
          ).toFixed(2)}%`,
        ]);
      doc.moveDown();

      // ---- Projects ----
      doc.addNamedDestination("projects");
      doc.fontSize(23).text("Projects", { underline: true, align: "center" });
      doc.moveDown(0.5);

      for (const [idx, p] of reportData.projects.entries()) {
        if (idx > 0) {
          doc
            .moveDown(1)
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke()
            .moveDown(1);
        }

        doc.fontSize(14).text(p.projectName, { underline: true });
        doc.fontSize(10).text(p.url);
        doc.moveDown(0.5);

        doc.fontSize(11).text("Stats:");
        doc
          .fontSize(10)
          .list([
            `Total checks: ${p.totalChecks}`,
            `Up: ${p.upCount}`,
            `Down: ${p.downCount}`,
            `Uptime %: ${p.uptimePct ?? "N/A"}`,
            `Avg response (ms): ${p.avgResponse ?? "N/A"}`,
          ]);

        // ---- Incidents ----
        if (p.incidents?.length) {
          doc.addNamedDestination("incidents");
          doc.moveDown(0.5).fontSize(11).text("Recent Incidents:");
          p.incidents.slice(0, 5).forEach((inc: any, i: number) => {
            doc
              .fontSize(9)
              .text(
                `${i + 1}. ${new Date(inc.checkedAt).toLocaleString()} — ${
                  inc.errorMessage || `HTTP ${inc.httpStatus || "-"}`
                }`
              );
          });
        }

        // ---- Logs ----
        if (reportData.options.includeRawLogs && p.logs?.length) {
          doc.addNamedDestination("logs");
          doc.moveDown(0.5).fontSize(11).text("Logs (latest):");
          p.logs.slice(0, 20).forEach((l: any) => {
            doc
              .fontSize(8)
              .text(
                `${new Date(l.checkedAt).toLocaleString()} | ${
                  l.status ? "UP" : "DOWN"
                } | ${l.responseTime ?? "-"}ms | ${l.httpStatus ?? "-"} | ${
                  l.errorMessage ?? "-"
                }`
              );
          });
        }
      }

      // ---- Visuals ----
      doc.addPage();
      doc.addNamedDestination("visuals");
      doc
        .fontSize(23)
        .text("Visuals & Graphs", { underline: true, align: "center" });
      doc.moveDown(0.5);

      // Chart.js
      new Chart(canvas as any, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Uptime %",
              data: dataPoints,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: { scales: { y: { beginAtZero: true, max: 100 } } },
      });

      const chartImg = canvas.toBuffer("image/png");
      doc.image(chartImg, { fit: [500, 250], align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

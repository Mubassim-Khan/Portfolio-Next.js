import PDFDocument from "pdfkit";
import path from "path";
import { createCanvas } from "canvas";
import { ChartConfiguration } from "chart.js";
const Chart = (await import("chart.js/auto")).default;

export interface ReportOptions {
  includeEverything?: boolean;
  includeSummary?: boolean;
  includeCharts?: boolean;
  includeRawLogs?: boolean;
  includeTables?: boolean;

  // range
  range: {
    start: string;
    end: string;
    type?: "day" | "week" | "month" | "year";
  };

  // other config
  format?: "pdf" | "csv";
  maxLogs?: number;
  projectId?: string | null;
}

// The actual dataset we feed to the PDF/CSV generator
export interface ReportData {
  id: string;
  title: string;
  recipients: string[];
  date: string;
  generatedAt: string;
  range: { start: string; end: string; type?: string };

  options: {
    includeRawLogs?: boolean;
  };
  projects: {
    projectId: string;
    projectName: string;
    url: string | null;
    totalChecks: number;
    upCount: number;
    downCount: number;
    uptimePct: number | null;
    avgResponse: number | null;
    incidents: {
      checkedAt: string;
      errorMessage?: string;
      httpStatus?: number;
    }[];
    logs: {
      checkedAt: string;
      status: boolean;
      responseTime?: number;
      httpStatus?: number;
      errorMessage?: string;
    }[];
  }[];

  totals: {
    projects: number;
    totalChecks: number;
    overallUptime: number | null;
  };
}

export async function generateReportPDF(
  reportData: ReportData
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = createCanvas(600, 300);

      const labels: string[] = reportData.projects.map((p) => p.projectName);
      const dataPoints: number[] = reportData.projects.map(
        (p) => p.uptimePct ?? 0
      );

      const fontPath = path.join(
        process.cwd(),
        "public",
        "assets",
        "fonts",
        "CentraNo2-Medium.ttf"
      );
      const logoPath = path.join(
        process.cwd(),
        "public",
        "assets",
        "images",
        "logo.png"
      );

      const doc = new PDFDocument({ size: "A4", margin: 50, font: fontPath });
      const chunks: Buffer[] = [];

      doc.registerFont("Custom", fontPath);
      doc.font("Custom");

      doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // ==========================
      // Cover Page
      // ==========================
      try {
        doc.image(logoPath, doc.page.width / 2 - 40, 50, { width: 80 });
      } catch {
        console.warn("Logo not found, skipping...");
      }

      doc.moveDown(6);
      doc
        .fontSize(25)
        .text("Portfolio Dashboard | Monitoring Report", { align: "center" });
      doc.moveDown(2);

      // Fix: Format generatedAt date properly
      const generatedDate = new Date(reportData.generatedAt);
      doc.fontSize(12).text(
        `Generated on: ${generatedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })} at ${generatedDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        })}`,
        { align: "center" }
      );

      const r = reportData.range;

      // Debug log to see what dates we're receiving
      console.log("PDF Generation - Date Range Received:", {
        start: r.start,
        end: r.end,
        parsedStart: new Date(r.start),
        parsedEnd: new Date(r.end),
      });

      // Fix: Parse dates properly and format them
      const startDate = new Date(r.start);
      const endDate = new Date(r.end);

      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error("Invalid dates received:", {
          start: r.start,
          end: r.end,
        });
      }

      doc.moveDown(0.5);
      doc.fontSize(12).text(
        `Date range: ${startDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })} — ${endDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        { align: "center" }
      );

      // Continue with the rest of the PDF generation...
      doc.addPage();

      // ==========================
      // Table of Contents
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
      // Summary
      // ==========================
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

      // ==========================
      // Projects
      // ==========================
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
        doc.fontSize(10).text(p.url ?? "N/A");
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

        if (p.incidents?.length) {
          doc.addNamedDestination("incidents");
          doc.moveDown(0.5).fontSize(11).text("Recent Incidents:");
          p.incidents.slice(0, 5).forEach((inc, i) => {
            const incidentDate = new Date(inc.checkedAt);
            doc
              .fontSize(9)
              .text(
                `${
                  i + 1
                }. ${incidentDate.toLocaleDateString()} ${incidentDate.toLocaleTimeString()} — ${
                  inc.errorMessage ?? `HTTP ${inc.httpStatus ?? "-"}`
                }`
              );
          });
        }

        if (reportData.options.includeRawLogs && p.logs?.length) {
          doc.addNamedDestination("logs");
          doc.moveDown(0.5).fontSize(11).text("Logs (latest):");
          p.logs.slice(0, 20).forEach((l) => {
            const logDate = new Date(l.checkedAt);
            doc
              .fontSize(8)
              .text(
                `${logDate.toLocaleDateString()} ${logDate.toLocaleTimeString()} | ${
                  l.status ? "UP" : "DOWN"
                } | ${l.responseTime ?? "-"}ms | ${l.httpStatus ?? "-"} | ${
                  l.errorMessage ?? "-"
                }`
              );
          });
        }
      }

      // ==========================
      // Visuals
      // ==========================
      doc.addPage();
      doc.addNamedDestination("visuals");
      doc
        .fontSize(23)
        .text("Visuals & Graphs", { underline: true, align: "center" });
      doc.moveDown(0.5);

      const config: ChartConfiguration<"bar"> = {
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
      };

      new Chart(canvas as unknown as HTMLCanvasElement, config);

      const chartImg = canvas.toBuffer("image/png");
      doc.image(chartImg, { fit: [500, 250], align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

import PDFDocument from "pdfkit";
import path from "path";
import { CloudCog } from "lucide-react";

export async function generateReportPDF(reportData: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const fontPath = path.join(
        process.cwd(),
        "public",
        "CentraNo2-Medium.ttf"
      );

      const doc = new PDFDocument({ size: "A4", margin: 40, font: fontPath });

      const chunks: Buffer[] = [];

      // Force font at doc creation
      doc.registerFont("Custom", fontPath);
      doc.font("Custom"); // ⬅️ immediately set it so Helvetica never gets used

      doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // Header
      doc.fontSize(18).text("Monitoring Report", { align: "center" });
      doc.moveDown(0.5);
      doc
        .fontSize(10)
        .text(
          `Generated: ${new Date(reportData.generatedAt).toLocaleString()}`,
          { align: "center" }
        );
      doc.moveDown();

      // Range
      const r = reportData.range;
      doc
        .fontSize(11)
        .text(
          `Date range: ${new Date(r.start).toLocaleString()} — ${new Date(
            r.end
          ).toLocaleString()}`
        );
      doc.moveDown();

      // Totals summary
      doc.fontSize(12).text("Summary", { underline: true });
      doc.moveDown(0.25);
      const t = reportData.totals;
      doc
        .fontSize(10)
        .list([
          `Projects: ${t.projects}`,
          `Total checks: ${t.totalChecks}`,
          `Average uptime (avg of projects): ${Number(
            t.overallUptime || 0
          ).toFixed(2)}%`,
        ]);
      doc.moveDown();

      // Per-project
      for (const p of reportData.projects) {
        doc.addPage();
        doc.fontSize(14).text(p.projectName);
        doc.fontSize(10).text(p.url);
        doc.moveDown(0.25);
        doc.fontSize(11).text("Stats:", { underline: true });
        doc
          .fontSize(10)
          .list([
            `Total checks: ${p.totalChecks}`,
            `Up: ${p.upCount}`,
            `Down: ${p.downCount}`,
            `Uptime %: ${p.uptimePct ?? "N/A"}`,
            `Avg response (ms): ${p.avgResponse ?? "N/A"}`,
          ]);
        doc.moveDown();

        if (p.incidents && p.incidents.length) {
          doc
            .fontSize(11)
            .text("Recent Incidents (sample):", { underline: true });
          doc.moveDown(0.25);
          p.incidents.forEach((inc: any, idx: number) => {
            doc
              .fontSize(9)
              .text(
                `${idx + 1}. ${new Date(inc.checkedAt).toLocaleString()} — ${
                  inc.errorMessage || `HTTP ${inc.httpStatus || "-"}`
                }`
              );
          });
          doc.moveDown();
        }

        // Optionally include a log table - keep compact
        if (reportData.options.includeRawLogs) {
          doc.fontSize(11).text("Logs (latest):", { underline: true });
          doc.moveDown(0.25);
          const lines = p.logs
            .slice(0, 50)
            .map(
              (l: any) =>
                `${new Date(l.checkedAt).toLocaleString()} | ${
                  l.status ? "UP" : "DOWN"
                } | ${l.responseTime ?? "-"}ms | ${l.httpStatus ?? "-"} | ${
                  l.errorMessage ?? "-"
                }`
            );
          const chunkSize = 40;
          for (let i = 0; i < lines.length; i += chunkSize) {
            const slice = lines.slice(i, i + chunkSize);
            slice.forEach((ln: string) => doc.fontSize(8).text(ln));
            doc.moveDown(0.25);
          }
        }
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

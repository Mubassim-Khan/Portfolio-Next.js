import { NextResponse } from "next/server";
import { generateReportData } from "@/lib/reports/generateReportData";
import { generateReportPDF } from "@/lib/reports/generateReportPDF";
import { generateReportCSV } from "@/lib/reports/generateReportCSV";

// Force Node runtime (critical for PDFKit / Buffers)
export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { options, action = "preview", format = "pdf" } = body;

    const reportData = await generateReportData(options);

    if (action === "preview") {
      return NextResponse.json({ report: reportData });
    }

    if (format === "csv") {
      // sanitize projects so `url` is always a string — generateReportCSV expects ReportData with string urls
      const sanitizedReportData = {
        ...reportData,
        projects: reportData.projects.map((p) => ({ ...p, url: p.url ?? "" })),
      } as unknown as Parameters<typeof generateReportCSV>[0];

      const csvBuffer = await generateReportCSV(sanitizedReportData);

      if (action === "download") {
        const uint8Array = new Uint8Array(csvBuffer);
        return new Response(uint8Array, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="report.csv"',
          },
        });
      }

      return NextResponse.json({
        report: reportData,
        csvBase64: csvBuffer.toString("base64"),
      });
    }

    // 🔹 PDF
    // @ts-expect-error reportData doesn’t match ReportData fully
    const pdfBuffer = await generateReportPDF(reportData);

    if (action === "download") {
      const uint8Array = new Uint8Array(pdfBuffer);
      return new Response(uint8Array, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="report.pdf"',
        },
      });
    }

    return NextResponse.json({
      report: reportData,
      pdfBase64: pdfBuffer.toString("base64"),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

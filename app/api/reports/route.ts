import { NextResponse } from "next/server";
import { generateReportData } from "@/lib/reports/generateReportData";
import { generateReportPDF } from "@/lib/reports/generateReportPDF";
import { generateReportCSV } from "@/lib/reports/generateReportCSV";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body should contain options: { options: ReportOptions, action: "download"|"email"|"preview", format: "pdf"|"csv" }
    const { options, action = "preview", format = "pdf" } = body;

    const reportData = await generateReportData(options);

    if (action === "preview") {
      // return raw JSON for preview on frontend
      return NextResponse.json({ report: reportData });
    }

    if (format === "csv") {
      const csvBuffer = await generateReportCSV(reportData);
      if (action === "download") {
        return new NextResponse(new Uint8Array(csvBuffer), {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="report.csv"`,
          },
        });
      }
      // else return base64 for attaching
      return NextResponse.json({
        report: reportData,
        csvBase64: csvBuffer.toString("base64"),
      });
    } else {
      const pdfBuffer = await generateReportPDF(reportData);
      if (action === "download") {
        return new NextResponse(new Uint8Array(pdfBuffer), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="report.pdf"`,
          },
        });
      }
      return NextResponse.json({
        report: reportData,
        pdfBase64: pdfBuffer.toString("base64"),
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { generateReportData } from "@/lib/reports/generateReportData";
import { generateReportPDF } from "@/lib/reports/generateReportPDF";
import { generateReportCSV } from "@/lib/reports/generateReportCSV";
import { sendReportMail } from "@/lib/email/sendReportMail";

export async function POST(req: Request) {
  try {
    const { email, options, subject, format = "pdf" } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const reportData = await generateReportData(options);
    if (format === "csv") {
      const csvBuffer = await generateReportCSV(reportData);

      const result = await sendReportMail({
        to: email,
        subject: subject || "Your Report",
        text: "Please find attached your report (CSV).",
        html: undefined,
        attachment: {
          filename: "report.csv",
          content: csvBuffer,
          contentType: "text/csv",
        },
      });

      if (!result.success) {
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        );
      }
      return NextResponse.json({ message: "Report emailed" });
    } else {
      // @ts-expect-error reportData doesn’t match ReportData fully
      const pdfBuffer = await generateReportPDF(reportData);
      const result = await sendReportMail({
        to: email,
        subject: subject || "Your Report",
        text: "Please find attached your report (PDF).",
        html: undefined,
        attachment: {
          filename: "report.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      });

      if (!result.success) {
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        );
      }
      return NextResponse.json({ message: "Report emailed" });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send report" },
      { status: 500 }
    );
  }
}

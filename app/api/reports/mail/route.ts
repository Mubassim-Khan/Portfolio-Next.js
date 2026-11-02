import { NextResponse } from "next/server";
import { generateReportData } from "@/lib/reports/generateReportData";
import { generateReportPDF } from "@/lib/reports/generateReportPDF";
import { generateReportCSV } from "@/lib/reports/generateReportCSV";
import { sendReportMail } from "@/lib/email/sendReportMail";

export async function POST(req: Request) {
  try {
    const { options, subject, format = "pdf" } = await req.json();

    // Reports always go to the configured owner address
    const email = process.env.MY_EMAIL;
    if (!email) {
      return NextResponse.json(
        { error: "MY_EMAIL environment variable is not configured" },
        { status: 500 }
      );
    }

    const reportData = await generateReportData(options);
    if (format === "csv") {
      // Ensure project URLs are strings (convert null to empty string) to satisfy ReportData shape
      const sanitizedReportData = {
        ...reportData,
        projects: reportData.projects.map((p) => ({
          ...p,
          url: p.url ?? "",
        })),
      };

      const csvBuffer = await generateReportCSV(sanitizedReportData);

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

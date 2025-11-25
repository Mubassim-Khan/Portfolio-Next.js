import { NextResponse } from "next/server";
import { generateReportPDF, ReportData } from "@/lib/reports/generateReportPDF";
import { sendReportMail } from "@/lib/email/sendReportMail";

export async function GET() {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).toISOString();

    const reportData: ReportData = {
      id: "report-123",
      title: "Monitoring Report",
      recipients: [process.env.MY_EMAIL!],
      date: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      range: {
        start,
        end,
        type: "month",
      },
      options: {
        includeRawLogs: false,
      },
      totals: {
        projects: 0, // dynamically calculate if you pull real projects
        totalChecks: 0,
        overallUptime: null,
      },
      projects: [], // dynamically fill if you fetch projects/logs
    };

    // Now pass the correct type
    const reportBuffer = await generateReportPDF(reportData);

    // Send to configured admin email(s)
    await sendReportMail({
      to: process.env.MY_EMAIL!,
      subject: "Monthly Project Status Report",
      text: "Attached is the monthly status report.",
      attachment: {
        filename: "monthly_report.pdf",
        content: reportBuffer,
        contentType: "application/pdf",
      },
    });

    return NextResponse.json({ success: true, message: "Monthly report sent" });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

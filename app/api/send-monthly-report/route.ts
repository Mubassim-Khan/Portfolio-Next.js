import { NextResponse } from "next/server";
import { generateReportPDF } from "@/lib/reports/generateReportPDF";
import { sendReportMail } from "@/lib/email/sendReportMail";

export async function GET() {
  try {
    // Default monthly report: past 1 month, all sections included
    const reportBuffer = await generateReportPDF({
      includeAll: true,
      format: "pdf",
      range: { type: "month" },
    });

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
  } catch (error: any) {
    console.error("Monthly report error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

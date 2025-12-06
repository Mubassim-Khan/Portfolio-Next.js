import { NextResponse } from "next/server";
import { generateReportData } from "@/lib/reports/generateReportData";
import { generateReportPDF } from "@/lib/reports/generateReportPDF";
import { sendReportMail } from "@/lib/email/sendReportMail";

export async function GET() {
  try {
    // Check if MY_EMAIL is configured
    const myEmail = process.env.MY_EMAIL;
    if (!myEmail) {
      return NextResponse.json(
        { error: "MY_EMAIL environment variable is not configured" },
        { status: 500 }
      );
    }

    // Set date range for previous month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Calculate previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Format month name for email subject
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[prevMonth];
    const emailSubject = `Monthly Report: ${monthName} ${prevMonthYear}`;

    // Define options for report generation (previous month's data)
    const options = {
      range: "last_month" as const, 
      includeEverything: true,
      includeRawLogs: false,
      format: "pdf" as const,
    };

    // Generate report data using your existing function
    const reportData = await generateReportData(options);

    // Generate PDF using your existing function
    // @ts-expect-error reportData doesn't match ReportData fully (url can be null)
    const pdfBuffer = await generateReportPDF(reportData);

    // Send email using your existing function
    const result = await sendReportMail({
      to: myEmail,
      subject: emailSubject,
      text: `Attached is the monthly project status report for ${monthName} ${prevMonthYear}.`,
      html: undefined,
      attachment: {
        filename: `monthly_report_${prevMonthYear}_${String(
          prevMonth + 1
        ).padStart(2, "0")}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    });

    if (!result.success) {
      throw new Error("Failed to send email");
    }

    return NextResponse.json({
      success: true,
      message: "Monthly report sent successfully",
    });
  } catch (err: unknown) {
    console.error("Monthly report error:", err);

    return NextResponse.json(
      {
        error: "Failed to generate and send monthly report",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

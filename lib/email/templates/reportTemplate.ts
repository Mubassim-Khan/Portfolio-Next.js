// lib/email/templates/reportTemplate.ts
export const reportEmailTemplate = (
  recipientEmail: string,
  title = "Your Report"
) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width"/>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#f9fafb; color:#111827; }
        .container { max-width:680px; margin:24px auto; background:#fff; padding:20px; border-radius:8px; box-shadow: 0 6px 18px rgba(16,24,40,0.06);}
        h1 { color:#2563eb; font-size:20px; margin-bottom:8px; }
        p { line-height:1.6; color:#374151; }
        .cta { display:inline-block; padding:8px 14px; background:#2563eb; color:#fff; border-radius:6px; text-decoration:none; }
        .meta { font-size:12px; color:#6b7280; margin-top:12px; }
        .footer { font-size:12px; color:#9ca3af; margin-top:18px; }
        pre { background:#f3f4f6; padding:10px; border-radius:6px; white-space:pre-wrap; font-size:12px; color:#111827;}
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title} 📊</h1>
        <p>Hello ${recipientEmail},</p>
        <p>Your requested report has been generated. The full file is attached to this email (PDF/CSV depending on your choice).</p>
        <p>If you want a quick summary, see the details in the attachment or contact the dashboard for custom queries.</p>
        <div class="meta">Generated on ${new Date().toLocaleString()}</div>
        <div class="footer">© ${new Date().getFullYear()} Portfolio Dashboard</div>
      </div>
    </body>
  </html>
  `;
};

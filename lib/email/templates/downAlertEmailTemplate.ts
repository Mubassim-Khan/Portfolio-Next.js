export interface DownProject {
  name: string;
  url: string | null;
  reason: string;
  httpStatus: number | null;
  /** true when the project went down in this check run (vs. still down from an earlier run) */
  isNew: boolean;
}

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function downAlertEmailTemplate(projects: DownProject[], checkedAt = new Date()) {
  const rows = projects
    .map(
      (p) => `
        <tr>
          <td style="padding:8px 10px;border-bottom:1px solid #eee;">
            <strong>${escape(p.name)}</strong>${p.isNew ? "" : ' <span style="color:#888;font-size:11px;">(still down)</span>'}<br/>
            ${p.url ? `<a href="${escape(p.url)}" style="color:#1a73e8;font-size:12px;text-decoration:none;">${escape(p.url)}</a>` : ""}
          </td>
          <td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:center;">${p.httpStatus ?? "—"}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #eee;color:#c62828;">${escape(p.reason)}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 680px;">
      <h2>${projects.length} project${projects.length === 1 ? " is" : "s are"} DOWN ❌</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#18181b;color:#fff;text-align:left;">
            <th style="padding:8px 10px;">Project</th>
            <th style="padding:8px 10px;text-align:center;">Status</th>
            <th style="padding:8px 10px;">Reason</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p>Checked at: ${checkedAt.toLocaleString()}</p>
      <p>Head over to <a href="https://mubassim.vercel.app/dashboard" style="color: #1a73e8; text-decoration: none;">Portfolio Dashboard</a> for more information.</p>
      <p>— Portfolio Dashboard </p>
    </div>
  `;
}

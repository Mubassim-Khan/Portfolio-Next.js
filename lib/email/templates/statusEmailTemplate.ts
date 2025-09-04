export default function statusEmailTemplate(
  projectName: string,
  status: boolean,
  errorMsg?: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>${projectName} is now ${status ? "UP ✅" : "DOWN ❌"}</h2>
      ${errorMsg ? `<p style="color: red;">Error: ${errorMsg}</p>` : ""}
      <p>Checked at: ${new Date().toLocaleString()}</p>
      <p>Head over to <a href="https://mubassim.vercel.app/dashboard" style="color: #1a73e8; text-decoration: none;">Portfolio Dashboard</a> for more information.</p>
      <p>— Portfolio Dashboard </p>
    </div>
  `;
}

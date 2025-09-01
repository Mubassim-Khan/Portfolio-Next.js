import { Parser } from "json2csv";

export async function generateReportCSV(reportData: any): Promise<Buffer> {
  // For CSV, we will create two CSVs: summary and logs (flattened) and join them
  const summary = {
    generatedAt: reportData.generatedAt,
    rangeStart: reportData.range.start,
    rangeEnd: reportData.range.end,
    totalProjects: reportData.totals.projects,
    totalChecks: reportData.totals.totalChecks,
    overallUptime: Number(reportData.totals.overallUptime || 0).toFixed(2),
  };

  // Flatten logs for CSV
  const logsRows: any[] = [];
  for (const p of reportData.projects) {
    for (const l of p.logs) {
      logsRows.push({
        projectId: p.projectId,
        projectName: p.projectName,
        checkedAt: l.checkedAt,
        status: l.status ? "UP" : "DOWN",
        responseTime: l.responseTime ?? "",
        httpStatus: l.httpStatus ?? "",
        errorMessage: l.errorMessage ?? "",
      });
    }
  }

  const parserSummary = new Parser({ fields: Object.keys(summary) });
  const summaryCsv = parserSummary.parse([summary]);

  const parserLogs = new Parser({ fields: Object.keys(logsRows[0] || {}) });
  const logsCsv = logsRows.length ? parserLogs.parse(logsRows) : "";

  // Combine with separator
  const combined = `# Summary\n${summaryCsv}\n\n# Logs\n${logsCsv}`;
  return Buffer.from(combined, "utf8");
}

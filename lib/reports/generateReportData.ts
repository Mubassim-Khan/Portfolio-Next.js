import { prisma } from "@/lib/prisma";

export type RangeOption =
  | "last_7_days"
  | "last_month"
  | "last_year"
  | "year"
  | "custom";

export interface ReportOptions {
  includeEverything?: boolean;
  includeSummary?: boolean;
  includeCharts?: boolean;
  includeRawLogs?: boolean;
  includeTables?: boolean;
  // time
  range: RangeOption;
  // for custom:
  start?: string; // ISO
  end?: string; // ISO
  format?: "pdf" | "csv";
  // limit number of logs if needed
  maxLogs?: number;
  // optionally projectId to scope report
  projectId?: string | null;
}

function getRangeDates(opts: ReportOptions) {
  const now = new Date();
  switch (opts.range) {
    case "last_7_days": {
      const end = now;
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      return { start, end };
    }
    case "last_month": {
      const end = now;
      const start = new Date(now);
      start.setMonth(now.getMonth() - 1);
      return { start, end };
    }
    case "last_year": {
      const end = now;
      const start = new Date(now);
      start.setFullYear(now.getFullYear() - 1);
      return { start, end };
    }
    case "custom": {
      const start = opts.start ? new Date(opts.start) : now;
      const end = opts.end ? new Date(opts.end) : now;
      return { start, end };
    }
    default: // "year"
      return { start: new Date(now.getFullYear(), 0, 1), end: now };
  }
}

export async function generateReportData(opts: ReportOptions) {
  const { start, end } = getRangeDates(opts);

  // Query projects (scope by projectId if provided)
  const projects = await prisma.project.findMany({
    where: opts.projectId ? { id: opts.projectId } : {},
    include: {
      logs: {
        where: {
          checkedAt: {
            gte: start,
            lte: end,
          },
        },
        orderBy: { checkedAt: "desc" },
        take: opts.maxLogs ?? 200,
      },
    },
  });

  // Build per-project stats
  const projectSummaries = projects.map((p) => {
    const total = p.logs.length;
    const up = p.logs.filter((l) => l.status).length;
    const down = total - up;
    const uptimePct =
      total === 0 ? null : Number(((up / total) * 100).toFixed(2));
    const avgResponse =
      total === 0
        ? null
        : Math.round(
            p.logs.reduce((s, l) => s + (l.responseTime ?? 0), 0) / total || 0
          );

    // sample incidents (recent down logs)
    const incidents = p.logs
      .filter((l) => !l.status)
      .slice(0, 10)
      .map((l) => ({
        checkedAt: l.checkedAt,
        httpStatus: l.httpStatus,
        responseTime: l.responseTime,
        errorMessage: l.errorMessage,
      }));

    return {
      projectId: p.id,
      projectName: p.name,
      url: p.url,
      totalChecks: total,
      upCount: up,
      downCount: down,
      uptimePct,
      avgResponse,
      incidents,
      logs: p.logs.map((l) => ({
        checkedAt: l.checkedAt,
        status: l.status,
        httpStatus: l.httpStatus,
        responseTime: l.responseTime,
        errorMessage: l.errorMessage,
      })),
    };
  });

  // Global aggregates
  const totals = {
    projects: projects.length,
    totalChecks: projectSummaries.reduce((s, p) => s + p.totalChecks, 0),
    overallUptime:
      projectSummaries.reduce((s, p) => s + (p.uptimePct ?? 0), 0) /
      (projectSummaries.filter((p) => p.uptimePct !== null).length || 1),
  };

  const report = {
    generatedAt: new Date().toISOString(),
    range: { start: start.toISOString(), end: end.toISOString() },
    options: opts,
    totals,
    projects: projectSummaries,
  };

  return report;
}

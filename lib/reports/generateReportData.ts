import { prisma } from "@/lib/prisma";
import { countryCodeToName } from "@/lib/country-codes";
import { failureReason } from "@/lib/utils/failureReason";

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

type Ranked = { name: string; visitors: number };

type AudienceAnalytics = {
  visitors: number | null;
  pageviews: number | null;
  newVisitors: number | null;
  returningVisitors: number | null;
  topPages: { path: string; visitors: number }[];
  topReferrers: { source: string; visitors: number }[];
  countries: Ranked[];
  devices: Ranked[];
  browsers: Ranked[];
  systems: Ranked[];
  peakDay: { day: string; visitors: number } | null;
};

const EMPTY_ANALYTICS: AudienceAnalytics = {
  visitors: null,
  pageviews: null,
  newVisitors: null,
  returningVisitors: null,
  topPages: [],
  topReferrers: [],
  countries: [],
  devices: [],
  browsers: [],
  systems: [],
  peakDay: null,
};

const DEVICE_LABELS: Record<string, string> = {
  phone: "Phones",
  tablet: "Tablets",
  desktop: "Desktop",
  desktophd: "Desktop (HD+)",
  unknown: "Unknown",
};

async function getAudienceAnalytics(start: Date, end: Date): Promise<AudienceAnalytics> {
  const host = process.env.GOATCOUNTER_HOST;
  const apiKey = process.env.GOATCOUNTER_API_KEY;
  if (!host || !apiKey) return EMPTY_ANALYTICS;

  const baseUrl = `https://${host}.goatcounter.com/api/v0`;
  const query = `start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`;
  const get = async (endpoint: string) => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Analytics request failed: ${response.status}`);
    return response.json();
  };

  const [total, pages, referrers, locations, sizes, browsers, systems] = await Promise.allSettled([
    get(`/stats/total?${query}`),
    get(`/stats/hits?${query}&limit=100`),
    get(`/stats/toprefs?${query}&limit=6`),
    get(`/stats/locations?${query}&limit=8`),
    get(`/stats/sizes?${query}&limit=6`),
    get(`/stats/browsers?${query}&limit=5`),
    get(`/stats/systems?${query}&limit=5`),
  ]);

  const stats = (r: PromiseSettledResult<any>) => (r.status === "fulfilled" ? (r.value.stats ?? []) : []);
  const ranked = (r: PromiseSettledResult<any>, label: (item: any) => string): Ranked[] =>
    stats(r).map((item: any) => ({ name: label(item), visitors: item.count || 0 }));

  const totalValue = total.status === "fulfilled" ? total.value : null;
  const num = (v: unknown) => (typeof v === "number" ? v : null);
  // GoatCounter's total is the number of visits (visitors)
  const visitors = num(totalValue?.total);

  // Per-path hits include custom events (new-visitor / returning-visitor, see VisitorTracker)
  type Hit = { path?: string; count?: number; event?: boolean };
  const allHits: Hit[] = pages.status === "fulfilled" ? (pages.value.hits ?? []) : [];
  const pageHits = allHits.filter((h) => !h.event);
  const eventCount = (name: string) => allHits.find((h) => h.event && (h.path === name || h.path === `/${name}`))?.count ?? 0;
  const newVisitors = eventCount("new-visitor");
  const returningVisitors = eventCount("returning-visitor");
  const hasSplit = newVisitors + returningVisitors > 0;
  const pageviews = pageHits.length ? pageHits.reduce((sum, h) => sum + (h.count ?? 0), 0) : visitors;

  const daily: { day: string; daily: number }[] = totalValue?.stats ?? [];
  const peak = daily.reduce<{ day: string; visitors: number } | null>(
    (best, d) => (d.daily > (best?.visitors ?? 0) ? { day: d.day, visitors: d.daily } : best),
    null,
  );

  return {
    visitors,
    pageviews,
    newVisitors: hasSplit ? newVisitors : null,
    returningVisitors: hasSplit ? returningVisitors : null,
    topPages: pageHits.slice(0, 6).map((item) => ({ path: item.path || "/", visitors: item.count || 0 })),
    topReferrers: referrers.status === "fulfilled" ? (referrers.value.stats ?? []).map((item: { name?: string; count?: number }) => ({ source: item.name || "Direct / None", visitors: item.count || 0 })) : [],
    countries: ranked(locations, (i) => countryCodeToName(i.name || "Unknown")),
    devices: ranked(sizes, (i) => DEVICE_LABELS[i.id || ""] || i.id || "Unknown"),
    browsers: ranked(browsers, (i) => i.name || "Unknown"),
    systems: ranked(systems, (i) => i.name || "Unknown"),
    peakDay: peak,
  };
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

  // Exact counts over the whole period (p.logs is capped, so it can't be used for totals)
  const [upGroups, avgGroups, lastDown] = await Promise.all([
    prisma.uptimeLog.groupBy({
      by: ["projectId", "status"],
      where: { projectId: { in: projects.map((p) => p.id) }, checkedAt: { gte: start, lte: end } },
      _count: { _all: true },
    }),
    prisma.uptimeLog.groupBy({
      by: ["projectId"],
      where: { projectId: { in: projects.map((p) => p.id) }, checkedAt: { gte: start, lte: end }, responseTime: { not: null } },
      _avg: { responseTime: true },
    }),
    prisma.uptimeLog.groupBy({
      by: ["projectId"],
      where: { projectId: { in: projects.map((p) => p.id) }, checkedAt: { gte: start, lte: end }, status: false },
      _max: { checkedAt: true },
    }),
  ]);

  const reasonGroups = await prisma.uptimeLog.groupBy({
    by: ["projectId", "httpStatus", "errorMessage"],
    where: { projectId: { in: projects.map((p) => p.id) }, checkedAt: { gte: start, lte: end }, status: false },
    _count: { _all: true },
    _max: { checkedAt: true },
  });

  // Build per-project stats
  const projectSummaries = projects.map((p) => {
    const count = (status: boolean) =>
      upGroups.find((g) => g.projectId === p.id && g.status === status)?._count._all ?? 0;
    const up = count(true);
    const down = count(false);
    const total = up + down;
    const uptimePct =
      total === 0 ? null : Number(((up / total) * 100).toFixed(2));
    const avg = avgGroups.find((g) => g.projectId === p.id)?._avg.responseTime;
    const avgResponse = avg == null ? null : Math.round(avg);
    const lastIncident = lastDown.find((g) => g.projectId === p.id)?._max.checkedAt ?? null;

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

    // Group failures by reason (merging legacy logs that only stored a status code)
    const reasonMap = new Map<string, { reason: string; httpStatus: number | null; count: number; lastSeen: Date }>();
    for (const g of reasonGroups.filter((g) => g.projectId === p.id)) {
      const reason = failureReason(g.httpStatus, g.errorMessage);
      const seen = g._max.checkedAt ?? new Date(0);
      const existing = reasonMap.get(reason);
      if (existing) {
        existing.count += g._count._all;
        if (seen > existing.lastSeen) existing.lastSeen = seen;
      } else {
        reasonMap.set(reason, { reason, httpStatus: g.httpStatus, count: g._count._all, lastSeen: seen });
      }
    }
    const failureReasons = [...reasonMap.values()].sort((x, y) => y.count - x.count);

    return {
      projectId: p.id,
      projectName: p.name,
      url: p.url,
      totalChecks: total,
      upCount: up,
      downCount: down,
      lastIncident,
      failureReasons,
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

  const analytics = await getAudienceAnalytics(start, end);

  const report = {
    generatedAt: new Date().toISOString(),
    range: { start: start.toISOString(), end: end.toISOString() },
    options: opts,
    totals,
    analytics,
    projects: projectSummaries,
  };

  return report;
}

import { NextResponse } from "next/server";
import { countryCodeToName } from "@/lib/country-codes";

const GOATCOUNTER_HOST = process.env.GOATCOUNTER_HOST;
const GOATCOUNTER_API_KEY = process.env.GOATCOUNTER_API_KEY;
const BASE_URL = GOATCOUNTER_HOST
  ? `https://${GOATCOUNTER_HOST}.goatcounter.com/api/v0`
  : null;

async function goatFetch(endpoint: string) {
  if (!BASE_URL || !GOATCOUNTER_API_KEY) {
    throw new Error(
      !GOATCOUNTER_HOST
        ? "GOATCOUNTER_HOST is not configured"
        : "GOATCOUNTER_API_KEY is not configured"
    );
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GOATCOUNTER_API_KEY}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GoatCounter ${endpoint}: ${res.status} ${text}`);
  }
  return res.json();
}

function parseRange(range: string): { start: string; end: string } {
  const now = new Date();
  const nowRounded = new Date(now);
  nowRounded.setMinutes(0, 0, 0);

  let start: Date;
  const isPrev = range.startsWith("prev_");
  const baseRange = isPrev ? range.slice(5) : range;

  const durationMs = (r: string): number => {
    switch (r) {
      case "today":
        return 0;
      case "7d":
        return 7 * 24 * 60 * 60 * 1000;
      case "30d":
        return 30 * 24 * 60 * 60 * 1000;
      case "6m":
        return 180 * 24 * 60 * 60 * 1000;
      case "1y":
        return 365 * 24 * 60 * 60 * 1000;
      case "all":
        return 3650 * 24 * 60 * 60 * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000;
    }
  };

  if (baseRange === "today") {
    start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  } else {
    start = new Date(nowRounded.getTime() - durationMs(baseRange));
  }

  if (isPrev) {
    const shift = nowRounded.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime());
    start = new Date(prevEnd.getTime() - shift);
  }

  return {
    start: start.toISOString(),
    end: isPrev ? start.toISOString() : nowRounded.toISOString(),
  };
}

function groupByRefScheme(
  referrers: { source: string; visitors: number; ref_scheme: string }[]
) {
  const labels: Record<string, string> = {
    h: "Referral",
    g: "Search",
    c: "Campaign",
    o: "Direct / Other",
  };
  const groups: Record<string, number> = {};
  for (const r of referrers) {
    const key = labels[r.ref_scheme] || "Direct / Other";
    groups[key] = (groups[key] || 0) + r.visitors;
  }
  return Object.entries(groups).map(([name, count]) => ({ name, count }));
}

function calculatePrevRange(range: string): string {
  if (range.startsWith("prev_")) return range;
  return `prev_${range}`;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ metric: string }> }
) {
  try {
    const { metric } = await context.params;
    const url = new URL(req.url);
    const range = url.searchParams.get("range") || "7d";

    if (metric === "referrers") {
      const { start, end } = parseRange(range);
      const data = await goatFetch(
        `/stats/toprefs?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=20`
      );
      const stats = data.stats || [];
      const referrers = stats.map(
        (r: { name?: string; count?: number; ref_scheme?: string }) => ({
          source: r.name || "Direct / None",
          visitors: r.count || 0,
          ref_scheme: r.ref_scheme || "o",
        })
      );

      const sources = groupByRefScheme(referrers);

      return NextResponse.json({ referrers, sources });

    }

    if (metric === "visitors") {
      const { start, end } = parseRange(range);
      const data = await goatFetch(
        `/stats/locations?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=50`
      );
      const stats = data.stats || [];
      return NextResponse.json(
        stats.map((r: { name?: string; count?: number }) => ({
          country: countryCodeToName(r.name || "Unknown"),
          visitors: r.count || 0,
        }))
      );
    }

    if (metric === "traffic") {
      const { start, end } = parseRange(range);
      const data = await goatFetch(
        `/stats/total?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      );

      const dailyStats = (data.stats || []).map(
        (s: { day?: string; daily?: number }) => ({
          day: s.day || "",
          visitors: s.daily || 0,
        })
      );

      // Fetch previous period for trend comparison
      const prevRange = calculatePrevRange(range);
      const prev = parseRange(prevRange);
      let prevData = { total: 0, dailyStats: [] as { day: string; visitors: number }[] };

      if (!range.startsWith("prev_")) {
        try {
          const prevRes = await goatFetch(
            `/stats/total?start=${encodeURIComponent(prev.start)}&end=${encodeURIComponent(prev.end)}`
          );
          prevData = {
            total: prevRes.total || 0,
            dailyStats: (prevRes.stats || []).map(
              (s: { day?: string; daily?: number }) => ({
                day: s.day || "",
                visitors: s.daily || 0,
              })
            ),
          };
        } catch {
          // Previous period data is optional
        }
      }

      return NextResponse.json({
        visitors: data.total || 0,
        dailyStats,
        prevVisitors: prevData.total || 0,
        prevDailyStats: prevData.dailyStats || [],
      });
    }

    if (metric === "browsers") {
      const { start, end } = parseRange(range);
      const data = await goatFetch(
        `/stats/browsers?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=10`
      );
      return NextResponse.json((data.stats || []).map(
        (r: { name?: string; count?: number }) => ({
          name: r.name || "Unknown",
          count: r.count || 0,
        })
      ));
    }

    if (metric === "systems") {
      const { start, end } = parseRange(range);
      const data = await goatFetch(
        `/stats/systems?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=10`
      );
      return NextResponse.json((data.stats || []).map(
        (r: { name?: string; count?: number }) => ({
          name: r.name || "Unknown",
          count: r.count || 0,
        })
      ));
    }

    if (metric === "pages") {
      const { start, end } = parseRange(range);
      const data = await goatFetch(
        `/stats/hits?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=10`
      );
      const hits = data.hits || [];
      return NextResponse.json(
        hits.map((h: { path?: string; count?: number }) => ({
          path: h.path || "/",
          visitors: h.count || 0,
        }))
      );
    }

    if (metric === "devices") {
      const { start, end } = parseRange(range);
      const data = await goatFetch(
        `/stats/sizes?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=20`
      );
      const labelMap: Record<string, string> = {
        phone: "Phones",
        tablet: "Tablets and large phones",
        desktop: "Computer monitors",
        desktophd: "Computer monitors larger than HD",
        unknown: "Unknown",
      };
      const stats = data.stats || [];
      return NextResponse.json(
        stats.map((s: { id?: string; count?: number }) => ({
          name: labelMap[s.id || ""] || s.id || "Unknown",
          count: s.count || 0,
        }))
      );
    }

    return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
  } catch (err: unknown) {
    console.error("GoatCounter API error:", (err as Error).message);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

const UMAMI_BASE_URL = process.env.UMAMI_BASE_URL!;
const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID!;
const USERNAME = process.env.UMAMI_USER!;
const PASSWORD = process.env.UMAMI_PASS!;

async function getAuthToken() {
  const res = await fetch(`${UMAMI_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.token;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ metric: string }> }
) {
  try {
    const { metric } = await context.params;
    const url = new URL(req.url);
    const range = url.searchParams.get("range") || "7d";

    const now = new Date();
    const endAt = now.getTime();
    let startAt: number;

    switch (range) {
      case "today":
        startAt = Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate()
        );
        break;
      case "7d":
        startAt = endAt - 7 * 24 * 60 * 60 * 1000;
        break;
      case "30d":
        startAt = endAt - 30 * 24 * 60 * 60 * 1000;
        break;
      case "90d":
        startAt = endAt - 90 * 24 * 60 * 60 * 1000;
        break;
      default:
        startAt = endAt - 7 * 24 * 60 * 60 * 1000;
    }

    const token = await getAuthToken();

    if (metric === "referrers") {
      // Top Referrers
      const res = await fetch(
        `${UMAMI_BASE_URL}/websites/${WEBSITE_ID}/metrics?type=referrer&unit=day&startAt=${startAt}&endAt=${endAt}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok)
        throw new Error(
          `Referrers fetch failed: ${res.status} ${await res.text()}`
        );
      const { data } = await res.json();

      return NextResponse.json(
        (data || []).map((r: { x?: string; y?: number }) => ({
          source: r.x || "Direct / None",
          visitors: r.y || 0,
        }))
      );
    }

    if (metric === "visitors") {
    const res = await fetch(
      `${UMAMI_BASE_URL}/websites/${WEBSITE_ID}/metrics?type=country&unit=total&startAt=${startAt}&endAt=${endAt}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Visitors fetch failed: ${res.status} ${text}`);
    }

    const { data } = await res.json();

    // Transform data into { country, visitors }
    const visitorsData = (data || []).map((d: { x?: string; y?: number }) => ({
      country: d.x || "Unknown",
      visitors: d.y || 0,
    }));

    return NextResponse.json(visitorsData);
  }

    if (metric === "traffic") {
      // Overall traffic stats
      const res = await fetch(
        `${UMAMI_BASE_URL}/websites/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok)
        throw new Error(
          `Traffic fetch failed: ${res.status} ${await res.text()}`
        );
      const stats = await res.json();

      return NextResponse.json({
        visitors: stats.visitors?.value || 0,
        pageviews: stats.pageviews?.value || 0,
        sessions: stats.sessions?.value || 0,
        bounces: stats.bounces?.value || 0,
        totaltime: stats.totaltime?.value || 0,
      });
    }

    return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Umami API error:", (err as Error).message);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

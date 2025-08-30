import { NextResponse } from "next/server";

const UMAMI_BASE_URL = process.env.UMAMI_BASE_URL;
const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

async function getAuthToken() {
  const res = await fetch(`${UMAMI_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: process.env.UMAMI_USER,
      password: process.env.UMAMI_PASS,
    }),
  });

  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
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
    const type = metric === "referrers" ? "referrer" : "pageview";

    const res = await fetch(
      `${UMAMI_BASE_URL}/websites/${WEBSITE_ID}/metrics?type=${type}&startAt=${startAt}&endAt=${endAt}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Metrics fetch failed: ${res.status} ${text}`);
    }

    const { data } = await res.json();

    if (metric === "referrers") {
        return NextResponse.json(
          (data || []).map((r: { x?: string; y?: number }) => ({
            source: r.x || "Direct / None",
            visitors: r.y || 0,
          }))
        );
    }

    // For traffic/pageviews
      const total = data.reduce((sum: number, d: { y: number }) => sum + d.y, 0);
      return NextResponse.json({ total, breakdown: data });
  } catch (err: unknown) {
      console.error("Umami API error:", (err as Error).message);
      return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

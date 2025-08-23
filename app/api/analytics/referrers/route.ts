import { NextResponse } from "next/server";

const UMAMI_BASE_URL = "https://umami-plum-delta.vercel.app/api";
const WEBSITE_ID = "cf6ab4d0-e402-488d-a3c0-a95ab5ba944a";
const UMAMI_USER = process.env.UMAMI_USER!;
const UMAMI_PASS = process.env.UMAMI_PASS!;

async function getAuthToken() {
  const res = await fetch(`${UMAMI_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: UMAMI_USER, password: UMAMI_PASS }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.token;
}

export async function GET(req: Request) {
  try {
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
      case "30d":
        startAt = endAt - 30 * 24 * 60 * 60 * 1000;
        break;
      default: // 7d
        startAt = endAt - 7 * 24 * 60 * 60 * 1000;
        break;
    }

    const token = await getAuthToken();

    const res = await fetch(
      `${UMAMI_BASE_URL}/websites/${WEBSITE_ID}/metrics?type=referrer&startAt=${startAt}&endAt=${endAt}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Metrics fetch failed: ${res.status} ${text}`);
    }

    const { data } = await res.json();
    const topReferrers = (data || []).map((r: any) => ({
      source: r.x || "Direct / None",
      visitors: r.y || 0,
    }));

    return NextResponse.json(topReferrers);
  } catch (err: any) {
    console.error("Umami API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

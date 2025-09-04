import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "last_7_days";

  const res = await fetch(
    `https://wakatime.com/api/v1/users/current/stats/${range}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.WAKATIME_API_KEY + ":"
        ).toString("base64")}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      {
        error: `Failed to fetch WakaTime`,
        status: res.status,
        statusText: res.statusText,
        details: text,
      },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data.data);
}

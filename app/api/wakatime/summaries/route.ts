import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ error: "start and end query params are required" }, { status: 400 });
  }

  const res = await fetch(
    `https://wakatime.com/api/v1/users/current/summaries?start=${start}&end=${end}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.WAKATIME_API_KEY + ":").toString("base64")}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Failed to fetch WakaTime summaries", status: res.status, details: text },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").at(-3) ?? "";

  const { status, responseTime } = await req.json();
  const log = await prisma.uptimeLog.create({
    data: {
      projectId: id,
      status,
      responseTime,
    },
  });
  return NextResponse.json(log);
}
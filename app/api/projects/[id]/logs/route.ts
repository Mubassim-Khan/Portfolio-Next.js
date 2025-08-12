import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const projectId = pathname.split("/").pop() ?? "";

  const logs = await prisma.uptimeLog.findMany({
    where: { projectId },
    orderBy: { checkedAt: "asc" },
  });

  return NextResponse.json(logs);
}

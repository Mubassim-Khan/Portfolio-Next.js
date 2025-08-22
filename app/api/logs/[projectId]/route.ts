import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { projectId: string } }
) {
  const logs = await prisma.uptimeLog.findMany({
    where: { projectId: params.projectId },
    orderBy: { checkedAt: "asc" },
    take: 50, // Last 50 checks
  });

  return NextResponse.json(logs);
}

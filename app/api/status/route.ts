import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: {
      logs: {
        orderBy: { checkedAt: "desc" },
        take: 1,
      },
    },
  });

  return NextResponse.json(projects);
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, url, description } = await req.json();
  const project = await prisma.project.create({
    data: { name, url, description },
  });
  return NextResponse.json(project);
}

export async function GET() {
  // include last log
  const projects = await prisma.project.findMany({
    include: {
      logs: { orderBy: { checkedAt: "desc" }, take: 1 },
    },
  });
  return NextResponse.json(projects);
}

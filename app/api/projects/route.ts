import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const project = await prisma.project.create({
    data: {
      name: body.name,
      url: body.url,
      coverImage: body.coverImage,
      description: body.description,
      featured: body.featured || false,
      order: body.order || null,
    },
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

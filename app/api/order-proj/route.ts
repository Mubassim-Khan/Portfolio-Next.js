import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      url: true,
      description: true,
      coverImage: true,
      order: true,
    },
  });

  return NextResponse.json(projects);
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(projects);
}

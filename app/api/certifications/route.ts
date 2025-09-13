import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all certifications
export async function GET() {
  const certifications = await prisma.certification.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(certifications);
}

// POST create new certification
export async function POST(req: Request) {
  const body = await req.json();
  const cert = await prisma.certification.create({
    data: {
      name: body.name,
      verifyUrl: body.verifyUrl,
      featured: body.featured || false,
      skill: body.skill || null,
      order: body.order || null,
    },
  });
  return NextResponse.json(cert);
}

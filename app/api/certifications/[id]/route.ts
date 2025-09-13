import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET certification by id
export async function GET(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop() ?? "";

  const cert = await prisma.certification.findUnique({
    where: { id },
  });

  if (!cert) {
    return NextResponse.json(
      { error: "Certification not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(cert);
}

// PUT update certification
export async function PUT(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop() ?? "";

  const body = await req.json();

  const cert = await prisma.certification.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(cert);
}

// DELETE certification
export async function DELETE(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop() ?? "";

  await prisma.certification.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Certification deleted" });
}

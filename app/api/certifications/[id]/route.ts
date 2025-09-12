import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET certification by id
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const cert = await prisma.certification.findUnique({
    where: { id: params.id },
  });
  return NextResponse.json(cert);
}

// PUT update certification
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const cert = await prisma.certification.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(cert);
}

// DELETE certification
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.certification.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: "Certification deleted" });
}

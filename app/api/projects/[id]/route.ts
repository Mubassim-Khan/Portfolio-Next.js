import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { name, url, description } = await req.json();

  const updated = await prisma.project.update({
    where: { id: params.id },
    data: { name, url, description },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.project.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}

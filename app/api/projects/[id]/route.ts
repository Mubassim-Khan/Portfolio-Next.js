import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop() ?? "";

  const body = await req.json();

  const updated = await prisma.project.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop() ?? "";

  await prisma.project.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

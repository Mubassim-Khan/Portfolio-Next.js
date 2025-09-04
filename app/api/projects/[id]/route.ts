import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop() ?? "";

  const { name, url, description } = await req.json();

  const updated = await prisma.project.update({
    where: { id },
    data: { name, url, description },
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

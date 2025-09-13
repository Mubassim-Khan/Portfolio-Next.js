import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop() ?? "";

  const cert = await prisma.certification.findUnique({
    where: { id },
  });

  if (!cert) {
    return NextResponse.json({ error: "Certification not found" }, { status: 404 });
  }

  return NextResponse.json(cert);
}

export async function DELETE(req: Request) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop() ?? "";

  await prisma.project.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await prisma.user.findFirst(); // Fetch first user (only one in DB)
  return NextResponse.json(user);
}

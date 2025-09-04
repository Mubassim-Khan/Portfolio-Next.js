import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CREATE a new API key
export async function POST(req: Request) {
  try {
    const { variable, secret } = await req.json();

    if (!variable || !secret) {
      return NextResponse.json(
        { error: "Variable and Secret required" },
        { status: 400 }
      );
    }

    const newKey = await prisma.apiKey.create({
      data: { variable, secret },
    });

    return NextResponse.json(newKey, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET all API keys
export async function GET() {
  try {
    const keys = await prisma.apiKey.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(keys);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

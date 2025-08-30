import { NextResponse } from "next/server";
import { checkProjectsStatus } from "@/lib/utils/checkProjectsStatus";

export async function GET() {
  await checkProjectsStatus();
  return NextResponse.json({ message: "Projects checked via cron" });
}

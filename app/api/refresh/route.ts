import { NextResponse } from "next/server";
import { checkProjectsStatus } from "@/lib/utils/checkProjectsStatus";

export async function POST() {
  await checkProjectsStatus();
  return NextResponse.json({ message: "Projects checked successfully" });
}

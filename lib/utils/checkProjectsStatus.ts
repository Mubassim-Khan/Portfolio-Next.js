import { prisma } from "@/lib/prisma";
import { sendStatusAlert } from "../email/sendStatusAlert";

export async function checkProjectsStatus() {
  const projects = await prisma.project.findMany();

  for (const project of projects) {
    const start = Date.now();
    let isUp = false;
    let responseTime: number | null = null;
    let httpStatus: number | null = null;
    let errorMessage: string | null = null;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const res = await fetch(project.url, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      httpStatus = res.status;
      responseTime = Date.now() - start;
      isUp = res.ok;
    } catch (error: any) {
      isUp = false;
      responseTime = null;
      errorMessage = error.name === "AbortError" ? "Timeout" : error.message;
    }

    await prisma.uptimeLog.create({
      data: {
        projectId: project.id,
        status: isUp,
        responseTime,
        errorMessage,
      },
    });

    if (!isUp) {
      await sendStatusAlert(
        "your@email.com",
        project.name,
        isUp,
        errorMessage ?? undefined
      );
    }
  }

  console.log("Project statuses checked and logged with details.");
}

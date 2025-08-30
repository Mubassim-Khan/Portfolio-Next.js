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
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

      const res = await fetch(project.url, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      httpStatus = res.status;
      responseTime = Date.now() - start;
      isUp = res.ok;
    } catch (error: Error | unknown) {
      isUp = false;
      responseTime = null;
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        "message" in error
      ) {
        const err = error as { name: string; message: string };
        errorMessage = err.name === "AbortError" ? "Timeout" : err.message;
      } else {
        errorMessage = "Unknown error";
      }
    }

    // Get last status
    const lastLog = await prisma.uptimeLog.findFirst({
      where: { projectId: project.id },
      orderBy: { checkedAt: "desc" },
    });

    // Save new log
    await prisma.uptimeLog.create({
      data: {
        projectId: project.id,
        status: isUp,
        responseTime,
        httpStatus,
        errorMessage,
      },
    });

    // Send alert if status changed
    if ((!lastLog || lastLog.status !== isUp) && !isUp) {
      await sendStatusAlert(
        process.env.MY_EMAIL!,
        project.name,
        isUp,
        errorMessage ?? undefined
      );
    }
  }

  console.log("Project statuses checked and logged.");
}

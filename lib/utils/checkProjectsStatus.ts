import { prisma } from "@/lib/prisma";
import { sendStatusAlert } from "../email/sendStatusAlert";

export async function checkProjectsStatus() {
  // Only fetch projects that have URLs
  const projects = await prisma.project.findMany({
    where: {
      url: {
        not: null,
      },
    },
  });

  for (const project of projects) {
    // Type guard to ensure URL is not null
    if (!project.url) {
      console.log(`Skipping project "${project.name}" - No URL provided`);
      continue;
    }

    const start = Date.now();
    let isUp = false;
    let responseTime: number | null = null;
    let httpStatus: number | null = null;
    let errorMessage: string | null = null;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

      // Now project.url is guaranteed to be string
      const res = await fetch(project.url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "ProjectMonitor/1.0",
        },
      });

      clearTimeout(timeout);

      httpStatus = res.status;
      responseTime = Date.now() - start;
      isUp = res.ok;
    } catch (error: Error | unknown) {
      isUp = false;
      responseTime = null;

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage = "Request timeout (10 seconds)";
        } else {
          errorMessage = error.message;
        }
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

    // Send alert if status changed from UP to DOWN
    if ((!lastLog || lastLog.status !== isUp) && !isUp) {
      await sendStatusAlert(
        process.env.MY_EMAIL!,
        project.name,
        isUp,
        errorMessage ?? undefined
      );
    }
  }
}

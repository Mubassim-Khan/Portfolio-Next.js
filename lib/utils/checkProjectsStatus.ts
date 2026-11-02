import { prisma } from "@/lib/prisma";
import { sendDownAlert } from "../email/sendDownAlert";
import type { DownProject } from "../email/templates/downAlertEmailTemplate";
import { describeFetchError, describeHttpStatus } from "./failureReason";

const TIMEOUT_MS = 10000;

export async function checkProjectsStatus() {
  // Only fetch projects that have URLs
  const projects = await prisma.project.findMany({
    where: {
      url: {
        not: null,
      },
    },
  });

  const results = await Promise.all(
    projects.map(async (project): Promise<DownProject | null> => {
      if (!project.url) {
        console.log(`Skipping project "${project.name}" - No URL provided`);
        return null;
      }

      const start = Date.now();
      let isUp = false;
      let responseTime: number | null = null;
      let httpStatus: number | null = null;
      let errorMessage: string | null = null;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

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
        if (!isUp) errorMessage = describeHttpStatus(res.status);
      } catch (error: unknown) {
        errorMessage = describeFetchError(error, TIMEOUT_MS);
      }

      // Get last status
      const lastLog = await prisma.uptimeLog.findFirst({
        where: { projectId: project.id },
        orderBy: { checkedAt: "desc" },
      });

      await prisma.uptimeLog.create({
        data: {
          projectId: project.id,
          status: isUp,
          responseTime,
          httpStatus,
          errorMessage,
        },
      });

      if (isUp) return null;

      return {
        name: project.name,
        url: project.url,
        reason: errorMessage ?? "Unknown error",
        httpStatus,
        // went from UP (or unknown) to DOWN in this run
        isNew: !lastLog || lastLog.status,
      };
    }),
  );

  const down = results.filter((r): r is DownProject => r !== null);

  // One cumulative email, only when something newly went down
  if (down.some((p) => p.isNew)) {
    await sendDownAlert(process.env.MY_EMAIL!, down);
  }
}

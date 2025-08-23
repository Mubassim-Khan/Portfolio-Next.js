import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Missing VERCEL_TOKEN" },
      { status: 500 }
    );
  }

  try {
    // Fetch all projects
    const projectsRes = await fetch("https://api.vercel.com/v9/projects", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!projectsRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: projectsRes.status }
      );
    }

    const { projects } = await projectsRes.json();

    // Fetch deployments for each project
    const deploymentsData = await Promise.all(
      projects.map(async (project: any) => {
        const res = await fetch(
          `https://api.vercel.com/v6/deployments?projectId=${project.id}&limit=3`,
          { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
        );

        if (!res.ok) return [];
        const { deployments } = await res.json();

        return deployments.map((d: any) => ({
          project: project.name,
          date: new Date(d.createdAt).toLocaleString(),
          status:
            d.readyState === "READY"
              ? "Success"
              : d.readyState === "ERROR"
              ? "Failed"
              : "Building",
        }));
      })
    );

    // Flatten and sort by date (newest first)
    const allDeployments = deploymentsData.flat().sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json(allDeployments);
  } catch (err) {
    console.error("Vercel API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

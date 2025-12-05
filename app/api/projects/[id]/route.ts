import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop() ?? "";

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function DELETE(req: Request) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop() ?? "";

  await prisma.project.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop() ?? "";

    // Check if the project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Parse request body
    const body = await req.json();

    // Validate required fields
    const { name, description, githubURL } = body;

    if (!name || !description || !githubURL) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, githubURL" },
        { status: 400 }
      );
    }

    // Update the project WITHOUT updatedAt
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        url: body.url || null,
        githubURL,
        coverImage: body.coverImage || null,
        featured: body.featured || false,
        order: body.order || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

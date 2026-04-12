import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        published: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        description: true,
        images: true,
        techStack: true,
        previewUrl: true,
        repoUrl: true,
        featured: true,
        category: true,
      },
    });

    // Transform image array to single image (first one or placeholder)
    const formattedProjects = projects.map((project: any) => ({
      ...project,
      image:
        project.images && project.images.length > 0
          ? project.images[0]
          : "/uploads/projects/1771091571514-495444105-122106673688856494-1931793321589978397-n.jpg",
      tags: project.techStack,
      github: project.repoUrl || "#",
      demo: project.previewUrl || "#",
    }));

    return NextResponse.json({ projects: formattedProjects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

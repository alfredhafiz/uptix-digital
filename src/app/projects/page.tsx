import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Projects | Uptix Digital",
  description:
    "Explore our portfolio of web applications, mobile apps, and digital solutions. See how we've helped businesses transform their digital presence.",
  openGraph: {
    title: "Projects | Uptix Digital",
    description:
      "Explore our portfolio of web applications, mobile apps, and digital solutions.",
    type: "website",
  },
};

export const revalidate = 3600; // Cache for 1 hour

export default async function ProjectsPage() {
  // Fetch projects directly from database using Prisma
  let projects = [];
  try {
    const dbProjects = await prisma.project.findMany({
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

    projects = dbProjects.map((project: any) => ({
      ...project,
      image:
        project.images && project.images.length > 0
          ? project.images[0]
          : "/uploads/projects/1771091571514-495444105-122106673688856494-1931793321589978397-n.jpg",
      tags: project.techStack,
      github: project.repoUrl || "#",
      demo: project.previewUrl || "#",
    }));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  // Fallback projects if API fails
  const fallbackProjects = [
    {
      id: "1",
      title: "E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with real-time inventory and payment processing.",
      image:
        "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
      tags: ["Next.js", "Prisma", "Stripe"],
      github: "#",
      demo: "#",
      category: "Web Development",
    },
    {
      id: "2",
      title: "SaaS Dashboard",
      description:
        "Analytics dashboard with real-time data visualization and user management.",
      image:
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop",
      tags: ["React", "TypeScript", "D3.js"],
      github: "#",
      demo: "#",
      category: "Web Application",
    },
    {
      id: "3",
      title: "Mobile Banking App",
      description:
        "Secure mobile banking application with biometric authentication.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      tags: ["React Native", "Node.js", "MongoDB"],
      github: "#",
      demo: "#",
      category: "Mobile Development",
    },
    {
      id: "4",
      title: "AI Content Generator",
      description:
        "AI-powered content creation platform with natural language processing.",
      image:
        "https://images.unsplash.com/photo-1556740049-0cfed4f6a45d?w=800&h=600&fit=crop",
      tags: ["Python", "OpenAI", "FastAPI"],
      github: "#",
      demo: "#",
      category: "AI/ML",
    },
    {
      id: "5",
      title: "Real-time Chat App",
      description:
        "High-performance messaging platform with encryption and notifications.",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      tags: ["WebSocket", "Next.js", "PostgreSQL"],
      github: "#",
      demo: "#",
      category: "Web Development",
    },
    {
      id: "6",
      title: "Fitness Tracking App",
      description:
        "Comprehensive fitness tracking with AI-powered workout recommendations.",
      image:
        "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=600&fit=crop",
      tags: ["React Native", "Machine Learning", "AWS"],
      github: "#",
      demo: "#",
      category: "Mobile Application",
    },
  ];

  const displayProjects =
    projects && projects.length > 0 ? projects : fallbackProjects;

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-400 font-mono text-sm">// PORTFOLIO</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Our <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono">
            Explore our latest work and see how we have helped businesses
            transform their digital presence.
          </p>
        </div>

        {/* Projects Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project: any) => (
            <div
              key={project.id}
              className="glass-card rounded-xl overflow-hidden border border-white/10 group hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-blue-400 text-xs font-mono mb-2 uppercase tracking-wider">
                  {project.category}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:gradient-text transition-all line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.slice(0, 2).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded text-xs bg-white/5 text-slate-300 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags?.length > 2 && (
                    <span className="px-2 py-1 rounded text-xs bg-white/5 text-slate-300 border border-white/10">
                      +{project.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Link
                    href={project.github || "#"}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 hover:text-white transition-colors group/btn"
                  >
                    <Github className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span>Code</span>
                  </Link>
                  <Link
                    href={project.demo || "#"}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20 hover:text-blue-300 transition-colors group/btn"
                  >
                    <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span>Live</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Projects Message */}
        {displayProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 mb-4">No projects available yet.</p>
            <p className="text-slate-500 text-sm">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

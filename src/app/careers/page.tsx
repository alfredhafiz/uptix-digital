import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Heart, Zap, Globe, Coffee } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | Uptix Digital",
  description:
    "Join our team at Uptix Digital. We're always looking for talented developers, designers, and digital strategists.",
};

const benefits = [
  {
    icon: Globe,
    title: "Remote Work",
    description:
      "Work from anywhere in the world. We believe in flexibility and work-life balance.",
  },
  {
    icon: Zap,
    title: "Cutting-Edge Projects",
    description:
      "Work with the latest technologies on exciting projects for diverse clients.",
  },
  {
    icon: Users,
    title: "Great Team",
    description:
      "Collaborate with passionate professionals who love what they do.",
  },
  {
    icon: Heart,
    title: "Health Benefits",
    description:
      "Comprehensive health, dental, and vision coverage for you and your family.",
  },
  {
    icon: Coffee,
    title: "Learning Budget",
    description:
      "Annual budget for courses, conferences, and professional development.",
  },
  {
    icon: Briefcase,
    title: "Career Growth",
    description:
      "Clear career paths and opportunities for advancement within the company.",
  },
];

const openPositions = [
  {
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "React Native Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <span className="text-blue-400 font-mono text-sm">// CAREERS</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Join Our <span className="gradient-text">Team</span>
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto font-mono text-lg">
            We're building the future of digital experiences. Join us and work
            on projects that matter with a team that cares.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">
              Why Work With <span className="gradient-text">Us</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <benefit.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">
              Open <span className="gradient-text">Positions</span>
            </h2>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {openPositions.map((position, index) => (
              <Card key={index} className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-400">
                        <span>{position.department}</span>
                        <span>•</span>
                        <span>{position.location}</span>
                        <span>•</span>
                        <span>{position.type}</span>
                      </div>
                    </div>
                    <a href="mailto:careers@uptixdigital.com?subject=Application for ${encodeURIComponent(position.title)}">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-500 whitespace-nowrap">
                        Apply Now
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card border-white/10 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't See a Perfect Fit?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            We're always interested in meeting talented people. Send us your
            resume and tell us why you'd be a great addition to our team.
          </p>
          <a href="mailto:careers@uptixdigital.com">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 px-8">
              Send Your Resume
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

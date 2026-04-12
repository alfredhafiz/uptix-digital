import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Code2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Web Development Services | Uptix Digital",
  description:
    "Custom web applications built with Next.js, React, and modern technologies. From landing pages to complex web apps.",
};

const features = [
  "Next.js & React Applications",
  "Progressive Web Apps (PWA)",
  "E-commerce Solutions",
  "CMS Integration",
  "API Development",
  "Database Design",
  "SEO Optimization",
  "Performance Tuning",
];

const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
  "AWS",
];

export default function WebDevelopmentPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/services"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Code2 className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Web <span className="gradient-text">Development</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            We build high-performance web applications using cutting-edge
            technologies. From simple landing pages to complex enterprise
            solutions, we deliver excellence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">
              What We Offer
            </h2>
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">
              Technologies We Use
            </h2>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Our Development Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Discovery",
                desc: "Understanding your requirements and goals",
              },
              {
                step: "02",
                title: "Design",
                desc: "Creating beautiful UI/UX mockups",
              },
              {
                step: "03",
                title: "Development",
                desc: "Building with clean, scalable code",
              },
              {
                step: "04",
                title: "Launch",
                desc: "Deployment and ongoing support",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold gradient-text mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Web Application?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create something amazing together.
          </p>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-6 text-lg">
              Start Your Project
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

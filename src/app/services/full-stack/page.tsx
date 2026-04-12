import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Full-Stack Solutions | Uptix Digital",
  description:
    "End-to-end development from database design to deployment with modern cloud infrastructure.",
};

const features = [
  "Complete Web Applications",
  "Database Architecture",
  "Cloud Infrastructure",
  "DevOps & CI/CD",
  "Microservices",
  "Serverless Architecture",
  "System Integration",
  "Technical Consultation",
];

const technologies = [
  "AWS",
  "Docker",
  "Kubernetes",
  "Terraform",
  "GitHub Actions",
  "Vercel",
  "PostgreSQL",
  "MongoDB",
];

export default function FullStackPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Link>

        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Full-Stack <span className="gradient-text">Solutions</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            End-to-end development services covering everything from database
            design to cloud deployment. We handle the full technology stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">
              What We Offer
            </h2>
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
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
                  className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need a Complete Solution?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            From concept to deployment, we'll build your entire application
            stack.
          </p>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-6 text-lg">
              Start Full-Stack Project
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

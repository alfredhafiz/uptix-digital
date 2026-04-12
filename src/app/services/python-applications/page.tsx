import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Terminal, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Python Applications | Uptix Digital",
  description:
    "Data-driven applications, automation scripts, and AI/ML solutions using Python ecosystem.",
};

const features = [
  "Data Processing & Analysis",
  "Machine Learning Models",
  "AI Integration",
  "Automation Scripts",
  "Web Scraping",
  "ETL Pipelines",
  "Data Visualization",
  "Natural Language Processing",
];

const technologies = [
  "Python",
  "FastAPI",
  "Django",
  "TensorFlow",
  "PyTorch",
  "Pandas",
  "NumPy",
  "OpenAI",
];

export default function PythonApplicationsPage() {
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
          <div className="w-20 h-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Terminal className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Python <span className="gradient-text">Applications</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Harness the power of Python for data analysis, machine learning, and
            intelligent automation solutions.
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
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
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
                  className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Leverage Python for Your Business
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            From data analysis to AI solutions, let's build something
            intelligent.
          </p>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-6 text-lg">
              Start Python Project
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

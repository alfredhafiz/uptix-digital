import type { Metadata } from "next";
import { ServicesList } from "@/components/services/services-list";

export const metadata: Metadata = {
  title: "Services | Uptix Digital",
  description:
    "Explore our comprehensive range of digital services including web development, app development, API development, and more.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-400 font-mono text-sm">// SERVICES</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono">
            From concept to deployment, we offer end-to-end digital solutions
            tailored to your business needs.
          </p>
        </div>

        <ServicesList />
      </div>
    </div>
  );
}

import HeroSection from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import StatsSection from "@/components/sections/stats";
import ProjectsSection from "@/components/sections/projects";
import ProcessSection from "@/components/sections/process";
import TestimonialsSection from "@/components/sections/testimonials";
import CTASection from "@/components/sections/cta";

export default function HomePage() {
  return (
    <div className="relative">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}

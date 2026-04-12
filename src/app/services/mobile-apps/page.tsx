import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Smartphone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mobile App Development | Uptix Digital",
  description:
    "Expert mobile app development for iOS and Android. Native and cross-platform mobile applications with cutting-edge technology.",
};

const features = [
  "iOS App Development",
  "Android App Development",
  "Cross-Platform Solutions",
  "React Native Apps",
  "Flutter Applications",
  "App Store Optimization",
  "Push Notifications",
  "Offline Functionality",
  "Real-time Sync",
  "Cloud Integration",
  "Analytics Integration",
  "User Authentication",
];

const technologies = [
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  "Firebase",
  "Expo",
  "Redux",
  "GraphQL",
];

export default function MobileAppsPage() {
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
          <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Mobile Apps <span className="gradient-text">Development</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            We create stunning mobile applications that deliver exceptional user
            experiences across iOS and Android platforms. From concept to
            deployment, we handle every aspect of mobile app development with
            precision and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">
              What We Deliver
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
              Technologies & Tools
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
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">
                Why Choose Us?
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ Experienced team with 100+ mobile apps delivered</li>
                <li>✓ Native performance with cross-platform reach</li>
                <li>✓ Agile development approach</li>
                <li>✓ Post-launch support and maintenance</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3">
              iOS Development
            </h3>
            <p className="text-slate-400 text-sm">
              Native iOS apps with SwiftUI and UIKit, optimized for iPhone and
              iPad devices.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3">
              Android Development
            </h3>
            <p className="text-slate-400 text-sm">
              Robust Android applications supporting all devices and OS
              versions.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3">
              Cross-Platform
            </h3>
            <p className="text-slate-400 text-sm">
              Efficient cross-platform solutions with React Native and Flutter
              for faster development.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Launch Your Mobile App?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Let's transform your mobile app vision into a fully featured,
            production-ready application that users will love.
          </p>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-6 text-lg">
              Start Your Mobile App Project
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

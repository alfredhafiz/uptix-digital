"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Code2,
  Smartphone,
  Database,
  Zap,
  Terminal,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Custom web applications built with Next.js, React, and modern technologies for optimal performance.",
    color: "blue",
    href: "/services/web-development",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile applications for iOS and Android using React Native and Flutter.",
    color: "purple",
    href: "/services/mobile-apps",
  },
  {
    icon: Database,
    title: "API Development",
    description:
      "Robust RESTful and GraphQL APIs designed for scalability, security, and seamless integration.",
    color: "pink",
    href: "/services/api-development",
  },
  {
    icon: Terminal,
    title: "Python Applications",
    description:
      "Data-driven applications, automation scripts, and AI/ML solutions using Python ecosystem.",
    color: "cyan",
    href: "/services/python-applications",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description:
      "Speed up your applications with advanced caching, optimization techniques, and best practices.",
    color: "yellow",
    href: "/services/performance",
  },
  {
    icon: Globe,
    title: "Full-Stack Solutions",
    description:
      "End-to-end development from database design to deployment with modern cloud infrastructure.",
    color: "green",
    href: "/services/full-stack",
  },
];

const colorClasses: Record<
  string,
  { bg: string; text: string; glow: string; border: string }
> = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
    border: "group-hover:border-blue-500/30",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    glow: "shadow-purple-500/20",
    border: "group-hover:border-purple-500/30",
  },
  pink: {
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    glow: "shadow-pink-500/20",
    border: "group-hover:border-pink-500/30",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
    border: "group-hover:border-cyan-500/30",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    glow: "shadow-yellow-500/20",
    border: "group-hover:border-yellow-500/30",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    glow: "shadow-green-500/20",
    border: "group-hover:border-green-500/30",
  },
};

export function ServicesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-blue-400 font-mono text-sm inline-block"
          >
            // SERVICES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4"
          >
            What We <span className="gradient-text">Build</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-slate-400 max-w-2xl mx-auto font-mono"
          >
            From concept to deployment, we deliver cutting-edge digital
            solutions tailored to your business needs.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const colors = colorClasses[service.color];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
              >
                <Link href={service.href}>
                  <Card
                    className={`group glass-card border-white/10 ${colors.border} transition-all duration-500 h-full overflow-hidden relative hover:shadow-lg hover:shadow-${service.color}-500/10 hover:-translate-y-2`}
                  >
                    {/* Animated gradient background on hover */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${colors.bg}`}
                    />

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    <CardHeader className="relative z-10">
                      <motion.div
                        className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}
                        whileHover={{ rotate: 5 }}
                      >
                        <service.icon
                          className={`w-7 h-7 ${colors.text} transition-transform duration-300 group-hover:scale-110`}
                        />
                      </motion.div>
                      <CardTitle className="text-xl text-white group-hover:gradient-text transition-all duration-300">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

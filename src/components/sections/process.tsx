"use client";

import { motion } from "framer-motion";
import { Search, Lightbulb, Code, Rocket, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Discovery",
    description:
      "We analyze your requirements, understand your goals, and define the project scope through detailed consultations.",
    color: "blue",
  },
  {
    icon: Lightbulb,
    number: "02",
    title: "Strategy",
    description:
      "Our team creates a comprehensive roadmap with architecture design, tech stack selection, and timeline planning.",
    color: "purple",
  },
  {
    icon: Code,
    number: "03",
    title: "Development",
    description:
      "Agile development with regular sprints, code reviews, and continuous integration to ensure quality delivery.",
    color: "pink",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Launch",
    description:
      "Seamless deployment with performance optimization, security hardening, and ongoing support & maintenance.",
    color: "cyan",
  },
];

const colorStyles = {
  blue: {
    iconWrap: "bg-blue-500/10 group-hover:bg-blue-500/20",
    icon: "text-blue-400 group-hover:text-blue-300",
    check: "text-blue-400",
  },
  purple: {
    iconWrap: "bg-purple-500/10 group-hover:bg-purple-500/20",
    icon: "text-purple-400 group-hover:text-purple-300",
    check: "text-purple-400",
  },
  pink: {
    iconWrap: "bg-pink-500/10 group-hover:bg-pink-500/20",
    icon: "text-pink-400 group-hover:text-pink-300",
    check: "text-pink-400",
  },
  cyan: {
    iconWrap: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
    icon: "text-cyan-400 group-hover:text-cyan-300",
    check: "text-cyan-400",
  },
} as const;

export default function ProcessSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />

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
            className="text-cyan-400 font-mono text-sm inline-block"
          >
            // PROCESS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4"
          >
            How We <span className="gradient-text">Work</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-slate-400 max-w-2xl mx-auto font-mono"
          >
            Our proven development process ensures transparent communication and
            exceptional results.
          </motion.p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line - Completely hidden behind cards */}
          <div
            className="hidden lg:block absolute h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30"
            style={{
              top: "52px",
              left: "15%",
              right: "15%",
              zIndex: 0,
            }}
          />

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
            style={{ zIndex: 1 }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative group"
              >
                {(() => {
                  const style =
                    colorStyles[step.color as keyof typeof colorStyles];
                  return (
                    <>
                      {/* Hover glow effect */}
                      <div
                        className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                        style={{ zIndex: -1 }}
                      />

                      <div
                        className="glass-card rounded-2xl p-6 h-full relative overflow-hidden transition-all duration-300 group-hover:border-white/20 group-hover:shadow-lg group-hover:shadow-blue-500/10"
                        style={{
                          zIndex: 2,
                          background:
                            "linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7))",
                        }}
                      >
                        {/* Animated background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />

                        {/* Step Number */}
                        <motion.div
                          className="absolute -top-4 left-6"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.15 + 0.3,
                          }}
                          viewport={{ once: true }}
                        >
                          <span className="text-4xl font-bold text-slate-700 font-mono group-hover:text-slate-600 transition-colors">
                            {step.number}
                          </span>
                        </motion.div>

                        {/* Icon - positioned to cover the line */}
                        <motion.div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 mt-4 relative group-hover:scale-105 transition-all duration-300 will-change-transform ${style.iconWrap}`}
                          style={{ zIndex: 3 }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.15 + 0.2,
                          }}
                          viewport={{ once: true }}
                        >
                          <step.icon
                            className={`w-7 h-7 transition-colors ${style.icon}`}
                          />
                        </motion.div>

                        {/* Content */}
                        <motion.h3
                          className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.15 + 0.3,
                          }}
                          viewport={{ once: true }}
                        >
                          {step.title}
                        </motion.h3>
                        <motion.p
                          className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.15 + 0.4,
                          }}
                          viewport={{ once: true }}
                        >
                          {step.description}
                        </motion.p>

                        {/* Checkmark */}
                        <motion.div
                          className="mt-4 flex items-center space-x-2"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.15 + 0.5,
                          }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle2
                            className={`w-5 h-5 group-hover:scale-105 transition-transform ${style.check}`}
                          />
                          <span className="text-xs text-slate-500 font-mono group-hover:text-slate-400 transition-colors">
                            Phase Complete
                          </span>
                        </motion.div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

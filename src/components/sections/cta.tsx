"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px] will-change-transform"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[80px] will-change-transform"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            className="glass-card rounded-3xl p-8 md:p-16 text-center relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative Elements */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl will-change-transform"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-2xl will-change-transform"
              animate={{
                rotate: -360,
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
            </div>

            <div className="relative z-10">
              <motion.span
                className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-sm mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                }}
              >
                Ready to start?
              </motion.span>

              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Let&apos;s Build Something
                <br />
                <span className="gradient-text group-hover:scale-105 transition-transform duration-500 inline-block">
                  Amazing Together
                </span>
              </motion.h2>

              <motion.p
                className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto font-mono group-hover:text-slate-300 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                Have a project in mind? We&apos;d love to hear about it. Get in
                touch and let&apos;s discuss how we can help bring your vision
                to life.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/contact">
                    <Button
                      size="lg"
                      className="btn-glow bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0 px-8 py-6 text-lg group/btn relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        Start a Project
                        <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="glass-card border-white/20 px-8 py-6 text-lg group/btn2 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                    >
                      <MessageSquare className="mr-2 w-5 h-5 group-hover/btn2:scale-110 transition-transform" />
                      Schedule a Call
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="mt-12 pt-8 border-t border-white/10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-slate-500 text-sm mb-4 font-mono">
                  Trusted by innovative companies worldwide
                </p>
                <div className="flex items-center justify-center space-x-8 opacity-50">
                  {["Company 1", "Company 2", "Company 3", "Company 4"].map(
                    (company, i) => (
                      <motion.div
                        key={i}
                        className="text-slate-400 font-bold text-lg hover:text-slate-300 transition-colors cursor-default"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1, opacity: 1 }}
                      >
                        {company}
                      </motion.div>
                    ),
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    content:
      "Uptix Digital transformed our vision into reality. Their expertise in modern web technologies and attention to detail exceeded our expectations. The team's professionalism and communication throughout the project was exceptional.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Founder, DataFlow Systems",
    content:
      "Working with Uptix was a game-changer for our business. They delivered a complex data analytics platform ahead of schedule and the performance optimizations they implemented were remarkable.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "CTO, InnovateLab",
    content:
      "The mobile app Uptix developed for us has received outstanding user feedback. Their understanding of user experience and technical excellence made them the perfect partner for our project.",
    rating: 5,
    avatar: "ER",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-[100px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
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
            className="text-pink-400 font-mono text-sm inline-block"
          >
            // TESTIMONIALS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4"
          >
            Client <span className="gradient-text">Success Stories</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-slate-400 max-w-2xl mx-auto font-mono"
          >
            Do not just take our word for it. Here is what our clients have to
            say about working with us.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="group glass-card border-white/10 h-full hover:border-pink-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-pink-500/10 relative overflow-hidden">
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-700" />

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                <CardContent className="p-6 relative">
                  {/* Quote Icon with animation */}
                  <motion.div
                    initial={{ opacity: 0, rotate: -10 }}
                    whileInView={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: index * 0.15 + 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Quote className="w-10 h-10 text-blue-500/30 mb-4 group-hover:text-pink-500/40 group-hover:scale-110 transition-all duration-300" />
                  </motion.div>

                  {/* Rating with stagger animation */}
                  <motion.div
                    className="flex space-x-1 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.15 + i * 0.05 + 0.3 }}
                        viewport={{ once: true }}
                      >
                        <Star
                          className="w-4 h-4 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform duration-200"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Content */}
                  <motion.p
                    className="text-slate-300 mb-6 leading-relaxed group-hover:text-slate-200 transition-colors duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.4 }}
                    viewport={{ once: true }}
                  >
                    &ldquo;{testimonial.content}&rdquo;
                  </motion.p>

                  {/* Author */}
                  <motion.div
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 + 0.5 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-500"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {testimonial.avatar}
                    </motion.div>
                    <div>
                      <motion.div className="font-semibold text-white group-hover:text-pink-300 transition-colors">
                        {testimonial.name}
                      </motion.div>
                      <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                        {testimonial.role}
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

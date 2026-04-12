"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@uptixdigital.com",
    href: "mailto:hello@uptixdigital.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Tech Street, Digital City, DC 12345",
    href: "#",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Fri: 9:00 AM - 6:00 PM EST",
    href: "#",
  },
];

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Contact Information
        </h2>
        <p className="text-slate-400">
          Fill up the form and our team will get back to you within 24 hours.
        </p>
      </div>

      <div className="space-y-4">
        {contactInfo.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <a href={item.href}>
              <Card className="glass-card border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>

      {/* Social Links */}
      <div className="pt-6">
        <p className="text-slate-400 mb-4">Follow us on social media</p>
        <div className="flex space-x-4">
          {["Twitter", "LinkedIn", "GitHub", "Instagram"].map((social) => (
            <a
              key={social}
              href="#"
              className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="sr-only">{social}</span>
              <div className="w-5 h-5 bg-current rounded-sm" />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

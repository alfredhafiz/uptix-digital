"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code2,
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  services: [
    { label: "Web Development", href: "/services/web-development" },
    { label: "App Development", href: "/services/app-development" },
    { label: "API Development", href: "/services/api-development" },
    { label: "Python Applications", href: "/services/python-applications" },
    { label: "Performance Optimization", href: "/services/performance" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Work", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "FAQ", href: "/faq" },
    { label: "Support", href: "/support" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com/uptixdigital", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com/uptixdigital", label: "Twitter" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/uptixdigital",
    label: "LinkedIn",
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-slate-900 rounded-lg p-2 border border-white/10">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold gradient-text">
                Uptix<span className="text-white">.digital</span>
              </span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              Premium digital agency specializing in custom web & app
              development. We transform ideas into high-performance digital
              solutions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 glass-card rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-mono">
              <span className="text-blue-400">//</span> Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-mono">
              <span className="text-blue-400">//</span> Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-mono">
              <span className="text-blue-400">//</span> Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>hello@uptixdigital.com</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <span>123 Tech Street, Digital City, DC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-slate-400 text-sm">
            <span className="font-mono">&copy;</span> {new Date().getFullYear()}{" "}
            Uptix Digital. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Terms
            </Link>
            <a
              href="/sitemap.xml"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Book,
  Code,
  Zap,
  FileText,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation | Uptix Digital",
  description:
    "Documentation, guides, and resources for Uptix Digital services and APIs.",
};

const docSections = [
  {
    icon: Book,
    title: "Getting Started",
    description:
      "Learn the basics of working with Uptix Digital and our services.",
    links: [
      { label: "Our Process", href: "/about" },
      { label: "Services Overview", href: "/services" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    icon: Code,
    title: "API Reference",
    description:
      "Technical documentation for developers integrating with our platform.",
    links: [
      { label: "Authentication", href: "/auth/login" },
      { label: "Orders API", href: "/api/orders" },
      { label: "Payments API", href: "/api/payments" },
    ],
  },
  {
    icon: Zap,
    title: "Integrations",
    description: "Learn how to integrate with popular tools and platforms.",
    links: [
      { label: "Payment Methods", href: "/support" },
      { label: "Webhooks", href: "/api/webhooks/binance-pay" },
      { label: "Third-party Services", href: "/services" },
    ],
  },
  {
    icon: FileText,
    title: "Guides & Tutorials",
    description:
      "Step-by-step guides to help you get the most out of our services.",
    links: [
      { label: "Placing an Order", href: "/client/orders/new" },
      { label: "Managing Projects", href: "/client/dashboard" },
      { label: "Communication", href: "/client/messages" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <span className="text-blue-400 font-mono text-sm">
            // DOCUMENTATION
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Documentation & <span className="gradient-text">Resources</span>
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto font-mono text-lg">
            Everything you need to know about working with Uptix Digital.
          </p>
        </div>

        {/* Docs Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {docSections.map((section, index) => (
            <Card key={index} className="glass-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    {section.title}
                  </h2>
                </div>
                <p className="text-slate-400 mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center"
                      >
                        {link.label}
                        <ArrowRight className="w-3 h-3 ml-2" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support CTA */}
        <div className="glass-card border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to
            help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Contact Support
              </button>
            </Link>
            <Link href="/faq">
              <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors">
                View FAQ
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

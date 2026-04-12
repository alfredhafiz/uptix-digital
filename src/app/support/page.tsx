import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, MessageSquare, Clock, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Support | Uptix Digital",
  description:
    "Get help and support from the Uptix Digital team. We're here to assist you with any questions or issues.",
};

const supportOptions = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    description:
      "Chat with our support team in real-time during business hours.",
    action: "Start Chat",
    href: "/client/messages",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email and we'll respond within 24 hours.",
    action: "Send Email",
    href: "mailto:support@uptixdigital.com",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us directly for urgent matters.",
    action: "Call Now",
    href: "tel:+15551234567",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <span className="text-blue-400 font-mono text-sm">// SUPPORT</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            How Can We <span className="gradient-text">Help?</span>
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto font-mono text-lg">
            Our support team is here to assist you. Choose the option that works
            best for you.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          {supportOptions.map((option, index) => (
            <Card key={index} className="glass-card border-white/10">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {option.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  {option.description}
                </p>
                <a href={option.href}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 w-full">
                    {option.action}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Hours */}
        <div className="glass-card border-white/10 rounded-2xl p-8 max-w-3xl mx-auto mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Clock className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Business Hours</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-slate-300">
              <span>Monday - Friday</span>
              <span>9:00 AM - 6:00 PM EST</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Saturday</span>
              <span>10:00 AM - 4:00 PM EST</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Sunday</span>
              <span>Closed</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-6">
            * Emergency support available 24/7 for critical issues
          </p>
        </div>

        {/* Documentation Link */}
        <div className="text-center">
          <LifeBuoy className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Looking for Documentation?
          </h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Check out our comprehensive documentation for guides, tutorials, and
            API references.
          </p>
          <a href="/docs">
            <Button variant="outline" className="glass-card">
              View Documentation
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

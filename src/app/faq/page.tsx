import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, MessageCircle, FileText, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ | Uptix Digital",
  description:
    "Frequently asked questions about our services, process, and how we work.",
};

const faqs = [
  {
    question: "What services does Uptix Digital offer?",
    answer:
      "We offer comprehensive digital solutions including custom web development, mobile app development, API development, Python applications, performance optimization, and UI/UX design. We specialize in modern technologies like Next.js, React, Node.js, and more.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on complexity and scope. A simple website might take 2-4 weeks, while a complex web application could take 3-6 months. During our initial consultation, we'll provide a detailed timeline based on your specific requirements.",
  },
  {
    question: "What is your development process?",
    answer:
      "We follow an agile development process: 1) Discovery & Planning - understanding your needs, 2) Design - creating mockups and prototypes, 3) Development - building your solution, 4) Testing - ensuring quality, 5) Deployment - launching your product, 6) Support - ongoing maintenance.",
  },
  {
    question: "Do you offer ongoing maintenance and support?",
    answer:
      "Yes! We offer various maintenance packages to keep your application secure, up-to-date, and performing optimally. This includes security updates, bug fixes, performance monitoring, and feature enhancements.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "Project costs depend on scope, complexity, and timeline. We offer competitive pricing and provide detailed quotes after understanding your requirements. Contact us for a free consultation and estimate.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We use modern, proven technologies including Next.js, React, TypeScript, Node.js, PostgreSQL, Prisma, Tailwind CSS, AWS, and more. We choose the best tech stack based on your project requirements.",
  },
  {
    question: "Can you work with existing codebases?",
    answer:
      "Absolutely! We can work with existing codebases, whether you need maintenance, new features, or a complete refactoring. We'll start with a code audit to understand the current state.",
  },
  {
    question: "Do you provide hosting services?",
    answer:
      "While we don't provide hosting directly, we can recommend and set up hosting solutions on platforms like Vercel, AWS, or DigitalOcean. We also handle deployment and configuration.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including bank transfers, credit cards (via Stripe), PayPal, and cryptocurrency (via Binance Pay). We typically work with a milestone-based payment structure.",
  },
  {
    question: "How do we get started?",
    answer:
      "Getting started is easy! Simply contact us through our contact form or email. We'll schedule a free consultation to discuss your project, requirements, and how we can help bring your vision to life.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <span className="text-blue-400 font-mono text-sm">// FAQ</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto font-mono text-lg">
            Got questions? We've got answers. If you don't find what you're
            looking for, feel free to contact us.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="glass-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 glass-card border-white/10 rounded-2xl p-12 text-center">
          <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our team is here to help.
            Reach out and we'll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Contact Us
              </button>
            </a>
            <a href="mailto:hello@uptixdigital.com">
              <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors inline-flex items-center justify-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Us
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

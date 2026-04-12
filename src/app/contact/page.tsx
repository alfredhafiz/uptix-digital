import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export const metadata: Metadata = {
  title: "Contact Us | Uptix Digital",
  description:
    "Get in touch with Uptix Digital. Let's discuss your project and transform your digital presence.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-400 font-mono text-sm">// CONTACT</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Let&apos;s <span className="gradient-text">Talk</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-mono">
            Have a project in mind? We&apos;d love to hear from you. Send us a
            message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Uptix Digital",
  description:
    "Privacy policy for Uptix Digital services. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="glass-card rounded-xl p-8 md:p-12 border border-white/10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-slate-400 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-slate-400 leading-relaxed">
                At Uptix Digital, we respect your privacy and are committed to
                protecting your personal data. This privacy policy explains how
                we collect, use, and safeguard your information when you use our
                website and services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Information We Collect
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2">
                <li>Name and contact information</li>
                <li>Email address</li>
                <li>Project requirements and specifications</li>
                <li>Payment information</li>
                <li>Communication history</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process your orders and payments</li>
                <li>Communicate with you about your projects</li>
                <li>Send you updates and marketing communications</li>
                <li>Improve our services and website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                4. Data Security
              </h2>
              <p className="text-slate-400 leading-relaxed">
                We implement appropriate security measures to protect your
                personal information from unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Contact Us
              </h2>
              <p className="text-slate-400 leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="text-slate-300 mt-2">
                Email: hello@uptixdigital.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

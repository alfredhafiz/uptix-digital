import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Uptix Digital",
  description:
    "Terms of service for Uptix Digital. Read our terms and conditions for using our services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="glass-card rounded-xl p-8 md:p-12 border border-white/10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-slate-400 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-400 leading-relaxed">
                By accessing or using Uptix Digital's services, you agree to be
                bound by these Terms of Service. If you disagree with any part
                of the terms, you may not access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Services
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Uptix Digital provides web development, app development, and
                digital consulting services. We reserve the right to withdraw or
                amend our services without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                3. Payment Terms
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Payment terms will be specified in individual project contracts.
                Generally, we require a deposit before starting work, with final
                payment due upon project completion. All fees are non-refundable
                unless otherwise stated.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                4. Intellectual Property
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Upon full payment, clients receive ownership rights to the final
                deliverables. Uptix Digital retains the right to use the work in
                our portfolio and for marketing purposes unless otherwise agreed
                in writing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Limitation of Liability
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Uptix Digital shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                6. Contact Information
              </h2>
              <p className="text-slate-400 leading-relaxed">
                For questions about these Terms, please contact us at:
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

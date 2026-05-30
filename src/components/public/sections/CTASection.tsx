'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';

export default function CTASection() {
  return (
    <section className="section-pad relative overflow-hidden bg-gray-950">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-950" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollAnimation>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8">
            <Sparkles className="w-4 h-4 text-mint-300" />
            Start Your Growth Journey Today
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to <span className="brand-gradient-text">grow your business?</span>
          </h2>

          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Join 1,950+ successful businesses that have trusted FundGrow for
            registration, funding, certification, and compliance. Take the first
            step towards building your dream business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="primary-action px-8 py-4 text-base"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="tel:+919998006734"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-8 py-4 text-base font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              Call Us Now
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-400" />
              Free Consultation
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mint-400" />
              No Hidden Charges
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-400" />
              Expert Guidance
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

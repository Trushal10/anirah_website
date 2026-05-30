'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Phone, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

type Props = {
  settings: {
    hero_title?: string;
    hero_subtitle?: string;
    hero_badge?: string;
    phone?: string;
    google_reviews?: string;
    projects_executed?: string;
    states_covered?: string;
  };
};

const metrics = [
  { key: 'projects_executed', label: 'Projects executed', fallback: '500+' },
  { key: 'google_reviews', label: 'Google reviews', fallback: '1,950+' },
  { key: 'states_covered', label: 'States covered', fallback: '36+' },
] as const;

export default function HeroSection({ settings }: Props) {
  const { navigate } = useAppStore();
  const { toast } = useToast();
  const [eligibility, setEligibility] = useState({
    businessType: '',
    fundingAmount: '',
    phone: '',
  });
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  const heroTitle = settings?.hero_title || 'Buland Sapno ke Saath FundGrow';
  const heroSubtitle = settings?.hero_subtitle || 'From registration to investor pitch, we simplify everything for startups, MSMEs, and entrepreneurs.';
  const heroBadge = settings?.hero_badge || 'Trusted by growing Indian businesses';
  const phone = settings?.phone || '+91 9998006734';

  const checkEligibility = async () => {
    if (!eligibility.businessType || !eligibility.phone) {
      toast({
        title: 'Error',
        description: 'Please fill in your business type and phone number.',
        variant: 'destructive',
      });
      return;
    }

    setCheckingEligibility(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: 'Great news',
      description: 'Based on your profile, you may be eligible for funding. Our team will contact you shortly.',
    });
    setCheckingEligibility(false);
  };

  return (
    <section id="home" className="relative overflow-hidden bg-[#070707] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(249,182,91,0.20),transparent_34%),radial-gradient(circle_at_82%_14%,rgba(22,163,74,0.14),transparent_30%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="section-shell relative py-14 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm text-white/90 shadow-sm backdrop-blur"
            >
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-300" />
              <span className="truncate">{heroBadge}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-4xl font-bold leading-[1.08] tracking-normal sm:text-5xl lg:text-[4rem]"
            >
              {heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg lg:mx-0"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <button onClick={() => navigate('services')} className="primary-action px-7 py-3.5 text-base">
                Explore services
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/18 bg-white/10 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/15"
              >
                <Phone className="h-4 w-4" />
                Talk to an expert
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-7 grid gap-3 sm:grid-cols-3"
            >
              {metrics.map((metric) => (
                <div key={metric.key} className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-left">
                  <div className="text-xl font-bold text-white">
                    {settings?.[metric.key] ? `${settings[metric.key]}+` : metric.fallback}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-white/55">{metric.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mx-auto w-full max-w-lg"
          >
            <div className="rounded-lg border border-white/14 bg-white/[0.08] p-5 shadow-2xl backdrop-blur sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-400/15">
                    <Sparkles className="h-5 w-5 text-brand-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Check your eligibility</h2>
                    <p className="mt-1 text-sm text-white/60">Share a few details and get a quick callback.</p>
                  </div>
                </div>
                <TrendingUp className="mt-1 hidden h-5 w-5 text-mint-300 sm:block" />
              </div>

              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-white/78">Business type</span>
                  <select
                    value={eligibility.businessType}
                    onChange={(event) => setEligibility({ ...eligibility, businessType: event.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-[#111] px-3 py-3 text-sm text-white outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-300/25"
                  >
                    <option value="">Select business type</option>
                    <option value="Private Limited">Private Limited</option>
                    <option value="LLP">LLP</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-white/78">Funding required</span>
                  <select
                    value={eligibility.fundingAmount}
                    onChange={(event) => setEligibility({ ...eligibility, fundingAmount: event.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-[#111] px-3 py-3 text-sm text-white outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-300/25"
                  >
                    <option value="">Select amount</option>
                    <option value="5-25L">INR 5 Lakhs - INR 25 Lakhs</option>
                    <option value="25L-1Cr">INR 25 Lakhs - INR 1 Crore</option>
                    <option value="1Cr-5Cr">INR 1 Crore - INR 5 Crore</option>
                    <option value="5Cr+">INR 5 Crore+</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-white/78">Phone number</span>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={eligibility.phone}
                    onChange={(event) => setEligibility({ ...eligibility, phone: event.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-[#111] px-3 py-3 text-sm text-white placeholder:text-white/38 outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-300/25"
                  />
                </label>

                <Button
                  onClick={checkEligibility}
                  disabled={checkingEligibility}
                  className="h-12 w-full rounded-lg bg-gradient-to-r from-brand-500 to-mint-600 font-semibold text-white hover:from-brand-400 hover:to-mint-500"
                >
                  {checkingEligibility ? 'Checking...' : 'Check now'}
                  {!checkingEligibility && <Zap className="ml-2 h-4 w-4" />}
                </Button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center text-xs text-white/60">
                {['Secure', 'Fast callback', 'Free guidance'].map((item) => (
                  <span key={item} className="inline-flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-mint-300" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { Building2, IndianRupee, MapPin, MapPinned, TrendingUp } from 'lucide-react';
import { ScrollAnimation, StaggerContainer, StaggerItem } from '@/components/ui/ScrollAnimation';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const stateStats = [
  { state: 'Maharashtra', businesses: '82 Lakh+', funded: 'Rs. 120 Cr+' },
  { state: 'Tamil Nadu', businesses: '49 Lakh+', funded: 'Rs. 85 Cr+' },
  { state: 'Uttar Pradesh', businesses: '73 Lakh+', funded: 'Rs. 78 Cr+' },
  { state: 'Gujarat', businesses: '35 Lakh+', funded: 'Rs. 72 Cr+' },
  { state: 'Karnataka', businesses: '28 Lakh+', funded: 'Rs. 65 Cr+' },
  { state: 'Rajasthan', businesses: '32 Lakh+', funded: 'Rs. 45 Cr+' },
  { state: 'Madhya Pradesh', businesses: '30 Lakh+', funded: 'Rs. 38 Cr+' },
  { state: 'Telangana', businesses: '18 Lakh+', funded: 'Rs. 32 Cr+' },
  { state: 'West Bengal', businesses: '42 Lakh+', funded: 'Rs. 28 Cr+' },
  { state: 'Kerala', businesses: '22 Lakh+', funded: 'Rs. 25 Cr+' },
  { state: 'Delhi NCR', businesses: '15 Lakh+', funded: 'Rs. 22 Cr+' },
  { state: 'Punjab', businesses: '20 Lakh+', funded: 'Rs. 18 Cr+' },
];

const presenceStats = [
  { value: 36, suffix: '+', label: 'States & UTs', icon: MapPinned },
  { value: 250, suffix: '+', label: 'Cities Covered', icon: MapPin },
  { value: 20, suffix: 'K+', label: 'Businesses Funded', icon: Building2 },
  { value: 500, suffix: 'Cr+', label: 'Total Disbursed', icon: IndianRupee },
];

export default function PanIndiaSection() {
  return (
    <section className="relative overflow-hidden bg-[#050505] py-14 text-white lg:py-20">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-brand-500 via-mint-500 to-brand-500" />

      <div className="section-shell relative">
        <ScrollAnimation className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
            Pan-India Presence
          </span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Funding Businesses <span className="brand-gradient-text">Across India</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/65">
            From metro cities to tier-3 towns, our network helps entrepreneurs access practical funding consultancy.
          </p>
        </ScrollAnimation>

        <StaggerContainer className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4" staggerDelay={0.1}>
          {presenceStats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.06] p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-gray-950">
                  <stat.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-2xl font-bold text-white">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-white/55">{stat.label}</div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollAnimation>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stateStats.map((state) => (
              <div
                key={state.state}
                className="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-4 transition-all hover:-translate-y-0.5 hover:border-brand-400/50 hover:bg-white/[0.09]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mint-500 text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-white">{state.state}</h4>
                  <div className="flex items-center gap-1 text-xs text-white/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint-400" />
                    {state.businesses} MSMEs
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-brand-300" />
                    <span className="font-semibold text-brand-300">{state.funded}</span>
                    <span className="text-white/45">funded</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

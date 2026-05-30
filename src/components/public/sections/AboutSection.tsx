'use client';

import { Clock, Eye, MapPin, Star, Target, Users } from 'lucide-react';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const teamStats = [
  { icon: Clock, value: 40, suffix: '+', label: 'Years experience' },
  { icon: Users, value: 50, suffix: '+', label: 'Team members' },
  { icon: MapPin, value: 36, suffix: '+', label: 'States covered' },
  { icon: Star, value: 4.7, suffix: '/5', label: 'Rating' },
];

type Props = {
  settings: Partial<Record<'mission' | 'vision' | 'about_text', string>>;
};

export default function AboutSection({ settings }: Props) {
  const aboutContent = settings?.about_text || "FundGrow helps entrepreneurs and MSMEs start, operate, and scale with reliable registration, compliance, certification, and funding support.";
  const aboutMission = settings?.mission || 'To make high-quality business consultancy accessible, transparent, and practical for growing Indian businesses.';
  const aboutVision = settings?.vision || "To become India's most trusted business growth partner for startups, MSMEs, and established enterprises.";

  return (
    <section id="about" className="section-pad bg-white">
      <div className="section-shell">
        <div className="mb-14 grid items-center gap-10 lg:mb-16 lg:grid-cols-2 lg:gap-14">
          <ScrollAnimation direction="left">
            <span className="section-kicker mb-4">About FundGrow</span>
            <h2 className="section-heading mb-5">
              We are on a mission to <span className="text-brand-600">grow every business</span>
            </h2>
            <p className="section-copy">{aboutContent}</p>
          </ScrollAnimation>

          <ScrollAnimation direction="right" className="space-y-4">
            <div className="surface-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-950">Our Mission</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{aboutMission}</p>
            </div>

            <div className="surface-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-950">Our Vision</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{aboutVision}</p>
            </div>
          </ScrollAnimation>
        </div>

        <ScrollAnimation>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teamStats.map((stat) => (
              <div key={stat.label} className="surface-card flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                  <stat.icon className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-950">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-medium text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

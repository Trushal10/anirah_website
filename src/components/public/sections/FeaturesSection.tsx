'use client';

import { Zap, Eye, HeadphonesIcon, MapPin } from 'lucide-react';
import { ScrollAnimation, StaggerContainer, StaggerItem } from '@/components/ui/ScrollAnimation';

const features = [
  {
    icon: Zap,
    title: 'Fast Processing',
    description:
      'Our streamlined processes and strong institutional relationships enable quick service delivery. Most registrations are completed within 7-10 working days, and funding applications are processed efficiently through our dedicated team and established connections.',
    color: 'from-brand-400 to-brand-600',
    bgLight: 'bg-brand-50',
    iconColor: 'text-brand-600',
  },
  {
    icon: Eye,
    title: 'Transparent Pricing',
    description:
      'Complete transparency is at the core of our business philosophy. We provide clear, upfront pricing with zero hidden charges. Every cost is explained before you commit, ensuring you get maximum value from our consultancy services.',
    color: 'from-mint-400 to-mint-600',
    bgLight: 'bg-mint-50',
    iconColor: 'text-mint-700',
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Team',
    description:
      'Our team comprises experienced consultants, CAs, CSs, and legal professionals with deep domain expertise. From initial consultation to final delivery, a dedicated advisor guides you through every step with personalized attention.',
    color: 'from-brand-300 to-brand-600',
    bgLight: 'bg-brand-50',
    iconColor: 'text-brand-700',
  },
  {
    icon: MapPin,
    title: 'Pan India Service',
    description:
      'We serve businesses across all 36+ states and union territories in India. Most of our services can be handled completely online, and our team has in-depth knowledge of state-specific regulations and requirements.',
    color: 'from-mint-400 to-mint-600',
    bgLight: 'bg-mint-50',
    iconColor: 'text-mint-700',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section-pad bg-gray-950">
      <div className="section-shell">
        {/* Section Header */}
        <ScrollAnimation className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white/90 mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Built for <span className="brand-gradient-text">your success</span>
          </h2>
          <p className="text-lg text-white/68 max-w-2xl mx-auto">
            We combine expertise, transparency, and commitment to deliver an
            unparalleled business consultancy experience that puts your success first.
          </p>
        </ScrollAnimation>

        {/* Features Grid */}
        <StaggerContainer className="grid md:grid-cols-2 gap-6 lg:gap-8" staggerDelay={0.15}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group flex flex-col sm:flex-row gap-5 p-6 lg:p-8 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300 h-full">
                <div
                  className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgLight} group-hover:scale-105 transition-transform`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

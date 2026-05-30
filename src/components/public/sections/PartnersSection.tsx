'use client';

import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import { Award, Shield, BadgeCheck, Star } from 'lucide-react';

const partners = [
  { name: 'Startup India', abbr: 'SI' },
  { name: 'DPIIT', abbr: 'DP' },
  { name: 'State Bank of India', abbr: 'SBI' },
  { name: 'HDFC Bank', abbr: 'HDFC' },
  { name: 'MUDRA', abbr: 'MUD' },
  { name: 'SIDBI', abbr: 'SID' },
  { name: 'ICICI Bank', abbr: 'ICICI' },
  { name: 'Axis Bank', abbr: 'AXIS' },
  { name: 'Bank of Baroda', abbr: 'BOB' },
  { name: 'Punjab National', abbr: 'PNB' },
];

const certifications = [
  { icon: Shield, label: 'DPIIT Recognised', desc: 'Government of India' },
  { icon: Award, label: 'ISO 9001:2015', desc: 'Quality Certified' },
  { icon: BadgeCheck, label: 'GeM Registered', desc: 'Government Portal' },
  { icon: Star, label: 'Top 100 Fintech', desc: 'India 2024' },
];

export default function PartnersSection() {
  return (
    <section className="py-16 lg:py-20 bg-gray-50/80 border-y border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-4">
            Our Partners
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Trusted by Leading{' '}
            <span className="text-brand-600">
              Institutions
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We work with top banks, NBFCs, and government bodies to bring you the best funding options.
          </p>
        </ScrollAnimation>

        {/* Scrolling Logos */}
        <div className="relative mb-12">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50/80 to-transparent z-10 pointer-events-none" />

          <div className="flex animate-scroll gap-6 w-max">
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex-shrink-0 w-40 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1.5 hover:shadow-md hover:border-brand-200 hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-gray-400 font-bold text-xs group-hover:from-brand-100 group-hover:to-brand-50 group-hover:text-brand-600 transition-colors">
                  {partner.abbr}
                </div>
                <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-600 transition-colors text-center leading-tight px-2">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <ScrollAnimation>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.label}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-3">
                  <cert.icon className="w-6 h-6 text-brand-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">{cert.label}</span>
                <span className="text-xs text-gray-400">{cert.desc}</span>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

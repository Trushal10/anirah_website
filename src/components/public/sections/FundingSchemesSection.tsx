'use client';

import { useState } from 'react';
import { ScrollAnimation, StaggerContainer, StaggerItem } from '@/components/ui/ScrollAnimation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { richTextToPlainText } from '@/lib/rich-text';
import { useAppStore } from '@/store/app';

/* ✅ TYPE */
interface Scheme {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  description: string;
  category: string;
  image?: string | null;
  benefits: string;
  eligibility: string;
}

/* ✅ PROPS */
type Props = {
  schemes: Scheme[];
};

const filters = ['All Schemes', 'Loans', 'Subsidy', 'Grants'];

export default function FundingSchemesSection({ schemes }: Props) {
  const { navigate } = useAppStore();
  const [activeFilter, setActiveFilter] = useState('All Schemes');

  /* ✅ FILTER LOGIC */
  const filtered =
    activeFilter === 'All Schemes'
      ? schemes
      : schemes.filter((s) => s.category === activeFilter);

  return (
    <section className="section-pad bg-white">

      <div className="section-shell">

        {/* Header */}
        <ScrollAnimation className="text-center mb-12">
          <span className="section-kicker mb-4">
            Government Schemes
          </span>
          <h2 className="section-heading mb-4">
            Powerful <span className="text-brand-600">funding schemes</span>
          </h2>
          <p className="section-copy max-w-2xl mx-auto">
            Access government-backed funding programs designed specifically for startups, MSMEs, and entrepreneurs across India.
          </p>
        </ScrollAnimation>


        {/* Filters */}
        <div className="flex justify-center gap-2 mb-8">
          {/* {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm ${
                activeFilter === f
                  ? 'bg-[#F0B354] text-black shadow-none'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {f}
            </button>
          ))} */}
        </div>

        {/* Scheme Cards */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {filtered.map((scheme) => (
            <StaggerItem key={scheme.title}>
              <button
                onClick={() => navigate('scheme-detail', scheme.slug)}
                className="surface-card surface-card-hover group relative p-6 h-full flex w-full flex-col text-left"
              >
                {/* {scheme.popular && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </span>
                )} */}

                <div className="mb-4 overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
                  {scheme.image ? (
                    <img
                      src={scheme.image}
                      alt={scheme.title}
                      className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-gray-950 text-brand-300">
                      <Sparkles className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium mb-3 w-fit">
                  {scheme.category}
                </span>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{scheme.title}</h3>
                {/* <p className="text-brand-600 font-semibold text-sm mb-2">{scheme.amount}</p> */}
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{scheme.summary || richTextToPlainText(scheme.description)}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-mint-700">
                  View Details
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>

                {/* <div className="flex items-center gap-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-brand-600" />
                    Success <strong className="text-gray-600">{scheme.success}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-brand-400" />
                    Time <strong className="text-gray-600">{scheme.time}</strong>
                  </span>
                </div> */}
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}

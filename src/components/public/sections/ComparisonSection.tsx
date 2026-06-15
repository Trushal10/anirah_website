'use client';

import { Check, X, Minus } from 'lucide-react';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';

const comparisons = [
  {
    feature: 'Loan Approval Rate',
    anirahAdvisory: '95%',
    bank: '40-55%',
    other: '60-70%',
    anirahAdvisoryBest: true,
  },
  {
    feature: 'Average Processing Time',
    anirahAdvisory: '15-30 Days',
    bank: '45-90 Days',
    other: '30-60 Days',
    anirahAdvisoryBest: true,
  },
  {
    feature: 'Collateral-Free Options',
    anirahAdvisory: true,
    bank: false,
    other: true,
    anirahAdvisoryBest: true,
  },
  {
    feature: 'Government Scheme Access',
    anirahAdvisory: true,
    bank: true,
    other: false,
    anirahAdvisoryBest: null,
  },
  {
    feature: 'Dedicated Consultant',
    anirahAdvisory: true,
    bank: false,
    other: true,
    anirahAdvisoryBest: true,
  },
  {
    feature: 'Document Preparation',
    anirahAdvisory: true,
    bank: false,
    other: null,
    anirahAdvisoryBest: true,
  },
  {
    feature: '50+ Lending Partners',
    anirahAdvisory: true,
    bank: false,
    other: false,
    anirahAdvisoryBest: true,
  },
  {
    feature: 'Transparent Fees',
    anirahAdvisory: true,
    bank: true,
    other: false,
    anirahAdvisoryBest: null,
  },
  {
    feature: 'Pan-India Coverage',
    anirahAdvisory: '36 States',
    bank: 'Urban Only',
    other: 'Major Cities',
    anirahAdvisoryBest: true,
  },
  {
    feature: 'Post-Funding Support',
    anirahAdvisory: true,
    bank: false,
    other: null,
    anirahAdvisoryBest: true,
  },
  {
    feature: 'Success-Based Fee Option',
    anirahAdvisory: true,
    bank: null,
    other: false,
    anirahAdvisoryBest: true,
  },
  {
    feature: 'Online Application',
    anirahAdvisory: true,
    bank: true,
    other: true,
    anirahAdvisoryBest: null,
  },
];

function CellValue({ value, best }: { value: boolean | string | null; best: boolean | null }) {
  if (value === null) return <Minus className="w-4 h-4 text-gray-300 mx-auto" />;
  if (typeof value === 'boolean') {
    return value ? (
      <Check className={`w-4 h-4 mx-auto ${best ? 'text-brand-600' : 'text-brand-600'}`} />
    ) : (
      <X className="w-4 h-4 mx-auto text-red-400" />
    );
  }
  return (
    <span className={`text-sm font-medium ${best === true ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
      {value}
    </span>
  );
}

export default function ComparisonSection() {
  return (
    <section className="section-pad bg-gray-50/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollAnimation className="text-center mb-12">
          <span className="section-kicker mb-4">
            Why Anirah Advisory?
          </span>
          <h2 className="section-heading mb-4">
            See how we <span className="text-brand-600">stack up</span>
          </h2>
          <p className="section-copy max-w-2xl mx-auto">
            An honest comparison of what Anirah Advisory offers versus going directly to banks
            or working with other consultants. The numbers speak for themselves.
          </p>
        </ScrollAnimation>

        <ScrollAnimation>
          <div className="surface-card overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid sm:grid-cols-4 border-b-4 border-brand-400 bg-navy-950 text-white">
              <div className="p-4 font-semibold text-sm">Feature</div>
              <div className="p-4 font-bold text-sm text-center bg-white/20 rounded-none">
                Anirah Advisory
              </div>
              <div className="p-4 font-semibold text-sm text-center">Direct to Bank</div>
              <div className="p-4 font-semibold text-sm text-center">Other Consultants</div>
            </div>

            {/* Mobile Header Row */}
            <div className="sm:hidden border-b-4 border-brand-400 bg-navy-950 p-4 text-white">
              <div className="flex justify-between text-sm font-semibold">
                <span>Feature</span>
                <div className="flex gap-4 text-xs">
                  <span className="font-bold">Us</span>
                  <span>Bank</span>
                  <span>Others</span>
                </div>
              </div>
            </div>

            {/* Table Rows */}
            {comparisons.map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 items-center border-b border-gray-50 last:border-b-0 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <div className="p-3 sm:p-4 text-sm text-gray-700 font-medium">{row.feature}</div>
                <div
                  className={`p-3 sm:p-4 flex justify-center items-center ${
                    row.anirahAdvisoryBest === true ? 'bg-brand-50/50' : ''
                  }`}
                >
                  <CellValue value={row.anirahAdvisory} best={row.anirahAdvisoryBest} />
                </div>
                <div className="p-3 sm:p-4 flex justify-center items-center">
                  <CellValue value={row.bank} best={false} />
                </div>
                <div className="p-3 sm:p-4 flex justify-center items-center">
                  <CellValue value={row.other} best={false} />
                </div>
              </div>
            ))}
          </div>
        </ScrollAnimation>

      </div>
    </section>
  );
}

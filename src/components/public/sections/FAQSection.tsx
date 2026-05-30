'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ScrollAnimation } from '@/components/ui/ScrollAnimation';
import { richTextToPlainText } from '@/lib/rich-text';


interface FAQItemType {
  id: string;
  question: string;
  answer: string;
  category: string;
}

type Props = {
  faqs: FAQItemType[];
};

/* ✅ SINGLE ITEM COMPONENT */
function FAQCard({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`border rounded-lg transition-all duration-300 ${
        isOpen
          ? 'border-brand-200 bg-brand-50/30 shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full p-5 text-left gap-4"
      >
        <span
          className={`text-sm sm:text-base font-semibold ${
            isOpen ? 'text-brand-700' : 'text-gray-900'
          }`}
        >
          {question}
        </span>

        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'rotate-180 text-brand-600' : 'text-gray-400'
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
          {richTextToPlainText(answer)}
        </p>
      </div>
    </div>
  );
}

/* ✅ MAIN COMPONENT */
export default function FAQSection({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-pad bg-white">

      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <ScrollAnimation className="text-center mb-12">
          <span className="section-kicker mb-4">
            FAQ
          </span>
          <h2 className="section-heading mb-4">
            Frequently asked <span className="text-brand-600">questions</span>
          </h2>
          <p className="section-copy max-w-2xl mx-auto">
            Find answers to common questions about our business registration, certification,
            funding assistance, and compliance services.
          </p>
        </ScrollAnimation>

        {/* FAQ LIST */}
        <div className="space-y-3">

          {faqs?.length > 0 ? (
            faqs.slice(0, 8).map((faq, index) => (
              <FAQCard
                key={faq.id} // ✅ correct
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))
          ) : (
            <p className="text-center text-gray-400">
              No FAQs found
            </p>
          )}

        </div>

      </div>
    </section>
  );
}

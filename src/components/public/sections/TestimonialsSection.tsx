'use client';

import { Star, Quote } from 'lucide-react';
import { ScrollAnimation, StaggerContainer, StaggerItem } from '@/components/ui/ScrollAnimation';

/* ✅ TYPE */
interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  avatarUrl?: string | null;
}

type Props = {
  testimonials: Testimonial[];
};

/* ⭐ Rating */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-brand-400 fill-brand-400' : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonials }: Props) {
  return (
    <section className="py-10 lg:py-18 bg-gray-50/50">

      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <ScrollAnimation className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our{' '}
            <span className="text-brand-600">
              Clients Say
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Hear from the businesses we have helped
            with registration, certification, funding, and compliance across India.
          </p>
        </ScrollAnimation>

        {/* Cards */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>

          {testimonials?.map((t) => {

            const initials = t.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2);

            return (
              <StaggerItem key={t.id}>

                <div className="group relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-brand-100 mb-4" />

                <StarRating rating={t.rating} />

                {/* Review text */}
                <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-5 flex-1">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="brand-gradient w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                    <p className="text-xs text-gray-400">{t.company ? ` at ${t.company}` : ''}</p>
                  </div>
                </div>
              </div>

              </StaggerItem>
            );
          })}

        </StaggerContainer>

      </div>
    </section>
  );
}

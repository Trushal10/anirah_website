'use client';

import { useAppStore } from '@/store/app';
import { ArrowRight } from 'lucide-react';
import ServiceIcon from '@/components/common/ServiceIcon';
import { StaggerContainer, StaggerItem } from '@/components/ui/ScrollAnimation';
import { richTextToPlainText } from '@/lib/rich-text';
import { publicAccent } from '@/lib/public-palette';

interface Service {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tagline: string;
  description: string;
  accentColor: string;
  subservices?: { id: string }[];
}

type Props = {
  services: Service[];
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { navigate } = useAppStore();
  const accent = publicAccent(service.slug, index);

  return (
    <article className="surface-card surface-card-hover h-full">
      <button
        type="button"
        onClick={() => navigate('service-detail', service.slug)}
        className="group flex h-full w-full flex-col p-6 text-left lg:p-7"
      >
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}18` }}
        >
          <ServiceIcon icon={service.icon} accentColor={accent} className="h-6 w-6" alt={service.name} />
        </div>

        <h3 className="text-lg font-bold leading-snug text-gray-950">{service.name}</h3>
        <p className="mt-1 text-sm font-semibold" style={{ color: accent }}>
          {service.tagline}
        </p>

        <p className="mt-4 line-clamp-4 flex-1 text-sm leading-relaxed text-gray-600">
          {richTextToPlainText(service.description)}
        </p>

        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: accent }}>
          View sub-services
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </button>
    </article>
  );
}

export default function ServicesSection({ services }: Props) {
  return (
    <section className="section-pad bg-gray-50/80">
      <div className="section-shell">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="section-kicker">Our Services</span>
          <h2 className="section-heading mt-4">
            End-to-End <span className="text-brand-600">Business Solutions</span>
          </h2>
          <p className="section-copy mt-4">
            From registration to compliance, legal protection to government grants, every service is organized around the way a business actually grows.
          </p>
        </div>

        {services?.length > 0 ? (
          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            {services.map((service, index) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} index={index} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="surface-card p-8 text-center text-sm text-gray-500">No services found.</div>
        )}
      </div>
    </section>
  );
}

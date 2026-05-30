'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/app'
import { ArrowRight, Building2, CheckCircle, Phone } from 'lucide-react'
import PageHero from '@/components/common/PageHero'
import ServiceIcon from '@/components/common/ServiceIcon'
import { richTextToPlainText } from '@/lib/rich-text'
import { publicAccent } from '@/lib/public-palette'

interface SubService {
  id: string
  name: string
  slug: string
  description: string
  features: string[]
  pricing: string | null
  referenceLink: string | null
  order: number
}

interface ServiceSeries {
  id: string
  name: string
  slug: string
  icon: string
  tagline: string
  description: string
  accentColor: string
  subservices: SubService[]
}

export default function ServicesPage() {
  const { navigate } = useAppStore()
  const [services, setServices] = useState<ServiceSeries[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        const parsed = (data || []).map((service: any) => ({
          ...service,
          subservices: (service.subservices || []).map((sub: any) => {
            let features: string[] = []
            try {
              features = JSON.parse(sub.features || '[]')
            } catch {
              features = sub.features ? sub.features.split('\n').filter(Boolean) : []
            }
            return { ...sub, features }
          }),
        }))
        setServices(parsed)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="section-shell py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-56 rounded-lg bg-gray-100" />
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-56 rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <PageHero
        kicker="What We Offer"
        title="End-to-End"
        highlight="Business Solutions"
        description="From registration to legal, funding to branding, we provide practical consultancy services for every stage of your business."
        icon={<Building2 className="h-4 w-4 text-brand-300" />}
      />

      <section className="section-pad bg-white">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <span className="section-kicker">Service Categories</span>
            <h2 className="section-heading mt-4">Choose the support your business needs</h2>
            <p className="section-copy mt-4">
              Every category includes focused sub-services, clear next steps, and consultation support from the FundGrow team.
            </p>
          </div>

          <div className="mt-12 space-y-8">
            {services.map((service, index) => {
              const accent = publicAccent(service.slug, index)

              return (
                <article key={service.id} className="surface-card overflow-hidden">
                  <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="p-6 sm:p-8 lg:p-10">
                      <div
                        className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${accent}18` }}
                      >
                        <ServiceIcon icon={service.icon} accentColor={accent} className="h-7 w-7" alt={service.name} />
                      </div>
                      <p className="text-sm font-semibold" style={{ color: accent }}>
                        {service.tagline}
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-gray-950">{service.name}</h3>
                      <p className="mt-4 leading-relaxed text-gray-600">{richTextToPlainText(service.description)}</p>
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button onClick={() => navigate('service-detail', service.slug)} className="primary-action">
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button onClick={() => navigate('contact')} className="secondary-action">
                          <Phone className="h-4 w-4" />
                          Free Consultation
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {service.subservices.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => navigate('subservice-detail', sub.slug)}
                            className="surface-card surface-card-hover flex h-full items-start gap-3 p-4 text-left"
                          >
                            <span
                              className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                              style={{ backgroundColor: `${accent}18`, color: accent }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-gray-950">{sub.name}</span>
                              <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-gray-500">
                                {richTextToPlainText(sub.description)}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-gray-950 text-white">
        <div className="section-shell text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Not sure which service you need?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Book a free consultation. We will assess your needs and recommend the right service path.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate('contact')} className="primary-action">
              Book Free Consultation
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href="tel:+91998006734" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              <Phone className="h-4 w-4" />
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

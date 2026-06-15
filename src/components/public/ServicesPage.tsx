'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/app'
import { ArrowRight, CheckCircle, Clock, Phone } from 'lucide-react'
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
  registrationTime?: string | null
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

function parseStringArray(value: string[] | string | null | undefined) {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return value.split('\n').map((item) => item.trim()).filter(Boolean)
  }
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
          subservices: (service.subservices || []).map((sub: any) => ({
            ...sub,
            features: parseStringArray(sub.features),
          })),
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
              <div key={item} className="h-64 rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gray-950 py-14 text-white sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(240,179,84,0.18),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(22,163,74,0.14),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="section-shell relative text-center">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-200">
            Services
          </span>
          <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Business Solutions for <span className="text-brand-400">Startups and MSMEs</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Explore our comprehensive range of services, from business registration to funding, compliance, and growth consultancy.
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3 text-left">
            {[
              { value: `${services.length}+`, label: 'Service categories' },
              { value: services.reduce((total, item) => total + item.subservices.length, 0).toString(), label: 'Solutions' },
              { value: '24hr', label: 'Response time' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-center sm:px-4">
                <div className="text-lg font-bold text-white sm:text-2xl">{item.value}</div>
                <div className="mt-1 text-[11px] font-medium text-white/55 sm:text-xs">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-7 flex max-w-4xl flex-wrap justify-center gap-2">
            {services.map((service, index) => {
              const accent = publicAccent(service.slug, index)

              return (
                <a
                  key={service.id}
                  href={`#${service.slug}`}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
                  style={{ borderColor: `${accent}55` }}
                >
                  {service.name}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50/80">
        <div className="section-shell">
          <div className="space-y-8 py-10 sm:py-14 lg:py-16">
            {services.map((service, index) => {
              const accent = publicAccent(service.slug, index)
              const textPanel = (
                <div className="self-center">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: `${accent}12`, color: accent }}
                  >
                    {service.tagline}
                  </span>
                  <h2 className="mt-4 text-2xl font-bold leading-tight text-gray-950 sm:text-3xl">{service.name}</h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                    {richTextToPlainText(service.description)}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate('service-detail', service.slug)}
                      className="primary-action"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate('contact')}
                      className="secondary-action"
                    >
                      <Phone className="h-4 w-4" />
                      Free Consultation
                    </button>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${accent}14` }}
                    >
                      <ServiceIcon icon={service.icon} accentColor={accent} className="h-5 w-5" alt={service.name} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Services Available</p>
                      <p className="text-sm font-bold text-gray-950">{service.subservices.length} Solutions</p>
                    </div>
                  </div>
                </div>
              )

              const cardsPanel = (
                <div className="grid gap-3 sm:grid-cols-2">
                  {service.subservices.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => navigate('subservice-detail', sub.slug)}
                      className="group min-h-[150px] rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-mint-200 hover:shadow-lg hover:shadow-black/5"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                          style={{ backgroundColor: `${accent}12`, color: accent }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </span>
                        {sub.pricing && (
                          <span className="shrink-0 text-[10px] font-semibold text-gray-400">{sub.pricing}</span>
                        )}
                      </span>

                      <span className="mt-4 block text-sm font-bold leading-snug text-gray-950 transition group-hover:text-mint-700">{sub.name}</span>
                      <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-gray-500">
                        {richTextToPlainText(sub.description)}
                      </span>

                      <span className="mt-3 flex items-center justify-between gap-3 text-xs">
                        <span className="inline-flex min-h-5 items-center gap-1 text-gray-400">
                          {sub.registrationTime && (
                            <>
                              <Clock className="h-3 w-3" />
                              {sub.registrationTime}
                            </>
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold" style={{ color: accent }}>
                          View Details
                          <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )

              return (
                <article id={service.slug} key={service.id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 lg:p-10">
                  <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
                    {index % 2 === 0 ? (
                      <>
                        {textPanel}
                        {cardsPanel}
                      </>
                    ) : (
                      <>
                        {cardsPanel}
                        {textPanel}
                      </>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-gray-950 text-white">
        <div className="section-shell text-center">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-brand-200">
            Need Help Choosing?
          </span>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">Get the right service path before you start</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            We will assess your business stage, documents, urgency, and compliance needs before recommending the right service.
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

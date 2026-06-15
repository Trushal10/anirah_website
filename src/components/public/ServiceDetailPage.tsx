'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '@/store/app'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  ArrowLeft, ArrowRight, Phone, CheckCircle, Building2, Shield, Award, Clock,
  Users, Star, Sparkles, ClipboardList, Gift, Landmark, Palette, CheckCircle2,
  FileText, Zap, Rocket, ChevronRight, Target, Eye
} from 'lucide-react'
import { richTextToPlainText } from '@/lib/rich-text'
import ServiceIcon from '@/components/common/ServiceIcon'
import { publicAccent, publicAccentForeground } from '@/lib/public-palette'

/* ─── FadeIn Wrapper ─── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
  )
}

/* ─── JSON Parser ─── */
function parseJSON<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback
  try { return JSON.parse(str) } catch { return fallback }
}

/* ─── Interfaces ─── */
interface SubService {
  id: string
  name: string
  slug: string
  description: string
  features: string[]
  benefits: string[]
  process: { title: string; desc: string }[]
  documents: string[]
  eligibility: string
  registrationTime: string | null
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

interface Stat {
  id: string
  label: string
  value: number
  suffix: string
  icon: string
  color: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const iconMap: Record<string, React.ElementType> = {
  'clipboard-list': ClipboardList,
  'check-circle': CheckCircle,
  shield: Shield,
  award: Award,
  gift: Gift,
  landmark: Landmark,
  palette: Palette,
  Building2,
  Sparkles,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  Star,
}

const statIconMap: Record<string, React.ElementType> = {
  Calendar: Clock,
  Star,
  Building2,
  MapPin: Users,
  Users,
  Award,
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function ServiceDetailPage() {
  const { pageParam, navigate, settings } = useAppStore()

  const [service, setService] = useState<ServiceSeries | null>(null)
  const [allServices, setAllServices] = useState<ServiceSeries[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)

  /* ─── Fetch Data ─── */
  useEffect(() => {
    Promise.all([
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
      fetch('/api/faqs').then((r) => r.json()),
    ]).then(([sv, s, f]) => {
      const parsed: ServiceSeries[] = (sv || []).map((s: any) => ({
        ...s,
        subservices: (s.subservices || []).map((sub: any) => ({
          ...sub,
          features: parseJSON<string[]>(sub.features, []),
          benefits: parseJSON<string[]>(sub.benefits, []),
          process: parseJSON<{ title: string; desc: string }[]>(sub.process, []),
          documents: parseJSON<string[]>(sub.documents, []),
        })),
      }))
      setAllServices(parsed)
      const found = parsed.find((s: ServiceSeries) => s.slug === pageParam)
      setService(found || null)
      setStats(s || [])
      setFaqs(f || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [pageParam])

  /* ─── Derived ─── */
  const accent = publicAccent(service?.slug)
  const accentText = publicAccentForeground(accent)
  const otherServices = allServices.filter((s) => s.slug !== service?.slug).slice(0, 6)
  const phone = settings?.phone || ''

  const relatedFaqs = service
    ? faqs.filter(
        (f) =>
          f.category.toLowerCase().includes(service.name.toLowerCase()) ||
          service.name.toLowerCase().includes(f.category.toLowerCase())
      )
    : []
  const displayFaqs = relatedFaqs.length > 0 ? relatedFaqs : faqs.slice(0, 4)

  /* ─── Aggregated benefits from all subservices ─── */
  const allBenefits: string[] = []
  if (service) {
    for (const sub of service.subservices) {
      for (const b of sub.benefits) {
        if (!allBenefits.includes(b) && allBenefits.length < 6) {
          allBenefits.push(b)
        }
      }
    }
  }

  const benefitIcons = [Rocket, Sparkles, Star, Award, Eye, Target, Shield, CheckCircle2, Zap, FileText]

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-gray-100 rounded-2xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="h-48 bg-gray-100 rounded-2xl" />
            <div className="h-48 bg-gray-100 rounded-2xl" />
            <div className="h-48 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  /* ─── Error State ─── */
  if (!service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <p className="text-gray-500 mb-6">The service category you are looking for does not exist.</p>
          <Button onClick={() => navigate('services')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ═══════════════════════════════════════
          SECTION 1: Hero
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(240,179,84,0.18),transparent_30%),radial-gradient(circle_at_84%_14%,rgba(22,163,74,0.14),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-24">
          <FadeIn>
            {/* Back button */}
            <button
              onClick={() => navigate('services')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Services
            </button>

            <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-start">
              <div>
                {/* Series Badge */}
                <Badge className="mb-5 px-4 py-1.5 text-sm font-semibold" style={{ backgroundColor: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}>
                  {service.tagline}
                </Badge>

                {/* Title with icon */}
                <div className="flex flex-col gap-4 mb-5 sm:flex-row sm:items-center">
                  <div className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${accent}25` }}>
                    <ServiceIcon icon={service.icon} accentColor={accent} className="w-7 h-7" alt={service.name} />
                  </div>
                  <h1 className="text-3xl lg:text-5xl font-bold leading-tight text-white">{service.name}</h1>
                </div>

                {/* Description */}
                <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">{richTextToPlainText(service.description)}</p>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    onClick={() => navigate('contact')}
                    className="primary-action"
                    size="lg"
                  >
                    Get Free Consultation <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  {phone && (
                    <Button
                      variant="outline"
                      className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white rounded-xl"
                      size="lg"
                      asChild
                    >
                      <a href={`tel:${phone}`}>
                        <Phone className="w-4 h-4 mr-2" /> Call Us Now
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Right - Stats cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardContent className="p-5 text-center">
                    <p className="text-3xl font-bold text-white">{service.subservices.length}+</p>
                    <p className="text-xs text-gray-400 mt-1">Services</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardContent className="p-5 text-center">
                    <p className="text-3xl font-bold text-white">95%</p>
                    <p className="text-xs text-gray-400 mt-1">Success Rate</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardContent className="p-5 text-center">
                    <p className="text-3xl font-bold text-white">24hr</p>
                    <p className="text-xs text-gray-400 mt-1">Response Time</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardContent className="p-5 text-center">
                    <p className="text-3xl font-bold text-white">500+</p>
                    <p className="text-xs text-gray-400 mt-1">Projects Done</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2: Stats Bar
          ═══════════════════════════════════════ */}
      {stats.length > 0 && (
        <section className="py-10 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.slice(0, 4).map((stat, i) => {
                const SIcon = statIconMap[stat.icon] || Building2
                return (
                  <FadeIn key={stat.id} delay={i * 0.1}>
                    <Card className="rounded-xl border-0 shadow-sm bg-white">
                      <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
                          <SIcon className="w-5 h-5" style={{ color: accent }} />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-gray-900">{stat.value.toLocaleString()}{stat.suffix}</p>
                          <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          SECTION 3: Sub-Services Overview (3-column cards)
          ═══════════════════════════════════════ */}
      <section className="section-pad bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="section-kicker mb-3">Our Solutions</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive {service.name} Solutions
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Choose from our range of expert services designed to help your business succeed.
              </p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.subservices.map((sub, i) => (
              <FadeIn key={sub.id} delay={i * 0.05}>
                <Card
                  onClick={() => navigate('subservice-detail', sub.slug)}
                  className="group h-full cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-mint-200 hover:shadow-lg hover:shadow-black/5"
                >
                  <CardContent className="p-6">
                    {/* Numbered badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: accent, color: accentText }}
                      >
                        {i + 1}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors flex-1">
                        {sub.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                      {richTextToPlainText(sub.description)}
                    </p>

                    {/* Features preview */}
                    {sub.features.length > 0 && (
                      <ul className="space-y-1.5 mb-4">
                        {sub.features.slice(0, 3).map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: accent }} />
                            <span>{f}</span>
                          </li>
                        ))}
                        {sub.features.length > 3 && (
                          <li className="text-xs text-gray-400 ml-5">+{sub.features.length - 3} more features</li>
                        )}
                      </ul>
                    )}

                    {/* View Details link */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-sm font-medium" style={{ color: accent }}>View Details</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: accent }} />
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4: All Sub-Services (numbered list)
          ═══════════════════════════════════════ */}
      <section className="section-pad bg-white">
        <div className="section-shell">
          <FadeIn>
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="section-kicker mb-3">Complete List</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                All {service.name} Services
              </h2>
              <p className="text-gray-500">
                Pick the exact service you need. Each item opens a detailed page with documents, process, and eligibility.
              </p>
            </div>
          </FadeIn>
          <div className="grid gap-4 md:grid-cols-2">
            {service.subservices.map((sub, i) => (
              <FadeIn key={sub.id} delay={i * 0.05}>
                <button
                  onClick={() => navigate('subservice-detail', sub.slug)}
                  className="group flex h-full w-full items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-mint-200 hover:shadow-lg hover:shadow-black/5"
                >
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                    style={{ backgroundColor: accent, color: accentText }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-950 transition group-hover:text-mint-700">{sub.name}</h3>
                      {sub.registrationTime && (
                        <Badge variant="outline" className="rounded-full px-2 py-0 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {sub.registrationTime}
                        </Badge>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
                      {richTextToPlainText(sub.description)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mint-700">
                      View details
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5: Why Choose Us (Benefits)
          ═══════════════════════════════════════ */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="section-kicker mb-3">Why Choose Us</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Key Benefits of {service.name}
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Our expert {service.name} services come with these guaranteed advantages.
              </p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBenefits.length > 0
              ? allBenefits.slice(0, 6).map((benefit, i) => (
                  <FadeIn key={i} delay={i * 0.05}>
                    <Card className="h-full rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                      <CardContent className="p-6">
                        {(() => {
                          const BenefitIcon = benefitIcons[i % benefitIcons.length]
                          return <BenefitIcon className="mb-4 h-8 w-8" style={{ color: accent }} />
                        })()}
                        <h3 className="font-semibold text-gray-900 mb-1">{benefit}</h3>
                        <p className="text-sm text-gray-500">Professional support to ensure your {benefit.toLowerCase()} goals are achieved.</p>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))
              : [
                  { icon: Clock, title: 'Fast Processing', desc: 'Quick turnaround with dedicated support' },
                  { icon: Shield, title: 'Expert Guidance', desc: 'Experienced consultants at every step' },
                  { icon: Award, title: 'High Success Rate', desc: '95%+ approval rate across services' },
                  { icon: Users, title: 'Dedicated Manager', desc: 'Personal account manager for your needs' },
                  { icon: CheckCircle2, title: 'End-to-End Support', desc: 'From documentation to final delivery' },
                  { icon: Zap, title: 'Digital Process', desc: '100% online process with real-time tracking' },
                ].map((b, i) => (
                  <FadeIn key={i} delay={i * 0.05}>
                    <Card className="h-full rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${accent}15` }}>
                          <b.icon className="w-5 h-5" style={{ color: accent }} />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
                        <p className="text-sm text-gray-500">{b.desc}</p>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 6: How We Work
          ═══════════════════════════════════════ */}
      <section className="section-pad bg-gray-50/80">
        <div className="section-shell">
          <FadeIn>
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="section-kicker mb-3">Our Process</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How We Work</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                A simple and transparent process for all our {service.name} services.
              </p>
            </div>
          </FadeIn>
          <div className="grid gap-4 lg:grid-cols-4">
            {[
              { step: 1, icon: Phone, title: 'Consultation', desc: 'We understand your requirement and suggest the right service path.' },
              { step: 2, icon: FileText, title: 'Documents', desc: 'Our team shares a clear checklist and helps organize required papers.' },
              { step: 3, icon: ClipboardList, title: 'Filing', desc: 'We prepare, review, and submit the application with supporting details.' },
              { step: 4, icon: Award, title: 'Delivery', desc: 'You receive status updates until certificate, approval, or completion.' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  {i < 3 && (
                    <div className="absolute left-[calc(100%-0.5rem)] top-10 hidden h-px w-8 bg-gray-200 lg:block" />
                  )}
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold"
                    style={{ backgroundColor: accent, color: accentText }}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Step {item.step}
                  </span>
                  <h3 className="mb-2 font-bold text-gray-950">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 7: FAQ Section
          ═══════════════════════════════════════ */}
      {displayFaqs.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="section-kicker mb-3">FAQs</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <Accordion type="single" collapsible className="space-y-3">
                {displayFaqs.slice(0, 6).map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="bg-white rounded-xl border border-gray-100 px-6 data-[state=open]:shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-500 leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          SECTION 8: CTA - Ready to Get Started
          ═══════════════════════════════════════ */}
      <section className="section-pad relative overflow-hidden bg-gray-950">
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <ServiceIcon icon={service.icon} accentColor="#ffffff" className="w-8 h-8 text-white" alt={service.name} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Let our experts handle your {service.name} needs. Get a free consultation today and take the first step towards growing your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="primary-action"
                onClick={() => navigate('contact')}
              >
                Get Free Consultation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {phone && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white rounded-xl"
                  asChild
                >
                  <a href={`tel:${phone}`}>
                    <Phone className="w-4 h-4 mr-2" /> Call Us Now
                  </a>
                </Button>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 9: Other Services
          ═══════════════════════════════════════ */}
      {otherServices.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="section-kicker mb-3">Explore More</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Other Services</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Discover our comprehensive range of business services.
                </p>
              </div>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherServices.map((s, i) => {
                const sColor = publicAccent(s.slug, i)
                return (
                  <FadeIn key={s.id} delay={i * 0.05}>
                    <Card
                      onClick={() => navigate('service-detail', s.slug)}
                      className="cursor-pointer group rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${sColor}15` }}>
                            <ServiceIcon icon={s.icon} accentColor={sColor} className="w-5 h-5" alt={s.name} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: sColor }}>{s.tagline}</p>
                            <p className="font-bold text-gray-900">{s.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{richTextToPlainText(s.description)}</p>
                        <span className="text-sm font-medium inline-flex items-center gap-1" style={{ color: sColor }}>
                          Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

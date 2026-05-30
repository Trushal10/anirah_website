'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '@/store/app'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  ArrowLeft, ArrowRight, Phone, CheckCircle, ExternalLink, Clock,
  Building2, Shield, Award, Users, Star, Sparkles, ClipboardList,
  Gift, Landmark, Palette, CheckCircle2, FileText, Zap, Send,
  Lightbulb, Target, TrendingUp, Eye, Rocket, BarChart3, Search,
  BookOpen, ChevronRight
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { richTextToHtml, richTextToPlainText } from '@/lib/rich-text'
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

/* ─── JSON Parsers ─── */
function parseJSON<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback
  try { return JSON.parse(str) } catch { return fallback }
}

const benefitIcons = [Rocket, Sparkles, TrendingUp, Award, Lightbulb, Target, Shield, CheckCircle2, Zap, BarChart3]

/* ─── Interfaces ─── */
interface SubServiceData {
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
  series: {
    id: string
    name: string
    slug: string
    icon: string
    tagline: string
    description: string
    accentColor: string
  }
  seriesId?: string
}

interface ServiceSeries {
  id: string
  name: string
  slug: string
  icon: string
  tagline: string
  description: string
  accentColor: string
  subservices: SubServiceData[]
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

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function SubServiceDetailPage() {
  const { pageParam, navigate, settings } = useAppStore()
  const { toast } = useToast()

  const [subservice, setSubservice] = useState<SubServiceData | null>(null)
  const [siblingSubservices, setSiblingSubservices] = useState<SubServiceData[]>([])
  const [allServices, setAllServices] = useState<ServiceSeries[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)

  /* ─── Fetch Data ─── */
  useEffect(() => {
    if (!pageParam) return
    let cancelled = false

    // Reset stale data async to avoid sync setState in effect
    queueMicrotask(() => {
      if (!cancelled) {
        setSubservice(null)
        setSiblingSubservices([])
        setLoading(true)
      }
    })

    Promise.all([
      fetch(`/api/subservices?slug=${pageParam}`).then((r) => r.json()),
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
      fetch('/api/faqs').then((r) => r.json()),
    ]).then(([subData, servicesData, statsData, faqsData]) => {
      if (cancelled) return
      if (subData.error) {
        setSubservice(null)
        setLoading(false)
        return
      }

      // Parse sub-service JSON fields
      const parsedSub: SubServiceData = {
        ...subData,
        benefits: parseJSON<string[]>(subData.benefits, []),
        process: parseJSON<{ title: string; desc: string }[]>(subData.process, []),
        documents: parseJSON<string[]>(subData.documents, []),
      }
      setSubservice(parsedSub)

      // Parse all services for siblings and other series
      const parsedServices: ServiceSeries[] = (servicesData || []).map((s: any) => ({
        ...s,
        subservices: (s.subservices || []).map((sub: any) => ({
          ...sub,
          features: parseJSON<string[]>(sub.features, []),
          benefits: parseJSON<string[]>(sub.benefits, []),
          process: parseJSON<{ title: string; desc: string }[]>(sub.process, []),
          documents: parseJSON<string[]>(sub.documents, []),
        })),
      }))
      setAllServices(parsedServices)
      setStats(statsData || [])
      setFaqs(faqsData || [])

      // Find sibling subservices (same series)
      const series = parsedServices.find(
        (s) => s.id === subData.series?.id || s.slug === subData.series?.slug
      )
      if (series) {
        setSiblingSubservices(series.subservices)
      }

      setLoading(false)
    }).catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [pageParam])

  /* ─── Derived data ─── */
  const accent = publicAccent(subservice?.series?.slug || subservice?.slug)
  const accentText = publicAccentForeground(accent)
  const seriesName = subservice?.series?.name || 'Service'
  const seriesSlug = subservice?.series?.slug || ''
  const seriesTagline = subservice?.series?.tagline || ''
  const benefits = parseJSON<string[]>(subservice?.benefits as any, [])
  const processSteps = parseJSON<{ title: string; desc: string }[]>(subservice?.process as any, [])
  const documents = parseJSON<string[]>(subservice?.documents as any, [])
  const eligibilityHtml = subservice?.eligibility || ''
  const regTime = subservice?.registrationTime || ''

  const otherServices = allServices.filter((s) => s.slug !== seriesSlug).slice(0, 6)
  const relatedFaqs = faqs.filter(
    (f) =>
      f.category.toLowerCase().includes(seriesName.toLowerCase()) ||
      seriesName.toLowerCase().includes(f.category.toLowerCase()) ||
      f.category.toLowerCase().includes(subservice?.name?.toLowerCase().split(' ')[0] || '')
  )
  const displayFaqs = relatedFaqs.length > 0 ? relatedFaqs : faqs.slice(0, 4)

  const phone = settings?.phone || ''

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
  if (!subservice) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <p className="text-gray-500 mb-6">The service you are looking for does not exist.</p>
          <Button onClick={() => navigate('services')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
          </Button>
        </div>
      </div>
    )
  }

  /* ─── Strip HTML for plain text ─── */
  const plainDescription = subservice.description
    ? richTextToPlainText(subservice.description)
    .trim()
    : ''

  return (
    <div>
      {/* ═══════════════════════════════════════
          SECTION 1: Hero
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#010000' }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: accent }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-10" style={{ backgroundColor: '#16A34A' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <FadeIn>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
              <button onClick={() => navigate('services')} className="hover:text-white transition-colors">Services</button>
              <ChevronRight className="w-3 h-3" />
              <button onClick={() => navigate('service-detail', seriesSlug)} className="hover:text-white transition-colors">{seriesName}</button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{subservice.name}</span>
            </div>

            <div className="grid lg:grid-cols-5 gap-10 items-start">
              <div className="lg:col-span-3">
                {/* Series Badge */}
                <Badge className="mb-5 px-4 py-1.5 text-sm font-semibold" style={{ backgroundColor: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}>
                  {seriesTagline}
                </Badge>

                {/* Title */}
                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {subservice.name}
                </h1>

                {/* Tagline from series description */}
                <p className="text-base text-gray-300 leading-relaxed mb-8 max-w-2xl">
                  {richTextToPlainText(subservice.series?.description)}
                </p>

                {/* Description */}
                <div className="prose prose-invert prose-sm max-w-none mb-8 text-gray-400 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: richTextToHtml(subservice.description) }} />
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => navigate('contact')}
                    className="rounded-xl shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: accent, color: accentText }}
                    size="lg"
                  >
                    Get Free Consultation <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  {phone && (
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 rounded-xl"
                      size="lg"
                      asChild
                    >
                      <a href={`tel:${phone}`}>
                        <Phone className="w-4 h-4 mr-2" /> Call Us Now
                      </a>
                    </Button>
                  )}
                  {subservice.referenceLink && (
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 rounded-xl"
                      size="lg"
                      asChild
                    >
                      <a href={subservice.referenceLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" /> Official Reference
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Side - Quick Info Cards */}
              <div className="lg:col-span-2 space-y-4">
                {regTime && (
                  <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}20` }}>
                        <Clock className="w-6 h-6" style={{ color: accent }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Processing Time</p>
                        <p className="font-semibold text-white">{regTime}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}20` }}>
                      <Shield className="w-6 h-6" style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Support</p>
                      <p className="font-semibold text-white">Dedicated Manager</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}20` }}>
                      <CheckCircle className="w-6 h-6" style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Services in {seriesName}</p>
                      <p className="font-semibold text-white">{siblingSubservices.length} Services</p>
                    </div>
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
              {stats.slice(0, 4).map((stat, i) => (
                <FadeIn key={stat.id} delay={i * 0.1}>
                  <Card className="rounded-xl border-0 shadow-sm bg-white">
                    <CardContent className="p-5 text-center">
                      <p className="text-2xl lg:text-3xl font-bold" style={{ color: accent }}>
                        {stat.value.toLocaleString()}{stat.suffix}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          SECTION 3: What We Offer (sibling subservices grid)
          ═══════════════════════════════════════ */}
      {siblingSubservices.length > 1 && (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-3">What We Offer</Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  All {seriesName} Services
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Comprehensive solutions under the {seriesName} series to help your business grow.
                </p>
              </div>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {siblingSubservices.map((sub, i) => {
                const isActive = sub.slug === subservice.slug
                return (
                  <FadeIn key={sub.id} delay={i * 0.05}>
                    <Card
                      onClick={() => !isActive && navigate('subservice-detail', sub.slug)}
                      className={`group rounded-2xl border transition-all duration-300 h-full bg-white overflow-hidden cursor-pointer ${
                        isActive
                          ? 'shadow-lg ring-2'
                          : 'border-gray-100 hover:shadow-xl hover:-translate-y-1'
                      }`}
                      style={isActive ? { borderColor: accent, '--tw-ring-color': accent } as React.CSSProperties : {}}
                    >
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${accent}15` }}>
                          <ServiceIcon icon={subservice?.series?.icon} accentColor={accent} className="w-6 h-6" alt={seriesName} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                          {sub.name}
                          {isActive && (
                            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: accent, color: accentText }}>
                              Current
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {richTextToPlainText(sub.description)}
                        </p>
                        <span className="text-sm font-medium inline-flex items-center gap-1" style={{ color: accent }}>
                          View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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

      {/* ═══════════════════════════════════════
          SECTION 4: Included Services (numbered list)
          ═══════════════════════════════════════ */}
      {siblingSubservices.length > 1 && (
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-3">Included Services</Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
              </div>
            </FadeIn>
            <div className="space-y-4">
              {siblingSubservices.map((sub, i) => {
                const isActive = sub.slug === subservice.slug
                return (
                  <FadeIn key={sub.id} delay={i * 0.05}>
                    <div
                      onClick={() => !isActive && navigate('subservice-detail', sub.slug)}
                      className={`flex items-start gap-4 p-5 rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white shadow-md border-l-4'
                          : 'bg-white border border-gray-100 hover:shadow-md hover:border-l-4'
                      }`}
                      style={{ borderLeftColor: accent }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                        style={{ backgroundColor: accent, color: accentText }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {sub.name}
                          {isActive && (
                            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: accent, color: accentText }}>
                              Viewing
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {richTextToPlainText(sub.description)}
                        </p>
                      </div>
                      {!isActive && (
                        <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0 text-gray-400" />
                      )}
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          SECTION 5: Why Choose Our Service (Benefits)
          ═══════════════════════════════════════ */}
      {benefits.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-3">Key Benefits</Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose {subservice.name}
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Discover the advantages of choosing our expert {subservice.name} service.
                </p>
              </div>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <Card className="rounded-xl border-0 shadow-sm bg-white h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      {(() => {
                        const BenefitIcon = benefitIcons[i % benefitIcons.length]
                        return <BenefitIcon className="mb-4 h-8 w-8" style={{ color: accent }} />
                      })()}
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit}</h3>
                      <p className="text-sm text-gray-500">Professional assistance to ensure your {benefit.toLowerCase()} needs are met effectively.</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          SECTION 6: How We Work (Process Steps)
          ═══════════════════════════════════════ */}
      {processSteps.length > 0 && (
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-3">Our Process</Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How We Work</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  A simple 4-step process to get your {subservice.name} done efficiently.
                </p>
              </div>
            </FadeIn>
            <div className="relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block" />

              <div className="space-y-8">
                {processSteps.map((step, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="flex items-start gap-6 relative">
                      {/* Step number circle */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold z-10 shadow-lg"
                        style={{ backgroundColor: accent, color: accentText }}
                      >
                        {i + 1}
                      </div>
                      {/* Step content */}
                      <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          SECTION 7: Eligibility Criteria
          ═══════════════════════════════════════ */}
      {eligibilityHtml && (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Eligibility */}
              <FadeIn>
                <div className="bg-white rounded-2xl border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
                      <CheckCircle className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Eligibility Criteria</h2>
                  </div>
                  <div
                    className="prose prose-sm max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: richTextToHtml(eligibilityHtml) }}
                  />
                </div>
              </FadeIn>

              {/* Documents */}
              {documents.length > 0 && (
                <FadeIn delay={0.2}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-50">
                        <FileText className="w-5 h-5 text-brand-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Required Documents</h2>
                    </div>
                    <ul className="space-y-3">
                      {documents.map((doc, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-600" />
                          <span className="text-sm text-gray-600">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          SECTION 8: FAQ Section
          ═══════════════════════════════════════ */}
      {displayFaqs.length > 0 && (
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-3">FAQs</Badge>
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
          SECTION 9: CTA - Ready to Get Started
          ═══════════════════════════════════════ */}
      <section className="py-16 lg:py-20 relative overflow-hidden bg-gray-950">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Let our experts handle your {subservice.name} needs. Get a free consultation today and take the first step towards growing your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-100 rounded-xl shadow-lg font-semibold"
                style={{ color: accent }}
                onClick={() => navigate('contact')}
              >
                Get Free Consultation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {phone && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl"
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
          SECTION 10: Other Services
          ═══════════════════════════════════════ */}
      {otherServices.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-3">Explore More</Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Other Service Categories</h2>
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

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
function parseJSON<T>(value: T | string | null | undefined, fallback: T): T {
  if (value == null || value === '') return fallback
  if (typeof value !== 'string') return value
  try { return JSON.parse(value) } catch { return fallback }
}


/* ─── Interfaces ─── */
const benefitIcons = [Rocket, Sparkles, TrendingUp, Award, Lightbulb, Target, Shield, CheckCircle2, Zap, BarChart3]

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

function groupDocumentItems(items: string[]) {
  const groups: { title: string; items: string[] }[] = []
  let current: { title: string; items: string[] } | null = null

  for (const rawItem of items) {
    const item = rawItem.trim()
    if (!item) continue

    const heading = item
      .replace(/^#{1,6}\s*/, '')
      .replace(/:$/, '')
      .trim()

    const isHeading = item.startsWith('#') || item.endsWith(':')
    if (isHeading) {
      current = { title: heading, items: [] }
      groups.push(current)
      continue
    }

    if (!current) {
      current = { title: 'Required Documents', items: [] }
      groups.push(current)
    }
    current.items.push(item)
  }

  return groups.filter((group) => group.items.length > 0)
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
function normalizeMatchText(value: string | null | undefined) {
  return (value || '')
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

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
        features: parseJSON<string[]>(subData.features, []),
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
  const features = subservice?.features || []
  const benefits = subservice?.benefits || []
  const processSteps = subservice?.process || []
  const documents = subservice?.documents || []
  const documentGroups = groupDocumentItems(documents)
  const eligibilityHtml = subservice?.eligibility || ''
  const regTime = subservice?.registrationTime || ''
  const pricing = subservice?.pricing || ''

  const guideServices = features.length > 0 ? features : [
    'Free consultation and requirement review',
    'Document checklist and verification support',
    'Application preparation and portal filing',
    'Follow-up, correction support, and approval tracking',
    'Final handover with next-step guidance',
    'Post-service compliance and advisory support',
  ]
  const guideBenefits = benefits.length > 0 ? benefits : [
    'Clear guidance before you start the process',
    'Reduced chance of document or filing mistakes',
    'Professional support from planning to approval',
    'Transparent timeline, requirements, and handover',
    'Better readiness for compliance, banking, and growth',
  ]
  const guideProcessSteps = processSteps.length > 0 ? processSteps : [
    { title: 'Consultation', desc: `We understand your requirement for ${subservice?.name} and explain the right process, timeline, and documents.` },
    { title: 'Document Review', desc: 'Our team checks the submitted documents and helps you fix missing or incorrect details before filing.' },
    { title: 'Preparation & Filing', desc: 'We prepare the required application, forms, declarations, and supporting documents for submission.' },
    { title: 'Approval & Handover', desc: 'After approval, we share the final documents and guide you on the next important steps.' },
  ]
  const guideDocumentGroups = documentGroups.length > 0 ? documentGroups : [
    {
      title: 'Applicant Details',
      items: ['PAN card or identity proof', 'Aadhaar card or address proof', 'Mobile number and email address', 'Passport size photograph if required'],
    },
    {
      title: 'Business Details',
      items: ['Business name and activity details', 'Registered office or business address proof', 'Rent agreement or NOC if applicable'],
    },
  ]

  const otherServices = allServices.filter((s) => s.slug !== seriesSlug).slice(0, 6)
  const faqTerms = [
    subservice?.name,
    subservice?.slug,
    seriesName,
    seriesSlug,
  ]
    .map(normalizeMatchText)
    .filter(Boolean)
  const relatedFaqs = faqs.filter((faq) => {
    const category = normalizeMatchText(faq.category)
    const question = normalizeMatchText(faq.question)
    return faqTerms.some((term) => {
      const keyword = term.split(' ')[0]
      return category.includes(term) || term.includes(category) || question.includes(term) || question.includes(keyword)
    })
  })
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
                <div className="prose-content prose-content-invert max-w-none mb-8 text-gray-300 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: richTextToHtml(subservice.description) }} />
                </div>

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
                  {subservice.referenceLink && (
                    <Button
                      variant="outline"
                      className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white rounded-xl"
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
                  <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
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
                <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}20` }}>
                      <Landmark className="w-6 h-6" style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Pricing</p>
                      <p className="font-semibold text-white">{pricing || 'Get custom quote'}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
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
                <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
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
          SECTION 2B: Service Content Overview
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="section-pad bg-white">
          <div className="section-shell">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                <FadeIn>
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                    <span className="section-kicker mb-4">Our Services</span>
                    <h2 className="mb-4 text-2xl font-bold text-gray-950 sm:text-3xl">
                      What You Get With {subservice.name}
                    </h2>
                    <p className="mb-6 text-sm leading-relaxed text-gray-500">
                      Complete assistance for every important step, from planning and documents to filing and final approval.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {guideServices.map((feature, index) => (
                        <div key={feature} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint-50 text-xs font-bold text-mint-700">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium leading-relaxed text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                  <div className="rounded-2xl border border-gray-900 bg-gray-950 p-5 text-white shadow-sm sm:p-7">
                    <span className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-200">
                      Client Guide
                    </span>
                    <h2 className="mb-5 text-2xl font-bold sm:text-3xl">
                      Why This Service Helps
                    </h2>
                    <div className="space-y-3">
                      {guideBenefits.slice(0, 10).map((benefit) => (
                        <div key={benefit} className="flex items-start gap-3 rounded-xl bg-white/[0.06] p-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint-300" />
                          <span className="text-sm leading-relaxed text-white/78">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
            </div>
          </div>
        </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 3: What We Offer (sibling subservices grid)
          ═══════════════════════════════════════ */}
      {false && siblingSubservices.length > 1 && (
      <section className="section-pad bg-gray-50/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="section-kicker mb-3">What We Offer</span>
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
                      className={`group h-full cursor-pointer overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                        isActive
                          ? 'shadow-lg ring-2'
                          : 'border-gray-200 hover:-translate-y-0.5 hover:border-mint-200 hover:shadow-lg hover:shadow-black/5'
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
      <section className="section-pad bg-white">
          <div className="section-shell">
            <FadeIn>
              <div className="mx-auto mb-12 max-w-3xl text-center">
                <span className="section-kicker mb-3">Included Services</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
                <p className="text-gray-500">
                  See every service available in this category and jump between related options easily.
                </p>
              </div>
            </FadeIn>
            <div className="grid gap-4 md:grid-cols-2">
              {siblingSubservices.map((sub, i) => {
                const isActive = sub.slug === subservice.slug
                return (
                  <FadeIn key={sub.id} delay={i * 0.05}>
                    <button
                      onClick={() => !isActive && navigate('subservice-detail', sub.slug)}
                      className={`group flex h-full w-full items-start gap-4 rounded-2xl p-5 text-left transition-all ${
                        isActive
                          ? 'border border-mint-200 bg-mint-50/35 shadow-sm'
                          : 'border border-gray-200 bg-white hover:-translate-y-0.5 hover:border-mint-200 hover:shadow-lg hover:shadow-black/5'
                      }`}
                    >
                      <div
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                        style={{ backgroundColor: accent, color: accentText }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-2 font-bold text-gray-950 transition group-hover:text-mint-700">
                          {sub.name}
                          {isActive && (
                            <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: accent, color: accentText }}>
                              Viewing
                            </span>
                          )}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
                          {richTextToPlainText(sub.description)}
                        </p>
                        {!isActive && (
                          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mint-700">
                            View details
                            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                          </span>
                        )}
                      </div>
                    </button>
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
      {false && benefits.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="section-kicker mb-3">Key Benefits</span>
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
                    <Card className="h-full rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
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
      <section className="section-pad bg-gray-50/80">
          <div className="section-shell">
            <FadeIn>
              <div className="mx-auto mb-12 max-w-3xl text-center">
                <span className="section-kicker mb-3">Our Process</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Simple Step-by-Step Guidance</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  A clear path from consultation and document verification to submission, follow-up, and final handover.
                </p>
              </div>
            </FadeIn>
            <div className="grid gap-4 lg:grid-cols-4">
                {guideProcessSteps.map((step, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="relative h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      {i < guideProcessSteps.length - 1 && (
                        <div className="absolute left-[calc(100%-0.5rem)] top-10 hidden h-px w-8 bg-gray-200 lg:block" />
                      )}
                      <div
                        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold"
                        style={{ backgroundColor: accent, color: accentText }}
                      >
                        {i + 1}
                      </div>
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Step {i + 1}
                      </span>
                      <h3 className="mb-2 text-lg font-bold text-gray-950">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-500">{step.desc}</p>
                    </div>
                  </FadeIn>
                ))}
            </div>
          </div>
        </section>

      {/* ═══════════════════════════════════════
          SECTION 7: Eligibility Criteria
          ═══════════════════════════════════════ */}
      <section className="section-pad bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Eligibility */}
              <FadeIn>
                <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
                      <CheckCircle className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Who This Is For</h2>
                  </div>
                  {eligibilityHtml ? (
                    <div
                      className="prose-content max-w-none text-gray-600"
                      dangerouslySetInnerHTML={{ __html: richTextToHtml(eligibilityHtml) }}
                    />
                  ) : (
                    <div className="space-y-3 text-sm leading-relaxed text-gray-600">
                      <p>
                        This service is suitable for founders, MSMEs, professionals, and growing businesses that need structured support for {subservice.name}.
                      </p>
                      <p>
                        Exact eligibility can vary by business activity, location, documents, and portal requirements. Our team reviews these details before starting the application.
                      </p>
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Documents */}
                <FadeIn delay={0.2}>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}15` }}>
                        <FileText className="h-5 w-5" style={{ color: accent }} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Required Documents</h2>
                    </div>
                    <div className="space-y-5">
                      {guideDocumentGroups.map((group) => (
                        <div key={group.title}>
                          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">{group.title}</h3>
                          <ul className="space-y-3">
                            {group.items.map((doc) => (
                              <li key={doc} className="flex items-start gap-3">
                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: accent }} />
                                <span className="text-sm leading-relaxed text-gray-600">{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
            </div>
          </div>
        </section>

      {/* ═══════════════════════════════════════
          SECTION 8: FAQ Section
          ═══════════════════════════════════════ */}
      {displayFaqs.length > 0 && (
      <section className="section-pad bg-gray-50/80">
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
          SECTION 9: CTA - Ready to Get Started
          ═══════════════════════════════════════ */}
      <section className="section-pad relative overflow-hidden bg-gray-950">
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
          SECTION 10: Other Services
          ═══════════════════════════════════════ */}
      {otherServices.length > 0 && (
      <section className="section-pad bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="section-kicker mb-3">Explore More</span>
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

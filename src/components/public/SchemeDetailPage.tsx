'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Landmark, Phone, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/store/app'
import { richTextToHtml, richTextToPlainText } from '@/lib/rich-text'

interface Scheme {
  id: string
  title: string
  slug: string
  summary?: string | null
  description: string
  benefits: string
  eligibility: string
  category: string
  image?: string | null
}

function parseBenefits(value: string | null | undefined) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String)
  } catch {
    // fall through
  }
  return value.split('\n').map((item) => item.trim()).filter(Boolean)
}

interface SchemeDetailPageProps {
  slug?: string
}

export default function SchemeDetailPage({ slug }: SchemeDetailPageProps) {
  const { pageParam, navigate, settings } = useAppStore()
  const activeSlug = slug || pageParam
  const [scheme, setScheme] = useState<Scheme | null>(null)
  const [relatedSchemes, setRelatedSchemes] = useState<Scheme[]>([])
  const [loadedSlug, setLoadedSlug] = useState('')
  const phone = settings?.phone || ''

  useEffect(() => {
    if (!activeSlug) {
      return
    }
    fetch('/api/schemes')
      .then((r) => r.json())
      .then((data) => {
        const list: Scheme[] = Array.isArray(data) ? data : []
        const found = list.find((item) => item.slug === activeSlug) || null
        setScheme(found)
        setRelatedSchemes(list.filter((item) => item.slug !== activeSlug && (!found || item.category === found.category)).slice(0, 3))
        setLoadedSlug(activeSlug)
      })
      .catch(() => setLoadedSlug(activeSlug))
  }, [activeSlug])

  const benefits = useMemo(() => parseBenefits(scheme?.benefits), [scheme?.benefits])
  const loading = Boolean(activeSlug && loadedSlug !== activeSlug)

  if (loading) {
    return (
      <div className="section-shell py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-72 rounded-lg bg-gray-100" />
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="h-96 rounded-lg bg-gray-100" />
            <div className="h-80 rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>
    )
  }

  if (!scheme) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-950">Scheme Not Found</h2>
          <p className="mb-6 text-gray-500">The government scheme you are looking for does not exist.</p>
          <Button onClick={() => navigate('government-schemes')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Government Schemes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(232,162,62,0.16),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(22,163,74,0.12),transparent_30%)]" />
        <div className="section-shell relative py-16 lg:py-24">
          <button onClick={() => navigate('government-schemes')} className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Government Schemes
          </button>

          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <Badge className="mb-5 border-white/15 bg-white/10 px-4 py-1.5 text-sm text-white">{scheme.category}</Badge>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">{scheme.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                {scheme.summary || richTextToPlainText(scheme.description)}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => navigate('contact')} className="primary-action">
                  Get Consultation
                  <ArrowRight className="h-4 w-4" />
                </button>
                {phone && (
                  <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                    <Phone className="h-4 w-4" />
                    Call Us
                  </a>
                )}
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
              {scheme.image ? (
                <img src={scheme.image} alt={scheme.title} className="h-72 w-full object-cover lg:h-80" />
              ) : (
                <div className="flex h-72 items-center justify-center text-brand-300 lg:h-80">
                  <Landmark className="h-16 w-16" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="section-shell grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-6">
            <section className="surface-card p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-950">Scheme Overview</h2>
              </div>
              <div className="prose-content max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: richTextToHtml(scheme.description) }} />
            </section>

            <section className="surface-card p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint-50 text-mint-700">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-950">Eligibility</h2>
              </div>
              <div className="prose-content max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: richTextToHtml(scheme.eligibility) }} />
            </section>

            {benefits.length > 0 && (
              <section className="surface-card p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-950 text-brand-300">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-950">Benefits</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint-600" />
                      <p className="text-sm leading-relaxed text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="sticky top-24 space-y-5">
            <div className="surface-card p-6">
              <h2 className="text-lg font-bold text-gray-950">Need help applying?</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Our team can check eligibility, prepare documents, and guide the application process.
              </p>
              <button onClick={() => navigate('contact')} className="primary-action mt-5 w-full">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {relatedSchemes.length > 0 && (
              <div className="surface-card p-6">
                <h2 className="text-lg font-bold text-gray-950">Related Schemes</h2>
                <div className="mt-4 space-y-3">
                  {relatedSchemes.map((item) => (
                    <button key={item.id} onClick={() => navigate('scheme-detail', item.slug)} className="block w-full rounded-lg border border-gray-100 p-4 text-left transition hover:border-mint-200 hover:bg-mint-50/40">
                      <span className="text-sm font-semibold text-gray-950">{item.title}</span>
                      <span className="mt-1 block text-xs text-gray-500">{item.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}

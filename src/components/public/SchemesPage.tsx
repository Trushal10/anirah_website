'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Landmark, Search, Sparkles } from 'lucide-react'
import PageHero from '@/components/common/PageHero'
import { useAppStore } from '@/store/app'
import { richTextToPlainText } from '@/lib/rich-text'

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

export default function SchemesPage() {
  const { navigate } = useAppStore()
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/schemes')
      .then((r) => r.json())
      .then((data) => {
        setSchemes(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = useMemo(() => ['All', ...Array.from(new Set(schemes.map((scheme) => scheme.category).filter(Boolean)))], [schemes])
  const filteredSchemes = schemes.filter((scheme) => {
    const matchesCategory = activeCategory === 'All' || scheme.category === activeCategory
    const cardSummary = scheme.summary || richTextToPlainText(scheme.description)
    const searchable = `${scheme.title} ${scheme.category} ${cardSummary}`.toLowerCase()
    return matchesCategory && searchable.includes(search.toLowerCase())
  })

  if (loading) {
    return (
      <div className="section-shell py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-56 rounded-lg bg-gray-100" />
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-80 rounded-lg bg-gray-100" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <PageHero
        kicker="Government Schemes"
        title="Explore Funding"
        highlight="Opportunities"
        description="Find government-backed schemes, grants, subsidies, and support programs for startups, MSMEs, and growing businesses."
        icon={<Landmark className="h-4 w-4 text-brand-300" />}
      />

      <section className="section-pad">
        <div className="section-shell">
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search schemes..."
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-mint-300 focus:ring-2 focus:ring-mint-100"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    activeCategory === category
                      ? 'border-gray-950 bg-gray-950 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:text-brand-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredSchemes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredSchemes.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => navigate('scheme-detail', scheme.slug)}
                  className="surface-card surface-card-hover group flex h-full flex-col overflow-hidden text-left"
                >
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    {scheme.image ? (
                      <img src={scheme.image} alt={scheme.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-950 text-brand-300">
                        <Sparkles className="h-10 w-10" />
                      </div>
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-950 shadow-sm">
                      {scheme.category}
                    </span>
                  </div>
                  <span className="flex flex-1 flex-col p-6">
                    <span className="text-xl font-bold text-gray-950">{scheme.title}</span>
                    <span className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                      {scheme.summary || richTextToPlainText(scheme.description)}
                    </span>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-mint-700">
                      View scheme details
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
              <Landmark className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">No government schemes found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

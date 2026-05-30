'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '@/store/app'
import { BookOpen, Clock } from 'lucide-react'
import PageHero from '@/components/common/PageHero'

interface ContentArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  readTime: string
  coverImage: string | null
  isFeatured: boolean
  createdAt: string
}

const fallbackCategories = ['All', 'Registration', 'Certification', 'Compliance', 'Tax', 'Business Funding', 'Legal']

export default function ContentPage() {
  const { navigate } = useAppStore()
  const [articles, setArticles] = useState<ContentArticle[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        setArticles(data?.articles || data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const fromArticles = Array.from(new Set(articles.map((article) => article.category).filter(Boolean)))
    return ['All', ...fallbackCategories.filter((category) => category !== 'All' && fromArticles.includes(category)), ...fromArticles.filter((category) => !fallbackCategories.includes(category))]
  }, [articles])

  const filtered = activeCategory === 'All' ? articles : articles.filter((article) => article.category === activeCategory)
  const featured = filtered.filter((article) => article.isFeatured).slice(0, 3)

  if (loading) {
    return (
      <div className="section-shell py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-48 rounded-lg bg-gray-100" />
          <div className="grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-64 rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderArticleCard = (article: ContentArticle, featuredCard = false) => (
    <button
      key={article.id}
      onClick={() => navigate('content-detail', article.slug)}
      className="surface-card surface-card-hover flex h-full flex-col overflow-hidden text-left"
    >
      {featuredCard && (
        <div className="relative h-48 bg-gray-100">
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-950">
              <BookOpen className="h-12 w-12 text-white/30" />
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-950 shadow-sm">
            Featured
          </span>
        </div>
      )}
      <span className="flex flex-1 flex-col p-5">
        <span className="mb-3 w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{article.category}</span>
        <span className="line-clamp-2 text-lg font-bold text-gray-950">{article.title}</span>
        <span className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{article.excerpt}</span>
        <span className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime}
          </span>
          <span>{new Date(article.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </span>
      </span>
    </button>
  )

  return (
    <div className="bg-white">
      <PageHero
        kicker="Knowledge Base"
        title="Content and"
        highlight="Resources"
        description="Read practical guides on registration, compliance, certifications, tax, legal work, and funding."
        icon={<BookOpen className="h-4 w-4 text-brand-300" />}
      />

      <section className="section-pad">
        <div className="section-shell">
          <div className="flex flex-wrap justify-center gap-2">
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

          {featured.length > 0 && (
            <div className="mt-12">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <span className="section-kicker">Featured</span>
                  <h2 className="section-heading mt-4">Start with these guides</h2>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {featured.map((article) => renderArticleCard(article, true))}
              </div>
            </div>
          )}

          <div className="mt-12">
            <div className="mb-6">
              <span className="section-kicker">All Articles</span>
              <h2 className="section-heading mt-4">Latest resources</h2>
            </div>
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((article) => renderArticleCard(article))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p className="text-gray-500">No articles found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/app'
import { ArrowRight, Calendar, Clock, TrendingUp } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/ui/ScrollAnimation'
import { richTextToPlainText } from '@/lib/rich-text'
import PageHero from '@/components/common/PageHero'

interface BlogPost {
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

const categories = ['All', 'Registration', 'Startup', 'Tax', 'Funding', 'Compliance', 'Legal', 'Business']

export default function BlogPage() {
  const { navigate } = useAppStore()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        const blogData = data?.posts || data || []
        setPosts(Array.isArray(blogData) ? blogData : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const availableCategories = categories.filter((category) => category === 'All' || posts.some((post) => post.category === category))
  const filtered = activeCategory === 'All' ? posts : posts.filter((post) => post.category === activeCategory)

  if (loading) {
    return (
      <div className="section-shell py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-52 rounded-lg bg-gray-100" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-72 rounded-lg bg-gray-100" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        kicker="Knowledge Hub"
        title="Insights &"
        highlight="Resources"
        description="Expert articles, registration guides, funding tips, and compliance updates to help you make better business decisions."
        icon={<TrendingUp className="h-4 w-4 text-brand-300" />}
      />

      <section className="section-pad bg-gray-50/80">
        <div className="section-shell">
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {availableCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === category
                    ? 'border-transparent bg-gradient-to-r from-brand-500 to-mint-600 text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
              {filtered.map((post) => (
                <StaggerItem key={post.id}>
                  <article
                    onClick={() => navigate('blog-detail', post.slug)}
                    className="surface-card surface-card-hover group flex h-full cursor-pointer flex-col overflow-hidden border border-gray-200"
                  >
                    <div className="h-44 overflow-hidden bg-gray-100">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-950 text-sm font-semibold tracking-wide text-brand-300">ARTICLE</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{post.category}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="line-clamp-2 text-base font-bold leading-snug text-gray-950 transition group-hover:text-mint-700">{post.title}</h2>
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">{richTextToPlainText(post.excerpt)}</p>
                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-mint-700">
                          Read <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="surface-card p-8 text-center text-sm text-gray-500">No articles found in this category.</div>
          )}
        </div>
      </section>
    </div>
  )
}

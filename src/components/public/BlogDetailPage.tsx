'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '@/store/app'
import { motion, useInView } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Clock, Calendar, BookOpen, User } from 'lucide-react'
import { richTextToHtml } from '@/lib/rich-text'
import PageHero from '@/components/common/PageHero'

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
}

interface BlogPost { id: string; title: string; slug: string; excerpt: string; content: string; category: string; readTime: string; coverImage: string | null; tags: string; createdAt: string }

export default function BlogDetailPage() {
  const { pageParam, navigate, settings } = useAppStore()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(!pageParam)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!pageParam) {
      setRedirecting(true)
      navigate('blog')
      return
    }
    fetch(`/api/blog/${pageParam}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setRedirecting(true)
          setPost(null)
          navigate('blog')
          return
        }
        setPost(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        const all = data?.posts || data || []
        setRelated(all.filter((p: BlogPost) => p.slug !== pageParam).slice(0, 3))
      })
      .catch(() => {})
  }, [pageParam])

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20"><div className="animate-pulse space-y-6"><div className="h-64 bg-gray-100 rounded-2xl" /><div className="h-96 bg-gray-100 rounded-2xl" /></div></div>
  }

  if (redirecting) {
    return <div className="min-h-[40vh]" />
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <Button onClick={() => navigate('blog')} variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        kicker="Knowledge Hub"
        title={post.category}
        highlight="Article"
        description={post.title}
        icon={<BookOpen className="h-4 w-4 text-brand-300" />}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FadeIn>
          <button onClick={() => navigate('blog')} className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>
        </FadeIn>

        {/* Hero details */}
        <FadeIn>
          <div className="surface-card overflow-hidden">
            {post.coverImage && (
              <div className="h-72 overflow-hidden bg-gray-100">
                <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <Badge className="mb-4 bg-brand-50 text-brand-700 border border-brand-200">{post.category}</Badge>
              <h1 className="text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Author Info */}
        <FadeIn>
          <div className="mt-8 flex items-center gap-3 border-b border-gray-100 pb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-950">
              <User className="w-5 h-5 text-brand-300" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{settings.company_name || 'FundGrow'} Team</p>
              <p className="text-xs text-gray-500">MSME Business Consultancy</p>
            </div>
          </div>
        </FadeIn>

        {/* Content */}
        <FadeIn>
          <article
            className="prose prose-lg max-w-none prose-headings:text-gray-950 prose-p:text-gray-700 prose-a:text-brand-700 leading-relaxed mb-12"
            dangerouslySetInnerHTML={{ __html: richTextToHtml(post.content) }}
          />
        </FadeIn>

        {/* Tags */}
        {post.tags && (
          <FadeIn>
            <div className="mb-12 flex flex-wrap gap-2">
              {(() => {
                try {
                  const tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags
                  return (Array.isArray(tags) ? tags : String(tags).split(',')).map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary" className="rounded-full">{tag.trim()}</Badge>
                  ))
                } catch {
                  return null
                }
              })()}
            </div>
          </FadeIn>
        )}
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="section-pad bg-gray-50">
          <div className="section-shell">
            <FadeIn>
              <h2 className="mb-8 text-2xl font-bold text-gray-950">Related Articles</h2>
            </FadeIn>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.05}>
                  <Card onClick={() => navigate('blog-detail', p.slug)} className="surface-card surface-card-hover cursor-pointer overflow-hidden">
                    <div className="h-36 overflow-hidden bg-gray-100">
                      {p.coverImage ? <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-gray-950"><BookOpen className="w-10 h-10 text-white/30" /></div>}
                    </div>
                    <CardContent className="p-5">
                      <Badge variant="secondary" className="mb-2 text-xs">{p.category}</Badge>
                      <h3 className="line-clamp-2 font-bold text-gray-950 transition group-hover:text-brand-700">{p.title}</h3>
                      <span className="mt-3 flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3" /> {p.readTime}</span>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

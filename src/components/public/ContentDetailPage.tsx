'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '@/store/app'
import { motion, useInView } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, Calendar, BookOpen } from 'lucide-react'
import { richTextToHtml } from '@/lib/rich-text'

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
}

interface ContentArticle { id: string; title: string; slug: string; content: string; category: string; readTime: string; coverImage: string | null; createdAt: string }

export default function ContentDetailPage() {
  const { pageParam, navigate } = useAppStore()
  const [article, setArticle] = useState<ContentArticle | null>(null)
  const [loading, setLoading] = useState(!pageParam)

  useEffect(() => {
    if (!pageParam) return
    fetch(`/api/content/${pageParam}`).then((r) => r.json()).then((data) => { setArticle(data.error ? null : data); setLoading(false) }).catch(() => setLoading(false))
  }, [pageParam])

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20"><div className="animate-pulse space-y-6"><div className="h-64 bg-gray-100 rounded-2xl" /><div className="h-96 bg-gray-100 rounded-2xl" /></div></div>
  }

  if (!article) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2><Button onClick={() => navigate('content')} variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Content</Button></div></div>
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FadeIn>
            <button onClick={() => navigate('content')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm"><ArrowLeft className="w-4 h-4" /> Back to Content</button>
            <Badge className="bg-white/10 text-white/90 border-white/20 mb-4">{article.category}</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {article.readTime}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(article.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {article.coverImage && (
          <FadeIn><div className="rounded-2xl overflow-hidden shadow-xl mb-10 max-h-[400px]"><img src={article.coverImage} alt={article.title} className="w-full object-cover" /></div></FadeIn>
        )}
        <FadeIn>
          <article className="prose-content max-w-none text-gray-700 leading-relaxed mb-12" dangerouslySetInnerHTML={{ __html: richTextToHtml(article.content) }} />
        </FadeIn>
      </div>
    </div>
  )
}

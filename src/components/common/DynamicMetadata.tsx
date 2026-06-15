'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/app'
import { richTextToPlainText } from '@/lib/rich-text'

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value)
  })
}

function upsertLink(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector)

  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value)
  })
}

export default function DynamicMetadata() {
  const { currentPage, pageParam, settings } = useAppStore()

  useEffect(() => {
    let cancelled = false
    const pageKeyMap: Record<string, string> = {
      home: 'home',
      services: 'services',
      blog: 'blog',
      content: 'content',
      about: 'about',
      career: 'career',
      contact: 'contact',
    }
    const pagePathMap: Record<string, string> = {
      home: '/',
      services: '/services',
      'service-detail': pageParam ? `/services/${pageParam}` : '/services',
      'subservice-detail': pageParam ? `/services/subservice/${pageParam}` : '/services',
      blog: '/blog',
      'blog-detail': pageParam ? `/blog/${pageParam}` : '/blog',
      content: '/content',
      'content-detail': pageParam ? `/content/${pageParam}` : '/content',
      about: '/about',
      career: '/career',
      contact: '/contact',
    }

    const applyMetadata = (metadata: {
      title: string
      description: string
      keywords: string
      canonicalUrl: string
      imageUrl?: string | null
    }) => {
      if (cancelled) return

      const siteName = settings.company_name || 'Anirah Advisory'
      const siteUrl = settings.site_url || settings.website || process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const baseUrl = siteUrl.replace(/\/$/, '')
      const imageUrl = metadata.imageUrl || settings.seo_image || settings.company_logo || ''
      const absoluteImageUrl = imageUrl && imageUrl.startsWith('/')
        ? `${baseUrl}${imageUrl}`
        : imageUrl

      document.title = metadata.title

      upsertMeta('meta[name="description"]', { name: 'description', content: metadata.description })
      upsertMeta('meta[name="keywords"]', { name: 'keywords', content: metadata.keywords })
      upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow' })

      upsertMeta('meta[property="og:title"]', { property: 'og:title', content: metadata.title })
      upsertMeta('meta[property="og:description"]', { property: 'og:description', content: metadata.description })
      upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: siteName })
      upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
      upsertMeta('meta[property="og:url"]', { property: 'og:url', content: metadata.canonicalUrl })

      upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: absoluteImageUrl ? 'summary_large_image' : 'summary' })
      upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: metadata.title })
      upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: metadata.description })

      if (absoluteImageUrl) {
        upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteImageUrl })
        upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteImageUrl })
      }

      upsertLink('link[rel="canonical"]', { rel: 'canonical', href: metadata.canonicalUrl })
    }

    const resolveMetadata = async () => {
      const siteName = settings.company_name || 'Anirah Advisory'
      const siteUrl = settings.site_url || settings.website || process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const baseUrl = siteUrl.replace(/\/$/, '')
      const pageKey = pageKeyMap[currentPage] || 'home'
      const staticTitle =
        settings[`seo_${pageKey}_title`] ||
        `${pageKey === 'home' ? siteName : `${pageKey.replace(/_/g, ' ')} | ${siteName}`}`
      const staticDescription =
        settings[`seo_${pageKey}_description`] ||
        settings.company_description ||
        'Business registration, MSME funding, government schemes, compliance, certification, and legal documentation support for Indian entrepreneurs.'
      const staticKeywords =
        settings[`seo_${pageKey}_keywords`] ||
        'MSME funding, business registration India, startup funding, government schemes, compliance'
      const staticCanonical =
        currentPage === 'home'
          ? baseUrl
          : `${baseUrl}${pagePathMap[currentPage] || '/'}`

      if (!pageParam || !['service-detail', 'subservice-detail', 'blog-detail', 'content-detail'].includes(currentPage)) {
        applyMetadata({
          title: staticTitle,
          description: staticDescription,
          keywords: staticKeywords,
          canonicalUrl: staticCanonical,
        })
        return
      }

      try {
        if (currentPage === 'blog-detail') {
          const post = await fetch(`/api/blog/${encodeURIComponent(pageParam)}`).then((r) => r.json())
          if (!post?.error) {
            applyMetadata({
              title: post.seoTitle || `${post.title} | ${siteName}`,
              description: post.seoDescription || richTextToPlainText(post.excerpt || ''),
              keywords: post.seoKeywords || post.category || staticKeywords,
              canonicalUrl: `${baseUrl}/blog/${post.slug || pageParam}`,
              imageUrl: post.coverImage,
            })
            return
          }
        }

        if (currentPage === 'content-detail') {
          const article = await fetch(`/api/content/${encodeURIComponent(pageParam)}`).then((r) => r.json())
          if (!article?.error) {
            applyMetadata({
              title: article.seoTitle || `${article.title} | ${siteName}`,
              description: article.seoDescription || richTextToPlainText(article.excerpt || ''),
              keywords: article.seoKeywords || article.category || staticKeywords,
              canonicalUrl: `${baseUrl}/content/${article.slug || pageParam}`,
              imageUrl: article.coverImage,
            })
            return
          }
        }

        if (currentPage === 'subservice-detail') {
          const subservice = await fetch(`/api/subservices?slug=${encodeURIComponent(pageParam)}`).then((r) => r.json())
          if (!subservice?.error) {
            applyMetadata({
              title: subservice.seoTitle || `${subservice.name} | ${siteName}`,
              description: subservice.seoDescription || richTextToPlainText(subservice.description || ''),
              keywords: subservice.seoKeywords || subservice.series?.name || staticKeywords,
              canonicalUrl: `${baseUrl}/services/subservice/${subservice.slug || pageParam}`,
            })
            return
          }
        }

        if (currentPage === 'service-detail') {
          const services = await fetch('/api/services').then((r) => r.json())
          const service = Array.isArray(services) ? services.find((item) => item.slug === pageParam) : null
          if (service) {
            applyMetadata({
              title: service.seoTitle || `${service.name} | ${siteName}`,
              description: service.seoDescription || richTextToPlainText(service.description || ''),
              keywords: service.seoKeywords || service.tagline || staticKeywords,
              canonicalUrl: `${baseUrl}/services/${service.slug || pageParam}`,
            })
            return
          }
        }
      } catch {
        // Fall back to static metadata below.
      }

      applyMetadata({
        title: staticTitle,
        description: staticDescription,
        keywords: staticKeywords,
        canonicalUrl: staticCanonical,
      })
    }

    resolveMetadata()
    return () => {
      cancelled = true
    }
  }, [currentPage, pageParam, settings])

  return null
}

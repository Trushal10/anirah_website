import { NextRequest, NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const [articles, total] = await Promise.all([
      db.contentArticle.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.contentArticle.count(),
    ])

    return NextResponse.json({ articles, total })
  } catch (error) {
    console.error('Error fetching admin content articles:', error)
    return apiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, slug, excerpt, content, seoTitle, seoDescription, seoKeywords, coverImage, category, readTime, isPublished, isFeatured } = body

    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: 'Title, slug, excerpt, content, and category are required' },
        { status: 400 }
      )
    }

    const article = await db.contentArticle.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
        coverImage: coverImage || null,
        category,
        readTime: readTime || '5 min read',
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error creating content article:', error)
    return apiError(error)
  }
}

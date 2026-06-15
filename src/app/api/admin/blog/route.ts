import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.blogPost.count(),
    ])

    return NextResponse.json({ posts, total })
  } catch (error) {
    console.error('Error fetching admin blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, slug, excerpt, content, seoTitle, seoDescription, seoKeywords, coverImage, category, tags, readTime, isPublished, isFeatured } = body

    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: 'Title, slug, excerpt, content, and category are required' },
        { status: 400 }
      )
    }

    const post = await db.blogPost.create({
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
        tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
        readTime: readTime || '5 min read',
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const where: Record<string, unknown> = { isPublished: true }

    if (featured === 'true') {
      where.isFeatured = true
    }
    if (category) {
      where.category = category
    }

    const [articles, total] = await Promise.all([
      db.contentArticle.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.contentArticle.count({ where }),
    ])

    return NextResponse.json({ articles, total })
  } catch (error) {
    console.error('Error fetching content articles:', error)
    return NextResponse.json({ error: 'Failed to fetch content articles' }, { status: 500 })
  }
}

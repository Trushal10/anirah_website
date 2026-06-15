import { NextRequest, NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
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

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.blogPost.count({ where }),
    ])

    return NextResponse.json({ posts, total })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return apiError(error)
  }
}

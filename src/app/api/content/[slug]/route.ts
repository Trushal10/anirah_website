import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const article = await db.contentArticle.findUnique({
      where: { slug },
    })

    if (!article || !article.isPublished) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching content article:', error)
    return NextResponse.json({ error: 'Failed to fetch content article' }, { status: 500 })
  }
}

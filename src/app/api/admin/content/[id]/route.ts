import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const data: Record<string, unknown> = {}
    if (body.title !== undefined) data.title = body.title
    if (body.slug !== undefined) data.slug = body.slug
    if (body.excerpt !== undefined) data.excerpt = body.excerpt
    if (body.content !== undefined) data.content = body.content
    if (body.coverImage !== undefined) data.coverImage = body.coverImage
    if (body.category !== undefined) data.category = body.category
    if (body.readTime !== undefined) data.readTime = body.readTime
    if (body.isPublished !== undefined) data.isPublished = body.isPublished
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured
    if (body.order !== undefined) data.order = body.order

    const article = await db.contentArticle.update({
      where: { id },
      data,
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error updating content article:', error)
    return NextResponse.json({ error: 'Failed to update content article' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.contentArticle.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting content article:', error)
    return NextResponse.json({ error: 'Failed to delete content article' }, { status: 500 })
  }
}

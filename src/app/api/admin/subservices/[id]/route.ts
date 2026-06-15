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
    if (body.name !== undefined) data.name = body.name
    if (body.slug !== undefined) data.slug = body.slug
    if (body.description !== undefined) data.description = body.description
    if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle || null
    if (body.seoDescription !== undefined) data.seoDescription = body.seoDescription || null
    if (body.seoKeywords !== undefined) data.seoKeywords = body.seoKeywords || null
    if (body.features !== undefined) {
      data.features = typeof body.features === 'string' ? body.features : JSON.stringify(body.features)
    }
    if (body.pricing !== undefined) data.pricing = body.pricing
    if (body.referenceLink !== undefined) data.referenceLink = body.referenceLink
    if (body.seriesId !== undefined) data.seriesId = body.seriesId
    if (body.order !== undefined) data.order = body.order
    if (body.isActive !== undefined) data.isActive = body.isActive
    if (body.benefits !== undefined) data.benefits = body.benefits
    if (body.process !== undefined) data.process = body.process
    if (body.documents !== undefined) data.documents = body.documents
    if (body.eligibility !== undefined) data.eligibility = body.eligibility
    if (body.registrationTime !== undefined) data.registrationTime = body.registrationTime

    const subservice = await db.subService.update({
      where: { id },
      data,
    })

    return NextResponse.json(subservice)
  } catch (error) {
    console.error('Error updating subservice:', error)
    return NextResponse.json({ error: 'Failed to update subservice' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.subService.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting subservice:', error)
    return NextResponse.json({ error: 'Failed to delete subservice' }, { status: 500 })
  }
}

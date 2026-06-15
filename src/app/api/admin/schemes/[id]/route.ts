import { NextRequest, NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
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
    if (body.summary !== undefined) data.summary = body.summary
    if (body.description !== undefined) data.description = body.description
    if (body.benefits !== undefined) {
      data.benefits = typeof body.benefits === 'string' ? body.benefits : JSON.stringify(body.benefits)
    }
    if (body.eligibility !== undefined) data.eligibility = body.eligibility
    if (body.category !== undefined) data.category = body.category
    if (body.image !== undefined) data.image = body.image || null
    if (body.isActive !== undefined) data.isActive = body.isActive
    if (body.order !== undefined) data.order = body.order

    const scheme = await db.scheme.update({
      where: { id },
      data,
    })

    return NextResponse.json(scheme)
  } catch (error) {
    console.error('Error updating scheme:', error)
    return apiError(error)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.scheme.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting scheme:', error)
    return apiError(error)
  }
}

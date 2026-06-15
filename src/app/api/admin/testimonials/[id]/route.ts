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
    if (body.name !== undefined) data.name = body.name
    if (body.company !== undefined) data.company = body.company
    if (body.role !== undefined) data.role = body.role
    if (body.content !== undefined) data.content = body.content
    if (body.rating !== undefined) data.rating = body.rating
    if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl
    if (body.isActive !== undefined) data.isActive = body.isActive
    if (body.order !== undefined) data.order = body.order

    const testimonial = await db.testimonial.update({
      where: { id },
      data,
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return apiError(error)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.testimonial.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return apiError(error)
  }
}

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
    if (body.question !== undefined) data.question = body.question
    if (body.answer !== undefined) data.answer = body.answer
    if (body.category !== undefined) data.category = body.category
    if (body.isActive !== undefined) data.isActive = body.isActive
    if (body.order !== undefined) data.order = body.order

    const faq = await db.fAQ.update({
      where: { id },
      data,
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return apiError(error)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.fAQ.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return apiError(error)
  }
}

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
    if (body.location !== undefined) data.location = body.location
    if (body.type !== undefined) data.type = body.type
    if (body.experience !== undefined) data.experience = body.experience
    if (body.description !== undefined) data.description = body.description
    if (body.requirements !== undefined) {
      data.requirements = typeof body.requirements === 'string' ? body.requirements : JSON.stringify(body.requirements)
    }
    if (body.department !== undefined) data.department = body.department
    if (body.salary !== undefined) data.salary = body.salary
    if (body.isActive !== undefined) data.isActive = body.isActive

    const career = await db.career.update({
      where: { id },
      data,
    })

    return NextResponse.json(career)
  } catch (error) {
    console.error('Error updating career:', error)
    return NextResponse.json({ error: 'Failed to update career' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.career.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting career:', error)
    return NextResponse.json({ error: 'Failed to delete career' }, { status: 500 })
  }
}

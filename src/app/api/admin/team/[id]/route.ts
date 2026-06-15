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
    if (body.role !== undefined) data.role = body.role
    if (body.bio !== undefined) data.bio = body.bio
    if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl
    if (body.linkedin !== undefined) data.linkedin = body.linkedin
    if (body.isActive !== undefined) data.isActive = body.isActive
    if (body.order !== undefined) data.order = body.order

    const member = await db.teamMember.update({
      where: { id },
      data,
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating team member:', error)
    return apiError(error)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.teamMember.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return apiError(error)
  }
}

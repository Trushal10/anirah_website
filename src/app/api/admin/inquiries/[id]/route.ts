import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const inquiry = await db.contactInquiry.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.isRead !== undefined && { isRead: body.isRead }),
      },
    })

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.contactInquiry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 })
  }
}

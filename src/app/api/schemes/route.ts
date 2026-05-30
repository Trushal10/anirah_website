import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const schemes = await db.scheme.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(schemes)
  } catch (error) {
    console.error('Error fetching schemes:', error)
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 })
  }
}

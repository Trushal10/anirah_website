import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const careers = await db.career.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(careers)
  } catch (error) {
    console.error('Error fetching careers:', error)
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const stats = await db.stat.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return apiError(error)
  }
}

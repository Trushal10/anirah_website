import { NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
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
    return apiError(error)
  }
}

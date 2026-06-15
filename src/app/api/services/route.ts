import { NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const services = await db.serviceSeries.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        subservices: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return apiError(error)
  }
}

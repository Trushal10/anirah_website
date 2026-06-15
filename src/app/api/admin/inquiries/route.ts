import { NextRequest, NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const where: Record<string, unknown> = {}
    if (status) {
      where.status = status
    }
    if (type) {
      where.inquiryType = type
    }

    const [inquiries, total] = await Promise.all([
      db.contactInquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.contactInquiry.count({ where }),
    ])

    return NextResponse.json({ inquiries, total })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return apiError(error)
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching admin testimonials:', error)
    return apiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, company, role, content, rating, avatarUrl } = body

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      )
    }

    const testimonial = await db.testimonial.create({
      data: {
        name,
        company: company || null,
        role: role || null,
        content,
        rating: rating ?? 5,
        avatarUrl: avatarUrl || null,
      },
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return apiError(error)
  }
}

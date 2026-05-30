import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const schemes = await db.scheme.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(schemes)
  } catch (error) {
    console.error('Error fetching admin schemes:', error)
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, slug, description, benefits, eligibility, category, image } = body

    if (!title || !slug || !description || !benefits || !eligibility || !category) {
      return NextResponse.json(
        { error: 'Title, slug, description, benefits, eligibility, and category are required' },
        { status: 400 }
      )
    }

    const scheme = await db.scheme.create({
      data: {
        title,
        slug,
        description,
        benefits: typeof benefits === 'string' ? benefits : JSON.stringify(benefits),
        eligibility,
        category,
        image: image || null,
      },
    })

    return NextResponse.json(scheme, { status: 201 })
  } catch (error) {
    console.error('Error creating scheme:', error)
    return NextResponse.json({ error: 'Failed to create scheme' }, { status: 500 })
  }
}

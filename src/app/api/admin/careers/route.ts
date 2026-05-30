import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const careers = await db.career.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(careers)
  } catch (error) {
    console.error('Error fetching admin careers:', error)
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, slug, location, type, experience, description, requirements, department, salary } = body

    if (!title || !slug || !location || !type || !experience || !description || !requirements || !department) {
      return NextResponse.json(
        { error: 'Title, slug, location, type, experience, description, requirements, and department are required' },
        { status: 400 }
      )
    }

    const career = await db.career.create({
      data: {
        title,
        slug,
        location,
        type,
        experience,
        description,
        requirements: typeof requirements === 'string' ? requirements : JSON.stringify(requirements),
        department,
        salary: salary || null,
      },
    })

    return NextResponse.json(career, { status: 201 })
  } catch (error) {
    console.error('Error creating career:', error)
    return NextResponse.json({ error: 'Failed to create career' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const faqs = await db.fAQ.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching admin FAQs:', error)
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { question, answer, category } = body

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      )
    }

    const faq = await db.fAQ.create({
      data: {
        question,
        answer,
        category: category || 'General',
      },
    })

    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message, businessType, fundingAmount, resumeUrl, experience, inquiryType, filePath, fileType, fileName } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const inquiry = await db.contactInquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        businessType: businessType || null,
        fundingAmount: fundingAmount || null,
        resumeUrl: resumeUrl || null,
        experience: experience || null,
        inquiryType: inquiryType || 'general',
        filePath: filePath || null,
        fileType: fileType || null,
        fileName: fileName || null,
      },
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    console.error('Error submitting contact inquiry:', error)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}

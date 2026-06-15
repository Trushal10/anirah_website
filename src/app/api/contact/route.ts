import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkRateLimit, cleanText, getClientIp, hasSpamSignals, isValidEmail, verifyTurnstileToken } from '@/lib/contact-security'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const honeypot = cleanText(body.website || body.companyWebsite || body.url, 255)

    if (honeypot) {
      return NextResponse.json({ success: true }, { status: 202 })
    }

    const ip = getClientIp(req)
    const turnstile = await verifyTurnstileToken(cleanText(body.turnstileToken, 4096), ip)
    if (!turnstile.success) {
      return NextResponse.json({ error: turnstile.error || 'Security check failed' }, { status: 400 })
    }

    const rateLimit = checkRateLimit(`contact:${ip}`)
    if (rateLimit.limited) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a few minutes and try again.' },
        { status: 429 }
      )
    }

    const formStartedAt = Number(body.formStartedAt)
    if (Number.isFinite(formStartedAt) && Date.now() - formStartedAt < 1500) {
      return NextResponse.json(
        { error: 'Submission was too fast. Please try again.' },
        { status: 400 }
      )
    }

    const name = cleanText(body.name, 255)
    const email = cleanText(body.email, 255).toLowerCase()
    const phone = cleanText(body.phone, 50)
    const subject = cleanText(body.subject, 500)
    const message = cleanText(body.message, 5000)
    const businessType = cleanText(body.businessType, 255)
    const fundingAmount = cleanText(body.fundingAmount, 255)
    const resumeUrl = cleanText(body.resumeUrl, 500)
    const experience = cleanText(body.experience, 255)
    const filePath = cleanText(body.filePath, 500)
    const fileType = cleanText(body.fileType, 100)
    const fileName = cleanText(body.fileName, 255)
    const allowedInquiryTypes = new Set(['general', 'career', 'service', 'scheme', 'other'])
    const requestedInquiryType = cleanText(body.inquiryType, 50)
    const inquiryType = allowedInquiryTypes.has(requestedInquiryType) ? requestedInquiryType : 'general'

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    if (message.length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters' }, { status: 400 })
    }

    if (hasSpamSignals(message)) {
      return NextResponse.json({ error: 'Message contains too many links' }, { status: 400 })
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
        inquiryType,
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

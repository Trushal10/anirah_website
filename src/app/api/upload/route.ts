import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type - images + PDFs
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
      'application/pdf',
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images and PDFs are allowed.' }, { status: 400 })
    }

    // Validate file size (max 10MB for PDFs, 5MB for images)
    const maxSize = file.type === 'application/pdf' ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Maximum size is ${file.type === 'application/pdf' ? '10MB' : '5MB'}.` }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const ext = file.name.split('.').pop() || (file.type === 'application/pdf' ? 'pdf' : 'jpg')
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Write file
    const filePath = path.join(uploadDir, uniqueName)
    await writeFile(filePath, buffer)

    const url = `/uploads/${uniqueName}`
    const fileType = file.type.startsWith('image/') ? 'image' : 'pdf'

    return NextResponse.json({ url, filename: uniqueName, fileType, originalName: file.name })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

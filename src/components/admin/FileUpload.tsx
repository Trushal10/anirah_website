'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, FileText, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  accept?: string
}

export default function FileUpload({ value, onChange, label = 'File', accept = '.pdf,.doc,.docx' }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be less than 10MB')
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      onChange(data.url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {uploading ? 'Uploading...' : 'Choose File'}
        </Button>
      </div>

      {value && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg text-sm">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          <span className="text-green-700 truncate flex-1">File uploaded</span>
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-red-500 hover:text-red-700 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste file URL here..."
        className="text-sm"
      />
    </div>
  )
}

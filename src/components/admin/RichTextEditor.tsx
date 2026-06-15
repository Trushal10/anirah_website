'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Table2,
  Underline,
  Undo2,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { richTextToHtml } from '@/lib/rich-text'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  minHeight?: string
  error?: string
}

type EditorMode = 'visual' | 'html' | 'preview'

function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html

  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script, style, iframe, object, embed, link, meta').forEach((node) => node.remove())
  doc.body.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()
      if (name.startsWith('on') || value.startsWith('javascript:')) {
        node.removeAttribute(attr.name)
      }
    })
  })

  return doc.body.innerHTML
}

function normalizeEditorHtml(value: string): string {
  return sanitizeHtml(richTextToHtml(value))
}

function ToolbarButton({
  onClick,
  title,
  children,
  disabled,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  label,
  minHeight = '240px',
  error,
}: RichTextEditorProps) {
  const [mode, setMode] = useState<EditorMode>('visual')
  const [uploading, setUploading] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastHtmlRef = useRef('')

  const updateFromEditor = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return

    const html = sanitizeHtml(editor.innerHTML)
    lastHtmlRef.current = html
    onChange(html)
  }, [onChange])

  useEffect(() => {
    if (mode !== 'visual') return

    const editor = editorRef.current
    if (!editor || document.activeElement === editor) return

    const nextHtml = normalizeEditorHtml(value)
    if (nextHtml !== lastHtmlRef.current && editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml
      lastHtmlRef.current = nextHtml
    }
  }, [mode, value])

  const focusEditor = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return
    editor.focus()
  }, [])

  const runCommand = useCallback((command: string, commandValue?: string) => {
    focusEditor()
    document.execCommand(command, false, commandValue)
    updateFromEditor()
  }, [focusEditor, updateFromEditor])

  const insertHtml = useCallback((html: string) => {
    focusEditor()
    document.execCommand('insertHTML', false, html)
    updateFromEditor()
  }, [focusEditor, updateFromEditor])

  const addLink = useCallback(() => {
    const url = window.prompt('Enter link URL')
    if (!url) return
    runCommand('createLink', url)
  }, [runCommand])

  const addImageUrl = useCallback(() => {
    const url = window.prompt('Enter image URL')
    if (!url) return
    insertHtml(`<img src="${url}" alt="" />`)
  }, [insertHtml])

  const addTable = useCallback(() => {
    insertHtml(`
      <table>
        <thead>
          <tr><th>Heading</th><th>Heading</th><th>Heading</th></tr>
        </thead>
        <tbody>
          <tr><td>Text</td><td>Text</td><td>Text</td></tr>
          <tr><td>Text</td><td>Text</td><td>Text</td></tr>
        </tbody>
      </table>
      <p><br></p>
    `)
  }, [insertHtml])

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      event.target.value = ''
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Upload failed')
      insertHtml(`<img src="${data.url}" alt="${file.name.replace(/"/g, '')}" />`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }, [insertHtml])

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    const imageFile = Array.from(event.clipboardData.files).find((file) => file.type.startsWith('image/'))
    if (imageFile) {
      event.preventDefault()
      const syntheticEvent = {
        target: { files: [imageFile], value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>
      void handleImageUpload(syntheticEvent)
      return
    }

    const html = event.clipboardData.getData('text/html')
    if (html) {
      event.preventDefault()
      insertHtml(sanitizeHtml(html))
    }
  }, [handleImageUpload, insertHtml])

  const renderedHtml = richTextToHtml(value)

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label} {error && <span className="text-destructive">*</span>}
        </label>
      )}

      <div className={`overflow-hidden rounded-xl border bg-card ${error ? 'border-destructive' : 'border-border'}`}>
        {mode === 'visual' && (
          <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/50 px-2 py-1">
            <ToolbarButton title="Undo" onClick={() => runCommand('undo')}>
              <Undo2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Redo" onClick={() => runCommand('redo')}>
              <Redo2 className="h-4 w-4" />
            </ToolbarButton>
            <div className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton title="Bold" onClick={() => runCommand('bold')}>
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Italic" onClick={() => runCommand('italic')}>
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Underline" onClick={() => runCommand('underline')}>
              <Underline className="h-4 w-4" />
            </ToolbarButton>
            <div className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton title="Heading 1" onClick={() => runCommand('formatBlock', 'H1')}>
              <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Heading 2" onClick={() => runCommand('formatBlock', 'H2')}>
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Heading 3" onClick={() => runCommand('formatBlock', 'H3')}>
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Paragraph" onClick={() => runCommand('formatBlock', 'P')}>
              <Code className="h-4 w-4" />
            </ToolbarButton>
            <div className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton title="Bullet list" onClick={() => runCommand('insertUnorderedList')}>
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Numbered list" onClick={() => runCommand('insertOrderedList')}>
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Quote" onClick={() => runCommand('formatBlock', 'BLOCKQUOTE')}>
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Horizontal line" onClick={() => runCommand('insertHorizontalRule')}>
              <Minus className="h-4 w-4" />
            </ToolbarButton>
            <div className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton title="Align left" onClick={() => runCommand('justifyLeft')}>
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Align center" onClick={() => runCommand('justifyCenter')}>
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Align right" onClick={() => runCommand('justifyRight')}>
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
            <div className="mx-1 h-5 w-px bg-border" />
            <ToolbarButton title="Link" onClick={addLink}>
              <Link2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Upload image" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            </ToolbarButton>
            <ToolbarButton title="Image URL" onClick={addImageUrl}>
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton title="Table" onClick={addTable}>
              <Table2 className="h-4 w-4" />
            </ToolbarButton>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {mode === 'visual' ? 'Visual editor' : mode === 'html' ? 'HTML' : 'Preview'}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant={mode === 'visual' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setMode('visual')}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant={mode === 'html' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setMode('html')}
            >
              <Code className="h-3 w-3" />
              HTML
            </Button>
            <Button
              type="button"
              variant={mode === 'preview' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setMode('preview')}
            >
              <Eye className="h-3 w-3" />
              Preview
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <div style={{ minHeight }}>
          {mode === 'preview' ? (
            <div
              className="prose-content max-w-none p-4 text-sm leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{
                __html: renderedHtml || `<p class="text-muted-foreground">${placeholder}</p>`,
              }}
            />
          ) : mode === 'html' ? (
            <textarea
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              className="w-full resize-none bg-transparent p-4 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
              style={{ minHeight }}
            />
          ) : (
            <div className="relative">
              {!value && (
                <div className="pointer-events-none absolute left-4 top-4 text-sm text-muted-foreground">
                  {placeholder}
                </div>
              )}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="rich-editor-content prose-content min-h-[200px] max-w-none overflow-auto p-4 text-sm leading-relaxed text-foreground outline-none"
                style={{ minHeight }}
                onInput={updateFromEditor}
                onBlur={updateFromEditor}
                onPaste={handlePaste}
              />
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

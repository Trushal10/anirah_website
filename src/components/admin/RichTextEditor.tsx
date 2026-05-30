'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, Code, Bold, Italic, Heading1, Heading2, Heading3, ListOrdered, List, Quote, Link2, Minus } from 'lucide-react'
import { richTextToHtml } from '@/lib/rich-text'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  minHeight?: string
  error?: string
}

interface ToolbarItem {
  type: 'button'
  title: string
  format: string
  suffix?: string
}

interface ToolbarDivider {
  type: 'divider'
}

const toolbarConfig: (ToolbarItem | ToolbarDivider)[] = [
  { type: 'button', title: 'Bold', format: '**', suffix: '**' },
  { type: 'button', title: 'Italic', format: '*', suffix: '*' },
  { type: 'divider' },
  { type: 'button', title: 'Heading 1', format: '# ' },
  { type: 'button', title: 'Heading 2', format: '## ' },
  { type: 'button', title: 'Heading 3', format: '### ' },
  { type: 'divider' },
  { type: 'button', title: 'Unordered List', format: '- ' },
  { type: 'button', title: 'Ordered List', format: '1. ' },
  { type: 'divider' },
  { type: 'button', title: 'Blockquote', format: '> ' },
  { type: 'button', title: 'Link', format: '[', suffix: '](url)' },
  { type: 'button', title: 'Horizontal Rule', format: '---\n' },
]

const toolbarIcons: Record<string, React.ReactNode> = {
  'Bold': <Bold className="w-4 h-4" />,
  'Italic': <Italic className="w-4 h-4" />,
  'Heading 1': <Heading1 className="w-4 h-4" />,
  'Heading 2': <Heading2 className="w-4 h-4" />,
  'Heading 3': <Heading3 className="w-4 h-4" />,
  'Unordered List': <List className="w-4 h-4" />,
  'Ordered List': <ListOrdered className="w-4 h-4" />,
  'Blockquote': <Quote className="w-4 h-4" />,
  'Link': <Link2 className="w-4 h-4" />,
  'Horizontal Rule': <Minus className="w-4 h-4" />,
}

function ToolbarButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={onClick}
      title={title}
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
  minHeight = '200px',
  error,
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertFormatting = useCallback((prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = prefix + (selectedText || 'text') + suffix

    const before = value.substring(0, start)
    const after = value.substring(end)
    onChange(before + newText + after)

    requestAnimationFrame(() => {
      textarea.focus()
      const newCursorPos = start + prefix.length
      const selectEnd = selectedText ? newCursorPos + selectedText.length : newCursorPos + 4
      textarea.setSelectionRange(
        selectedText ? newCursorPos : newCursorPos,
        selectEnd
      )
    })
  }, [value, onChange])

  const handleToolbarAction = useCallback((item: ToolbarItem) => {
    insertFormatting(item.format, item.suffix)
  }, [insertFormatting])

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground">{label} {error && <span className="text-destructive">*</span>}</label>
      )}
      <div className={`border rounded-xl overflow-hidden bg-card ${error ? 'border-destructive' : 'border-border'}`}>
        {/* Toolbar */}
        {!isPreview && (
          <div className="flex items-center gap-0.5 border-b border-border bg-muted/50 px-2 py-1 flex-wrap">
            {toolbarConfig.map((item, i) => {
              if (item.type === 'divider') {
                return <div key={i} className="w-px h-5 bg-border mx-1" />
              }
              return (
                <ToolbarButton
                  key={i}
                  onClick={() => handleToolbarAction(item)}
                  title={item.title}
                >
                  {toolbarIcons[item.title]}
                </ToolbarButton>
              )
            })}
          </div>
        )}

        {/* Preview/Edit toggle */}
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground font-medium">
              {isPreview ? 'Preview' : 'Markdown'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant={isPreview ? 'ghost' : 'secondary'}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setIsPreview(false)}
            >
              <Code className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              type="button"
              variant={isPreview ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setIsPreview(true)}
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </Button>
          </div>
        </div>

        {/* Editor or Preview */}
        <div style={{ minHeight }}>
          {isPreview ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none p-4 text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: richTextToHtml(value) || `<p class="text-muted-foreground">${placeholder}</p>`,
              }}
            />
          ) : (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-4 text-sm text-foreground bg-transparent focus:outline-none resize-none placeholder:text-muted-foreground"
              style={{ minHeight: '200px' }}
            />
          )}
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

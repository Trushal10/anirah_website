const htmlTagPattern = /<\/?[a-z][\s\S]*>/i

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function markdownToHtml(markdown: string): string {
  if (!markdown.trim()) return ''

  const inline = (text: string) => escapeHtml(text)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')

  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const html: string[] = []
  let paragraph: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let codeBlock: string[] | null = null
  let quote: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    html.push(`<p>${paragraph.map(inline).join('<br />')}</p>`)
    paragraph = []
  }

  const flushList = () => {
    if (!listType) return
    html.push(`</${listType}>`)
    listType = null
  }

  const flushQuote = () => {
    if (!quote.length) return
    html.push(`<blockquote>${quote.map(inline).join('<br />')}</blockquote>`)
    quote = []
  }

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      flushParagraph()
      flushList()
      flushQuote()
      if (codeBlock) {
        html.push(`<pre><code>${escapeHtml(codeBlock.join('\n'))}</code></pre>`)
        codeBlock = null
      } else {
        codeBlock = []
      }
      continue
    }

    if (codeBlock) {
      codeBlock.push(line)
      continue
    }

    const trimmed = line.trim()
    if (!trimmed) {
      flushParagraph()
      flushList()
      flushQuote()
      continue
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed)
    if (heading) {
      flushParagraph()
      flushList()
      flushQuote()
      html.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`)
      continue
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph()
      flushList()
      flushQuote()
      html.push('<hr />')
      continue
    }

    const unordered = /^[-*]\s+(.+)$/.exec(trimmed)
    const ordered = /^\d+\.\s+(.+)$/.exec(trimmed)
    if (unordered || ordered) {
      flushParagraph()
      flushQuote()
      const nextListType = unordered ? 'ul' : 'ol'
      if (listType && listType !== nextListType) flushList()
      if (!listType) {
        listType = nextListType
        html.push(`<${listType}>`)
      }
      html.push(`<li>${inline((unordered || ordered)?.[1] || '')}</li>`)
      continue
    }

    const quoted = /^>\s?(.+)$/.exec(trimmed)
    if (quoted) {
      flushParagraph()
      flushList()
      quote.push(quoted[1])
      continue
    }

    flushList()
    flushQuote()
    paragraph.push(line)
  }

  flushParagraph()
  flushList()
  flushQuote()
  if (codeBlock) html.push(`<pre><code>${escapeHtml(codeBlock.join('\n'))}</code></pre>`)

  return html.join('')
}

export function richTextToHtml(value: string | null | undefined): string {
  if (!value) return ''
  return htmlTagPattern.test(value) ? value : markdownToHtml(value)
}

export function richTextToPlainText(value: string | null | undefined): string {
  if (!value) return ''
  return richTextToHtml(value)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|h1|h2|h3|li|blockquote)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

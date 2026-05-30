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

  const escaped = escapeHtml(markdown)
  const html = escaped
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/^[*-] (.*$)/gim, '<li>$1</li>')
    .replace(/^---$/gim, '<hr />')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br />')

  return `<p>${html}</p>`
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

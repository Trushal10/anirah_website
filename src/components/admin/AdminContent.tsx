'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Eye, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ImageUpload from '@/components/admin/ImageUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { richTextToHtml } from '@/lib/rich-text'

interface ContentArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  category: string
  readTime: string
  isPublished: boolean
  isFeatured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: '',
  readTime: '5 min read',
  isPublished: false,
  isFeatured: false,
}

const categories = ['Registration', 'Certification', 'Compliance', 'Legal', 'Tax', 'Funding', 'Business', 'General']

export default function AdminContent() {
  const [articles, setArticles] = useState<ContentArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ContentArticle | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deleteTarget, setDeleteTarget] = useState<ContentArticle | null>(null)
  const [previewArticle, setPreviewArticle] = useState<ContentArticle | null>(null)

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/content')
      const data = await res.json()
      setArticles(data.articles || [])
    } catch {
      toast.error('Failed to load content articles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (article: ContentArticle) => {
    setEditing(article)
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      coverImage: article.coverImage || '',
      category: article.category,
      readTime: article.readTime,
      isPublished: article.isPublished,
      isFeatured: article.isFeatured,
    })
    setErrors({})
    setDialogOpen(true)
  }

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const saveArticle = async () => {
    const newErrors: Record<string, string> = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.slug.trim()) newErrors.slug = 'Slug is required'
    if (!form.excerpt.trim()) newErrors.excerpt = 'Excerpt is required'
    if (!form.content.trim()) newErrors.content = 'Content is required'
    if (!form.category) newErrors.category = 'Category is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }
    setErrors({})
    setSaving(true)
    try {
      const url = editing ? `/api/admin/content/${editing.id}` : '/api/admin/content'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      toast.success(editing ? 'Article updated' : 'Article created')
      setDialogOpen(false)
      fetchArticles()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save article')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/content/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Article deleted')
      setDeleteTarget(null)
      fetchArticles()
    } catch {
      toast.error('Failed to delete article')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Content Articles</h2>
          <p className="text-sm text-muted-foreground">Manage your knowledge base content</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Featured</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{article.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={article.isPublished ? 'default' : 'secondary'}>
                        {article.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {article.isFeatured && <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">Featured</Badge>}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setPreviewArticle(article)} title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(article)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(article)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {articles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No content articles yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Article' : 'New Article'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })
                    clearFieldError('title')
                  }}
                  placeholder="Article title"
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => {
                    setForm({ ...form, slug: e.target.value })
                    clearFieldError('slug')
                  }}
                  placeholder="article-slug"
                />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => {
                  setForm({ ...form, category: v })
                  clearFieldError('category')
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt *</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => {
                  setForm({ ...form, excerpt: e.target.value })
                  clearFieldError('excerpt')
                }}
                rows={2}
                placeholder="Brief summary"
              />
              {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt}</p>}
            </div>
            <div>
              <RichTextEditor
                value={form.content}
                onChange={(v) => {
                  setForm({ ...form, content: v })
                  clearFieldError('content')
                }}
                label="Content"
                placeholder="Full article content (Markdown supported)"
                minHeight="300px"
              />
              {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Read Time</Label>
                <Input
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  placeholder="5 min read"
                />
              </div>
              <ImageUpload
                value={form.coverImage}
                onChange={(url) => setForm({ ...form, coverImage: url })}
                label="Cover Image"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} />
                <Label>Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} />
                <Label>Featured</Label>
              </div>
            </div>
            <Button onClick={saveArticle} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? 'Update Article' : 'Create Article'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewArticle} onOpenChange={() => setPreviewArticle(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewArticle?.title}</DialogTitle>
          </DialogHeader>
          {previewArticle && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{previewArticle.category}</Badge>
                <span>{previewArticle.readTime}</span>
                <span>{new Date(previewArticle.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-muted-foreground italic">{previewArticle.excerpt}</p>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: richTextToHtml(previewArticle.content) }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

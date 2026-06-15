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
import { ArrowLeft, Plus, Pencil, Trash2, Eye, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ImageUpload from '@/components/admin/ImageUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { richTextToHtml } from '@/lib/rich-text'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  coverImage: string | null
  category: string
  tags: string
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
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  coverImage: '',
  category: '',
  tags: '',
  readTime: '5 min read',
  isPublished: false,
  isFeatured: false,
}

const categories = ['Registration', 'Tax', 'Startup', 'Funding', 'Compliance', 'Legal', 'Business', 'General']

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blog')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch {
      toast.error('Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (post: BlogPost) => {
    setEditing(post)
    const tagsStr = (() => {
      try {
        const parsed = JSON.parse(post.tags)
        return Array.isArray(parsed) ? parsed.join(', ') : post.tags
      } catch {
        return post.tags
      }
    })()
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      seoKeywords: post.seoKeywords || '',
      coverImage: post.coverImage || '',
      category: post.category,
      tags: tagsStr,
      readTime: post.readTime,
      isPublished: post.isPublished,
      isFeatured: post.isFeatured,
    })
    setErrors({})
    setDialogOpen(true)
  }

  const savePost = async () => {
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
      const tagsArray = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tags: tagsArray }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      toast.success(editing ? 'Post updated' : 'Post created')
      setDialogOpen(false)
      fetchPosts()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/blog/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Post deleted')
      setDeleteTarget(null)
      fetchPosts()
    } catch {
      toast.error('Failed to delete post')
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
          <h2 className="text-xl font-semibold">{dialogOpen ? (editing ? 'Edit Blog Post' : 'New Blog Post') : 'Blog Posts'}</h2>
          <p className="text-sm text-muted-foreground">
            {dialogOpen ? 'Write and format the full article content.' : 'Manage your blog content'}
          </p>
        </div>
        {dialogOpen ? (
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        ) : (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        )}
      </div>

      {!dialogOpen && (
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
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{post.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.isPublished ? 'default' : 'secondary'}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {post.isFeatured && <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">Featured</Badge>}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setPreviewPost(post)} title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(post)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {posts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No blog posts yet. Create your first post.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Create/Edit Page */}
      {dialogOpen && (
        <Card>
          <CardContent className="p-4 md:p-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })
                    if (errors.title) setErrors({ ...errors, title: '' })
                  }}
                  placeholder="Post title"
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => {
                    setForm({ ...form, slug: e.target.value })
                    if (errors.slug) setErrors({ ...errors, slug: '' })
                  }}
                  placeholder="post-slug"
                />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => {
                  setForm({ ...form, category: v })
                  if (errors.category) setErrors({ ...errors, category: '' })
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
                  if (errors.excerpt) setErrors({ ...errors, excerpt: '' })
                }}
                rows={2}
                placeholder="Brief summary"
              />
              {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt}</p>}
            </div>
            <RichTextEditor
              value={form.content}
              onChange={(v) => {
                setForm({ ...form, content: v })
                if (errors.content) setErrors({ ...errors, content: '' })
              }}
              label="Content"
              placeholder="Full article content (Markdown supported)"
              minHeight="300px"
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
            <div className="rounded-lg border p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold">SEO Meta</h3>
                <p className="text-xs text-muted-foreground">Used for this blog detail page.</p>
              </div>
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={form.seoTitle}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  placeholder="SEO title for this blog post"
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={form.seoDescription}
                  onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  rows={3}
                  placeholder="SEO description for this blog post"
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <Textarea
                  value={form.seoKeywords}
                  onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
                  rows={2}
                  placeholder="keyword one, keyword two, keyword three"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div className="space-y-2">
                <Label>Read Time</Label>
                <Input
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  placeholder="5 min read"
                />
              </div>
            </div>
            <ImageUpload
              value={form.coverImage}
              onChange={(url) => setForm({ ...form, coverImage: url })}
              label="Cover Image"
            />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isPublished}
                  onCheckedChange={(v) => setForm({ ...form, isPublished: v })}
                />
                <Label>Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(v) => setForm({ ...form, isFeatured: v })}
                />
                <Label>Featured</Label>
              </div>
            </div>
            <Button onClick={savePost} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewPost} onOpenChange={() => setPreviewPost(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewPost?.title}</DialogTitle>
          </DialogHeader>
          {previewPost && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{previewPost.category}</Badge>
                <span>{previewPost.readTime}</span>
                <span>{new Date(previewPost.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-muted-foreground italic">{previewPost.excerpt}</p>
              <div
                className="prose-content max-w-none"
                dangerouslySetInnerHTML={{ __html: richTextToHtml(previewPost.content) }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
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

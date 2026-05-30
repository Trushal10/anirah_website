'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ImageUpload from '@/components/admin/ImageUpload'
import { richTextToPlainText } from '@/lib/rich-text'

interface Scheme {
  id: string
  title: string
  slug: string
  description: string
  benefits: string
  eligibility: string
  category: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  benefits: '',
  eligibility: '',
  category: '',
  image: '',
}

const categories = ['Central Government', 'State Government', 'MSME', 'Startup', 'Export', 'Agriculture', 'Manufacturing', 'Technology', 'Women Entrepreneur', 'General']

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Scheme | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Scheme | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchSchemes = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/schemes')
      const data = await res.json()
      setSchemes(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load schemes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSchemes()
  }, [fetchSchemes])

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (scheme: Scheme) => {
    setEditing(scheme)
    setErrors({})
    const benefitsStr = (() => {
      try {
        const parsed = JSON.parse(scheme.benefits)
        return Array.isArray(parsed) ? parsed.join('\n') : scheme.benefits
      } catch {
        return scheme.benefits
      }
    })()
    setForm({
      title: scheme.title,
      slug: scheme.slug,
      description: scheme.description,
      benefits: benefitsStr,
      eligibility: scheme.eligibility,
      category: scheme.category,
      image: (scheme as any).image || '',
    })
    setDialogOpen(true)
  }

  const saveScheme = async () => {
    const newErrors: Record<string, string> = {}
    if (!form.title) newErrors.title = 'Title is required'
    if (!form.slug) newErrors.slug = 'Slug is required'
    if (!form.description) newErrors.description = 'Description is required'
    if (!form.benefits) newErrors.benefits = 'Benefits are required'
    if (!form.eligibility) newErrors.eligibility = 'Eligibility is required'
    if (!form.category) newErrors.category = 'Category is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }
    setSaving(true)
    try {
      const benefitsArray = form.benefits.split('\n').map((b) => b.trim()).filter(Boolean)
      const url = editing ? `/api/admin/schemes/${editing.id}` : '/api/admin/schemes'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, benefits: benefitsArray }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      toast.success(editing ? 'Scheme updated' : 'Scheme created')
      setErrors({})
      setDialogOpen(false)
      fetchSchemes()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save scheme')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/schemes/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Scheme deleted')
      setDeleteTarget(null)
      fetchSchemes()
    } catch {
      toast.error('Failed to delete scheme')
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
          <h2 className="text-xl font-semibold">Government Schemes</h2>
          <p className="text-sm text-muted-foreground">Manage government scheme listings</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Scheme
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
                  <TableHead className="hidden lg:table-cell">Eligibility</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schemes.map((scheme) => (
                  <TableRow key={scheme.id}>
                    <TableCell className="font-medium">{scheme.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{scheme.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={scheme.isActive ? 'default' : 'secondary'}>
                        {scheme.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                      {richTextToPlainText(scheme.eligibility)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(scheme)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(scheme)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {schemes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No schemes found.
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
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Scheme' : 'New Scheme'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="Scheme title"
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="scheme-slug"
              />
              {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
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
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                placeholder="Detailed description of the scheme"
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            <div className="space-y-2">
              <Label>Benefits * (one per line)</Label>
              <Textarea
                value={form.benefits}
                onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                rows={4}
                placeholder={"Benefit 1\nBenefit 2\nBenefit 3"}
              />
              {errors.benefits && <p className="text-sm text-destructive">{errors.benefits}</p>}
            </div>
            <div className="space-y-2">
              <Label>Eligibility *</Label>
              <Textarea
                value={form.eligibility}
                onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                rows={3}
                placeholder="Eligibility criteria"
              />
              {errors.eligibility && <p className="text-sm text-destructive">{errors.eligibility}</p>}
            </div>
            <ImageUpload
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              label="Scheme Image"
            />
            <Button onClick={saveScheme} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? 'Update Scheme' : 'Create Scheme'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scheme</AlertDialogTitle>
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

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
import { Plus, Pencil, Trash2, Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Testimonial {
  id: string
  name: string
  company: string | null
  role: string | null
  content: string
  rating: number
  avatarUrl: string | null
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

const emptyForm = {
  name: '',
  company: '',
  role: '',
  content: '',
  rating: 5,
  avatarUrl: '',
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      setTestimonials(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (testimonial: Testimonial) => {
    setEditing(testimonial)
    setErrors({})
    setForm({
      name: testimonial.name,
      company: testimonial.company || '',
      role: testimonial.role || '',
      content: testimonial.content,
      rating: testimonial.rating,
      avatarUrl: testimonial.avatarUrl || '',
    })
    setDialogOpen(true)
  }

  const saveTestimonial = async () => {
    const newErrors: Record<string, string> = {}
    if (!form.name) newErrors.name = 'Name is required'
    if (!form.content) newErrors.content = 'Content is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/admin/testimonials/${editing.id}` : '/api/admin/testimonials'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          company: form.company || null,
          role: form.role || null,
          avatarUrl: form.avatarUrl || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      toast.success(editing ? 'Testimonial updated' : 'Testimonial created')
      setErrors({})
      setDialogOpen(false)
      fetchTestimonials()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save testimonial')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/testimonials/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Testimonial deleted')
      setDeleteTarget(null)
      fetchTestimonials()
    } catch {
      toast.error('Failed to delete testimonial')
    }
  }

  const renderStars = (rating: number, onChange?: (r: number) => void) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  )

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
          <h2 className="text-xl font-semibold">Testimonials</h2>
          <p className="text-sm text-muted-foreground">Manage client testimonials</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Testimonial
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell text-sm">Content</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {testimonial.company || '-'}
                    </TableCell>
                    <TableCell>{renderStars(testimonial.rating)}</TableCell>
                    <TableCell>
                      <Badge variant={testimonial.isActive ? 'default' : 'secondary'}>
                        {testimonial.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                      {testimonial.content}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(testimonial)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(testimonial)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {testimonials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No testimonials yet.
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
            <DialogTitle>{editing ? 'Edit Testimonial' : 'New Testimonial'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Client name"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g., CEO, Founder"
              />
            </div>
            <div className="space-y-2">
              <Label>Rating *</Label>
              {renderStars(form.rating, (r) => setForm({ ...form, rating: r }))}
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                placeholder="Testimonial text"
              />
              {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
            </div>
            <div className="space-y-2">
              <Label>Avatar URL</Label>
              <Input
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <Button onClick={saveTestimonial} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? 'Update Testimonial' : 'Create Testimonial'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the testimonial from &quot;{deleteTarget?.name}&quot;? This action cannot be undone.
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

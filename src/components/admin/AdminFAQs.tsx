'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const emptyForm = {
  question: '',
  answer: '',
  category: 'General',
  order: 0,
}

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchFAQs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/faqs')
      const data = await res.json()
      setFaqs(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load FAQs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFAQs()
  }, [fetchFAQs])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, order: faqs.length > 0 ? Math.max(...faqs.map((f) => f.order)) + 1 : 0 })
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (faq: FAQ) => {
    setEditing(faq)
    setErrors({})
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
    })
    setDialogOpen(true)
  }

  const saveFAQ = async () => {
    const newErrors: Record<string, string> = {}
    if (!form.question) newErrors.question = 'Question is required'
    if (!form.answer) newErrors.answer = 'Answer is required'
    if (!form.category) newErrors.category = 'Category is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/admin/faqs/${editing.id}` : '/api/admin/faqs'
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
      toast.success(editing ? 'FAQ updated' : 'FAQ created')
      setErrors({})
      setDialogOpen(false)
      fetchFAQs()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save FAQ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/faqs/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('FAQ deleted')
      setDeleteTarget(null)
      fetchFAQs()
    } catch {
      toast.error('Failed to delete FAQ')
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
          <h2 className="text-xl font-semibold">FAQs</h2>
          <p className="text-sm text-muted-foreground">Manage frequently asked questions</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New FAQ
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="text-center">
                      <Badge variant="outline">{faq.order}</Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-[300px] truncate">{faq.question}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{faq.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={faq.isActive ? 'default' : 'secondary'}>
                        {faq.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(faq)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {faqs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No FAQs yet.
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
            <DialogTitle>{editing ? 'Edit FAQ' : 'New FAQ'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Question *</Label>
              <Textarea
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                rows={2}
                placeholder="What is..."
              />
              {errors.question && <p className="text-sm text-destructive">{errors.question}</p>}
            </div>
            <div className="space-y-2">
              <Label>Answer *</Label>
              <Textarea
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                rows={4}
                placeholder="The answer is..."
              />
              {errors.answer && <p className="text-sm text-destructive">{errors.answer}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Private Limited Company Registration"
                />
                <p className="text-xs text-muted-foreground">
                  Use the exact subservice or service name to show FAQs on that page.
                </p>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <Button onClick={saveFAQ} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? 'Update FAQ' : 'Create FAQ'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
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

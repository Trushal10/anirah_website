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

interface Career {
  id: string
  title: string
  slug: string
  location: string
  type: string
  experience: string
  description: string
  requirements: string
  department: string
  salary: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const emptyForm = {
  title: '',
  slug: '',
  location: '',
  type: 'Full Time',
  experience: '',
  description: '',
  requirements: '',
  department: '',
  salary: '',
}

const types = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote']
const departments = ['Business Development', 'Operations', 'Legal', 'Finance', 'Marketing', 'Technology', 'Human Resources']

export default function AdminCareers() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Career | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Career | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchCareers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/careers')
      const data = await res.json()
      setCareers(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load careers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCareers()
  }, [fetchCareers])

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (career: Career) => {
    setEditing(career)
    const reqStr = (() => {
      try {
        const parsed = JSON.parse(career.requirements)
        return Array.isArray(parsed) ? parsed.join('\n') : career.requirements
      } catch {
        return career.requirements
      }
    })()
    setForm({
      title: career.title,
      slug: career.slug,
      location: career.location,
      type: career.type,
      experience: career.experience,
      description: career.description,
      requirements: reqStr,
      department: career.department,
      salary: career.salary || '',
    })
    setErrors({})
    setDialogOpen(true)
  }

  const saveCareer = async () => {
    const newErrors: Record<string, string> = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.slug.trim()) newErrors.slug = 'Slug is required'
    if (!form.location.trim()) newErrors.location = 'Location is required'
    if (!form.type) newErrors.type = 'Type is required'
    if (!form.experience.trim()) newErrors.experience = 'Experience is required'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (!form.requirements.trim()) newErrors.requirements = 'Requirements are required'
    if (!form.department) newErrors.department = 'Department is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }
    setErrors({})
    setSaving(true)
    try {
      const reqArray = form.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
      const url = editing ? `/api/admin/careers/${editing.id}` : '/api/admin/careers'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, requirements: reqArray, salary: form.salary || null }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      toast.success(editing ? 'Career updated' : 'Career created')
      setDialogOpen(false)
      fetchCareers()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save career')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/careers/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Career deleted')
      setDeleteTarget(null)
      fetchCareers()
    } catch {
      toast.error('Failed to delete career')
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
          <h2 className="text-xl font-semibold">Careers</h2>
          <p className="text-sm text-muted-foreground">Manage job listings</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Career
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {careers.map((career) => (
                  <TableRow key={career.id}>
                    <TableCell className="font-medium">{career.title}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{career.location}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{career.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{career.experience}</TableCell>
                    <TableCell>
                      <Badge variant={career.isActive ? 'default' : 'secondary'}>
                        {career.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(career)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(career)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {careers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No career listings yet.
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
            <DialogTitle>{editing ? 'Edit Career' : 'New Career'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  clearError('title')
                  clearError('slug')
                  setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })
                }}
                placeholder="Job title"
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location *</Label>
                <Input
                  value={form.location}
                  onChange={(e) => {
                    clearError('location')
                    setForm({ ...form, location: e.target.value })
                  }}
                  placeholder="e.g., Mumbai, Remote"
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={form.type} onValueChange={(v) => {
                  clearError('type')
                  setForm({ ...form, type: v })
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Experience *</Label>
                <Input
                  value={form.experience}
                  onChange={(e) => {
                    clearError('experience')
                    setForm({ ...form, experience: e.target.value })
                  }}
                  placeholder="e.g., 2-5 years"
                />
                {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
              </div>
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select value={form.department} onValueChange={(v) => {
                  clearError('department')
                  setForm({ ...form, department: v })
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Salary</Label>
              <Input
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="e.g., ₹5L - ₹10L"
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => {
                  clearError('description')
                  setForm({ ...form, description: e.target.value })
                }}
                rows={4}
                placeholder="Job description"
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            <div className="space-y-2">
              <Label>Requirements * (one per line)</Label>
              <Textarea
                value={form.requirements}
                onChange={(e) => {
                  clearError('requirements')
                  setForm({ ...form, requirements: e.target.value })
                }}
                rows={4}
                placeholder={"Requirement 1\nRequirement 2\nRequirement 3"}
              />
              {errors.requirements && <p className="text-sm text-destructive">{errors.requirements}</p>}
            </div>
            <Button onClick={saveCareer} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? 'Update Career' : 'Create Career'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Career</AlertDialogTitle>
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

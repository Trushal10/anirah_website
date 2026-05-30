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
import ImageUpload from '@/components/admin/ImageUpload'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  avatarUrl: string | null
  linkedin: string | null
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  avatarUrl: '',
  linkedin: '',
  order: 0,
}

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/team')
      const data = await res.json()
      setMembers(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, order: members.length > 0 ? Math.max(...members.map((m) => m.order)) + 1 : 0 })
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (member: TeamMember) => {
    setEditing(member)
    setErrors({})
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      avatarUrl: member.avatarUrl || '',
      linkedin: member.linkedin || '',
      order: member.order,
    })
    setDialogOpen(true)
  }

  const saveMember = async () => {
    const newErrors: Record<string, string> = {}
    if (!form.name) newErrors.name = 'Name is required'
    if (!form.role) newErrors.role = 'Role is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/admin/team/${editing.id}` : '/api/admin/team'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          bio: form.bio || null,
          avatarUrl: form.avatarUrl || null,
          linkedin: form.linkedin || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      toast.success(editing ? 'Member updated' : 'Member created')
      setErrors({})
      setDialogOpen(false)
      fetchMembers()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save team member')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/team/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Team member deleted')
      setDeleteTarget(null)
      fetchMembers()
    } catch {
      toast.error('Failed to delete team member')
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
          <h2 className="text-xl font-semibold">Team Members</h2>
          <p className="text-sm text-muted-foreground">Manage your team</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Member
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">LinkedIn</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="text-center">
                      <Badge variant="outline">{member.order}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{member.role}</TableCell>
                    <TableCell>
                      <Badge variant={member.isActive ? 'default' : 'secondary'}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      {member.linkedin ? (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline"
                        >
                          Profile
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(member)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(member)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {members.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No team members yet.
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
            <DialogTitle>{editing ? 'Edit Team Member' : 'New Team Member'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g., CEO, Managing Director"
                />
                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Short bio"
              />
            </div>
            <ImageUpload
              value={form.avatarUrl}
              onChange={(url) => setForm({ ...form, avatarUrl: url })}
              label="Avatar Image"
            />
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <Button onClick={saveMember} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? 'Update Member' : 'Create Member'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot be undone.
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

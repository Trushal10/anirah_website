'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Eye, Trash2, Mail, MailOpen, Loader2, Paperclip, FileText, Image as ImageIcon, Download } from 'lucide-react'
import { toast } from 'sonner'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  businessType: string | null
  fundingAmount: string | null
  resumeUrl: string | null
  experience: string | null
  inquiryType: string
  filePath: string | null
  fileType: string | null
  fileName: string | null
  isRead: boolean
  status: string
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  in_progress: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const typeColors: Record<string, string> = {
  general: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  career: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  service: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  scheme: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  other: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const statusOptions = ['all', 'new', 'in_progress', 'resolved', 'closed']
const typeOptions = ['all', 'general', 'career', 'service', 'scheme', 'other']

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null)

  const fetchInquiries = useCallback(async (status?: string, type?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (status && status !== 'all') params.set('status', status)
      if (type && type !== 'all') params.set('type', type)
      params.set('limit', '50')
      const res = await fetch(`/api/admin/inquiries?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setInquiries(data.inquiries || [])
    } catch {
      toast.error('Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInquiries(filter, typeFilter)
  }, [fetchInquiries, filter, typeFilter])

  const updateStatus = async (inquiry: Inquiry, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      toast.success('Status updated')
      fetchInquiries(filter, typeFilter)
      if (selectedInquiry?.id === inquiry.id) {
        setSelectedInquiry({ ...inquiry, status: newStatus })
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  const toggleRead = async (inquiry: Inquiry) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !inquiry.isRead }),
      })
      if (!res.ok) throw new Error()
      fetchInquiries(filter, typeFilter)
    } catch {
      toast.error('Failed to update read status')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/inquiries/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Inquiry deleted')
      setDeleteTarget(null)
      fetchInquiries(filter, typeFilter)
    } catch {
      toast.error('Failed to delete inquiry')
    }
  }

  const hasAttachment = (inq: Inquiry) => !!(inq.filePath || inq.resumeUrl)

  const renderFileAttachment = (filePath: string | null, fileType: string | null, fileName: string | null) => {
    if (!filePath) return null

    const displayName = fileName || filePath.split('/').pop() || 'Attachment'

    if (fileType === 'image') {
      return (
        <a
          href={filePath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group"
        >
          <div className="h-16 w-16 rounded-lg overflow-hidden bg-background flex items-center justify-center shrink-0">
            <img
              src={filePath}
              alt={displayName}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
                ;(e.target as HTMLImageElement).parentElement!.innerHTML = '<svg class="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate group-hover:underline">{displayName}</p>
            <p className="text-xs text-muted-foreground">Image file • Click to view</p>
          </div>
          <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
        </a>
      )
    }

    // PDF or other files
    const isPdf = fileType === 'pdf' || filePath.toLowerCase().endsWith('.pdf')
    return (
      <a
        href={filePath}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group"
      >
        <div className="h-16 w-16 rounded-lg flex items-center justify-center shrink-0 bg-red-50 dark:bg-red-950">
          {isPdf ? (
            <FileText className="h-8 w-8 text-red-500" />
          ) : (
            <Download className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate group-hover:underline">{displayName}</p>
          <p className="text-xs text-muted-foreground">
            {isPdf ? 'PDF document' : 'Attached file'} • Click to {isPdf ? 'view' : 'download'}
          </p>
        </div>
        <Download className="h-4 w-4 text-muted-foreground shrink-0" />
      </a>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Inquiries</h2>
          <p className="text-sm text-muted-foreground">Manage contact inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((t) => (
                <SelectItem key={t} value={t}>
                  {t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === 'all' ? 'All Status' : s.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="hidden xl:table-cell">Type</TableHead>
                  <TableHead className="hidden xl:table-cell">Business Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : inquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No inquiries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  inquiries.map((inq) => (
                    <TableRow key={inq.id} className={!inq.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {!inq.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                          {inq.name}
                          {hasAttachment(inq) && <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{inq.email}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{inq.phone || '-'}</TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <Badge variant="secondary" className={typeColors[inq.inquiryType || 'other'] || typeColors.other}>
                          {(inq.inquiryType || 'other').charAt(0).toUpperCase() + (inq.inquiryType || 'other').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">{inq.businessType || '-'}</TableCell>
                      <TableCell>
                        <Select
                          value={inq.status}
                          onValueChange={(v) => updateStatus(inq, v)}
                        >
                          <SelectTrigger className="h-7 w-[120px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => toggleRead(inq)} title={inq.isRead ? 'Mark as unread' : 'Mark as read'}>
                            {inq.isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedInquiry(inq)} title="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(inq)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name</span>
                  <p className="font-medium mt-0.5">{selectedInquiry.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email</span>
                  <p className="font-medium mt-0.5">{selectedInquiry.email}</p>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <span className="text-muted-foreground">Phone</span>
                    <p className="font-medium mt-0.5">{selectedInquiry.phone}</p>
                  </div>
                )}
                {selectedInquiry.subject && (
                  <div>
                    <span className="text-muted-foreground">Subject</span>
                    <p className="font-medium mt-0.5">{selectedInquiry.subject}</p>
                  </div>
                )}
                {selectedInquiry.businessType && (
                  <div>
                    <span className="text-muted-foreground">Business Type</span>
                    <p className="font-medium mt-0.5">{selectedInquiry.businessType}</p>
                  </div>
                )}
                {selectedInquiry.fundingAmount && (
                  <div>
                    <span className="text-muted-foreground">Funding Amount</span>
                    <p className="font-medium mt-0.5">{selectedInquiry.fundingAmount}</p>
                  </div>
                )}
                {selectedInquiry.experience && (
                  <div>
                    <span className="text-muted-foreground">Experience</span>
                    <p className="font-medium mt-0.5">{selectedInquiry.experience}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Inquiry Type</span>
                  <div className="mt-0.5">
                    <Badge variant="secondary" className={typeColors[selectedInquiry.inquiryType || 'other'] || typeColors.other}>
                      {(selectedInquiry.inquiryType || 'other').charAt(0).toUpperCase() + (selectedInquiry.inquiryType || 'other').slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* File Attachments */}
              {(selectedInquiry.filePath || selectedInquiry.resumeUrl) && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Attachments</span>
                  <div className="space-y-2">
                    {renderFileAttachment(selectedInquiry.filePath, selectedInquiry.fileType, selectedInquiry.fileName)}
                    {selectedInquiry.resumeUrl && selectedInquiry.resumeUrl !== selectedInquiry.filePath && (
                      renderFileAttachment(
                        selectedInquiry.resumeUrl,
                        selectedInquiry.resumeUrl.toLowerCase().endsWith('.pdf') ? 'pdf' : null,
                        null
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <div className="mt-1">
                    <Badge variant="secondary" className={statusColors[selectedInquiry.status] || ''}>
                      {selectedInquiry.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Date</span>
                  <p className="font-medium mt-0.5">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Message</span>
                <p className="font-medium mt-1 bg-muted/50 rounded-lg p-3 text-sm leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the inquiry from &quot;{deleteTarget?.name}&quot;? This action cannot be undone.
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

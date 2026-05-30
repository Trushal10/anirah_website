'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/app'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  MessageSquare,
  FileText,
  Briefcase,
  Layers,
  Eye,
  Paperclip,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Download,
} from 'lucide-react'
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
  status: string
  isRead: boolean
  createdAt: string
}

interface DashboardCounts {
  inquiries: number
  unread: number
  blogPosts: number
  careers: number
  services: number
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

export default function AdminDashboard() {
  const { navigate } = useAppStore()
  const [counts, setCounts] = useState<DashboardCounts>({ inquiries: 0, unread: 0, blogPosts: 0, careers: 0, services: 0 })
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [inqRes, unreadRes, blogRes, careerRes, serviceRes, recentRes] = await Promise.all([
        fetch('/api/admin/inquiries?limit=1'),
        fetch('/api/admin/inquiries?status=new&limit=1'),
        fetch('/api/admin/blog?limit=5'),
        fetch('/api/admin/careers'),
        fetch('/api/admin/services'),
        fetch('/api/admin/inquiries?limit=5'),
      ])

      if (!inqRes.ok) throw new Error('Failed to fetch inquiries count')
      if (!blogRes.ok) throw new Error('Failed to fetch blog posts')
      if (!careerRes.ok) throw new Error('Failed to fetch careers')
      if (!serviceRes.ok) throw new Error('Failed to fetch services')

      const inqData = await inqRes.json()
      const unreadData = await unreadRes.json()
      const blogData = await blogRes.json()
      const careerData = await careerRes.json()
      const serviceData = await serviceRes.json()
      const recentData = await recentRes.json()

      setCounts({
        inquiries: inqData.total || 0,
        unread: unreadData.total || 0,
        blogPosts: blogData.total || 0,
        careers: Array.isArray(careerData) ? careerData.filter((c: { isActive: boolean }) => c.isActive).length : 0,
        services: Array.isArray(serviceData) ? serviceData.filter((s: { isActive: boolean }) => s.isActive).length : 0,
      })
      setInquiries(recentData.inquiries || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground text-center">{error}</p>
        <Button onClick={fetchDashboard} variant="outline">Retry</Button>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Inquiries',
      value: counts.inquiries,
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
      sub: counts.unread > 0 ? `${counts.unread} unread` : undefined,
    },
    { label: 'Published Blogs', value: counts.blogPosts, icon: FileText, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' },
    { label: 'Active Careers', value: counts.careers, icon: Briefcase, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950' },
    { label: 'Active Services', value: counts.services, icon: Layers, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950' },
  ]

  const hasAttachment = (inq: Inquiry) => !!(inq.filePath || inq.resumeUrl)

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      {stat.sub && (
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                          {stat.sub}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">Recent Inquiries</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('admin-inquiries')}>
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No inquiries yet
                    </TableCell>
                  </TableRow>
                ) : (
                  inquiries.map((inq) => (
                    <TableRow key={inq.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedInquiry(inq)}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {!inq.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                          {inq.name}
                          {hasAttachment(inq) && <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary" className={typeColors[inq.inquiryType || 'other'] || typeColors.other}>
                          {(inq.inquiryType || 'other').charAt(0).toUpperCase() + (inq.inquiryType || 'other').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {inq.subject || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColors[inq.status] || ''}>
                          {inq.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setSelectedInquiry(inq) }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Inquiry Detail Dialog */}
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
                    {selectedInquiry.filePath && (
                      <a
                        href={selectedInquiry.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-background flex items-center justify-center shrink-0">
                          {selectedInquiry.fileType === 'image' ? (
                            <img
                              src={selectedInquiry.filePath}
                              alt={selectedInquiry.fileName || 'Attachment'}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          ) : selectedInquiry.fileType === 'pdf' || selectedInquiry.filePath.toLowerCase().endsWith('.pdf') ? (
                            <FileText className="h-6 w-6 text-red-500" />
                          ) : (
                            <Download className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:underline">
                            {selectedInquiry.fileName || selectedInquiry.filePath.split('/').pop() || 'Attachment'}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            {selectedInquiry.fileType === 'image' ? <ImageIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                            {selectedInquiry.fileType || 'File'}
                          </p>
                        </div>
                      </a>
                    )}
                    {selectedInquiry.resumeUrl && selectedInquiry.resumeUrl !== selectedInquiry.filePath && (
                      <a
                        href={selectedInquiry.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0 bg-red-50 dark:bg-red-950">
                          <FileText className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:underline">Resume / CV</p>
                          <p className="text-xs text-muted-foreground">Click to view</p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <div className="mt-0.5">
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
                <p className="font-medium mt-0.5 bg-muted/50 rounded-lg p-3 text-sm leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

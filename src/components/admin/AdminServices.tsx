'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Layers,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import RichTextEditor from '@/components/admin/RichTextEditor'
import ImageUpload from '@/components/admin/ImageUpload'
import ServiceIcon from '@/components/common/ServiceIcon'

interface ProcessStep {
  title: string
  desc: string
}

interface SubService {
  id: string
  name: string
  slug: string
  description: string
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  benefits: string
  process: string
  documents: string
  eligibility: string
  features: string
  pricing: string | null
  referenceLink: string | null
  registrationTime: string | null
  order: number
  isActive: boolean
  seriesId: string
}

interface ServiceSeries {
  id: string
  name: string
  slug: string
  icon: string
  tagline: string
  description: string
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  accentColor?: string
  order: number
  isActive: boolean
  subservices: SubService[]
  createdAt: string
}

const emptyService = {
  name: '',
  slug: '',
  icon: '',
  tagline: '',
  description: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
}

const emptySubService = {
  name: '',
  slug: '',
  description: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  features: '',
  pricing: '',
  referenceLink: '',
  registrationTime: '',
  benefits: '',
  documents: '',
  eligibility: '',
  process: [] as ProcessStep[],
  seriesId: '',
}

function parseJsonArray(value: string): string {
  if (!value || value.trim() === '') return '[]'
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return JSON.stringify(parsed)
  } catch {
    // If not valid JSON, treat as newline-separated and convert to array
  }
  return JSON.stringify(value.split('\n').map(s => s.trim()).filter(Boolean))
}

function parseJsonProcess(value: string): ProcessStep[] {
  if (!value || value.trim() === '') return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.map((item: any) => ({
        title: String(item.title || ''),
        desc: String(item.desc || ''),
      }))
    }
  } catch {
    // ignore
  }
  return []
}

export default function AdminServices() {
  const [services, setServices] = useState<ServiceSeries[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Service Dialog
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceSeries | null>(null)
  const [serviceForm, setServiceForm] = useState(emptyService)

  // Subservice Dialog
  const [subDialogOpen, setSubDialogOpen] = useState(false)
  const [editingSub, setEditingSub] = useState<SubService | null>(null)
  const [subForm, setSubForm] = useState(emptySubService)
  const [parentSeries, setParentSeries] = useState<ServiceSeries | null>(null)

  // Subservice list panel
  const [subPanelSeries, setSubPanelSeries] = useState<ServiceSeries | null>(null)

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'service' | 'subservice'; id: string; name: string } | null>(null)

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/services')
      const data = await res.json()
      setServices(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  // --- Service CRUD ---
  const openCreateService = () => {
    setEditingService(null)
    setServiceForm(emptyService)
    setErrors({})
    setServiceDialogOpen(true)
  }

  const openEditService = (service: ServiceSeries) => {
    setEditingService(service)
    setServiceForm({
      name: service.name,
      slug: service.slug,
      icon: service.icon,
      tagline: service.tagline,
      description: service.description,
      seoTitle: service.seoTitle || '',
      seoDescription: service.seoDescription || '',
      seoKeywords: service.seoKeywords || '',
    })
    setErrors({})
    setServiceDialogOpen(true)
  }

  const saveService = async () => {
    const newErrors: Record<string, string> = {}
    if (!serviceForm.name.trim()) newErrors.s_name = 'Name is required'
    if (!serviceForm.slug.trim()) newErrors.s_slug = 'Slug is required'
    if (!serviceForm.icon.trim()) newErrors.s_icon = 'Icon is required'
    if (!serviceForm.tagline.trim()) newErrors.s_tagline = 'Tagline is required'
    if (!serviceForm.description.trim()) newErrors.s_description = 'Description is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }
    setErrors({})
    setSaving(true)
    try {
      const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services'
      const method = editingService ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      toast.success(editingService ? 'Service updated' : 'Service created')
      setServiceDialogOpen(false)
      fetchServices()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  // --- Subservice CRUD ---
  const openCreateSub = (series: ServiceSeries) => {
    setParentSeries(series)
    setEditingSub(null)
    setSubForm({ ...emptySubService, seriesId: series.id })
    setErrors({})
    setSubDialogOpen(true)
  }

  const openEditSub = (sub: SubService, series: ServiceSeries) => {
    setParentSeries(series)
    setEditingSub(sub)
    const benefitsArr = (() => {
      try {
        const parsed = JSON.parse(sub.benefits || '[]')
        if (Array.isArray(parsed)) return (parsed as string[]).join('\n')
      } catch { /* ignore */ }
      return ''
    })()
    const documentsArr = (() => {
      try {
        const parsed = JSON.parse(sub.documents || '[]')
        if (Array.isArray(parsed)) return (parsed as string[]).join('\n')
      } catch { /* ignore */ }
      return ''
    })()
    const processSteps = parseJsonProcess(sub.process || '[]')
    const featuresArr = (() => {
      try {
        const parsed = JSON.parse(sub.features || '[]')
        if (Array.isArray(parsed)) return (parsed as string[]).join('\n')
      } catch { /* ignore */ }
      return typeof sub.features === 'string' ? sub.features : ''
    })()
    setSubForm({
      name: sub.name,
      slug: sub.slug,
      description: sub.description,
      seoTitle: (sub as any).seoTitle || '',
      seoDescription: (sub as any).seoDescription || '',
      seoKeywords: (sub as any).seoKeywords || '',
      features: featuresArr,
      pricing: sub.pricing || '',
      referenceLink: (sub as any).referenceLink || '',
      registrationTime: (sub as any).registrationTime || '',
      benefits: benefitsArr,
      documents: documentsArr,
      eligibility: (sub as any).eligibility || '',
      process: processSteps.length > 0 ? processSteps : [{ title: '', desc: '' }],
      seriesId: sub.seriesId,
    })
    setErrors({})
    setSubDialogOpen(true)
  }

  const addProcessStep = () => {
    setSubForm({
      ...subForm,
      process: [...subForm.process, { title: '', desc: '' }],
    })
  }

  const removeProcessStep = (index: number) => {
    setSubForm({
      ...subForm,
      process: subForm.process.filter((_, i) => i !== index),
    })
  }

  const updateProcessStep = (index: number, field: 'title' | 'desc', value: string) => {
    const updated = [...subForm.process]
    updated[index] = { ...updated[index], [field]: value }
    setSubForm({ ...subForm, process: updated })
  }

  const saveSub = async () => {
    const newErrors: Record<string, string> = {}
    if (!subForm.name.trim()) newErrors.sub_name = 'Name is required'
    if (!subForm.slug.trim()) newErrors.sub_slug = 'Slug is required'
    if (!subForm.description.trim()) newErrors.sub_description = 'Description is required'
    if (!subForm.seriesId) newErrors.sub_series = 'Series ID missing'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }
    setErrors({})
    setSaving(true)
    try {
      const url = editingSub ? `/api/admin/subservices/${editingSub.id}` : '/api/admin/subservices'
      const method = editingSub ? 'PUT' : 'POST'

      const benefitsJson = JSON.stringify(
        subForm.benefits.split('\n').map(s => s.trim()).filter(Boolean)
      )
      const documentsJson = JSON.stringify(
        subForm.documents.split('\n').map(s => s.trim()).filter(Boolean)
      )
      const processJson = JSON.stringify(
        subForm.process.filter(s => s.title.trim() || s.desc.trim())
      )

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: subForm.name,
          slug: subForm.slug,
          description: subForm.description,
          features: parseJsonArray(subForm.features),
          pricing: subForm.pricing || null,
          referenceLink: subForm.referenceLink || null,
          registrationTime: subForm.registrationTime || null,
          benefits: benefitsJson,
          documents: documentsJson,
          process: processJson,
          eligibility: subForm.eligibility || '',
          seoTitle: subForm.seoTitle || null,
          seoDescription: subForm.seoDescription || null,
          seoKeywords: subForm.seoKeywords || null,
          seriesId: subForm.seriesId,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      toast.success(editingSub ? 'Subservice updated' : 'Subservice created')
      setSubDialogOpen(false)
      fetchServices()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save subservice')
    } finally {
      setSaving(false)
    }
  }

  // --- Delete ---
  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const url = deleteTarget.type === 'service'
        ? `/api/admin/services/${deleteTarget.id}`
        : `/api/admin/subservices/${deleteTarget.id}`
      const res = await fetch(url, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success(`${deleteTarget.name} deleted`)
      setDeleteTarget(null)
      if (deleteTarget.type === 'service') setSubPanelSeries(null)
      fetchServices()
    } catch {
      toast.error('Failed to delete')
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
          <h2 className="text-xl font-semibold">
            {serviceDialogOpen
              ? editingService ? 'Edit Service Series' : 'Add Service Series'
              : subDialogOpen
                ? editingSub ? 'Edit Subservice' : 'Add Subservice'
                : 'Service Series'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {serviceDialogOpen
              ? 'Edit the main service category details.'
              : subDialogOpen
                ? `Under: ${parentSeries?.name || 'Service'}`
                : 'Manage service categories and subservices'}
          </p>
        </div>
        {serviceDialogOpen || subDialogOpen ? (
          <Button
            variant="outline"
            onClick={() => {
              setServiceDialogOpen(false)
              setSubDialogOpen(false)
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        ) : (
          <Button onClick={openCreateService}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        )}
      </div>

      {!serviceDialogOpen && !subDialogOpen && (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead className="hidden lg:table-cell">Icon</TableHead>
                  <TableHead>Subservices</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{service.slug}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted"
                          style={{ backgroundColor: `${service.accentColor || '#F9B65B'}15` }}
                        >
                          <ServiceIcon
                            icon={service.icon}
                            accentColor={service.accentColor}
                            className="w-4 h-4"
                            alt={service.name}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{service.subservices?.length || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.isActive ? 'default' : 'secondary'}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSubPanelSeries(service)} title="Manage Subservices">
                          <Layers className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditService(service)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ type: 'service', id: service.id, name: service.name })}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {services.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No services found. Create your first service series.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Subservice Panel */}
      {subPanelSeries && !serviceDialogOpen && !subDialogOpen && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">
              Subservices — {subPanelSeries.name}
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => openCreateSub(subPanelSeries)}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSubPanelSeries(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Slug</TableHead>
                    <TableHead className="hidden lg:table-cell">Pricing</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subPanelSeries.subservices?.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{sub.slug}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{sub.pricing || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={sub.isActive ? 'default' : 'secondary'}>
                          {sub.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditSub(sub, subPanelSeries)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ type: 'subservice', id: sub.id, name: sub.name })}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!subPanelSeries.subservices || subPanelSeries.subservices.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No subservices yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Form Page */}
      {serviceDialogOpen && (
        <Card>
          <CardContent className="p-4 md:p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="e.g., Company Registration"
              />
              {errors.s_name && <p className="text-sm text-destructive">{errors.s_name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                value={serviceForm.slug}
                onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })}
                placeholder="company-registration"
              />
              {errors.s_slug && <p className="text-sm text-destructive">{errors.s_slug}</p>}
            </div>
            <div className="space-y-2">
              <ImageUpload
                value={serviceForm.icon}
                onChange={(url) => setServiceForm({ ...serviceForm, icon: url })}
                label="Icon Image *"
                folder="service-icons"
              />
              <p className="text-xs text-muted-foreground">Upload an icon image or paste an image URL. Existing legacy icon names still work.</p>
              {errors.s_icon && <p className="text-sm text-destructive">{errors.s_icon}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tagline *</Label>
              <Input
                value={serviceForm.tagline}
                onChange={(e) => setServiceForm({ ...serviceForm, tagline: e.target.value })}
                placeholder="Short description of the service"
              />
              {errors.s_tagline && <p className="text-sm text-destructive">{errors.s_tagline}</p>}
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                rows={4}
                placeholder="Detailed description"
              />
              {errors.s_description && <p className="text-sm text-destructive">{errors.s_description}</p>}
            </div>
            <div className="rounded-lg border p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold">SEO Meta</h3>
                <p className="text-xs text-muted-foreground">Used for this service detail page.</p>
              </div>
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={serviceForm.seoTitle}
                  onChange={(e) => setServiceForm({ ...serviceForm, seoTitle: e.target.value })}
                  placeholder="SEO title for this service"
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={serviceForm.seoDescription}
                  onChange={(e) => setServiceForm({ ...serviceForm, seoDescription: e.target.value })}
                  rows={3}
                  placeholder="SEO description for this service"
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <Textarea
                  value={serviceForm.seoKeywords}
                  onChange={(e) => setServiceForm({ ...serviceForm, seoKeywords: e.target.value })}
                  rows={2}
                  placeholder="keyword one, keyword two, keyword three"
                />
              </div>
            </div>
            <Button onClick={saveService} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
          </CardContent>
        </Card>
      )}

      {/* Subservice Form Page */}
      {subDialogOpen && (
        <Card>
          <CardContent className="p-4 md:p-6">
          <div className="space-y-5">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              <h3 className="font-semibold">Subservice content guide</h3>
              <p className="mt-1 text-amber-900/80">
                For pages like Private Limited Company Registration, use Description for the main intro, Services for items like DSC/MOA/MCA filing, Benefits for advantages, Documents for grouped document lists, and Process Steps for registration flow.
                Add page-specific FAQs from the FAQ admin and set the category to this subservice name.
              </p>
            </div>
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={subForm.name}
                    onChange={(e) => setSubForm({ ...subForm, name: e.target.value, slug: generateSlug(e.target.value) })}
                    placeholder="Subservice name"
                  />
                  {errors.sub_name && <p className="text-sm text-destructive">{errors.sub_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    value={subForm.slug}
                    onChange={(e) => setSubForm({ ...subForm, slug: e.target.value })}
                    placeholder="subservice-slug"
                  />
                  {errors.sub_slug && <p className="text-sm text-destructive">{errors.sub_slug}</p>}
                </div>
              </div>
              <RichTextEditor
                value={subForm.description}
                onChange={(v) => setSubForm({ ...subForm, description: v })}
                label="Description *"
                placeholder="Description of the subservice (Markdown supported)"
                minHeight="150px"
              />
              {errors.sub_description && <p className="text-sm text-destructive">{errors.sub_description}</p>}
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold">SEO Meta</h3>
                <p className="text-xs text-muted-foreground">Used for this subservice detail page.</p>
              </div>
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={subForm.seoTitle}
                  onChange={(e) => setSubForm({ ...subForm, seoTitle: e.target.value })}
                  placeholder="SEO title for this subservice"
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={subForm.seoDescription}
                  onChange={(e) => setSubForm({ ...subForm, seoDescription: e.target.value })}
                  rows={3}
                  placeholder="SEO description for this subservice"
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <Textarea
                  value={subForm.seoKeywords}
                  onChange={(e) => setSubForm({ ...subForm, seoKeywords: e.target.value })}
                  rows={2}
                  placeholder="keyword one, keyword two, keyword three"
                />
              </div>
            </div>

            {/* Services Covered */}
            <div className="space-y-2">
              <Label>Services Covered (one per line)</Label>
              <Textarea
                value={subForm.features}
                onChange={(e) => setSubForm({ ...subForm, features: e.target.value })}
                rows={6}
                placeholder={"Name Availability Check\nCompany Name Reservation\nDigital Signature Certificate (DSC)\nDirector Identification Number (DIN)\nMOA & AOA Drafting\nMCA Incorporation Filing"}
              />
              <p className="text-xs text-muted-foreground">Shown as the “Our Services” checklist on the public subservice page.</p>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <Label>Benefits (one per line)</Label>
              <Textarea
                value={subForm.benefits}
                onChange={(e) => setSubForm({ ...subForm, benefits: e.target.value })}
                rows={4}
                placeholder={"Separate Legal Entity\nLimited Liability Protection\nBetter Business Credibility\nFunding & Investment Opportunities\nEasy Expansion"}
              />
              <p className="text-xs text-muted-foreground">One benefit per line</p>
            </div>

            {/* Process Steps */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Process Steps</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProcessStep}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-3">
                {subForm.process.map((step, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex items-center justify-center w-7 h-9 rounded bg-muted text-xs font-bold text-muted-foreground shrink-0 mt-2">
                      {index + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={step.title}
                        onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                        placeholder="Step title"
                      />
                      <div className="flex gap-2">
                        <Textarea
                          value={step.desc}
                          onChange={(e) => updateProcessStep(index, 'desc', e.target.value)}
                          placeholder="Step description"
                          rows={2}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeProcessStep(index)}
                          disabled={subForm.process.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Add process steps with title and description</p>
            </div>

            {/* Documents */}
            <div className="space-y-2">
              <Label>Required Documents (one per line, headings allowed)</Label>
              <Textarea
                value={subForm.documents}
                onChange={(e) => setSubForm({ ...subForm, documents: e.target.value })}
                rows={8}
                placeholder={"For Directors:\nPAN Card\nAadhaar Card\nPassport Size Photograph\n\nAddress Proof:\nElectricity Bill\nBank Statement\n\nRegistered Office:\nRent Agreement\nNo Objection Certificate (NOC)"}
              />
              <p className="text-xs text-muted-foreground">Use lines ending with colon, like “For Directors:”, to create document groups on the public page.</p>
            </div>

            {/* Eligibility */}
            <div className="space-y-2">
              <RichTextEditor
                value={subForm.eligibility}
                onChange={(v) => setSubForm({ ...subForm, eligibility: v })}
                label="Eligibility Criteria"
                placeholder="Eligibility requirements (Markdown supported)"
                minHeight="150px"
              />
            </div>

            {/* Registration Time */}
            <div className="space-y-2">
              <Label>Registration Time</Label>
              <Input
                value={subForm.registrationTime}
                onChange={(e) => setSubForm({ ...subForm, registrationTime: e.target.value })}
                placeholder="e.g., 7-10 working days"
              />
              <p className="text-xs text-muted-foreground">Estimated time for registration/completion</p>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <Label>Pricing</Label>
              <Input
                value={subForm.pricing}
                onChange={(e) => setSubForm({ ...subForm, pricing: e.target.value })}
                placeholder="e.g., ₹5,000 - ₹15,000"
              />
            </div>

            {/* Reference Link */}
            <div className="space-y-2">
              <Label>Reference Link</Label>
              <Input
                value={subForm.referenceLink}
                onChange={(e) => setSubForm({ ...subForm, referenceLink: e.target.value })}
                placeholder="https://example.com/service-details"
              />
              <p className="text-xs text-muted-foreground">External link for more information about this service</p>
            </div>

            {errors.sub_series && <p className="text-sm text-destructive">{errors.sub_series}</p>}
            <Button onClick={saveSub} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingSub ? 'Update Subservice' : 'Create Subservice'}
            </Button>
          </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type === 'service' ? 'Service' : 'Subservice'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;?
              {deleteTarget?.type === 'service' && ' This will also delete all subservices under this service.'}
              This action cannot be undone.
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

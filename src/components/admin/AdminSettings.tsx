'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Save, Eye, Youtube, Instagram, Twitter, Linkedin, Facebook, Lock, Mail, User } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import ImageUpload from '@/components/admin/ImageUpload'
import { useAppStore } from '@/store/app'

interface Setting {
  id: string
  key: string
  value: string
}

const companyFields = [
  { key: 'company_name', label: 'Company Name', type: 'input' },
  { key: 'company_tagline', label: 'Company Tagline', type: 'input' },
  { key: 'company_description', label: 'Company Description', type: 'textarea' },
  { key: 'phone', label: 'Primary Phone', type: 'input' },
  { key: 'phone2', label: 'Secondary Phone', type: 'input' },
  { key: 'email', label: 'Primary Email', type: 'input' },
  { key: 'email2', label: 'Secondary Email', type: 'input' },
  { key: 'address', label: 'Address', type: 'textarea' },
  { key: 'website', label: 'Website', type: 'input' },
  { key: 'google_rating', label: 'Google Rating', type: 'input' },
]

const heroFields = [
  { key: 'hero_title', label: 'Hero Title', type: 'textarea' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' },
  { key: 'hero_badge', label: 'Hero Badge', type: 'input' },
  { key: 'announcement', label: 'Announcement', type: 'textarea' },
]

const aboutFields = [
  { key: 'mission', label: 'Mission', type: 'textarea' },
  { key: 'vision', label: 'Vision', type: 'textarea' },
  { key: 'about_text', label: 'About Text', type: 'textarea' },
]

const statsFields = [
  { key: 'experience_years', label: 'Experience Years', type: 'input' },
  { key: 'team_size', label: 'Team Size', type: 'input' },
  { key: 'states_covered', label: 'States Covered', type: 'input' },
  { key: 'projects_executed', label: 'Projects Executed', type: 'input' },
  { key: 'google_reviews', label: 'Google Reviews', type: 'input' },
]

const socialFields = [
  { key: 'youtube', label: 'YouTube URL', type: 'input', placeholder: 'https://youtube.com/@yourchannel' },
  { key: 'instagram', label: 'Instagram URL', type: 'input', placeholder: 'https://instagram.com/yourprofile' },
  { key: 'twitter', label: 'Twitter / X URL', type: 'input', placeholder: 'https://x.com/yourhandle' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'input', placeholder: 'https://linkedin.com/company/yourcompany' },
  { key: 'facebook', label: 'Facebook URL', type: 'input', placeholder: 'https://facebook.com/yourpage' },
]

export default function AdminSettings() {
  const { setSettings: setPublicSettings } = useAppStore()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = mounted ? resolvedTheme === 'dark' : false
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [originalSettings, setOriginalSettings] = useState<Record<string, string>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Account settings state
  const [adminEmail, setAdminEmail] = useState('')
  const [adminName, setAdminName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingAccount, setSavingAccount] = useState(false)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data: Setting[] = await res.json()
      const map: Record<string, string> = {}
      data.forEach((s) => (map[s.key] = s.value))
      setSettings(map)
      setOriginalSettings({ ...map })
      setHasUnsavedChanges(false)
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAccountInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/account')
      if (res.ok) {
        const data = await res.json()
        setAdminEmail(data.email || '')
        setAdminName(data.name || '')
        setNewEmail(data.email || '')
      }
    } catch {
      // Silently handle
    }
  }, [])

  useEffect(() => {
    fetchSettings()
    fetchAccountInfo()
  }, [fetchSettings, fetchAccountInfo])

  const handleSave = async () => {
    setSaving(true)
    try {
      const settingsArr = Object.entries(settings).map(([key, value]) => ({ key, value }))
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsArr }),
      })
      if (!res.ok) throw new Error()
      setOriginalSettings({ ...settings })
      setHasUnsavedChanges(false)
      setPublicSettings({ ...settings })
      toast.success('Settings saved successfully')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSocialMedia = async () => {
    setSaving(true)
    try {
      const socialSettings = socialFields
        .map((f) => ({ key: f.key, value: settings[f.key] || '' }))
        .filter((s) => s.value)
      if (socialSettings.length === 0) {
        toast.error('Please add at least one social media URL')
        setSaving(false)
        return
      }
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: socialSettings }),
      })
      if (!res.ok) throw new Error()
      setOriginalSettings({ ...settings })
      setHasUnsavedChanges(false)
      setPublicSettings({ ...settings })
      toast.success('Social media links saved successfully')
    } catch {
      toast.error('Failed to save social media links')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      setHasUnsavedChanges(true)
      return next
    })
  }

  const handleAccountSave = async () => {
    if (!newEmail.trim()) {
      toast.error('Email is required')
      return
    }
    if (newPassword) {
      if (!currentPassword) {
        toast.error('Current password is required to change password')
        return
      }
      if (newPassword.length < 6) {
        toast.error('New password must be at least 6 characters')
        return
      }
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match')
        return
      }
    }
    if (newEmail === adminEmail && !newPassword) {
      toast.error('No changes to save')
      return
    }

    setSavingAccount(true)
    try {
      const res = await fetch('/api/admin/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to update account')
        return
      }
      toast.success(data.message || 'Account updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setAdminEmail(newEmail)
      fetchAccountInfo()
    } catch {
      toast.error('Failed to update account')
    } finally {
      setSavingAccount(false)
    }
  }

  const hasChanges = hasUnsavedChanges || JSON.stringify(settings) !== JSON.stringify(originalSettings)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  const renderFields = (fields: typeof companyFields) => (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key}>{field.label}</Label>
          {field.type === 'textarea' ? (
            <Textarea
              id={field.key}
              value={settings[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              rows={3}
            />
          ) : (
            <Input
              id={field.key}
              value={settings[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={(field as any).placeholder}
            />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Site Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your website configuration</p>
        </div>
        <Button onClick={handleSave} disabled={saving || !hasChanges}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="hero">Hero Content</TabsTrigger>
          <TabsTrigger value="about">About Content</TabsTrigger>
          <TabsTrigger value="stats">Stats Counters</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company Information</CardTitle>
            </CardHeader>
            <CardContent>{renderFields(companyFields)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hero Section Content</CardTitle>
            </CardHeader>
            <CardContent>{renderFields(heroFields)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About Section Content</CardTitle>
            </CardHeader>
            <CardContent>{renderFields(aboutFields)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Homepage Stats Counters</CardTitle>
            </CardHeader>
            <CardContent>{renderFields(statsFields)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Logo Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Large Logo Preview */}
                {settings.company_logo && (
                  <div className={cn(
                    'rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-4',
                    isDark
                      ? 'border-[#285A48] bg-[#0A1A18]'
                      : 'border-gray-200 bg-gray-50'
                  )}>
                    <div className={cn(
                      'relative w-48 h-48 rounded-2xl flex items-center justify-center overflow-hidden',
                      isDark ? 'bg-[#091413]' : 'bg-white border'
                    )}>
                      <img
                        src={settings.company_logo}
                        alt="Company Logo"
                        className="max-w-full max-h-full object-contain p-4"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">Current Logo</p>
                      <p className="text-xs text-muted-foreground mt-1">{settings.company_logo}</p>
                    </div>
                  </div>
                )}

                {/* Upload Component */}
                <ImageUpload
                  value={settings.company_logo || ''}
                  onChange={(url) => handleChange('company_logo', url)}
                  label="Upload Company Logo"
                />

                {!settings.company_logo && (
                  <div className={cn(
                    'rounded-xl border-2 border-dashed p-12 flex flex-col items-center justify-center gap-3',
                    isDark
                      ? 'border-[#285A48] bg-[#0A1A18]'
                      : 'border-gray-200 bg-gray-50'
                  )}>
                    <Eye className={cn('h-12 w-12', isDark ? 'text-[#408A71]' : 'text-gray-300')} />
                    <p className="text-sm text-muted-foreground">No logo uploaded yet</p>
                    <p className="text-xs text-muted-foreground">Upload a logo above to see a large preview here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {socialFields.map((field) => {
                  const iconMap: Record<string, React.ElementType> = {
                    youtube: Youtube,
                    instagram: Instagram,
                    twitter: Twitter,
                    linkedin: Linkedin,
                    facebook: Facebook,
                  }
                  const Icon = iconMap[field.key] || User
                  return (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {field.label}
                      </Label>
                      <Input
                        id={field.key}
                        value={settings[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    </div>
                  )
                })}
              </div>
              <Button onClick={handleSaveSocialMedia} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Save Social Media Links
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Current Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{adminName || '-'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{adminEmail || '-'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Change Email */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Change Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-email">New Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div></div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleAccountSave} disabled={savingAccount}>
                    {savingAccount && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Update Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app'
import LoginDialog from '@/components/admin/LoginDialog'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminDashboard from '@/components/admin/AdminDashboard'
import AdminSettings from '@/components/admin/AdminSettings'
import AdminServices from '@/components/admin/AdminServices'
import AdminBlog from '@/components/admin/AdminBlog'
import AdminContent from '@/components/admin/AdminContent'
import AdminCareers from '@/components/admin/AdminCareers'
import AdminSchemes from '@/components/admin/AdminSchemes'
import AdminInquiries from '@/components/admin/AdminInquiries'
import AdminTestimonials from '@/components/admin/AdminTestimonials'
import AdminFAQs from '@/components/admin/AdminFAQs'
import AdminTeam from '@/components/admin/AdminTeam'
import AdminStats from '@/components/admin/AdminStats'

export default function AdminPage() {
  const router = useRouter()
  const { currentPage, isAdmin, setSettings, settings } = useAppStore()

  useEffect(() => {
    if (Object.keys(settings).length > 0) return
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {})
  }, [settings, setSettings])

  if (!isAdmin) {
    return (
      <LoginDialog
        onSuccess={() => router.replace('/admin')}
        onBack={() => router.replace('/')}
      />
    )
  }

  const renderAdminPage = () => {
    switch (currentPage) {
      case 'admin-dashboard': return <AdminDashboard />
      case 'admin-settings': return <AdminSettings />
      case 'admin-services': return <AdminServices />
      case 'admin-blog': return <AdminBlog />
      case 'admin-content': return <AdminContent />
      case 'admin-careers': return <AdminCareers />
      case 'admin-schemes': return <AdminSchemes />
      case 'admin-inquiries': return <AdminInquiries />
      case 'admin-testimonials': return <AdminTestimonials />
      case 'admin-faqs': return <AdminFAQs />
      case 'admin-team': return <AdminTeam />
      case 'admin-stats': return <AdminStats />
      default: return <AdminDashboard />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminLayout>{renderAdminPage()}</AdminLayout>
    </div>
  )
}

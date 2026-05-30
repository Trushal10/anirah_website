'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/app'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import HomePage from '@/components/public/HomePage'
import ServicesPage from '@/components/public/ServicesPage'
import BlogPage from '@/components/public/BlogPage'
import BlogDetailPage from '@/components/public/BlogDetailPage'
import ContentPage from '@/components/public/ContentPage'
import ContentDetailPage from '@/components/public/ContentDetailPage'
import AboutPage from '@/components/public/AboutPage'
import CareerPage from '@/components/public/CareerPage'
import ContactPage from '@/components/public/ContactPage'
import ServiceDetailPage from '@/components/public/ServiceDetailPage'
import SubServiceDetailPage from '@/components/public/SubServiceDetailPage'
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

export default function AppPage() {
  const { currentPage, setSettings, settings, isAdmin } = useAppStore()

  useEffect(() => {
    if (Object.keys(settings).length > 0) return
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {})
  }, [settings, setSettings])

  const isAdminPage = currentPage.startsWith('admin')

  // Admin panel
  if (isAdminPage) {
    if (!isAdmin) {
      return <LoginDialog />
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

  // Public pages
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />
      case 'services': return <ServicesPage />
      case 'service-detail': return <ServiceDetailPage />
      case 'subservice-detail': return <SubServiceDetailPage />
      case 'blog': return <BlogPage />
      case 'blog-detail': return <BlogDetailPage />
      case 'content': return <ContentPage />
      case 'content-detail': return <ContentDetailPage />
      case 'about': return <AboutPage />
      case 'career': return <CareerPage />
      case 'contact': return <ContactPage />
      default: return <HomePage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  )
}

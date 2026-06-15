'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Menu,
  Phone,
  ArrowRight,
  X,
  ChevronDown,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Search,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ServiceIcon from '@/components/common/ServiceIcon'
import { publicAccent } from '@/lib/public-palette'

const navLinks = [
  { label: 'Home', page: 'home' as const },
  { label: 'Services', page: 'services' as const, hasDropdown: true },
  { label: 'Schemes', page: 'government-schemes' as const },
  { label: 'About Us', page: 'about' as const },
  { label: 'Blog', page: 'blog' as const },
  { label: 'Career', page: 'career' as const },
  { label: 'Contact Us', page: 'contact' as const },
]

const serviceIconMap: Record<string, React.ElementType> = {
  'clipboard-list': ClipboardListFallback,
  'shield': ShieldFallback,
  'award': AwardFallback,
  'gift': GiftFallback,
  'landmark': LandmarkFallback,
  'palette': PaletteFallback,
  'check-circle': CheckCircleFallback,
}

function ClipboardListFallback(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>
  )
}
function ShieldFallback(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
  )
}
function AwardFallback(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
  )
}
function GiftFallback(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
  )
}
function LandmarkFallback(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
  )
}
function PaletteFallback(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
  )
}
function CheckCircleFallback(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  )
}

export default function Header() {
  const { settings, navigate, currentPage } = useAppStore()
  const [scrolled, setScrolled] = useState(false)
  const [failedLogo, setFailedLogo] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [services, setServices] = useState<{ name: string; slug: string; tagline: string; icon: string; accentColor: string }[]>([])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => setServices(data || []))
      .catch(() => {})
  }, [])

  const companyName = settings.company_name || 'Anirah Advisory'
  const phone = settings.phone || '+91 9998006734'
  const companyLogo = settings.company_logo || ''
  const logoFailed = Boolean(companyLogo && failedLogo === companyLogo)
  const settingsLoaded = Object.keys(settings).length > 0

  const handleNav = (page: string) => {
    navigate(page as any)
    setMobileOpen(false)
    setServicesOpen(false)
    setMobileServicesOpen(false)
  }

  const isActive = (page: string) => currentPage === page

  const socialLinks = [
    { url: settings.youtube_url, icon: Youtube, label: 'YouTube' },
    { url: settings.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: settings.twitter_url, icon: Twitter, label: 'Twitter' },
    { url: settings.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { url: settings.facebook_url, icon: Facebook, label: 'Facebook' },
  ].filter(s => s.url)

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs sm:text-sm">
          <p className="text-gray-300 truncate mr-4">
            {settings.announcement || 'India\'s Trusted MSME Funding & Business Consultancy Platform'}
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
            {settings.track_application_url && (
              <button
                onClick={() => window.open(settings.track_application_url, '_blank')}
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors whitespace-nowrap"
              >
                Track Application
                <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
              </button>
            )}
            <a href={`tel:${phone}`} className="hidden sm:flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors whitespace-nowrap">
              <Phone className="w-3.5 h-3.5" />
              {phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-md border-b border-gray-100'
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center group min-w-0"
            >
              {companyLogo && !logoFailed ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-[64px] w-auto max-w-[190px] shrink-0 object-contain"
                  onError={() => setFailedLogo(companyLogo)}
                />
              ) : !settingsLoaded ? (
                <div className="h-12 w-[150px] rounded-lg bg-gray-100" aria-label="Loading logo" />
              ) : (
                <div className="brand-gradient h-11 w-11 rounded-xl flex items-center justify-center shadow-lg shadow-brand-400/20 group-hover:shadow-brand-400/40 transition-shadow">
                  <span className="text-white font-bold text-sm">AA</span>
                </div>
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.page}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    onClick={() => !link.hasDropdown && handleNav(link.page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      isActive(link.page)
                        ? 'text-navy-950 bg-gray-100'
                        : 'text-gray-600 hover:text-navy-950 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {/* Services Dropdown */}
                  {link.hasDropdown && servicesOpen && services.length > 0 && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[640px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {services.map((s, index) => {
                            const accent = publicAccent(s.slug, index)
                            return (
                              <button
                                key={s.slug}
                                onClick={() => {
                                  navigate('service-detail', s.slug)
                                  setServicesOpen(false)
                                }}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                              >
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                                  style={{ backgroundColor: `${accent}15` }}
                                >
                                  <ServiceIcon icon={s.icon} accentColor={accent} className="w-5 h-5" alt={s.name} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{s.tagline}</p>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => {
                              navigate('services')
                              setServicesOpen(false)
                            }}
                            className="flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                          >
                            View All Services
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${phone}`}
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-navy-950 hover:text-brand-500 transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-400" />
                {phone}
              </a>

              <Button
                onClick={() => handleNav('contact')}
                size="sm"
                className="primary-action !hidden !h-auto !px-6 !py-3 lg:!inline-flex"
              >
                Start Funding Journey
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>

              {/* Mobile Menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0 overflow-y-auto">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                  {/* Mobile Header */}
                  <div className="p-6 border-b border-gray-100 brand-gradient-soft">
                    <div className="flex items-center gap-2.5">
                      {companyLogo && !logoFailed ? (
                        <img
                          src={companyLogo}
                          alt={companyName}
                          className="h-12 w-auto max-w-[160px] object-contain"
                          onError={() => setFailedLogo(companyLogo)}
                        />
                      ) : !settingsLoaded ? (
                        <div className="h-12 w-[130px] rounded-lg bg-white/60" aria-label="Loading logo" />
                      ) : (
                        <div className="brand-gradient h-10 w-10 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">AA</span>
                        </div>
                      )}
                    </div>
                    <a href={`tel:${phone}`} className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-brand-400" />
                      {phone}
                    </a>
                  </div>

                  {/* Mobile Nav */}
                  <nav className="p-4 space-y-1">
                    {navLinks.map((link) => (
                      <div key={link.page}>
                        <button
                          onClick={() => {
                            if (link.hasDropdown) {
                              setMobileServicesOpen(!mobileServicesOpen)
                            } else {
                              handleNav(link.page)
                            }
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                            isActive(link.page)
                              ? 'bg-brand-50 text-brand-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {link.label}
                          {link.hasDropdown && (
                            <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                          )}
                        </button>

                        {/* Mobile Services Sub-menu */}
                        {link.hasDropdown && mobileServicesOpen && (
                          <div className="ml-4 mt-1 space-y-1">
                            {services.map((s) => (
                              <button
                                key={s.slug}
                                onClick={() => {
                                  navigate('service-detail', s.slug)
                                  setMobileOpen(false)
                                }}
                                className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors truncate"
                              >
                                {s.name}
                              </button>
                            ))}
                            <button
                              onClick={() => handleNav('services')}
                              className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-brand-500 hover:bg-brand-50 font-medium transition-colors"
                            >
                              View All Services
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>

                  {/* Mobile CTA */}
                  <div className="p-4 mt-auto border-t border-gray-100">
                    <Button
                      onClick={() => handleNav('contact')}
                      className="primary-action w-full !h-auto !px-6 !py-3"
                    >
                      Start Funding Journey
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {socialLinks.length > 0 && (
                      <div className="flex items-center justify-center gap-3 mt-4">
                        {socialLinks.map((s, i) => (
                          <a
                            key={i}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-brand-50 flex items-center justify-center text-gray-400 hover:text-brand-500 transition-colors"
                          >
                            <s.icon className="w-4 h-4" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

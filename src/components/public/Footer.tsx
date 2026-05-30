'use client'

import { useEffect, useState } from 'react'
import { Page, useAppStore } from '@/store/app'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react'

type Service = { name: string; slug: string }

const companyLinks: { label: string; page: Page }[] = [
  { label: 'About', page: 'about' },
  { label: 'Career', page: 'career' },
  { label: 'Blog', page: 'blog' },
  { label: 'Contact', page: 'contact' },
]

export default function Footer() {
  const { settings, navigate } = useAppStore()
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const companyName = settings?.company_name || 'FundGrow'
  const companyDesc = settings?.company_description || "India's trusted MSME funding and business consultancy platform."
  const phone = settings?.phone || ''
  const phone2 = settings?.phone2 || ''
  const email = settings?.email || ''
  const email2 = settings?.email2 || ''
  const address = settings?.address || ''

  const socialLinks = [
    { url: settings?.facebook, icon: Facebook, label: 'Facebook' },
    { url: settings?.instagram, icon: Instagram, label: 'Instagram' },
    { url: settings?.twitter, icon: Twitter, label: 'Twitter' },
    { url: settings?.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { url: settings?.youtube, icon: Youtube, label: 'YouTube' },
  ].filter((item) => item.url)

  return (
    <footer className="relative overflow-hidden bg-gray-950 text-gray-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand-500 via-mint-500 to-brand-500" />

      <div className="section-shell py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <button onClick={() => navigate('home')} className="mb-5 flex items-center gap-2 text-left">
              {settings?.company_logo ? (
                <div className="flex h-10 w-auto max-w-[160px] items-center justify-center overflow-hidden rounded-lg bg-white px-2 py-1">
                  <img src={settings.company_logo} alt={companyName} className="h-8 w-auto object-contain" />
                </div>
              ) : (
                <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-lg">
                  <span className="text-lg font-bold text-white">F</span>
                </div>
              )}
            </button>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-400">{companyDesc}</p>

            <div className="mb-6 space-y-3">
              {address && (
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <span>{address}</span>
                </div>
              )}

              {(phone || phone2) && (
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <div className="flex flex-col gap-1">
                    {phone && <a href={`tel:${phone}`} className="hover:text-brand-300">{phone}</a>}
                    {phone2 && <a href={`tel:${phone2}`} className="hover:text-brand-300">{phone2}</a>}
                  </div>
                </div>
              )}

              {(email || email2) && (
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" />
                  <div className="flex flex-col gap-1">
                    {email && <a href={`mailto:${email}`} className="hover:text-brand-300">{email}</a>}
                    {email2 && <a href={`mailto:${email2}`} className="hover:text-brand-300">{email2}</a>}
                  </div>
                </div>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition hover:bg-brand-500/10 hover:text-brand-300"
                  >
                    <item.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-5 font-semibold text-white">Our Services</h2>
            <ul className="space-y-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <button onClick={() => navigate('service-detail', service.slug)} className="text-left text-sm text-gray-400 transition hover:text-mint-300">
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 font-semibold text-white">Company</h2>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.page}>
                  <button onClick={() => navigate(item.page)} className="text-sm text-gray-400 transition hover:text-brand-300">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 font-semibold text-white">Resources</h2>
            <ul className="space-y-3">
              <li>
                <button onClick={() => navigate('content')} className="text-sm text-gray-400 transition hover:text-brand-300">
                  Knowledge Base
                </button>
              </li>
              <li>
                <button onClick={() => navigate('blog')} className="text-sm text-gray-400 transition hover:text-brand-300">
                  Blog
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

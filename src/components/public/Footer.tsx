'use client'

import { useEffect, useState } from 'react'
import { Page, useAppStore } from '@/store/app'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react'

type Service = { name: string; slug: string }

const companyLinks: { label: string; page: Page }[] = [
  { label: 'About', page: 'about' },
  { label: 'Career', page: 'career' },
  { label: 'Government Schemes', page: 'government-schemes' },
  { label: 'Blog', page: 'blog' },
  { label: 'Contact', page: 'contact' },
]

export default function Footer() {
  const { settings, navigate } = useAppStore()
  const [services, setServices] = useState<Service[]>([])
  const [failedLogo, setFailedLogo] = useState('')

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const companyName = settings?.company_name || 'Anirah Advisory'
  const companyLogo = settings?.company_logo || ''
  const logoFailed = Boolean(companyLogo && failedLogo === companyLogo)
  const settingsLoaded = Object.keys(settings || {}).length > 0
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
              {companyLogo && !logoFailed ? (
                <div className="flex h-14 max-w-[210px] items-center justify-center overflow-hidden rounded-lg bg-white px-3 py-2">
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="h-10 w-auto object-contain"
                    onError={() => setFailedLogo(companyLogo)}
                  />
                </div>
              ) : !settingsLoaded ? (
                <div className="h-14 w-[160px] rounded-lg bg-white/10" aria-label="Loading logo" />
              ) : (
                <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-lg">
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
              <li>
                <button onClick={() => navigate('terms-conditions')} className="text-sm text-gray-400 transition hover:text-brand-300">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy-policy')} className="text-sm text-gray-400 transition hover:text-brand-300">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-5 text-left text-xs leading-relaxed text-gray-400">
          <p>
            <span className="font-semibold text-gray-300">Disclaimer:</span> We provide consultancy services in areas
            such as pitch deck preparation, financial reporting, business incorporation, certification assistance,
            funding support, and other professional services related to start-up consultation. {companyName} understands
            the evolving needs of today&apos;s enterprises and strives to offer guidance tailored to their growth. However,
            we are solely a consultancy service provider and are not affiliated, associated, or in collaboration with
            any Government or Non-Government Agency, Institution, Organization, or Department.
          </p>
          <p>
            <span className="font-semibold text-gray-300">Note:</span> Payments for services are accepted only in the
            name of {companyName} and must be made exclusively to official Current Accounts via NEFT, IMPS, RTGS, or
            approved digital payment modes (UPI). No payments are accepted in any personal account, third-party account,
            or under any other name. Any payment made outside these approved channels shall be solely at the payer&apos;s
            risk and responsibility, and the company shall not be liable for such transactions.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell py-6">
          <div className="grid grid-cols-1 items-center gap-4 text-sm text-gray-500 md:grid-cols-2">
            <div className="text-center md:text-left">
              Copyright All Right Reserved ©{new Date().getFullYear()} Developed & Managed By {companyName}.
            </div>
            <div className="flex items-center justify-center gap-5 md:justify-end">
              <button onClick={() => navigate('privacy-policy')} className="transition hover:text-brand-300">
                Privacy Policy
              </button>
              <button onClick={() => navigate('terms-conditions')} className="transition hover:text-brand-300">
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

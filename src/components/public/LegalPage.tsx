'use client'

import { ArrowRight, FileText, Home, LockKeyhole, Mail } from 'lucide-react'
import PageHero from '@/components/common/PageHero'
import { useAppStore } from '@/store/app'

type LegalPageKind = 'terms' | 'privacy'

interface LegalSection {
  title: string
  body?: string[]
  items?: string[]
}

interface LegalPageProps {
  kind: LegalPageKind
}

function withCompany(text: string, companyName: string, email: string) {
  return text.replaceAll('{company}', companyName).replaceAll('{email}', email)
}

const termsSections: LegalSection[] = [
  {
    title: 'Acceptance of Terms',
    body: [
      'By accessing this website, submitting forms, or using our consultancy services, you agree to follow these Terms & Conditions. If you do not agree with these terms, please do not use the website or services.',
    ],
  },
  {
    title: 'Consultancy Services Disclaimer',
    body: [
      '{company} provides consultancy support for business incorporation, compliance assistance, business documentation, startup advisory, pitch deck preparation, financial reporting, website development, digital marketing, certification support, funding assistance, and related professional services.',
      'We are a consultancy service provider only. We are not affiliated, associated, partnered, or officially connected with any Government or Non-Government Agency, Institution, Organization, or Department.',
      'Any regulatory, certification, funding, or government-related process is subject to the applicable authority rules, eligibility checks, timelines, and final decisions. The client remains responsible for providing accurate information and maintaining legal compliance.',
    ],
  },
  {
    title: 'Third-Party Services',
    items: [
      'Some services may involve third-party portals, professionals, vendors, payment processors, or official platforms.',
      'You may be required to accept additional third-party terms before using those services.',
      '{company} is not responsible for third-party products, platforms, service quality, delays, privacy practices, or independent communications.',
    ],
  },
  {
    title: 'Intellectual Property',
    items: [
      'Website content, documents, text, graphics, logos, videos, templates, and software are owned by {company} or its licensors unless stated otherwise.',
      'Forms, drafts, and documents shared with you may be used only for your personal or internal business purpose.',
      'Copying, modifying, reselling, publishing, or redistributing our materials without written permission is prohibited.',
    ],
  },
  {
    title: 'User Responsibilities',
    items: [
      'You agree not to upload or submit false, defamatory, obscene, abusive, illegal, offensive, or misleading content.',
      'You must not infringe any copyright, trademark, privacy, confidentiality, or intellectual property rights.',
      'You must not upload malware, viruses, harmful files, or use the services for fraudulent activity.',
      'You are responsible for the accuracy of all information, documents, declarations, and approvals submitted for your work.',
    ],
  },
  {
    title: 'Payments, Refunds, and Cancellations',
    body: [
      'Refund eligibility depends on the applicable service agreement, undertaking, quotation, memorandum of understanding, or written confirmation shared for the specific service. If work has already started or services have been rendered, refund eligibility may depend on the nature and stage of work completed.',
      'Where a refund is approved, the timeframe, documents required, full-and-final confirmation, and bank details will be communicated by email. Approved refunds may take up to 45 working days after receipt of all required information.',
      'Payments should be made only through approved company payment channels. Any payment made to an unauthorized personal, third-party, or unrelated account is at the payer risk.',
    ],
  },
  {
    title: 'Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, {company}, its directors, employees, consultants, partners, and affiliates will not be liable for indirect, incidental, consequential, punitive, or special damages including loss of profit, data, goodwill, opportunity, or legal claim.',
      'If any liability is established, it will be limited to the amount paid by you for the specific service connected with the claim.',
    ],
  },
  {
    title: 'Electronic Records and Signatures',
    body: [
      'By using our services, you authorize us to process electronic records, forms, declarations, and signatures where required for service delivery, unless you withdraw that authorization before submission.',
    ],
  },
  {
    title: 'Delivery of Services',
    body: [
      'Services may be delivered electronically through email, download links, client portals, messaging platforms, or physically through courier and logistics partners. Delivery timelines can vary based on client response, third-party portals, and authority processing.',
    ],
  },
  {
    title: 'Force Majeure',
    body: [
      '{company} will not be responsible for delays, failures, or interruptions caused by events beyond reasonable control, including natural disasters, technical outages, government action, strikes, pandemics, wars, authority delays, or third-party platform downtime.',
    ],
  },
  {
    title: 'Reviews and User Content',
    body: [
      'By submitting reviews, feedback, comments, or testimonials, you grant {company} permission to use, display, and publish that content for service improvement, marketing, and promotional purposes, unless you request removal where legally permitted.',
    ],
  },
  {
    title: 'Disputes and Governing Law',
    body: [
      'These terms are governed by the laws of India. Any dispute will be subject to the courts having jurisdiction over the company registered office, unless a written agreement states otherwise.',
    ],
  },
  {
    title: 'Grievance and Contact',
    body: [
      'For service-related queries, clarity, or grievance resolution, contact us at {email} with your name, company name, service availed, query details, and contact number.',
    ],
  },
]

const privacySections: LegalSection[] = [
  {
    title: 'Overview',
    body: [
      '{company} respects your privacy and is committed to protecting personal and business information collected through this website, forms, calls, emails, messaging channels, and other service interactions.',
      'By using our website or services, you agree to this Privacy Policy and consent to the collection, use, storage, and processing of information as described here.',
    ],
  },
  {
    title: 'Information We Collect',
    body: [
      'We may collect personal information when you browse the website, submit an inquiry, speak with our team, purchase a service, participate in a survey, request support, or share documents for service delivery.',
    ],
    items: [
      'Contact data such as name, address, city, state, postal code, phone number, and email address.',
      'Demographic or business data such as business type, industry, company details, and location.',
      'Legal, financial, registration, compliance, or service-related documents required to complete your assignment.',
      'Third-party individual details where required for a service, such as shareholders, directors, partners, nominees, authorized representatives, or registered contacts.',
    ],
  },
  {
    title: 'Website and Traffic Data',
    body: [
      'We may collect technical information such as IP address, browser type, operating system, device details, date and time of visit, referring pages, exit pages, clickstream data, and general usage information.',
      'This data helps us understand website traffic, improve content, diagnose technical issues, and maintain service performance. Aggregated or anonymous data may be shared with analytics, advertising, or business partners.',
    ],
  },
  {
    title: 'Cookies and Tracking',
    body: [
      'We and our technology partners may use cookies, pixels, web beacons, analytics tools, remarketing tags, and similar technologies to improve user experience, analyze traffic, remember preferences, and show relevant content or advertisements.',
      'You can control or disable cookies through your browser settings. Some website features may not work correctly if cookies are disabled.',
    ],
  },
  {
    title: 'Communication Consent',
    body: [
      'By sharing your contact details, you consent to receive service updates and, where permitted, promotional communication through phone, email, SMS, WhatsApp, RCS, or similar channels. You may opt out of promotional communication by following unsubscribe instructions or contacting us at {email}.',
    ],
  },
  {
    title: 'How We Use Information',
    items: [
      'To respond to inquiries and provide requested consultancy services.',
      'To process orders, payments, documents, applications, registrations, certifications, and filings.',
      'To communicate service updates, requirements, reminders, and support messages.',
      'To improve website performance, service quality, training, internal processes, and customer experience.',
      'To send relevant offers, updates, newsletters, or promotional communication where permitted.',
      'To comply with legal obligations, prevent fraud, protect rights, and respond to lawful requests.',
    ],
  },
  {
    title: 'Sharing of Information',
    body: [
      'We do not sell personal information for unrelated third-party marketing. We may share information only where required for service delivery, legal compliance, user consent, or legitimate business operations.',
    ],
    items: [
      'With payment processors, portals, vendors, consultants, logistics partners, or service providers involved in completing your work.',
      'With authorities, official platforms, professional partners, or designated third parties where a service requires it.',
      'With analytics, technology, advertising, or support providers who help us operate and improve the website and services.',
      'When required by law, lawful authority request, court order, fraud investigation, or protection of rights and safety.',
      'During merger, acquisition, restructuring, asset transfer, or similar business transition, subject to applicable law.',
    ],
  },
  {
    title: 'Blogs, Reviews, Forums, and Public Areas',
    body: [
      'Information you post in public areas such as comments, blogs, reviews, forums, or testimonials may be visible to others. Please avoid sharing confidential or sensitive information in public spaces.',
    ],
  },
  {
    title: 'Third-Party Links and Social Media',
    body: [
      'Our website may contain links to third-party websites, social media features, share buttons, embedded content, or external tools. Their privacy practices are governed by their own policies, and we are not responsible for their content or data practices.',
    ],
  },
  {
    title: 'Data Security',
    body: [
      'We use reasonable administrative, technical, and organizational safeguards to protect information collected through our website and services. However, no internet transmission, server, email, or digital storage method can be guaranteed as completely secure.',
      'If you believe your privacy has been breached through use of our website or services, contact us immediately at {email}.',
    ],
  },
  {
    title: 'Access, Updates, and Removal',
    body: [
      'You may request access, correction, update, or removal of certain personal information by contacting {email}. Some information may need to be retained for legal, compliance, service record, accounting, dispute resolution, or legitimate business purposes.',
    ],
  },
  {
    title: 'Policy Updates',
    body: [
      'We may update this Privacy Policy from time to time to reflect service, legal, technology, or operational changes. The updated policy will be posted on this page, and continued use of the website or services means you accept the updated policy.',
    ],
  },
]

export default function LegalPage({ kind }: LegalPageProps) {
  const { settings, navigate } = useAppStore()
  const companyName = settings?.company_name || 'Anirah Advisory'
  const email = settings?.email || 'support@anirahadvisory.in'
  const phone = settings?.phone || '+91 9998006734'
  const isTerms = kind === 'terms'
  const sections = isTerms ? termsSections : privacySections

  return (
    <div className="bg-white">
      <PageHero
        kicker="Legal"
        title={isTerms ? 'Terms &' : 'Privacy'}
        highlight={isTerms ? 'Conditions' : 'Policy'}
        description={
          isTerms
            ? 'Please read these terms carefully before using our website or consultancy services.'
            : 'Learn how we collect, use, share, and protect information connected with our website and services.'
        }
        icon={isTerms ? <FileText className="h-4 w-4 text-brand-300" /> : <LockKeyhole className="h-4 w-4 text-brand-300" />}
      />

      <section className="section-pad">
        <div className="section-shell">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 rounded-lg border border-mint-100 bg-gradient-to-r from-mint-50 to-brand-50 p-6">
              <span className="section-kicker">Important Note</span>
              <p className="mt-4 text-sm leading-relaxed text-gray-700 sm:text-base">
                This page is for general information about {companyName} policies and does not replace a signed proposal,
                service agreement, undertaking, invoice terms, or legal advice specific to your matter.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              {sections.map((section) => (
                <section key={section.title} className="border-b border-gray-100 p-6 last:border-b-0 sm:p-7">
                  <h2 className="text-xl font-bold text-gray-950">{section.title}</h2>
                  {section.body?.map((paragraph) => (
                    <p key={paragraph} className="mt-3 leading-relaxed text-gray-600">
                      {withCompany(paragraph, companyName, email)}
                    </p>
                  ))}
                  {section.items && (
                    <ul className="mt-4 space-y-2 pl-5 text-gray-600">
                      {section.items.map((item) => (
                        <li key={item} className="list-disc leading-relaxed">
                          {withCompany(item, companyName, email)}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-950 p-6 text-white sm:p-8">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/80">
                    <Mail className="h-4 w-4 text-brand-300" />
                    Need Help?
                  </span>
                  <h2 className="mt-4 text-2xl font-bold">Have questions about this policy?</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    Contact our team for service-related queries, documentation clarity, or payment confirmation.
                  </p>
                  <div className="mt-4 flex flex-col gap-1 text-sm text-white/75">
                    <a href={`mailto:${email}`} className="hover:text-brand-300">{email}</a>
                    <a href={`tel:${phone}`} className="hover:text-brand-300">{phone}</a>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                  <button onClick={() => navigate('contact')} className="primary-action">
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate('home')}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    <Home className="h-4 w-4" />
                    Go to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

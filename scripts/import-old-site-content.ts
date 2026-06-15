import { db } from '../src/lib/db'

const settings: Record<string, string> = {
  company_name: 'Anirah Advisory',
  company_tagline: 'Empowering Growth, Innovation, Success',
  company_description:
    'Anirah Advisory helps startups, MSMEs, and growing businesses with company registration, Startup India recognition, tax exemption, government funding schemes, compliance, branding, website development, and growth advisory.',
  phone: '+91 9974240114',
  phone2: '',
  email: 'hello@anirahadvisory.com',
  email2: 'sales@anirahadvisory.com',
  address: 'B-201, Mondeal Heights, Near Panchratna Party Plot, S. G. Highway, Ahmedabad, Gujarat 380015',
  website: 'https://anirahadvisory.com/',
  site_url: 'https://anirahadvisory.com/',
  google_rating: '4.7',
  experience_years: '4',
  hero_title: 'Start. Scale. Succeed with Anirah Advisory',
  hero_subtitle:
    'From Startup India recognition and tax exemption to seed funding, registration, compliance, branding, and digital growth, we help founders build with confidence.',
  hero_badge: 'Trusted advisory for startups, MSMEs, and entrepreneurs',
  announcement: 'Startup India applications, tax exemption, and funding advisory support available',
  mission:
    'Our mission is to empower entrepreneurs with clear, reliable, and affordable advisory support across business registration, compliance, funding, branding, and digital growth.',
  vision:
    'Our vision is to become a trusted growth partner for Indian startups and MSMEs by combining practical execution, transparent guidance, and long-term business support.',
  about_text:
    'Anirah Advisory is an Ahmedabad-based business consultancy helping founders and MSMEs start, scale, and succeed. We support clients with Startup India certification, company registration, tax exemption, seed funding guidance, compliance, branding, web development, and growth strategy under one roof.',
  seo_home_title: 'Anirah Advisory | Startup, Funding & Business Growth Consultants',
  seo_home_description:
    'Anirah Advisory helps startups and MSMEs with Startup India recognition, seed funding, tax exemption, company registration, compliance, branding, and digital growth.',
  seo_home_keywords:
    'Anirah Advisory, Startup India certification, seed funding, company registration, MSME consultant, tax exemption, business growth advisory',
  seo_about_title: 'About Anirah Advisory | Business Advisory for Startups and MSMEs',
  seo_about_description:
    'Learn about Anirah Advisory, an Ahmedabad-based consultancy supporting startups and MSMEs with registration, funding, compliance, branding, and growth.',
  seo_about_keywords: 'about Anirah Advisory, Ahmedabad business consultant, startup advisory, MSME advisory',
  seo_career_title: 'Careers at Anirah Advisory | Join Our Advisory Team',
  seo_career_description:
    'Explore career opportunities at Anirah Advisory and join a team helping Indian entrepreneurs with startup, funding, compliance, and growth services.',
  seo_career_keywords: 'Anirah Advisory careers, business consultant jobs, startup advisory jobs, Ahmedabad jobs',
  seo_contact_title: 'Contact Anirah Advisory | Startup and Business Advisory Support',
  seo_contact_description:
    'Contact Anirah Advisory for Startup India recognition, seed funding guidance, company registration, compliance, branding, and business growth consulting.',
  seo_contact_keywords:
    'contact Anirah Advisory, startup consultant Ahmedabad, MSME consultant, business advisory contact',
}

const testimonials = [
  {
    name: 'Tirthanjan Banerjee',
    company: 'Kolkata, West Bengal',
    role: 'Entrepreneur',
    content:
      'Prompt and efficient service for our registration and funding needs. The team was responsive, professional, and handled the process smoothly.',
    rating: 5,
    order: 1,
  },
  {
    name: 'Adarsh Singhania',
    company: 'Jaipur, Rajasthan',
    role: 'Business Owner',
    content:
      'Incredibly fast service. The team is humble, supportive, and made the entire business registration process smooth and hassle-free.',
    rating: 5,
    order: 2,
  },
  {
    name: 'Parshuram Wagh',
    company: 'Mumbai, Maharashtra',
    role: 'Startup Founder',
    content:
      'We received Startup India certification quickly, with clear guidance at every step. The team made a complex process easy to understand.',
    rating: 5,
    order: 3,
  },
]

async function upsertSettings() {
  for (const [key, value] of Object.entries(settings)) {
    await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }
}

async function upsertTestimonials() {
  for (const testimonial of testimonials) {
    const existing = await db.testimonial.findFirst({
      where: { name: testimonial.name },
    })

    if (existing) {
      await db.testimonial.update({
        where: { id: existing.id },
        data: testimonial,
      })
    } else {
      await db.testimonial.create({
        data: testimonial,
      })
    }
  }
}

async function main() {
  await upsertSettings()
  await upsertTestimonials()
  console.log(`Imported ${Object.keys(settings).length} settings and ${testimonials.length} testimonials.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

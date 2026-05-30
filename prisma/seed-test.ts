import { db } from '../src/lib/db'

const shouldClear = !process.argv.includes('--no-clear')
const isDryRun = process.argv.includes('--dry-run')

const json = (value: unknown) => JSON.stringify(value)

async function clearData() {
  await db.subService.deleteMany()
  await db.serviceSeries.deleteMany()
  await db.stat.deleteMany()
  await db.fAQ.deleteMany()
  await db.teamMember.deleteMany()
  await db.testimonial.deleteMany()
  await db.contactInquiry.deleteMany()
  await db.career.deleteMany()
  await db.contentArticle.deleteMany()
  await db.blogPost.deleteMany()
  await db.scheme.deleteMany()
  await db.siteSetting.deleteMany()
  await db.admin.deleteMany()
}

async function main() {
  console.log('Seeding test data...')

  if (isDryRun) {
    console.log('Dry run complete. Test seed data is valid.')
    return
  }

  if (shouldClear) {
    console.log('Clearing existing data...')
    await clearData()
  }

  await db.admin.upsert({
    where: { email: 'test-admin@fundgrow.local' },
    update: {
      password: 'test123',
      name: 'Test Admin',
      role: 'admin',
    },
    create: {
      email: 'test-admin@fundgrow.local',
      password: 'test123',
      name: 'Test Admin',
      role: 'admin',
    },
  })

  await db.siteSetting.createMany({
    data: [
      { key: 'company_name', value: 'FundGrow Test' },
      { key: 'company_tagline', value: 'Testing business growth workflows' },
      { key: 'company_description', value: 'A seeded test profile for local development and QA.' },
      { key: 'phone', value: '+91 90000 00000' },
      { key: 'email', value: 'testing@fundgrow.local' },
      { key: 'address', value: 'Ahmedabad, Gujarat, India' },
      { key: 'google_rating', value: '4.8' },
      { key: 'experience_years', value: '12' },
      { key: 'team_size', value: '24' },
      { key: 'states_covered', value: '10' },
    ],
    skipDuplicates: true,
  })

  const registration = await db.serviceSeries.upsert({
    where: { slug: 'test-registration' },
    update: {},
    create: {
      name: 'TEST AARAMBH',
      slug: 'test-registration',
      icon: 'clipboard-list',
      tagline: 'Registration test services',
      description: 'Test registration category used for local QA.',
      accentColor: '#2563EB',
      order: 1,
    },
  })

  const funding = await db.serviceSeries.upsert({
    where: { slug: 'test-funding' },
    update: {},
    create: {
      name: 'TEST VIKAS',
      slug: 'test-funding',
      icon: 'landmark',
      tagline: 'Funding test services',
      description: 'Test funding category used for local QA.',
      accentColor: '#059669',
      order: 2,
    },
  })

  await db.subService.createMany({
    data: [
      {
        name: 'Test Private Limited Registration',
        slug: 'test-private-limited-registration',
        description: '<p>Test service for company registration workflows.</p>',
        benefits: json(['Limited liability', 'Investor ready', 'Formal structure']),
        process: json([
          { title: 'Collect documents', desc: 'Gather PAN, Aadhaar, and address proof.' },
          { title: 'File application', desc: 'Submit incorporation application for testing.' },
        ]),
        documents: json(['PAN card', 'Aadhaar card', 'Address proof']),
        eligibility: '<ul><li>At least two directors</li><li>Registered office in India</li></ul>',
        features: json(['Fast setup', 'Document checklist', 'Compliance reminders']),
        pricing: 'INR 4,999',
        registrationTime: '7 working days',
        order: 1,
        seriesId: registration.id,
      },
      {
        name: 'Test MSME Loan Assistance',
        slug: 'test-msme-loan-assistance',
        description: '<p>Test service for funding and loan inquiry flows.</p>',
        benefits: json(['Loan readiness', 'Bank coordination', 'Documentation support']),
        process: json([
          { title: 'Eligibility check', desc: 'Review borrower profile and business need.' },
          { title: 'Application support', desc: 'Prepare and submit loan documents.' },
        ]),
        documents: json(['Business PAN', 'Bank statement', 'ITR']),
        eligibility: '<p>Active business with basic financial records.</p>',
        features: json(['Eligibility screening', 'Financial deck', 'Follow-up support']),
        pricing: 'Consultation based',
        registrationTime: '10 working days',
        order: 1,
        seriesId: funding.id,
      },
    ],
    skipDuplicates: true,
  })

  await db.scheme.upsert({
    where: { slug: 'test-startup-grant' },
    update: {},
    create: {
      title: 'Test Startup Grant',
      slug: 'test-startup-grant',
      description: 'Sample government scheme used to test scheme listing and detail UI.',
      benefits: json(['Prototype grant', 'Mentor access', 'Application support']),
      eligibility: 'Early-stage startups with a working prototype.',
      category: 'Startup',
      image: '/uploads/test-scheme.jpg',
      isActive: true,
      order: 1,
    },
  })

  await db.blogPost.upsert({
    where: { slug: 'test-business-registration-guide' },
    update: {},
    create: {
      title: 'Test Business Registration Guide',
      slug: 'test-business-registration-guide',
      excerpt: 'Seeded blog post for testing published and featured content.',
      content: '## Test Guide\n\nUse this post to test blog rendering, markdown, and featured sorting.',
      coverImage: '/uploads/test-blog.jpg',
      category: 'Registration',
      tags: json(['testing', 'registration']),
      readTime: '3 min read',
      isPublished: true,
      isFeatured: true,
      order: 1,
    },
  })

  await db.contentArticle.upsert({
    where: { slug: 'test-gst-checklist' },
    update: {},
    create: {
      title: 'Test GST Checklist',
      slug: 'test-gst-checklist',
      excerpt: 'Seeded article for testing knowledge-base pages.',
      content: '## Test GST Checklist\n\nConfirm article detail pages render seeded content correctly.',
      coverImage: '/uploads/test-content.jpg',
      category: 'Compliance',
      readTime: '4 min read',
      isPublished: true,
      isFeatured: true,
      order: 1,
    },
  })

  await db.career.upsert({
    where: { slug: 'test-business-analyst' },
    update: {},
    create: {
      title: 'Test Business Analyst',
      slug: 'test-business-analyst',
      location: 'Ahmedabad',
      type: 'Full Time',
      experience: '1-3 years',
      description: 'Seeded career listing for testing career pages and applications.',
      requirements: json(['Client communication', 'Documentation', 'Basic finance knowledge']),
      department: 'Operations',
      salary: 'INR 3,00,000 - 5,00,000 per annum',
    },
  })

  await db.contactInquiry.createMany({
    data: [
      {
        name: 'Aarav Test',
        email: 'aarav.test@example.com',
        phone: '+91 91111 11111',
        subject: 'Need company registration',
        message: 'Please help me test the inquiry management workflow.',
        businessType: 'Manufacturing',
        fundingAmount: 'INR 10,00,000',
        inquiryType: 'service',
        isRead: false,
        status: 'new',
      },
      {
        name: 'Meera Test',
        email: 'meera.test@example.com',
        phone: '+91 92222 22222',
        subject: 'Career application test',
        message: 'Testing career inquiry with resume metadata.',
        resumeUrl: '/uploads/test-resume.pdf',
        experience: '2 years',
        inquiryType: 'career',
        filePath: '/uploads/test-resume.pdf',
        fileType: 'application/pdf',
        fileName: 'test-resume.pdf',
        isRead: true,
        status: 'in_progress',
      },
    ],
  })

  await db.testimonial.createMany({
    data: [
      {
        name: 'Dev Test Client',
        company: 'Seeded Industries',
        role: 'Founder',
        content: 'This seeded testimonial verifies carousel and admin CRUD flows.',
        rating: 5,
        avatarUrl: '/uploads/test-avatar.jpg',
        order: 1,
      },
      {
        name: 'QA Test Client',
        company: 'Fixture Foods',
        role: 'Owner',
        content: 'A second seeded testimonial helps test ordering and active filters.',
        rating: 4,
        order: 2,
      },
    ],
  })

  await db.teamMember.createMany({
    data: [
      {
        name: 'Nisha Test',
        role: 'Operations Lead',
        bio: 'Seeded team member for local UI checks.',
        avatarUrl: '/uploads/test-team-1.jpg',
        linkedin: 'https://linkedin.com/in/nisha-test',
        order: 1,
      },
      {
        name: 'Rohan Test',
        role: 'Compliance Advisor',
        bio: 'Second seeded team member for ordering checks.',
        avatarUrl: '/uploads/test-team-2.jpg',
        linkedin: 'https://linkedin.com/in/rohan-test',
        order: 2,
      },
    ],
  })

  await db.fAQ.createMany({
    data: [
      {
        question: 'Is this test data safe to edit?',
        answer: 'Yes. It is intended for local testing and can be recreated with npm run seed:test.',
        category: 'Testing',
        order: 1,
      },
      {
        question: 'What are the test admin credentials?',
        answer: 'Use test-admin@fundgrow.local with password test123.',
        category: 'Testing',
        order: 2,
      },
    ],
  })

  await db.stat.createMany({
    data: [
      { label: 'Test Clients', value: 25, suffix: '+', icon: 'users', color: '#2563EB', order: 1 },
      { label: 'Test States', value: 10, suffix: '+', icon: 'map-pin', color: '#059669', order: 2 },
      { label: 'Test Projects', value: 80, suffix: '+', icon: 'briefcase', color: '#D97706', order: 3 },
      { label: 'Test Rating', value: 5, suffix: '/5', icon: 'star', color: '#DC2626', order: 4 },
    ],
  })

  console.log('Test database seeded successfully.')
  console.log('Admin: test-admin@fundgrow.local / test123')
}

main()
  .catch((error) => {
    console.error('Test seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

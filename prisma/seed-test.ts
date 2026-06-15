import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/password'

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
    where: { email: 'test-admin@anirahadvisory.local' },
    update: {
      password: hashPassword('test123'),
      name: 'Test Admin',
      role: 'admin',
    },
    create: {
      email: 'test-admin@anirahadvisory.local',
      password: hashPassword('test123'),
      name: 'Test Admin',
      role: 'admin',
    },
  })

  await db.siteSetting.createMany({
    data: [
      { key: 'company_name', value: 'Anirah Advisory Demo' },
      { key: 'company_tagline', value: 'Registration, compliance, funding, and growth support for Indian businesses' },
      { key: 'company_description', value: 'A realistic demo profile for local development and client review. This seed includes detailed service pages, long-form articles, client inquiries, testimonials, team profiles, FAQs, and homepage counters so every public and admin workflow can be checked with meaningful content.' },
      { key: 'phone', value: '+91 90000 00000' },
      { key: 'email', value: 'demo@anirahadvisory.local' },
      { key: 'address', value: 'Prahlad Nagar, Ahmedabad, Gujarat, India' },
      { key: 'google_rating', value: '4.8' },
      { key: 'experience_years', value: '12' },
      { key: 'team_size', value: '24' },
      { key: 'states_covered', value: '10' },
      { key: 'projects_executed', value: '380' },
      { key: 'google_reviews', value: '740' },
      { key: 'hero_title', value: 'Anirah Advisory Demo Business Console' },
      { key: 'hero_subtitle', value: 'Explore a complete seeded website experience with practical business services, client cases, funding support content, and admin-ready demo records.' },
      { key: 'hero_badge', value: 'Demo data for client presentation and QA' },
      { key: 'mission', value: 'Help entrepreneurs move from idea to compliant, fundable, and scalable business operations with clear documentation, structured execution, and reliable follow-up.' },
      { key: 'vision', value: 'Create a trusted operating partner for MSMEs and startups that need registration, certification, compliance, funding, and market-readiness support in one place.' },
      { key: 'about_text', value: 'Anirah Advisory Demo represents a business consultancy built for founders, family businesses, exporters, food entrepreneurs, and MSMEs. The seeded content is intentionally detailed so page layouts, admin editing, search, cards, descriptions, and detail views can be reviewed properly.' },
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
      description: 'Demo registration services for founders who need the right legal structure, clean incorporation documents, and practical guidance before opening bank accounts, applying for GST, or approaching investors.',
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
      description: 'Demo funding services for MSMEs and startups preparing loan applications, grant submissions, financial projections, and lender-ready documentation with clear eligibility checks.',
      accentColor: '#059669',
      order: 2,
    },
  })

  await db.subService.createMany({
    data: [
      {
        name: 'Demo Private Limited Registration',
        slug: 'demo-private-limited-registration',
        description: '<p>Private Limited Company registration is the preferred structure for founders who want limited liability, investor confidence, and a formal corporate identity from day one.</p><p>This demo service shows the full client journey: business structure consultation, name availability check, DSC and DIN coordination, SPICe+ filing, PAN and TAN issuance, and handover of incorporation documents. It is written with enough depth to test service cards, detail pages, admin forms, and rich description rendering.</p>',
        benefits: json(['Limited liability protection', 'Investor-ready structure', 'Separate legal identity', 'Improved vendor and banking credibility', 'Clear ownership through shareholding']),
        process: json([
          { title: 'Business structure review', desc: 'Understand the founder profile, shareholding plan, proposed activity, and immediate compliance needs.' },
          { title: 'Document preparation', desc: 'Prepare director KYC, registered office proof, consent documents, MOA, AOA, and incorporation forms.' },
          { title: 'MCA filing', desc: 'Submit the SPICe+ application, respond to resubmission notes if any, and track approval through the MCA portal.' },
          { title: 'Final handover', desc: 'Share certificate of incorporation, PAN, TAN, digital records, and a post-incorporation compliance checklist.' },
        ]),
        documents: json(['PAN card of directors', 'Aadhaar card of directors', 'Passport-size photographs', 'Registered office proof', 'NOC from owner', 'Latest utility bill']),
        eligibility: '<ul><li>Minimum two directors and two shareholders.</li><li>At least one director must be resident in India.</li><li>Registered office address must be available in India.</li><li>Proposed company name should be unique and legally acceptable.</li></ul>',
        features: json(['Name approval guidance', 'MOA and AOA drafting', 'PAN and TAN support', 'Post-incorporation checklist', 'Admin-ready long description']),
        pricing: 'INR 4,999 - 8,999',
        registrationTime: '7-10 working days',
        order: 1,
        seriesId: registration.id,
      },
      {
        name: 'Demo MSME Loan Assistance',
        slug: 'demo-msme-loan-assistance',
        description: '<p>MSME loan assistance helps business owners prepare a lender-ready file for working capital, machinery purchase, expansion, or cash-flow support.</p><p>This demo service includes eligibility screening, business profile writing, financial document review, projected cash-flow preparation, bank coordination, and follow-up tracking. The content is intentionally detailed so client demos show a realistic funding workflow instead of a single-line sample entry.</p>',
        benefits: json(['Loan readiness review', 'Bank coordination', 'Financial document support', 'Clear funding use case', 'Improved application presentation']),
        process: json([
          { title: 'Eligibility check', desc: 'Review business age, turnover, banking history, existing loans, credit score, and required funding amount.' },
          { title: 'File preparation', desc: 'Prepare business profile, projections, document checklist, and loan application summary.' },
          { title: 'Lender matching', desc: 'Identify suitable banks, NBFCs, or government-backed schemes based on profile and loan purpose.' },
          { title: 'Follow-up support', desc: 'Track queries, coordinate missing documents, and support until approval, rejection, or next-step recommendation.' },
        ]),
        documents: json(['Business PAN', 'Udyam certificate', 'GST certificate if applicable', 'Last 12 months bank statement', 'ITR or financial statements', 'KYC of proprietor, partners, or directors']),
        eligibility: '<p>Suitable for active businesses with basic financial records, bank transactions, and a clear use case for working capital, machinery, expansion, or order execution.</p>',
        features: json(['Eligibility screening', 'Financial deck support', 'Loan application summary', 'Bank query coordination', 'Follow-up status tracking']),
        pricing: 'Consultation based',
        registrationTime: '10-20 working days',
        order: 1,
        seriesId: funding.id,
      },
    ],
    skipDuplicates: true,
  })

  await db.scheme.upsert({
    where: { slug: 'demo-startup-prototype-grant' },
    update: {},
    create: {
      title: 'Demo Startup Prototype Grant',
      slug: 'demo-startup-prototype-grant',
      description: 'A realistic demo scheme for early-stage startups that need prototype validation, product trials, market-entry planning, and structured application support before approaching incubators or government-backed funding programs.',
      benefits: json(['Prototype development support', 'Market validation assistance', 'Application file preparation', 'Incubator coordination', 'No-equity funding guidance']),
      eligibility: 'Early-stage startups with an innovative idea, basic founder documents, a defined problem statement, and a prototype or proof-of-concept plan.',
      category: 'Startup',
      image: '/uploads/demo-scheme.jpg',
      isActive: true,
      order: 1,
    },
  })

  await db.blogPost.upsert({
    where: { slug: 'demo-business-structure-guide' },
    update: {},
    create: {
      title: 'Demo Guide: Choosing the Right Business Structure',
      slug: 'demo-business-structure-guide',
      excerpt: 'A practical demo blog post explaining when to choose proprietorship, partnership, LLP, OPC, or Private Limited registration for an Indian business.',
      content: '## Why structure matters\n\nChoosing a business structure affects liability, taxation, fundraising, credibility, and annual compliance. A small service business may start with a simple structure, while a startup planning to raise investor capital usually needs a Private Limited Company.\n\n## Common options\n\n- Proprietorship is simple but does not provide separate legal identity.\n- Partnership works for small teams but needs a strong deed and clear profit-sharing terms.\n- LLP gives operational flexibility with limited liability.\n- OPC suits solo founders who want a corporate structure.\n- Private Limited Company is best for investor-ready and scalable businesses.\n\n## Demo takeaway\n\nThis seeded article is long enough to test markdown rendering, excerpt cards, featured sorting, and detail-page spacing during client demos.',
      coverImage: '/uploads/demo-blog.jpg',
      category: 'Registration',
      tags: json(['testing', 'registration']),
      readTime: '3 min read',
      isPublished: true,
      isFeatured: true,
      order: 1,
    },
  })

  await db.contentArticle.upsert({
    where: { slug: 'demo-gst-compliance-checklist' },
    update: {},
    create: {
      title: 'Demo GST Compliance Checklist for MSMEs',
      slug: 'demo-gst-compliance-checklist',
      excerpt: 'A detailed demo knowledge-base article covering GST registration, monthly returns, input tax credit checks, invoicing, and annual compliance.',
      content: '## GST compliance overview\n\nGST compliance is more than registration. Businesses must maintain proper invoices, reconcile input tax credit, file periodic returns, and respond to portal notices on time.\n\n## Monthly checklist\n\n1. Reconcile sales invoices with GSTR-1.\n2. Match purchase records with GSTR-2B.\n3. Review input tax credit eligibility.\n4. File GSTR-3B and pay tax before the due date.\n5. Keep e-way bill and e-invoice records where applicable.\n\n## Why this matters\n\nGood GST records reduce penalties, improve lender confidence, and make annual filings easier. This demo article gives the client enough content to review article layouts and admin editing flows.',
      coverImage: '/uploads/demo-content.jpg',
      category: 'Compliance',
      readTime: '4 min read',
      isPublished: true,
      isFeatured: true,
      order: 1,
    },
  })

  await db.career.upsert({
    where: { slug: 'demo-business-analyst' },
    update: {},
    create: {
      title: 'Demo Business Analyst',
      slug: 'demo-business-analyst',
      location: 'Ahmedabad',
      type: 'Full Time',
      experience: '1-3 years',
      description: 'A demo career listing for a business analyst who can speak with MSME clients, collect business requirements, prepare documentation checklists, coordinate with compliance teams, and keep client cases moving through registration, certification, and funding workflows.',
      requirements: json(['Client communication and follow-up discipline', 'Documentation and checklist preparation', 'Basic finance and compliance understanding', 'Ability to prepare business summaries and status notes', 'Comfort working with CRM or admin-panel workflows']),
      department: 'Operations',
      salary: 'INR 3,00,000 - 5,00,000 per annum',
    },
  })

  await db.contactInquiry.createMany({
    data: [
      {
        name: 'Aarav Shah',
        email: 'aarav.shah@example.com',
        phone: '+91 91111 11111',
        subject: 'Need registration and food license package',
        message: 'I am starting a packaged snacks brand in Ahmedabad and need help with Private Limited registration, GST registration, FSSAI license, trademark filing, and basic compliance guidance. Please share the expected timeline, document list, and whether you can provide one combined onboarding package.',
        businessType: 'Manufacturing',
        fundingAmount: 'INR 10,00,000',
        inquiryType: 'service',
        isRead: false,
        status: 'new',
      },
      {
        name: 'Meera Iyer',
        email: 'meera.iyer@example.com',
        phone: '+91 92222 22222',
        subject: 'Application for Business Analyst role',
        message: 'I have two years of experience handling client coordination, documentation, and government portal filing for a local consultancy. I am interested in the Business Analyst role and have attached my resume for review.',
        resumeUrl: '/uploads/demo-resume.pdf',
        experience: '2 years',
        inquiryType: 'career',
        filePath: '/uploads/demo-resume.pdf',
        fileType: 'application/pdf',
        fileName: 'meera-iyer-resume.pdf',
        isRead: true,
        status: 'in_progress',
      },
    ],
  })

  await db.testimonial.createMany({
    data: [
      {
        name: 'Nikhil Desai',
        company: 'Desai Engineering Works',
        role: 'Founder',
        content: 'The demo team helped us convert a scattered registration and loan requirement into a clear action plan. They prepared the Udyam registration, GST documentation, and loan file in a structured way, and the status updates were easy to follow from the first call to final submission.',
        rating: 5,
        avatarUrl: '/uploads/demo-avatar-1.jpg',
        order: 1,
      },
      {
        name: 'Kavya Menon',
        company: 'Urban Roots Foods',
        role: 'Owner',
        content: 'We used the platform demo for FSSAI, GST, trademark, and funding readiness content. The service pages felt complete because they explained documents, timelines, benefits, and next steps instead of only showing short marketing lines.',
        rating: 4,
        avatarUrl: '/uploads/demo-avatar-2.jpg',
        order: 2,
      },
    ],
  })

  await db.teamMember.createMany({
    data: [
      {
        name: 'Nisha Mehta',
        role: 'Operations Lead',
        bio: 'Nisha manages client onboarding, document checklists, service timelines, and internal handoffs between registration, compliance, and funding teams. Her demo profile is intentionally detailed to verify team cards and admin edit forms.',
        avatarUrl: '/uploads/demo-team-1.jpg',
        linkedin: 'https://linkedin.com/in/nisha-mehta-demo',
        order: 1,
      },
      {
        name: 'Rohan Trivedi',
        role: 'Compliance Advisor',
        bio: 'Rohan advises MSME clients on GST, ROC, Udyam, and annual compliance tasks. He reviews records, flags missing documents, and prepares practical compliance calendars for founders who need predictable follow-up.',
        avatarUrl: '/uploads/demo-team-2.jpg',
        linkedin: 'https://linkedin.com/in/rohan-trivedi-demo',
        order: 2,
      },
    ],
  })

  await db.fAQ.createMany({
    data: [
      {
        question: 'Can this demo data be used for a client walkthrough?',
        answer: 'Yes. The demo seed is designed for local client walkthroughs and QA. It includes realistic business services, long descriptions, sample inquiries, career applications, testimonials, team profiles, FAQs, and counters so both the public website and admin panel have meaningful content.',
        category: 'Demo',
        order: 1,
      },
      {
        question: 'What are the demo admin credentials?',
        answer: 'Use test-admin@anirahadvisory.local with password test123.',
        category: 'Demo',
        order: 2,
      },
      {
        question: 'Why are service descriptions longer in this seed?',
        answer: 'Short descriptions make cards, detail pages, and admin previews look unfinished. The demo seed uses larger descriptions so spacing, rich text, mobile layout, and client-facing copy can be reviewed properly before production content is finalized.',
        category: 'Content',
        order: 3,
      },
    ],
  })

  await db.stat.createMany({
    data: [
      { label: 'Demo Clients', value: 740, suffix: '+', icon: 'users', color: '#2563EB', order: 1 },
      { label: 'States Covered', value: 10, suffix: '+', icon: 'map-pin', color: '#059669', order: 2 },
      { label: 'Projects Executed', value: 380, suffix: '+', icon: 'briefcase', color: '#D97706', order: 3 },
      { label: 'Client Rating', value: 5, suffix: '/5', icon: 'star', color: '#DC2626', order: 4 },
    ],
  })

  console.log('Test database seeded successfully.')
  console.log('Admin: test-admin@anirahadvisory.local / test123')
}

main()
  .catch((error) => {
    console.error('Test seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

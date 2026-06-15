import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/password'

function enrichSubServiceDescription(name: string, description: string, seriesName: string) {
  const plainText = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  if (description.includes('<p>') && plainText.length >= 220) {
    return description
  }

  const intro = description.includes('<')
    ? description
    : `<p>${description}</p>`

  return `${intro}<p>Our ${name} service gives founders and MSME owners a complete execution path instead of only basic form filling. The team reviews your business model, current documents, eligibility, timelines, and compliance risks before preparing the application, so the submission is cleaner and easier to track.</p><p>Under the ${seriesName} series, we coordinate documentation, portal filing, follow-ups, corrections, and final handover with practical guidance for what should be done after approval. This helps clients avoid repeated rejections, missed deadlines, and incomplete records while keeping the process transparent from start to finish.</p>`
}

async function main() {
  console.log('🌱 Seeding Anirah Advisory database...\n')

  // ─── Clear existing data ───
  console.log('  → Clearing existing data...')
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

  // ─── 1. Admin User ───
  console.log('  → Creating admin user...')
  await db.admin.upsert({
    where: { email: 'admin@anirahadvisory.in' },
    update: {},
    create: {
      email: 'admin@anirahadvisory.in',
      password: hashPassword('admin123'),
      name: 'Anirah Advisory Admin',
      role: 'admin',
    },
  })

  // ─── 2. Site Settings ───
  console.log('  → Creating site settings...')
  const settings: Record<string, string> = {
    company_name: 'Anirah Advisory',
    company_tagline: 'Sada Grow Karo — Buland Sapnon ke Saath',
    company_description:
      "India's trusted MSME funding and business consultancy platform. We empower entrepreneurs and businesses to start, operate, and scale with comprehensive end-to-end solutions.",
    phone: '+91 9998006734',
    email: 'support@bharat-edge.com',
    address: 'Ahmedabad, Gujarat, India',
    website: 'https://bharat-edge.com',
    google_rating: '4.7',
    experience_years: '40',
    team_size: '50',
    states_covered: '36',
    projects_executed: '500',
    google_reviews: '1950',
    phone2: '+91 9876543210',
    email2: 'info@anirahadvisory.in',
    youtube: 'https://youtube.com/@anirahadvisory',
    instagram: 'https://instagram.com/anirahadvisory',
    twitter: 'https://x.com/anirahadvisory',
    linkedin: 'https://linkedin.com/company/anirahadvisory',
    facebook: 'https://facebook.com/anirahadvisory',
    hero_title: 'Buland Sapnon ke Saath Anirah Advisory',
    hero_subtitle:
      'Buland Sapnon ke Saath — From registration to funding, we simplify everything for startups, MSMEs, and entrepreneurs across India.',
    hero_badge: 'Trusted by 1,950+ Businesses | Rated 4.7★ on Google',
    announcement:
      '🎉 Startup India 2025 Applications Open — Get 100% Tax Exemption for 3 Years',
    mission:
      'We are on a mission to grow every business. Our mission is to provide comprehensive, reliable, and affordable business solutions that empower entrepreneurs and MSMEs across India to start, operate, and scale their businesses with confidence.',
    vision:
      'Our vision is to be India\'s most trusted one-stop business consultancy — known for transparency, expertise, and results. We aim to serve 100,000+ businesses by 2030.',
    about_text:
      'Anirah Advisory is an Ahmedabad-based consultancy committed to empowering businesses with essential services that drive growth. From company registration to compliance, government schemes to grants — we provide comprehensive business solutions under one roof.',
  }

  Object.assign(settings, {
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
    experience_years: '4',
    hero_title: 'Start. Scale. Succeed with Anirah Advisory',
    hero_subtitle:
      'From Startup India recognition and tax exemption to seed funding, registration, compliance, branding, and digital growth, we help founders build with confidence.',
    hero_badge: 'Trusted advisory for startups, MSMEs, and entrepreneurs',
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
  })

  for (const [key, value] of Object.entries(settings)) {
    await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  // ─── 3. Service Series ───
  console.log('  → Creating service series...')
  const seriesData = [
    {
      name: 'AARAMBH',
      slug: 'registration',
      icon: 'clipboard-list',
      tagline: 'Registration | 7 Services',
      description:
        'Start your business journey with the right legal structure. From Private Limited to Section 8 companies, we handle complete registration with expert guidance and end-to-end support.',
      accentColor: '#DC2626',
      order: 1,
    },
    {
      name: 'KAVACH',
      slug: 'legal-ip',
      icon: 'shield',
      tagline: 'Legal & IP Protection | 4 Services',
      description:
        'Shield your business with comprehensive legal protection — trademark, patent, copyright registration, and labor compliance. Expert legal counsel for your every need.',
      accentColor: '#059669',
      order: 2,
    },
    {
      name: 'PRAMANIT',
      slug: 'certifications',
      icon: 'award',
      tagline: 'Certifications | 12 Services',
      description:
        'Get certified and build trust. Startup India, GeM, ISO, FSSAI, MSME/Udyam, GST, IEC, NSIC, ZED, and more to boost your business credibility and unlock new opportunities.',
      accentColor: '#2563EB',
      order: 3,
    },
    {
      name: 'NIDHI',
      slug: 'grants',
      icon: 'gift',
      tagline: 'Grants & Funding | 7 Services',
      description:
        'Access government grants and funding schemes including Seed Fund, Agri Preneurs, MSME Design, TIDE, NIDHI Prayas, and more to fuel your business growth without diluting equity.',
      accentColor: '#7C3AED',
      order: 4,
    },
    {
      name: 'VIKAS',
      slug: 'loans',
      icon: 'landmark',
      tagline: 'Funding & Loans | 7 Services',
      description:
        'Secure business loans from top banks and NBFCs. Venture Capital, CGTMSE, MUDRA, PMEGP, PMFME, and more with competitive interest rates and fast disbursement.',
      accentColor: '#D97706',
      order: 5,
    },
    {
      name: 'VISTAR',
      slug: 'branding',
      icon: 'palette',
      tagline: 'Branding & Growth | 3 Services',
      description:
        'Build a powerful business identity with Bhaskar ID, professional Financial Decks, and Investor Pitch Decks. Transform your business into an investor-ready and market-ready brand.',
      accentColor: '#DB2777',
      order: 6,
    },
    {
      name: 'PRABANDHIT',
      slug: 'compliance',
      icon: 'check-circle',
      tagline: 'Compliance | 4 Services',
      description:
        'Stay compliant year-round with ROC filing for Pvt Ltd and LLP, GST compliances, and Income Tax compliances. Expert support for all regulatory requirements.',
      accentColor: '#0891B2',
      order: 7,
    },
  ]

  const seriesRecords = []
  for (const s of seriesData) {
    const record = await db.serviceSeries.create({ data: s })
    seriesRecords.push(record)
  }

  // ─── 4. Sub Services ───
  console.log('  → Creating sub services...')
  const subservicesBySlug: Record<string, { name: string; description: string; features: string[]; pricing: string; benefits: string[]; process: { title: string; desc: string }[]; documents: string[]; eligibility: string; registrationTime: string }[]> = {
    registration: [
      {
        name: 'Private Limited Company Incorporation',
        description:
          '<p>Register your business as a Private Limited Company — the most preferred structure for startups and growing businesses in India. Offers limited liability protection and easy access to funding.</p><p>A Private Limited Company provides the highest level of credibility, making it easier to raise capital, attract talent, and establish trust with partners and clients. Our end-to-end incorporation service handles everything from name reservation to certificate of incorporation.</p>',
        features: [
          'Limited liability protection for shareholders',
          'Easy transfer of shares and ownership',
          'Separate legal entity status',
          'Access to venture capital and angel funding',
          'Enhanced brand credibility and trust',
        ],
        benefits: ['Limited Liability', 'Easy Funding Access', 'Brand Credibility', 'Perpetual Succession', 'Tax Benefits'],
        process: [
          { title: 'Consultation & Name Check', desc: 'We discuss your business structure, check name availability on MCA portal, and finalize the company name.' },
          { title: 'Document Preparation', desc: 'Prepare MOA, AOA, and all incorporation documents with proper digital signatures.' },
          { title: 'Filing & Registration', desc: 'File SPICe+ form with MCA for company incorporation, PAN, TAN, and GST registration.' },
          { title: 'Certificate & Handover', desc: 'Receive Certificate of Incorporation, PAN, TAN, and all compliance documents.' },
        ],
        documents: ['PAN Card of Directors', 'Aadhaar Card of Directors', 'Passport Size Photos', 'Address Proof of Registered Office', 'Rent Agreement / NOC', 'Utility Bill (Not older than 2 months)'],
        eligibility: '<ul><li>Minimum 2 directors required</li><li>Minimum 2 shareholders required</li><li>At least one director must be a resident of India</li><li>Registered office address within India</li><li>No minimum capital requirement</li></ul>',
        registrationTime: '7-10 working days',
        pricing: '₹4,999 - ₹8,999',
      },
      {
        name: 'One Person Company Registration',
        description:
          '<p>A One Person Company allows a single entrepreneur to enjoy limited liability while running a corporate entity. Perfect for solo founders who want a formal business structure.</p><p>OPC provides the benefits of a private limited company with the simplicity of a sole proprietorship. It automatically converts to Pvt Ltd when turnover exceeds ₹2 Crore.</p>',
        features: [
          'Single member can incorporate a company',
          'Limited liability protection',
          'Separate legal entity status',
          'Easy conversion to Pvt Ltd when needed',
          'Nominee director requirement for continuity',
        ],
        benefits: ['Single Owner Operation', 'Limited Liability', 'Separate Legal Entity', 'Easy to Convert', 'Professional Image'],
        process: [
          { title: 'Consultation & Planning', desc: 'Discuss business goals, eligibility, and choose nominee director.' },
          { title: 'Document Preparation', desc: 'Prepare MOA, AOA, consent from nominee, and all required documents.' },
          { title: 'Filing & Registration', desc: 'File SPICe+ form with MCA for OPC incorporation with PAN and TAN.' },
          { title: 'Certificate & Handover', desc: 'Receive Certificate of Incorporation and all compliance documents.' },
        ],
        documents: ['PAN Card of Director', 'Aadhaar Card', 'Passport Size Photo', 'Address Proof of Registered Office', 'Nominee Consent Letter', 'Rent Agreement / NOC'],
        eligibility: '<ul><li>Only one natural person as member</li><li>One nominee director required</li><li>Director must be a resident of India</li><li>Minimum paid-up capital: ₹1 Lakh</li><li>Cannot convert shares or debentures</li></ul>',
        registrationTime: '7-10 working days',
        pricing: '₹4,499 - ₹7,499',
      },
      {
        name: 'Limited Liability Partnership',
        description:
          '<p>Limited Liability Partnership combines the flexibility of a partnership with the protection of limited liability. Ideal for professional services and small businesses.</p><p>LLP offers the best of both worlds — operational flexibility of a partnership and legal protection of a company. It is widely preferred by CA, CS, and legal professionals.</p>',
        features: [
          'Limited liability for all partners',
          'Lower compliance requirements than Pvt Ltd',
          'No minimum capital requirement',
          'Operational flexibility',
          'Tax advantages over traditional partnerships',
        ],
        benefits: ['Limited Liability', 'Low Compliance', 'Operational Flexibility', 'Tax Advantages', 'No Minimum Capital'],
        process: [
          { title: 'Consultation & Name Reservation', desc: 'Discuss LLP structure, reserve unique business name on MCA portal.' },
          { title: 'Drafting LLP Agreement', desc: 'Draft and finalize LLP agreement with mutual rights and duties.' },
          { title: 'Filing & Incorporation', desc: 'File FiLLiP form with MCA for LLP registration.' },
          { title: 'PAN, TAN & Certificate', desc: 'Obtain PAN, TAN, and Certificate of Incorporation.' },
        ],
        documents: ['PAN Card of Partners', 'Aadhaar Card of Partners', 'Address Proof of Registered Office', 'Passport Size Photos', 'Rent Agreement / NOC', 'Utility Bill'],
        eligibility: '<ul><li>Minimum 2 designated partners required</li><li>At least one partner must be Indian resident</li><li>DPIN (Designated Partner Identification Number) required</li><li>LLP agreement must be filed within 30 days</li></ul>',
        registrationTime: '7-12 working days',
        pricing: '₹3,999 - ₹6,999',
      },
      {
        name: 'Partnership Firm Registration (ROF)',
        description:
          '<p>Register a Partnership Firm for businesses run by two or more partners. A cost-effective way to formalize your business partnership with proper legal documentation through Registrar of Firms.</p><p>ROF registration provides legal recognition to your partnership, enabling you to open bank accounts, file lawsuits, and establish business credibility.</p>',
        features: [
          'Easy and affordable to register',
          'Minimal compliance requirements',
          'Flexible profit-sharing arrangements',
          'Simple dissolution process',
          'No mandatory annual filing',
        ],
        benefits: ['Easy Registration', 'Low Cost', 'Flexible Structure', 'Minimal Compliance', 'Simple Dissolution'],
        process: [
          { title: 'Drafting Partnership Deed', desc: 'Prepare partnership deed with profit sharing, roles, and terms.' },
          { title: 'Document Collection', desc: 'Collect PAN, Aadhaar, address proof from all partners.' },
          { title: 'Filing with Registrar', desc: 'File registration application with Registrar of Firms.' },
          { title: 'Certificate Issuance', desc: 'Receive registration certificate and certified copy of deed.' },
        ],
        documents: ['PAN Card of All Partners', 'Aadhaar Card', 'Address Proof', 'Partnership Deed (Draft)', 'Rent Agreement', 'Passport Size Photos'],
        eligibility: '<ul><li>Minimum 2 partners required</li><li>All partners must be competent to contract (18+ years)</li><li>No maximum limit on number of partners</li><li>Partnership deed on stamp paper</li></ul>',
        registrationTime: '5-7 working days',
        pricing: '₹2,999 - ₹4,999',
      },
      {
        name: 'Section 8 Company',
        description:
          '<p>Register a Section 8 Company for non-profit objectives. These companies are formed for promoting commerce, art, science, sports, education, research, social welfare, religion, charity, or environmental protection.</p><p>Section 8 Companies enjoy tax benefits and government support while maintaining the formal structure of a company. Ideal for NGOs, trusts, and social enterprises.</p>',
        features: [
          'Tax exemptions under Section 12A and 80G',
          'No dividend distribution to members',
          'Government support and recognition',
          'Eligible for foreign funding with FCRA',
          'Enhanced credibility for social initiatives',
        ],
        benefits: ['Tax Exemptions', 'Government Support', 'Foreign Funding Eligible', 'Enhanced Credibility', 'No Dividend Restriction'],
        process: [
          { title: 'Consultation & Planning', desc: 'Discuss objectives, prepare MOA/AOA for Section 8 company.' },
          { title: 'Document Preparation', desc: 'Prepare all incorporation documents with non-profit objectives.' },
          { title: 'License Application', desc: 'File application with Regional Director for Section 8 license.' },
          { title: 'Incorporation & Certificate', desc: 'Obtain license and Certificate of Incorporation.' },
        ],
        documents: ['PAN Card of Directors', 'Aadhaar Card', 'Address Proof', 'MOA & AOA Draft', 'Objectives Description', 'Financial Projections'],
        eligibility: '<ul><li>Minimum 2 directors required</li><li>Promoted for charitable or non-profit purposes</li><li>Intends to apply profits only for promoting objectives</li><li>No dividend payout to members</li><li>Registered office within India</li></ul>',
        registrationTime: '15-20 working days',
        pricing: '₹5,999 - ₹9,999',
      },
      {
        name: '12A and 80G Registration',
        description:
          '<p>Obtain 12A and 80G registrations for your NGO or trust to avail tax exemptions and allow donors to claim tax deductions on their contributions.</p><p>These registrations are essential for any NGO or charitable organization in India. 12A provides income tax exemption while 80G allows donors to claim 50% tax deduction on donations.</p>',
        features: [
          'Section 12A for income tax exemption',
          'Section 80G for donor tax benefits',
          'Essential for NGO credibility',
          'Enables receipt of foreign donations',
          'Strengthens funding applications',
        ],
        benefits: ['Income Tax Exemption', 'Donor Tax Benefits', 'Enhanced Credibility', 'Foreign Donations', 'Funding Access'],
        process: [
          { title: 'Eligibility Check', desc: 'Verify NGO/trust eligibility for 12A and 80G registration.' },
          { title: 'Document Preparation', desc: 'Prepare trust deed, MOA, financial statements, and activity reports.' },
          { title: 'Online Application', desc: 'File Form 10A (12A) and Form 10G (80G) on the Income Tax portal.' },
          { title: 'Approval & Certificate', desc: 'Receive approval and registration certificates from Income Tax Department.' },
        ],
        documents: ['Trust Deed / MOA', 'Registration Certificate', 'PAN Card of NGO', 'PAN & Aadhaar of Trustees', 'Annual Financial Statements', 'Activity Report'],
        eligibility: '<ul><li>NGO or Trust must be registered for at least 1 year (for 80G)</li><li>Must have charitable objectives</li><li>Proper books of accounts maintained</li><li>Annual compliance filings up to date</li></ul>',
        registrationTime: '15-25 working days',
        pricing: '₹3,499 - ₹5,999',
      },
      {
        name: 'NGO Darpan',
        description:
          '<p>Register your NGO on the NITI Aayog NGO Darpan portal — a mandatory requirement for NGOs seeking government funding and grants in India.</p><p>NGO Darpan registration provides a unique ID that is mandatory for applying to any government scheme or receiving government grants. It enhances transparency and credibility.</p>',
        features: [
          'Mandatory for government grant eligibility',
          'NITI Aayog portal registration',
          'Unique NGO ID and registration certificate',
          'Access to government schemes and programs',
          'Enhanced transparency and credibility',
        ],
        benefits: ['Government Grant Access', 'Unique NGO ID', 'Transparency', 'Scheme Eligibility', 'Credibility'],
        process: [
          { title: 'Document Collection', desc: 'Collect NGO registration certificate, PAN, and trust deed.' },
          { title: 'Portal Registration', desc: 'Create account on NITI Aayog NGO Darpan portal.' },
          { title: 'Form Filling', desc: 'Fill in organization details, objectives, and upload documents.' },
          { title: 'Verification & Certificate', desc: 'NITI Aayog verifies and issues unique NGO ID.' },
        ],
        documents: ['NGO Registration Certificate', 'Trust Deed / MOA', 'PAN Card of NGO', 'PAN & Aadhaar of Members', 'Annual Report', 'Activity Details'],
        eligibility: '<ul><li>NGO/Trust must be registered under any law</li><li>Valid PAN card of the organization</li><li>At least 3 years of operation (for some grants)</li><li>Proper accounting records</li></ul>',
        registrationTime: '3-5 working days',
        pricing: '₹1,999 - ₹3,999',
      },
    ],
    'legal-ip': [
      {
        name: 'Shram Suvidha',
        description: '<p>Comprehensive labor law compliance and employee welfare management under the Shram Suvidha Portal. Ensure your business meets all PF, ESI, and labor regulatory requirements.</p><p>We handle all PF, ESI, professional tax, and labor welfare compliance to keep your business fully compliant with Indian labor laws.</p>',
        features: ['PF and ESI registration and filing', 'Professional tax compliance', 'Minimum wages compliance', 'Employee welfare fund management', 'Labor audit and risk assessment'],
        benefits: ['Full Compliance', 'Employee Protection', 'Legal Safety', 'Risk Assessment', 'Audit Support'],
        process: [{ title: 'Assessment', desc: 'Analyze current labor compliance status and identify gaps.' }, { title: 'Registration', desc: 'Register for PF, ESI, and professional tax as required.' }, { title: 'Filing & Returns', desc: 'Monthly/quarterly filing of all labor law returns.' }, { title: 'Audit & Advisory', desc: 'Annual labor audit and ongoing compliance advisory.' }],
        documents: ['PAN Card of Business', 'Business Registration Certificate', 'Employee Details', 'Salary Records', 'Bank Statements'],
        eligibility: '<ul><li>Any business with employees</li><li>Businesses with 10+ employees (PF required)</li><li>Businesses with 20+ employees (ESI required)</li></ul>',
        registrationTime: '3-5 working days',
        pricing: '₹4,999 - ₹9,999',
      },
      {
        name: 'Trademark Registration',
        description: '<p>Protect your brand name, logo, and slogan with trademark registration under the Trade Marks Act, 1999. Safeguard your intellectual property from unauthorized use.</p><p>Trademark registration gives you exclusive rights to your brand nationwide. It strengthens your legal position against infringement and adds significant value to your business.</p>',
        features: ['Exclusive rights to your brand name and logo', 'Legal protection against infringement', 'Nationwide protection under Indian law', 'Enhanced brand value and market trust', 'Valid for 10 years, renewable indefinitely'],
        benefits: ['Exclusive Rights', 'Legal Protection', 'Brand Value', 'Nationwide Coverage', 'Lifetime Protection'],
        process: [{ title: 'Trademark Search', desc: 'Conduct comprehensive search for existing trademarks.' }, { title: 'Application Filing', desc: 'File trademark application with Trademark Registry.' }, { title: 'Examination & Publication', desc: 'Examiner reviews application and publishes in journal.' }, { title: 'Registration Certificate', desc: 'Receive trademark registration certificate after opposition period.' }],
        documents: ['Brand Logo (High Resolution)', 'Business Registration Certificate', 'PAN Card', 'Address Proof', 'Identity Proof of Applicant', 'Power of Attorney'],
        eligibility: '<ul><li>Any individual, business, or LLP can apply</li><li>Brand name/logo must be unique and distinctive</li><li>Applicant must have a valid address in India</li></ul>',
        registrationTime: '12-18 months',
        pricing: '₹1,499 - ₹4,999',
      },
      {
        name: 'Patent Registration',
        description: '<p>Protect your inventions and innovations with patent registration. Get exclusive rights to prevent others from making, using, or selling your invention.</p><p>Patents provide the strongest form of intellectual property protection. They give you exclusive commercial rights for 20 years and can be licensed or sold.</p>',
        features: ['Exclusive rights for 20 years', 'Protection for inventions and processes', 'Commercial advantage over competitors', 'Ability to license or sell patent rights', 'Strong legal protection in India'],
        benefits: ['Exclusive Rights (20 years)', 'Commercial Advantage', 'Licensing Revenue', 'Legal Protection', 'Innovation Recognition'],
        process: [{ title: 'Patentability Search', desc: 'Search existing patents to confirm novelty of invention.' }, { title: 'Patent Drafting', desc: 'Draft detailed patent specification with claims.' }, { title: 'Filing Application', desc: 'File patent application with Indian Patent Office.' }, { title: 'Examination & Grant', desc: 'Examination, publication, and grant of patent.' }],
        documents: ['Invention Description', 'Drawings/Diagrams', 'Claims Document', 'Applicant Identity Proof', 'Power of Attorney', 'Abstract of Invention'],
        eligibility: '<ul><li>Invention must be novel and non-obvious</li><li>Must have industrial applicability</li><li>Not published before filing date</li></ul>',
        registrationTime: '18-36 months',
        pricing: '₹7,999 - ₹15,999',
      },
      {
        name: 'Copyright Registration',
        description: '<p>Register copyright for your original literary, artistic, musical, or dramatic works. Protect creative content from unauthorized copying and distribution.</p><p>Copyright protection is automatic upon creation, but registration provides legal evidence of ownership that is crucial in infringement disputes.</p>',
        features: ['Automatic protection upon creation', 'Legal evidence of ownership', 'Rights for lifetime + 60 years', 'Protection for software, books, music, art', 'Deterrent against unauthorized use'],
        benefits: ['Legal Evidence', 'Lifetime Protection', 'Global Recognition', 'Infringement Deterrent', 'Commercial Rights'],
        process: [{ title: 'Work Assessment', desc: 'Evaluate the work for copyright eligibility.' }, { title: 'Application Preparation', desc: 'Prepare copyright application with work details.' }, { title: 'Filing with Copyright Office', desc: 'File application with Copyright Office, Government of India.' }, { title: 'Registration Certificate', desc: 'Receive copyright registration certificate.' }],
        documents: ['Original Work Copies', 'Author Details', 'Publication Details', 'Identity Proof of Author', 'NOC from Publisher (if applicable)', 'Power of Attorney'],
        eligibility: '<ul><li>Work must be original and creative</li><li>Author must be an Indian citizen or work published in India</li><li>Not a mere idea — must be expressed in tangible form</li></ul>',
        registrationTime: '2-4 months',
        pricing: '₹2,999 - ₹5,999',
      },
    ],
    certifications: [
      {
        name: 'Startup India Certification',
        description:
          'Register under the Startup India initiative by DPIIT to avail tax exemptions, self-certification compliance, easy patent/trademark filing, and access to the Fund of Funds.',
        features: [
          'Tax exemption for 3 consecutive years',
          'Self-certification for compliance',
          'Fast-tracked patent/trademark applications',
          'Access to Fund of Funds (₹10,000 Cr)',
          'Eligibility for government tenders',
        ],
        pricing: '₹2,999 - ₹5,999',
      },
      {
        name: 'GeM Registration',
        description:
          'Get registered on Government e-Marketplace (GeM) to sell your products and services to government departments. Access a ₹2 Lakh crore+ procurement market.',
        features: [
          'Access to government procurement market',
          'Direct selling to government departments',
          'Transparent bidding process',
          'No middlemen or intermediaries',
          'Timely payment guarantee from government',
        ],
        pricing: '₹2,499 - ₹4,999',
      },
      {
        name: 'Tax Exemption Certificate',
        description:
          'Obtain tax exemption certificates under various sections to reduce your tax liability. Includes Section 80G, 12A, 10(23C), and other applicable exemptions.',
        features: [
          'Reduced tax liability for businesses',
          'Donor tax benefit certificates',
          'Charitable institution exemptions',
          'Professional assistance with documentation',
          'Regular renewal and compliance support',
        ],
        pricing: '₹3,499 - ₹7,999',
      },
      {
        name: 'ZED Certificate',
        description:
          'Get ZED (Zero Defect Zero Effect) Certification to demonstrate your commitment to quality manufacturing with zero defects and zero environmental impact.',
        features: [
          'Government-recognized quality certification',
          'Bronze, Silver, Gold, and Platinum levels',
          'Enhanced credibility for MSMEs',
          'Priority in government tenders',
          'Financial assistance from government',
        ],
        pricing: '₹9,999 - ₹24,999',
      },
      {
        name: 'ISO Certificate',
        description:
          'Get ISO certified (9001, 14001, 22000, 27001, 45001) to demonstrate international quality standards compliance and boost your business credibility globally.',
        features: [
          'International quality management standards',
          'Enhanced market credibility and trust',
          'Access to government and private tenders',
          'Improved operational efficiency',
          'Valid for 3 years with annual surveillance',
        ],
        pricing: '₹9,999 - ₹24,999',
      },
      {
        name: 'GST Registration & Certificate',
        description:
          'Complete GST registration and obtain your GSTIN — a 15-digit alphanumeric code mandatory for businesses above the prescribed turnover threshold.',
        features: [
          'GST registration (new/amendment/cancellation)',
          '15-digit GST Identification Number',
          'Input tax credit eligibility',
          'Inter-state business enablement',
          'Required for e-commerce and online platforms',
        ],
        pricing: '₹999 - ₹2,499',
      },
      {
        name: 'FSSAI Certificate',
        description:
          'Obtain FSSAI certificate for your food business — mandatory for all food manufacturers, processors, packagers, distributors, and restaurants in India.',
        features: [
          'Mandatory for all food businesses in India',
          'Basic, State, and Central license categories',
          '14-digit FSSAI license number',
          'Enhanced consumer trust and safety',
          'Required for online food delivery platforms',
        ],
        pricing: '₹1,999 - ₹6,999',
      },
      {
        name: 'IEC Certificate',
        description:
          'Obtain Import Export Code (IEC) from DGFT to start importing and exporting goods and services. Mandatory for any business involved in international trade.',
        features: [
          'Mandatory for international trade',
          'Lifetime validity — no renewal required',
          'Online application process',
          'Applicable to all business types',
          'Enables access to export incentives',
        ],
        pricing: '₹1,499 - ₹3,499',
      },
      {
        name: 'NSIC Certification',
        description:
          'Get registered with National Small Industries Corporation (NSIC) to access government tenders, marketing support, and credit rating for your MSME.',
        features: [
          'Eligibility for government tenders',
          'Marketing assistance and support',
          'Credit rating and performance rating',
          'Technology support and upgradation',
          'Single point registration for government purchases',
        ],
        pricing: '₹4,999 - ₹9,999',
      },
      {
        name: 'Udhyam Registration',
        description:
          'Register under MSME/Udyam to access government benefits including priority lending, interest subsidies, tax benefits, and eligibility for government tenders.',
        features: [
          'Priority sector lending from banks',
          'Interest rate subsidies on loans',
          'Tax benefits and exemptions',
          'Eligibility for government tenders',
          'Free or subsidized credit guarantee',
        ],
        pricing: '₹999 - ₹2,499',
      },
      {
        name: 'GST LUT',
        description:
          'File GST Letter of Undertaking (LUT) for exporting goods and services without paying IGST. Mandatory for exporters to claim tax refunds on exports.',
        features: [
          'Export without paying IGST',
          'Simplified export compliance',
          'Tax refund on exported goods/services',
          'Valid for one financial year',
          'Faster processing of export shipments',
        ],
        pricing: '₹1,499 - ₹2,999',
      },
      {
        name: 'Pasara Certificate',
        description:
          'Obtain Pasara Certificate for food businesses operating in Gujarat. It is a mandatory registration under the Gujarat Food and Drug Control Administration (FDCA).',
        features: [
          'Mandatory for Gujarat food businesses',
          'FDCA registration and compliance',
          'Required alongside FSSAI license in Gujarat',
          'Local food safety regulation adherence',
          'Enables smooth business inspections',
        ],
        pricing: '₹1,499 - ₹2,999',
      },
    ],
    grants: [
      {
        name: 'Seed Fund',
        description:
          'Apply for Startup India Seed Fund Scheme (SISFS) to get financial assistance for proof of concept, prototype development, product trials, and market entry.',
        features: [
          'Funding up to ₹20 Lakh for validation',
          'Up to ₹50 Lakh for market entry',
          'Government of India initiative',
          'No equity dilution required',
          'Support for ideation to commercialization',
        ],
        pricing: '₹2,999 - ₹5,999',
      },
      {
        name: 'Agri Preneurs',
        description:
          'Access government grants and support for agricultural entrepreneurs and agri-tech startups. Includes subsidy schemes, technology support, and market linkage assistance.',
        features: [
          'Grants for agri-tech innovation',
          'Subsidized equipment and infrastructure',
          'Technology transfer and training',
          'Market linkage and supply chain support',
          'Government mentorship programs',
        ],
        pricing: '₹3,999 - ₹7,999',
      },
      {
        name: 'MSME Design',
        description:
          'Apply for MSME Design Scheme to get financial support for product design, development, and innovation. Enhance your product competitiveness through professional design intervention.',
        features: [
          'Funding for product design and development',
          'Professional design consultancy support',
          'Prototype development assistance',
          'Innovation and R&D grants',
          'Enhanced product marketability',
        ],
        pricing: '₹3,499 - ₹7,999',
      },
      {
        name: 'Tide Idea',
        description:
          'TIDE (Technology Innovation for Development of Entrepreneurs) scheme by DST provides financial and technical support for tech-driven startups and innovators.',
        features: [
          'Funding up to ₹50 Lakh per startup',
          'Technical mentoring and incubation',
          'Focus on technology-driven solutions',
          'Support from Department of Science & Technology',
          'Access to institutional resources',
        ],
        pricing: '₹2,999 - ₹5,999',
      },
      {
        name: 'Nidhi Prayas',
        description:
          'NIDHI-PRAYAS (Promoting and Accelerating Young and Aspiring innovators & Startups) provides grants of up to ₹10 Lakh for building prototypes and converting ideas into products.',
        features: [
          'Grant up to ₹10 Lakh for prototype',
          'Idea-to-product conversion support',
          'Incubation facility access',
          'Mentoring from industry experts',
          'No equity dilution',
        ],
        pricing: '₹1,999 - ₹3,999',
      },
      {
        name: 'Seed Support Scheme',
        description:
          'Access seed funding through government-backed Seed Support Scheme for early-stage startups. Get financial assistance for prototype development, market testing, and initial operations.',
        features: [
          'Seed funding for early-stage startups',
          'Support for prototype development',
          'Market testing and validation assistance',
          'Incubation and mentoring support',
          'Government-backed funding mechanism',
        ],
        pricing: '₹2,499 - ₹4,999',
      },
      {
        name: 'Gujarat Innovators',
        description:
          'Access Gujarat government grants and support schemes for innovators and startups in the state. Includes Gujarat Startup Policy benefits, incubation support, and funding assistance.',
        features: [
          'Gujarat Startup Policy benefits',
          'State government funding support',
          'Incubation and acceleration programs',
          'Mentoring from industry leaders',
          'Networking with Gujarat startup ecosystem',
        ],
        pricing: '₹2,999 - ₹5,999',
      },
    ],
    loans: [
      {
        name: 'Venture Capital',
        description:
          'Connect with venture capital firms and angel investors to raise equity funding for your startup. We help you prepare pitch decks, business plans, and facilitate investor meetings.',
        features: [
          'Investor network of 50+ VCs and angel networks',
          'Professional pitch deck preparation',
          'Business plan and financial projections',
          'Due diligence support',
          'Term sheet negotiation assistance',
        ],
        pricing: '₹9,999 - ₹24,999',
      },
      {
        name: 'Working Capital (CGTMSE Loan)',
        description:
          'Secure collateral-free working capital finance under the Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) scheme. Get up to ₹2 Crore without any collateral.',
        features: [
          'Collateral-free loans up to ₹2 Crore',
          'CGTMSE guarantee coverage',
          'Quick processing within 7-15 days',
          'Competitive interest rates',
          'Available from all public sector banks',
        ],
        pricing: '₹2,999 - ₹5,999',
      },
      {
        name: 'NAIFF',
        description:
          'Access National Agriculture and Rural Development Finance (NAIFF) for agri-business, food processing, and rural enterprise loans at subsidized interest rates.',
        features: [
          'Subsidized interest rates for agri-business',
          'Funding for food processing units',
          'Rural enterprise development loans',
          'Long repayment tenure available',
          'Government-backed financing scheme',
        ],
        pricing: '₹2,499 - ₹5,999',
      },
      {
        name: 'PMEGP Loan',
        description:
          'Prime Minister\'s Employment Generation Programme (PMEGP) provides subsidized loans for setting up new micro-enterprises in rural and urban areas with 25-35% subsidy.',
        features: [
          'Subsidy up to 35% of project cost',
          'Loan amounts from ₹1 Lakh to ₹25 Lakh',
          'Margin money subsidy from government',
          'Applicable to manufacturing and service sectors',
          'Priority for women and SC/ST entrepreneurs',
        ],
        pricing: '₹2,999 - ₹5,999',
      },
      {
        name: 'MUDRA Loan',
        description:
          'Access MUDRA loans under Pradhan Mantri Mudra Yojana (PMMY) for micro and small enterprises. Three categories: Shishu, Kishore, and Tarun based on business stage.',
        features: [
          'Loans up to ₹10 Lakh',
          'Three categories: Shishu, Kishore, Tarun',
          'No collateral required',
          'Subsidized interest rates',
          'Available from all public sector banks',
        ],
        pricing: '₹1,499 - ₹3,999',
      },
      {
        name: 'PMFME',
        description:
          'Pradhan Mantri Formalisation of Micro Food Processing Enterprises (PMFME) provides credit-linked subsidy for micro food processing enterprises and FPOs.',
        features: [
          'Credit-linked subsidy up to 35%',
          'Loans up to ₹10 Lakh for micro enterprises',
          'Support for FPOs and SHGs',
          'Seed capital of ₹40,000 for working capital',
          'One-time capital injection assistance',
        ],
        pricing: '₹1,999 - ₹4,999',
      },
      {
        name: 'Maha Udyog Yojna',
        description:
          'Access financial assistance under Maharashtra State Government\'s Maha Udyog Yojna for setting up new industries and expanding existing businesses in the state.',
        features: [
          'State government subsidy schemes',
          'Capital investment subsidies',
          'Interest rate subsidies on loans',
          'Land allotment at concessional rates',
          'Employment generation incentives',
        ],
        pricing: '₹3,999 - ₹7,999',
      },
    ],
    branding: [
      {
        name: 'Bhaskar ID',
        description:
          'Get a unique Bhaskar ID — a verified business identity card that establishes your credibility across platforms. Ideal for MSMEs looking to build trust with clients and partners.',
        features: [
          'Verified business identity badge',
          'Enhanced credibility and market trust',
          'Digital and physical ID card',
          'Verification across government databases',
          'Boosts business profile and visibility',
        ],
        pricing: '₹1,999 - ₹4,999',
      },
      {
        name: 'Financial Deck',
        description:
          'Professional financial deck preparation for your business — including financial projections, revenue models, cost analysis, and growth strategies for bank loans and internal planning.',
        features: [
          '5-year financial projections',
          'Revenue and cost analysis models',
          'Break-even and profitability analysis',
          'Professional presentation format',
          'Customized for loan applications',
        ],
        pricing: '₹7,999 - ₹19,999',
      },
      {
        name: 'Investor Deck',
        description:
          'Compelling investor pitch deck with market analysis, business model, team overview, and financial projections. Designed to help you secure funding from VCs and angel investors.',
        features: [
          'Market opportunity and TAM analysis',
          'Business model and value proposition',
          'Competitive landscape analysis',
          'Team and advisory board overview',
          'Investment ask and use of funds breakdown',
        ],
        pricing: '₹14,999 - ₹39,999',
      },
    ],
    compliance: [
      {
        name: 'ROC Compliance for Pvt Ltd',
        description:
          'Ensure your Private Limited Company stays compliant with mandatory annual ROC filings including AOC-4, MGT-7, ADT-1, and DIR-3 KYC for directors.',
        features: [
          'AOC-4 (Financial Statements) filing',
          'MGT-7 (Annual Return) filing',
          'ADT-1 (Auditor Appointment) filing',
          'DIR-3 KYC for directors',
          'Board resolution preparation',
        ],
        pricing: '₹2,999 - ₹5,999',
      },
      {
        name: 'ROC Compliance for LLP',
        description:
          'Ensure your LLP stays compliant with mandatory annual filings including Form 8 (Statement of Account) and Form 11 (Annual Return) with the Registrar of Companies.',
        features: [
          'Form 8 (Statement of Account) filing',
          'Form 11 (Annual Return) filing',
          'Partner KYC compliance',
          'LLP agreement amendments',
          'Annual compliance calendar management',
        ],
        pricing: '₹1,999 - ₹4,999',
      },
      {
        name: 'GST Compliances',
        description:
          'Complete GST compliance services including registration, monthly/quarterly return filing (GSTR-1, GSTR-3B), annual return (GSTR-9), GST audit support, and e-way bill management.',
        features: [
          'GST registration (new/amendment/cancellation)',
          'Monthly/quarterly GSTR filing',
          'Annual return (GSTR-9) preparation',
          'GST audit support',
          'E-way bill and invoicing compliance',
        ],
        pricing: '₹2,999 - ₹7,999',
      },
      {
        name: 'Income Tax Compliances',
        description:
          'Professional income tax return filing for individuals, businesses, and companies. Includes TDS filing, advance tax computation, and notice handling for full tax compliance.',
        features: [
          'ITR filing for all categories',
          'Tax planning and optimization',
          'TDS return filing and reconciliation',
          'Advance tax computation',
          'Notice handling and assessment support',
        ],
        pricing: '₹1,499 - ₹9,999',
      },
    ],
  }

  for (const series of seriesRecords) {
    const subservices = subservicesBySlug[series.slug]
    if (!subservices) continue

    for (let i = 0; i < subservices.length; i++) {
      const sub = subservices[i]
      const slug = sub.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      await db.subService.create({
        data: {
          name: sub.name,
          slug,
          description: enrichSubServiceDescription(sub.name, sub.description, series.name),
          features: JSON.stringify(sub.features),
          benefits: JSON.stringify(sub.benefits || []),
          process: JSON.stringify(sub.process || []),
          documents: JSON.stringify(sub.documents || []),
          eligibility: sub.eligibility || '',
          registrationTime: sub.registrationTime || '',
          pricing: sub.pricing,
          order: i + 1,
          seriesId: series.id,
        },
      })
    }
  }

  // ─── 4b. Government Schemes ───
  console.log('  → Creating government schemes...')
  const schemes = [
    {
      title: 'Startup India Seed Fund Scheme (SISFS)',
      slug: 'startup-india-seed-fund',
      description: 'Financial assistance for proof of concept, prototype development, product trials, and market entry. Supports startups from ideation to commercialization.',
      benefits: JSON.stringify(['Funding up to ₹20 Lakh for validation', 'Up to ₹50 Lakh for market entry', 'No equity dilution required', 'Government of India initiative']),
      eligibility: 'Startups recognized by DPIIT, incorporated less than 10 years ago, working on innovative products/services.',
      category: 'Funding',
      order: 1,
    },
    {
      title: 'MUDRA Loan (PMMY)',
      slug: 'mudra-loan-pmmy',
      description: 'Micro Units Development and Refinance Agency loans under Pradhan Mantri Mudra Yojana for micro and small enterprises with three categories based on business stage.',
      benefits: JSON.stringify(['Loans up to ₹10 Lakh', 'No collateral required', 'Three categories: Shishu, Kishore, Tarun', 'Subsidized interest rates']),
      eligibility: 'Any Indian citizen who is an entrepreneur, micro or small business owner.',
      category: 'Loans',
      order: 2,
    },
    {
      title: 'CGTMSE Loan Scheme',
      slug: 'cgtmse-collateral-free-loan',
      description: 'Credit Guarantee Fund Trust for Micro and Small Enterprises provides collateral-free loans up to ₹2 Crore for MSMEs.',
      benefits: JSON.stringify(['Collateral-free loans up to ₹2 Crore', 'Quick processing within 7-15 days', 'Available from all public sector banks', 'Competitive interest rates']),
      eligibility: 'New and existing micro and small enterprises in manufacturing and service sectors.',
      category: 'Loans',
      order: 3,
    },
    {
      title: 'PMEGP Loan',
      slug: 'pmegp-loan-subsidy',
      description: "Prime Minister's Employment Generation Programme provides subsidized loans for setting up new micro-enterprises in rural and urban areas.",
      benefits: JSON.stringify(['Subsidy up to 35% of project cost', 'Loan from ₹1 Lakh to ₹25 Lakh', 'Margin money subsidy from government', 'Priority for women and SC/ST entrepreneurs']),
      eligibility: 'Any person above 18 years, new micro-enterprises in manufacturing and service sectors.',
      category: 'Loans',
      order: 4,
    },
    {
      title: 'NIDHI-PRAYAS Scheme',
      slug: 'nidhi-prayas-prototype-funding',
      description: 'NIDHI-PRAYAS provides grants of up to ₹10 Lakh for building prototypes and converting ideas into products for young innovators and startups.',
      benefits: JSON.stringify(['Grant up to ₹10 Lakh for prototype', 'Idea-to-product conversion support', 'Incubation facility access', 'No equity dilution']),
      eligibility: 'Young innovators and aspiring entrepreneurs with a prototype idea.',
      category: 'Grants',
      order: 5,
    },
    {
      title: 'ZED Certification',
      slug: 'zed-certification-msme',
      description: 'Zero Defect Zero Effect Certification demonstrates commitment to quality manufacturing with zero defects and zero environmental impact for MSMEs.',
      benefits: JSON.stringify(['Government-recognized quality certification', 'Bronze, Silver, Gold, and Platinum levels', 'Priority in government tenders', 'Financial assistance from government']),
      eligibility: 'MSMEs in manufacturing sector with quality management systems.',
      category: 'Certification',
      order: 6,
    },
  ]
  for (const scheme of schemes) {
    await db.scheme.create({ data: scheme })
  }

  // ─── 5. Blog Posts ───
  console.log('  → Creating blog posts...')
  const blogPosts = [
    {
      title: 'How to Get Startup India Certification: Complete 2025 Guide',
      slug: 'startup-india-certification-guide-2025',
      excerpt:
        'Everything you need to know about Startup India Certification — eligibility, documents required, step-by-step registration process, and key benefits including 3-year tax exemption.',
      content: `## What is Startup India Certification?

Startup India Certification is a recognition by the Department for Promotion of Industry and Internal Trade (DPIIT) that provides startups with various benefits including tax exemptions, simplified compliance, and access to funding.

## Key Benefits

### Tax Exemption
- 100% tax exemption for 3 out of the first 10 years
- Exemption on investments above fair market value (Angel Tax exemption)
- Carry forward of losses for up to 10 years

### Funding Support
- Access to Fund of Funds with ₹10,000 crore corpus
- SIDBI Fund of Funds facilitation
- Credit Guarantee Fund for Startups

### Compliance Simplification
- Self-certification for 6 labor laws and 3 environmental laws
- No inspection for 3 years in certain cases
- Faster patent and trademark examination

## Eligibility Criteria

1. Entity must be incorporated/registered in India (for not more than 10 years)
2. Turnover for any financial year must not exceed ₹100 crore
3. Entity must be working towards innovation, improvement of products/services, or scalable business model

## Registration Process

1. Visit the Startup India portal (startupindia.gov.in)
2. Create an account with your email and phone
3. Fill the application form with business details
4. Upload required documents (incorporation certificate, brief description)
5. Receive DPIIT recognition certificate

## Documents Required

- Incorporation certificate
- PAN card of the entity
- Brief description of the innovation/product
- Website/link if available
- Director/Partner details and PAN`,
      coverImage: '/images/blog/startup-india-2025.jpg',
      category: 'Registration',
      tags: JSON.stringify(['Startup India', 'DPIIT', 'Tax Exemption', 'Certification', 'Government Schemes']),
      readTime: '12 min read',
      isPublished: true,
      isFeatured: true,
      order: 1,
    },
    {
      title: 'MSME Udyam Registration: Benefits and Process Explained',
      slug: 'msme-udyam-registration-benefits-process',
      excerpt:
        'Learn why MSME (Udyam) Registration is essential for small businesses in India — from priority lending to government tender eligibility and tax benefits.',
      content: `## What is MSME Registration?

MSME Registration (now called Udyam Registration) is a government registration for Micro, Small, and Medium Enterprises in India. It provides businesses with a unique Udyam Registration Number (URN) and a recognition certificate.

## Revised Classification (Effective 2024)

| Category | Manufacturing | Services |
|----------|-------------|----------|
| Micro | Investment < ₹1 Cr & Turnover < ₹5 Cr | Investment < ₹1 Cr & Turnover < ₹5 Cr |
| Small | Investment < ₹10 Cr & Turnover < ₹50 Cr | Investment < ₹2 Cr & Turnover < ₹50 Cr |
| Medium | Investment < ₹50 Cr & Turnover < ₹250 Cr | Investment < ₹5 Cr & Turnover < ₹250 Cr |

## Key Benefits

### 1. Priority Sector Lending
Banks are mandated to allocate a certain percentage of their lending to MSMEs, making it easier to secure business loans.

### 2. Lower Interest Rates
MSME-registered businesses can access loans at preferential interest rates — typically 1-2% lower than regular rates.

### 3. Government Tender Eligibility
Many government and public sector tenders are reserved exclusively for MSME-registered businesses.

### 4. Tax Benefits
Various tax benefits and exemptions are available to registered MSMEs under different state and central government schemes.

### 5. Credit Guarantee Scheme
The Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) provides collateral-free loans up to ₹2 crore.

## Registration Process

1. Visit udyamregistration.gov.in
2. Enter your Aadhaar number
3. Fill in business details (PAN, GSTIN, bank account)
4. Submit and receive URN instantly
5. Registration is free of cost`,
      coverImage: '/images/blog/msme-registration.jpg',
      category: 'Certification',
      tags: JSON.stringify(['MSME', 'Udyam Registration', 'Small Business', 'Government Benefits', 'Tax']),
      readTime: '7 min read',
      isPublished: true,
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Top 7 Government Grants Every Indian MSME Should Know',
      slug: 'top-government-grants-indian-msme',
      excerpt:
        'Discover the most important government grants and funding schemes for MSMEs — from Seed Fund and NIDHI Prayas to PMEGP and PMFME loans.',
      content: `## Introduction

The Government of India offers numerous grants and funding schemes to support MSMEs. Here are the top 7 schemes every MSME should know about:

## 1. Startup India Seed Fund Scheme (SISFS)

Provides financial assistance for proof of concept, prototype development, product trials, and market entry.

- Funding: Up to ₹20 Lakh for validation, ₹50 Lakh for market entry
- No equity dilution required
- Apply through: Startup India portal

## 2. NIDHI-PRAYAS

Offers grants up to ₹10 Lakh for building prototypes and converting ideas into products.

- Grant: Up to ₹10 Lakh for prototype
- No equity dilution
- Incubation facility access
- Apply through: DST-supported incubators

## 3. PMEGP Loan

Prime Minister's Employment Generation Programme provides subsidized loans for new micro-enterprises.

- Loan: ₹1 Lakh to ₹25 Lakh
- Subsidy: Up to 35% of project cost
- Priority for women and SC/ST entrepreneurs

## 4. PMFME Scheme

Credit-linked subsidy for micro food processing enterprises and Farmer Producer Organizations.

- Credit-linked subsidy up to 35%
- Seed capital of ₹40,000 for working capital
- Apply through: State nodal agencies

## 5. CGTMSE (Collateral-Free Loans)

Credit Guarantee Fund Trust provides collateral-free loans up to ₹2 Crore for micro and small enterprises.

- Loan: Up to ₹2 Crore without collateral
- Coverage: 75-85% guarantee
- Apply through: Any public/private sector bank

## 6. MUDRA Loan

Three categories of loans under Pradhan Mantri Mudra Yojana for micro enterprises.

- Shishu: Up to ₹50,000
- Kishore: ₹50,000 to ₹5 Lakh
- Tarun: ₹5 Lakh to ₹10 Lakh

## 7. TIDE Scheme

Technology Innovation for Development of Entrepreneurs provides funding for tech-driven startups.

- Funding: Up to ₹50 Lakh per startup
- Technical mentoring and incubation
- Apply through: DST-supported institutions`,
      coverImage: '/images/blog/government-grants.jpg',
      category: 'Government Schemes',
      tags: JSON.stringify(['Government Grants', 'MSME Funding', 'PMEGP', 'MUDRA', 'CGTMSE']),
      readTime: '15 min read',
      isPublished: true,
      isFeatured: true,
      order: 3,
    },
    {
      title: 'GeM Registration: How to Sell to Government Departments',
      slug: 'gem-registration-sell-to-government',
      excerpt:
        'Complete guide to Government e-Marketplace (GeM) Registration — benefits, eligibility, documents required, and step-by-step process to start selling to government.',
      content: `## What is GeM?

Government e-Marketplace (GeM) is an online platform created by the Government of India for public procurement of goods and services. It enables businesses to directly sell to government departments, ministries, and public sector undertakings.

## Benefits of GeM Registration

- Access to ₹2 Lakh crore+ government procurement market
- Direct selling without intermediaries
- Transparent and fair bidding process
- Timely payment guarantee (usually within 10 days)
- No registration fee for MSMEs

## Who Can Register?

- Any Indian supplier, manufacturer, or service provider
- MSMEs get special benefits and preferences
- Startups with valid Startup India certification
- Self-help groups and cooperatives

## Documents Required

1. PAN Card of the business
2. GST Registration Certificate
3. Udyam Registration (for MSMEs)
4. Bank account details with cancelled cheque
5. Address proof of business premises
6. Product/service catalog details

## Registration Process

1. Visit gem.gov.in
2. Click on "Register" and select seller/buyer
3. Enter PAN and verify via OTP
4. Fill in business and bank details
5. Upload required documents
6. Complete seller assessment
7. Start listing products/services

## Tips for Success on GeM

- Keep competitive pricing
- Maintain product quality standards
- Respond promptly to bid invitations
- Build a good rating through timely delivery
- Leverage MSME-specific tender opportunities`,
      coverImage: '/images/blog/gem-registration.jpg',
      category: 'Certification',
      tags: JSON.stringify(['GeM', 'Government Marketplace', 'Public Procurement', 'MSME', 'Tenders']),
      readTime: '10 min read',
      isPublished: true,
      isFeatured: false,
      order: 4,
    },
    {
      title: 'GST Registration Guide for MSMEs in India',
      slug: 'gst-registration-guide-msme',
      excerpt:
        'A detailed, step-by-step guide to GST registration for MSMEs in India — who needs it, documents required, online process, and how to file GST returns.',
      content: `## What is GST Registration?

Goods and Services Tax (GST) registration is mandatory for businesses whose annual turnover exceeds the prescribed threshold limit. It is the process of obtaining a unique GST Identification Number (GSTIN) — a 15-digit alphanumeric code.

## Who Needs GST Registration?

### Mandatory Registration
- Businesses with turnover exceeding ₹40 Lakh (₹20 Lakh for services)
- E-commerce operators
- Inter-state suppliers of goods and services
- Casual taxable persons
- Persons required to pay tax under reverse charge

### Voluntary Registration
Businesses below the threshold limit can voluntarily register for GST to avail input tax credit and enhance business credibility.

## Documents Required

1. PAN Card of the business or proprietor
2. Aadhaar Card of the proprietor/partners/directors
3. Business Registration Certificate
4. Bank Account Proof (cancelled cheque or bank statement)
5. Address Proof of business premises
6. Digital Signature (for companies and LLPs)

## Step-by-Step Process

1. Visit gst.gov.in and click on "Services" → "Registration" → "New Registration"
2. Choose the appropriate application type
3. Enter PAN, mobile number, and email address. Verify via OTPs.
4. Complete the detailed application form with all business details
5. Upload all required documents
6. Submit application using DSC or EVC
7. Receive ARN and wait for approval (typically 3-7 working days)

## GST Returns Filing

- GSTR-1: Monthly/quarterly outward supplies
- GSTR-3B: Monthly/quarterly tax liability and payment
- GSTR-9: Annual return (due by December 31)
- GSTR-9C: Reconciliation statement (if turnover exceeds ₹5 Crore)`,
      coverImage: '/images/blog/gst-registration.jpg',
      category: 'Tax',
      tags: JSON.stringify(['GST', 'Registration', 'Tax', 'GSTIN', 'MSME', 'Business Compliance']),
      readTime: '9 min read',
      isPublished: true,
      isFeatured: false,
      order: 5,
    },
    {
      title: 'Private Limited Company vs LLP: Which One to Choose?',
      slug: 'private-limited-vs-llp-comparison',
      excerpt:
        'A detailed comparison between Private Limited Company and LLP — understand key differences in compliance, taxation, liability, and suitability for your business.',
      content: `## Overview

Choosing between a Private Limited Company and a Limited Liability Partnership is one of the most important decisions for business founders. Both offer limited liability, but they differ significantly in structure, compliance, and taxation.

## Key Differences

### Ownership
- **LLP**: Partners own the firm. No shares are issued.
- **Pvt Ltd**: Shareholders own the company through shares.

### Compliance
- **LLP**: Fewer annual filings — LLP Form 8 and Form 11
- **Pvt Ltd**: More filings — AOC-4, MGT-7, ADT-1, DIR-3 KYC

### Taxation
- **LLP**: Income taxed at 30% + surcharge + cess
- **Pvt Ltd**: Income taxed at 25%/30%

### Fundraising
- **LLP**: Cannot issue shares. Fundraising is limited.
- **Pvt Ltd**: Can issue equity shares. Easy access to investors.

### Conversion
- Both LLP and Pvt Ltd can be converted to each other

## When to Choose LLP?

- Service-based business with low capital requirements
- No plans to raise equity funding
- Want lower compliance costs
- Professional services (CA, CS, legal, consulting)

## When to Choose Pvt Ltd?

- Startup planning to raise VC or angel funding
- Want maximum brand credibility
- Plan to scale rapidly across India
- Planning for ESOPs for employees

## Our Recommendation

For most tech startups and businesses planning to raise funding, Private Limited Company is the preferred choice. For professional services and small businesses, LLP offers a cost-effective alternative.`,
      coverImage: '/images/blog/pvt-ltd-vs-llp.jpg',
      category: 'Registration',
      tags: JSON.stringify(['Private Limited', 'LLP', 'Business Structure', 'Registration', 'Startup']),
      readTime: '8 min read',
      isPublished: true,
      isFeatured: false,
      order: 6,
    },
  ]

  for (const post of blogPosts) {
    await db.blogPost.create({ data: post })
  }

  // ─── 6. Content Articles ───
  console.log('  → Creating content articles...')
  const contentArticles = [
    {
      title: 'Complete Guide to Private Limited Company Registration',
      slug: 'private-limited-company-registration-guide',
      excerpt:
        'Learn everything about Private Limited Company registration in India — eligibility, documents required, step-by-step process, costs, and post-incorporation compliance.',
      content: `## Introduction

A Private Limited Company is the most preferred business structure in India for startups and growing businesses. It offers limited liability, easy fundraising, and strong legal protection for shareholders.

## Eligibility Criteria

- Minimum 2 directors and 2 shareholders
- At least 1 director must be a resident of India
- Minimum authorized share capital of ₹1 Lakh
- Registered office address in India

## Documents Required

1. PAN cards of all directors and shareholders
2. Aadhaar cards of all directors
3. Passport-size photographs
4. Proof of registered office address (utility bill, rental agreement)
5. No Objection Certificate (NOC) from property owner
6. Digital Signature Certificates (DSC) for directors
7. Director Identification Numbers (DIN)
8. Memorandum of Association (MoA)
9. Articles of Association (AoA)

## Registration Process

The entire process is now online through the SPICe+ form on the MCA portal. It typically takes 7-10 business days for complete registration.

## Post-Incorporation Requirements

After incorporation, the company must:
- Obtain PAN and TAN
- Open a bank account
- Register for GST (if applicable)
- Issue share certificates within 2 months
- Hold first board meeting within 30 days

## Costs Involved

Registration typically costs between ₹4,999 and ₹8,999 including government fees, DSC, DIN, and professional charges.`,
      coverImage: '/images/articles/pvt-ltd-registration.jpg',
      category: 'Registration',
      readTime: '10 min read',
      isPublished: true,
      isFeatured: true,
      order: 1,
    },
    {
      title: 'FSSAI Certificate: Types, Process and Compliance',
      slug: 'fssai-certificate-types-process-compliance',
      excerpt:
        'Everything about FSSAI Certificate — types, eligibility, application process, fees, renewal, and consequences of operating without a food license in India.',
      content: `## What is FSSAI Certificate?

The Food Safety and Standards Authority of India (FSSAI) license is a mandatory registration/permit for all food businesses in India. It ensures that food products meet safety and quality standards.

## Types of FSSAI License

### Basic Registration
- For businesses with turnover up to ₹12 Lakh
- Small food manufacturers, hawkers, temporary stallholders

### State License
- For businesses with turnover between ₹12 Lakh and ₹20 Crore
- Restaurants, food processors, distributors operating within a state

### Central License
- For businesses with turnover exceeding ₹20 Crore
- Large food manufacturers, importers, exporters

## Application Process

1. Visit FoSCoS portal (foscos.fssai.gov.in)
2. Select the appropriate license type
3. Fill in business and applicant details
4. Upload required documents
5. Pay the fee online
6. Receive license after inspection (for State/Central)

## Validity and Renewal

FSSAI license can be obtained for 1 to 5 years. Renewal should be initiated 30 days before expiry to avoid penalties.`,
      coverImage: '/images/articles/fssai-license.jpg',
      category: 'Certification',
      readTime: '9 min read',
      isPublished: true,
      isFeatured: true,
      order: 2,
    },
    {
      title: 'IEC Certificate for Import Export Business',
      slug: 'iec-certificate-import-export-business',
      excerpt:
        'Complete guide to IEC registration — why you need it, eligibility, documents required, online application process, and how to start your import-export business.',
      content: `## What is Import Export Code (IEC)?

An Import Export Code (IEC) is a 10-digit code issued by the Directorate General of Foreign Trade (DGFT), Government of India. It is mandatory for any business importing or exporting goods and services.

## Key Features

- **Lifetime Validity**: No renewal required
- **Pan-India Applicability**: Single code works across all customs ports
- **Online Application**: Entire process is online
- **No Minimum Requirements**: No minimum turnover or capital requirement

## Documents Required

1. PAN Card of the business/individual
2. Aadhaar Card
3. Business registration proof
4. Bank account details with cancelled cheque
5. Digital photograph of the applicant
6. Address proof of business premises

## Application Process

1. Visit the DGFT website (dgft.gov.in)
2. Navigate to IEC application section
3. Fill in the online application form
4. Upload required documents
5. Pay the application fee of ₹500
6. Receive IEC certificate within 2-3 working days`,
      coverImage: '/images/articles/iec-registration.jpg',
      category: 'Certification',
      readTime: '8 min read',
      isPublished: true,
      isFeatured: false,
      order: 3,
    },
    {
      title: 'ROC Compliance Checklist for Private Limited Companies',
      slug: 'roc-compliance-checklist-pvt-ltd',
      excerpt:
        'Complete annual compliance checklist for Private Limited Companies — AOC-4, MGT-7, ADT-1, DIR-3 KYC, income tax filing, and important deadlines.',
      content: `## Overview

Every Private Limited Company in India must comply with annual regulatory requirements under the Companies Act, 2013. Missing compliance deadlines can result in heavy penalties and even company strike-off.

## Annual Compliance Checklist

### 1. AOC-4 (Financial Statements)
- File within 30 days of Annual General Meeting (AGM)
- Contains balance sheet, profit & loss account, and other financials

### 2. MGT-7 (Annual Return)
- File within 60 days of AGM
- Contains details of shareholders, directors, and company activities

### 3. ADT-1 (Auditor Appointment)
- File within 15 days of AGM
- Appoint or re-appoint company auditor

### 4. DIR-3 KYC
- Annual KYC for all directors
- Due by September 30 every year

### 5. Income Tax Return
- File ITR-6 by October 31 (or November 30 with audit report)
- Applicable even if no income or loss

### 6. GST Return (if registered)
- Monthly GSTR-1 and GSTR-3B
- Annual GSTR-9 by December 31

## Penalty for Non-Compliance

- Late filing fees: ₹100 per day per form
- Additional penalties for repeated non-compliance
- Company may be struck off by ROC`,
      coverImage: '/images/articles/roc-compliance.jpg',
      category: 'Compliance',
      readTime: '7 min read',
      isPublished: true,
      isFeatured: true,
      order: 4,
    },
  ]

  for (const article of contentArticles) {
    await db.contentArticle.create({ data: article })
  }

  // ─── 7. Careers ───
  console.log('  → Creating career listings...')
  const careers = [
    {
      title: 'Business Development Manager',
      slug: 'business-development-manager',
      location: 'Ahmedabad',
      type: 'Full Time',
      experience: '3-6 years',
      description:
        'We are looking for an experienced Business Development Manager to drive growth by identifying new business opportunities, building client relationships, and expanding our market presence across Gujarat and neighboring states.',
      requirements: JSON.stringify([
        'MBA in Marketing or Business Development',
        '3-6 years of experience in B2B business development',
        'Strong understanding of MSME, startup, and corporate sectors',
        'Excellent communication and negotiation skills',
        'Proven track record of meeting revenue targets',
        'Familiarity with business consultancy services is a plus',
      ]),
      department: 'Business Development',
      salary: '₹8,00,000 - ₹12,00,000 per annum',
    },
    {
      title: 'Chartered Accountant',
      slug: 'chartered-accountant',
      location: 'Ahmedabad',
      type: 'Full Time',
      experience: '3-5 years',
      description:
        'Looking for a qualified Chartered Accountant to handle GST compliance, income tax filing, financial audits, and provide advisory services to our diverse client base.',
      requirements: JSON.stringify([
        'CA qualification from ICAI',
        '3-5 years of post-qualification experience',
        'Expert knowledge of GST, Income Tax, and Companies Act',
        'Experience with audit and assurance services',
        'Strong analytical skills and attention to detail',
        'Excellent communication and client management skills',
      ]),
      department: 'Finance',
      salary: '₹8,00,000 - ₹14,00,000 per annum',
    },
    {
      title: 'Legal Consultant',
      slug: 'legal-consultant',
      location: 'Remote',
      type: 'Full Time',
      experience: '5+ years',
      description:
        'Seeking an experienced Legal Consultant to provide expert advice on company law, intellectual property, labor law compliance, and regulatory matters for our clients.',
      requirements: JSON.stringify([
        'LLB degree from a recognized university',
        '5+ years of experience in corporate law',
        'Expertise in Companies Act, IP law, and labor laws',
        'Strong drafting and documentation skills',
        'Ability to handle multiple client cases simultaneously',
        'Prior experience in business consultancy is preferred',
      ]),
      department: 'Legal',
      salary: '₹10,00,000 - ₹15,00,000 per annum',
    },
    {
      title: 'Digital Marketing Specialist',
      slug: 'digital-marketing-specialist',
      location: 'Ahmedabad',
      type: 'Full Time',
      experience: '2-3 years',
      description:
        'We need a creative Digital Marketing Specialist to manage our online presence, run campaigns, and generate leads through various digital channels.',
      requirements: JSON.stringify([
        "Bachelor's degree in Marketing or related field",
        '2-3 years of experience in digital marketing',
        'Hands-on experience with Google Ads, Facebook Ads, and SEO',
        'Proficiency in marketing automation tools',
        'Strong content writing and copywriting skills',
        'Experience in lead generation for B2B services',
      ]),
      department: 'Marketing',
      salary: '₹4,00,000 - ₹6,50,000 per annum',
    },
  ]

  for (const career of careers) {
    await db.career.create({ data: career })
  }

  // ─── 8. Contact Inquiries ───
  console.log('  → Creating sample contact inquiries...')
  const inquiries = [
    {
      name: 'Rajesh Patel',
      email: 'rajesh.patel@example.com',
      phone: '+91 98765 43210',
      subject: 'Need help with Private Limited Company Registration',
      message:
        'Hi, I am planning to start a food processing business in Rajkot, Gujarat. I need assistance with company registration, FSSAI license, and GST registration. Could you please provide a complete package and pricing details?',
      businessType: 'Food Processing',
      fundingAmount: '₹10,00,000',
      isRead: true,
      status: 'in_progress',
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 87654 32109',
      subject: 'Startup India Registration Query',
      message:
        'Hello, I have a tech startup that has been operating for 8 months now. I want to register under Startup India scheme to avail tax benefits. Can you help me with the process and documents needed?',
      businessType: 'Technology',
      fundingAmount: '',
      isRead: false,
      status: 'new',
    },
  ]

  for (const inquiry of inquiries) {
    await db.contactInquiry.create({ data: inquiry })
  }

  // ─── 9. Testimonials ───
  console.log('  → Creating testimonials...')
  const testimonials = [
    {
      name: 'Rajiv Agarwal',
      company: 'Agarwal Manufacturing Pvt Ltd',
      role: 'Managing Director',
      content:
        'Anirah Advisory helped us register our manufacturing unit and obtain all necessary certifications including ISO, ZED, and NSIC. Their team is incredibly knowledgeable about government schemes. We also secured a CGTMSE loan through their assistance. Truly a one-stop solution for MSMEs!',
      rating: 5,
      order: 1,
    },
    {
      name: 'Sneha Kulkarni',
      company: 'FreshBite Foods',
      role: 'Founder',
      content:
        'I was struggling with FSSAI, GST, and Pasara Certificate compliance for my food business in Ahmedabad. Anirah Advisory handled everything end-to-end. They also helped me get registered on GeM, and now I supply to 3 government departments. Their expertise saved me both time and money!',
      rating: 5,
      order: 2,
    },
    {
      name: 'Mohammed Tariq',
      company: 'Tariq Enterprises',
      role: 'Proprietor',
      content:
        'I approached Anirah Advisory for MUDRA Loan assistance. Their team prepared an excellent Financial Deck and helped me navigate the bank loan process. I received ₹8 Lakh within 2 weeks! Their knowledge of government loan schemes is unmatched. Highly recommended for small business owners.',
      rating: 5,
      order: 3,
    },
    {
      name: 'Deepika Patel',
      company: 'GreenTech Innovations',
      role: 'Co-Founder',
      content:
        'Anirah Advisory helped us get Startup India certification and also connected us with NIDHI Prayas for our prototype funding. The Investor Deck they prepared helped us secure our first round of angel investment. Their branding services under VISTAR series are top-notch. Great team, great results!',
      rating: 4,
      order: 4,
    },
  ]

  for (const testimonial of testimonials) {
    await db.testimonial.create({ data: testimonial })
  }

  // ─── 10. Team Members ───
  console.log('  → Creating team members...')
  const teamMembers = [
    {
      name: 'Hitesh Shah',
      role: 'Founder & CEO',
      bio: 'With over 25 years of experience in business consultancy, Hitesh leads Anirah Advisory with a vision to make entrepreneurship accessible to every Indian. He has helped 2,000+ businesses get established.',
      linkedin: 'https://linkedin.com/in/hitesh-shah',
      order: 1,
    },
    {
      name: 'Anjali Patel',
      role: 'Head of Operations',
      bio: 'Anjali oversees all service delivery at Anirah Advisory. With an MBA from IIM-A and 15 years in consulting, she ensures every client receives seamless and efficient service.',
      linkedin: 'https://linkedin.com/in/anjali-patel',
      order: 2,
    },
    {
      name: 'Rohit Joshi',
      role: 'Lead Legal Consultant',
      bio: 'Rohit is a practicing company secretary and legal consultant with expertise in corporate law, IP protection, and regulatory compliance. He has 12+ years of experience.',
      linkedin: 'https://linkedin.com/in/rohit-joshi',
      order: 3,
    },
    {
      name: 'Sneha Verma',
      role: 'Chartered Accountant',
      bio: 'Sneha leads the taxation and compliance team at Anirah Advisory. She specializes in GST, income tax, and corporate compliance with a track record of serving 500+ clients.',
      linkedin: 'https://linkedin.com/in/sneha-verma',
      order: 4,
    },
    {
      name: 'Karan Mehta',
      role: 'Business Development Head',
      bio: 'Karan drives Anirah Advisory\'s growth strategy and client acquisition. His deep understanding of the MSME ecosystem and strong network have been instrumental in Anirah Advisory\'s expansion.',
      linkedin: 'https://linkedin.com/in/karan-mehta',
      order: 5,
    },
    {
      name: 'Pooja Reddy',
      role: 'Digital Marketing Manager',
      bio: 'Pooja manages Anirah Advisory\'s online presence and lead generation. With expertise in SEO, content marketing, and paid campaigns, she ensures Anirah Advisory reaches the right audience.',
      linkedin: 'https://linkedin.com/in/pooja-reddy',
      order: 6,
    },
  ]

  for (const member of teamMembers) {
    await db.teamMember.create({ data: member })
  }

  // ─── 11. FAQs ───
  console.log('  → Creating FAQs...')
  const faqs = [
    {
      question: 'What services does Anirah Advisory offer for new businesses?',
      answer:
        'Anirah Advisory offers comprehensive end-to-end business solutions under 7 service series: AARAMBH (Registration), KAVACH (Legal & IP Protection), PRAMANIT (Certifications), NIDHI (Grants & Funding), VIKAS (Funding & Loans), VISTAR (Branding & Growth), and PRABANDHIT (Compliance). Whether you need company registration, government certifications, business loans, or annual compliance — we handle everything under one roof.',
      category: 'General',
      order: 1,
    },
    {
      question: 'How long does it take to register a Private Limited Company?',
      answer:
        'With Anirah Advisory, the entire registration process takes 7-10 business days. This includes obtaining DSC, DIN, name reservation, and filing the incorporation forms through SPICe+. We ensure the fastest possible turnaround and handle all paperwork on your behalf.',
      category: 'Registration',
      order: 2,
    },
    {
      question: 'What is Startup India Certification and do I need it?',
      answer:
        'Startup India Certification (DPIIT recognition) is a government certification that provides startups with tax exemption for 3 years, self-certification for compliance, fast-tracked patent applications, and access to the ₹10,000 Cr Fund of Funds. If your business is innovative and incorporated for less than 10 years with turnover under ₹100 Cr, you should definitely get this certification.',
      category: 'Registration',
      order: 3,
    },
    {
      question: 'What government grants are available for MSMEs in India?',
      answer:
        'Several government grants are available: Seed Fund Scheme (up to ₹50 Lakh), NIDHI-PRAYAS (up to ₹10 Lakh for prototypes), TIDE (up to ₹50 Lakh for tech startups), PMEGP (subsidy up to 35%), PMFME (credit-linked subsidy for food processing), and CGTMSE (collateral-free loans up to ₹2 Crore). Anirah Advisory helps identify the best scheme for your business and handles the entire application process.',
      category: 'Funding',
      order: 4,
    },
    {
      question: 'How can I get a collateral-free business loan?',
      answer:
        'You can get a collateral-free business loan under the CGTMSE scheme (up to ₹2 Crore) or MUDRA Loan (up to ₹10 Lakh). Anirah Advisory helps you with documentation, Financial Deck preparation, loan application, and bank coordination. Our success rate for loan approvals is over 85%, and we have relationships with 15+ banks and NBFCs.',
      category: 'Funding',
      order: 5,
    },
    {
      question: 'What are the annual compliance requirements for a Private Limited Company?',
      answer:
        'A Private Limited Company must file: AOC-4 (financial statements) within 30 days of AGM, MGT-7 (annual return) within 60 days of AGM, ADT-1 (auditor appointment) within 15 days of AGM, DIR-3 KYC for all directors annually, and income tax return by October 31st. Anirah Advisory offers comprehensive annual compliance packages starting from ₹2,999 under our PRABANDHIT series.',
      category: 'Compliance',
      order: 6,
    },
    {
      question: 'What is GeM Registration and how can it help my business?',
      answer:
        'Government e-Marketplace (GeM) is an online platform for government procurement. Registering on GeM allows you to sell products and services directly to government departments, ministries, and PSUs. It provides access to a ₹2 Lakh crore+ market, ensures timely payments, and offers a transparent bidding process. MSMEs get special preferences on GeM.',
      category: 'Services',
      order: 7,
    },
    {
      question: 'What certifications should my MSME have to grow faster?',
      answer:
        'Key certifications for MSME growth include: Udyam Registration (mandatory for benefits), Startup India Certification (for tax exemption), ISO Certificate (for quality credibility), GeM Registration (for government sales), NSIC Registration (for tenders), and ZED Certificate (for quality manufacturing). Anirah Advisory handles all these under our PRAMANIT series with expert guidance.',
      category: 'Services',
      order: 8,
    },
  ]

  for (const faq of faqs) {
    await db.fAQ.create({ data: faq })
  }

  // ─── 12. Stats ───
  console.log('  → Creating stats...')
  const stats = [
    {
      label: 'Combined Experience',
      value: 40,
      suffix: '+ Years',
      icon: 'calendar',
      color: '#2563EB',
      order: 1,
    },
    {
      label: 'Google Reviews (4.7★)',
      value: 1950,
      suffix: '+',
      icon: 'star',
      color: '#D97706',
      order: 2,
    },
    {
      label: 'Projects Executed',
      value: 500,
      suffix: '+',
      icon: 'briefcase',
      color: '#059669',
      order: 3,
    },
    {
      label: 'Pan India Client Base',
      value: 36,
      suffix: '+',
      icon: 'map-pin',
      color: '#DC2626',
      order: 4,
    },
  ]

  for (const stat of stats) {
    await db.stat.create({ data: stat })
  }

  console.log('\n✅ Database seeded successfully!')
  console.log('  - 1 Admin user')
  console.log('  - 20 Site settings')
  console.log('  - 7 Service series')
  console.log('  - 44 Sub services')
  console.log('  - 6 Blog posts')
  console.log('  - 4 Content articles')
  console.log('  - 4 Career listings')
  console.log('  - 2 Contact inquiries')
  console.log('  - 4 Testimonials')
  console.log('  - 6 Team members')
  console.log('  - 8 FAQs')
  console.log('  - 4 Stats')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

import { db } from '../src/lib/db';

async function main() {
  const subservices = await db.subService.findMany();
  
  const defaultBenefits = ['Expert Consultation', 'End-to-End Support', 'Quick Processing', 'Affordable Pricing', 'Dedicated Manager'];
  const defaultProcess = [
    { title: 'Initial Consultation', desc: 'We discuss your requirements, assess eligibility, and plan the best approach for your needs.' },
    { title: 'Document Collection', desc: 'Our team helps you gather and organize all required documents for the application.' },
    { title: 'Application Filing', desc: 'We prepare and submit the application with all supporting documents to the relevant authority.' },
    { title: 'Approval & Handover', desc: 'Track the application status and deliver the certificate or approval to you upon completion.' },
  ];
  const defaultDocuments = ['PAN Card of Business', 'Business Registration Certificate', 'Address Proof', 'Bank Statements', 'Identity Proof of Directors/Partners'];
  const defaultEligibility = '<ul><li>Registered business entity in India</li><li>Valid PAN and business registration</li><li>Compliant with existing regulations</li><li>All required documents available</li></ul>';
  const regTimes: Record<string, string> = {
    'startup-india-certification': '7-15 working days',
    'gem-registration': '5-10 working days',
    'tax-exemption-certificate': '15-20 working days',
    'zed-certificate': '15-25 working days',
    'iso-certificate': '15-30 working days',
    'gst-registration-certificate': '3-5 working days',
    'fssai-certificate': '7-15 working days',
    'iec-certificate': '3-5 working days',
    'nsic-certification': '15-25 working days',
    'udhyam-registration': '1-2 working days',
    'gst-lut': '1-2 working days',
    'pasara-certificate': '5-10 working days',
    'seed-fund': '30-45 working days',
    'agri-preneurs': '30-45 working days',
    'msme-design': '30-45 working days',
    'tide-idea': '30-45 working days',
    'nidhi-prayas': '30-45 working days',
    'seed-support-scheme': '30-45 working days',
    'gujarat-innovators': '30-45 working days',
    'venture-capital': '30-90 working days',
    'working-capital-cgtmse-loan': '7-15 working days',
    'naiff': '15-30 working days',
    'pmegp-loan': '21-30 working days',
    'mudra-loan': '7-15 working days',
    'pmfme': '21-30 working days',
    'maha-udyog-yojna': '30-45 working days',
    'bhaskar-id': '7-10 working days',
    'financial-deck': '7-10 working days',
    'investor-deck': '10-15 working days',
    'roc-compliance-for-pvt-ltd': '5-7 working days',
    'roc-compliance-for-llp': '5-7 working days',
    'gst-compliances': '3-5 working days',
    'income-tax-compliances': '3-5 working days',
  };

  for (const sub of subservices) {
    let benefits = sub.benefits;
    let process = sub.process;
    let documents = sub.documents;
    let eligibility = sub.eligibility;
    let registrationTime = sub.registrationTime;

    if (!benefits || benefits === '[]') benefits = JSON.stringify(defaultBenefits);
    if (!process || process === '[]') process = JSON.stringify(defaultProcess);
    if (!documents || documents === '[]') documents = JSON.stringify(defaultDocuments);
    if (!eligibility) eligibility = defaultEligibility;
    if (!registrationTime) registrationTime = regTimes[sub.slug] || '7-15 working days';

    let desc = sub.description;
    if (desc && !desc.includes('<p>') && !desc.includes('<')) {
      desc = `<p>${desc}</p>`;
    }

    await db.subService.update({
      where: { id: sub.id },
      data: { benefits, process, documents, eligibility, registrationTime, description: desc },
    });
    console.log(`  Updated: ${sub.name}`);
  }
  
  console.log(`\nDone: Updated ${subservices.length} subservices with new fields.`);
}

main().catch(console.error).finally(() => process.exit(0));

---
## Task ID: 3 - fullstack-developer
### Work Task
Complete redesign of 5 public-facing components (Header, Footer, HomePage, CareerPage, ContactPage) to match reference design with brand colors (#F9B65B gold, #3EC793 green, #010000 near-black).

### Work Summary

**1. Header.tsx - Complete Rewrite:**
- Announcement bar: bg-navy-950 with white text, Track Application link, phone number
- Header: White background with shadow on scroll
- Logo: Company logo from settings or gradient bg square (brand-400 to mint-300) with AA text
- Navigation: Home, Services (dropdown), About Us, Blog, Career, Contact Us
- Services dropdown: 2-column grid with icons and taglines
- Right side: Phone number, Start Funding Journey button (bg-brand-400 text-navy-950)
- Mobile: Sheet sidebar with navigation, social links
- Hidden admin: Long-press (2s) on logo navigates to admin

**2. Footer.tsx - Complete Rewrite:**
- Background: bg-navy-950, 4-column layout
- Company info + social icons with gold hover
- Services from API, Company + Resources links
- Contact info with both phones/emails from settings
- Newsletter subscribe with email input + gold button

**3. HomePage.tsx - Complete Rewrite (10 sections):**
1. Hero: Gold gradient, eligibility card, CTA buttons, trust badges
2. Government Schemes: Grid from /api/schemes
3. Why Choose Us: 4 static cards
4. Why Anirah Advisory: 3 stats with mint-300 color
5. Services Grid: From /api/services with subservice count
6. Success Stories: Card grid (not carousel) from /api/testimonials
7. Pan-India Presence: Dark section with 4 animated stats
8. Insights: 3 blog cards from /api/blog?limit=3
9. FAQ: Accordion from /api/faqs
10. CTA: Gold gradient with consultation + call buttons

**4. CareerPage.tsx - Updated:**
- FileUpload accepts images + PDFs with preview
- inquiryType: career on submit

**5. ContactPage.tsx - Updated:**
- inquiryType: general on submit
- Shows both phone2 and email2 from settings

**Lint Status:** Zero errors.

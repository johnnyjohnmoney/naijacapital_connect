## Why

The current frontend displays placeholder/generic content that does not accurately reflect NaijaConnect Capital's actual business information from the official business plan (December 2025). Key discrepancies include:

1. **Team Information**: Current team members (Adebayo Ogundimu, Kemi Adeleke, Chidi Okafor) are fictional and do not match the actual founding team
2. **Business Description**: Generic descriptions don't capture the unique value proposition of channeling diaspora remittances into pre-vetted investments
3. **Contact Information**: Current contact details are placeholders (info@naijaconnectcapital.com, +234 901 234 5678)
4. **Statistics**: Current stats (₦2.5B+, 1,200+, 85+, 18%) are placeholders not aligned with business projections
5. **Products/Services**: Missing the four core products (RemitConnect, InvestDirect, ImpactTrack Dashboard, Diaspora Learning Hub)
6. **Company Vision**: Missing the specific mission of transforming remittances from consumption into productive capital

**Business Impact:**

- Builds credibility by displaying accurate founding team credentials
- Aligns website content with business plan for investor presentations
- Establishes trust with diaspora investors through transparent company information

## What Changes

**Homepage (page.tsx):**

- Update hero section tagline to emphasize diaspora remittance-to-investment transformation
- Update stats section with projected targets: 10,000 investors by Year 3, ₦3-5B investment target
- Add new product/service section showcasing: RemitConnect, InvestDirect, ImpactTrack Dashboard, Diaspora Learning Hub
- Update features to highlight: Low-cost Remittance Gateway (2% fees vs 4-6% industry), Curated Investment Marketplace, Investment Monitoring & Impact Tracking
- Update testimonials with more representative diaspora locations (UK, USA, Canada, UAE)

**About Page (about/page.tsx):**

- Replace placeholder team with actual founding team:
  - Temitayo Sunmonu-Balogun (CEO) - 10+ years finance/accounting experience
  - Emmanuel Orevba (COO) - Risk profiling, tax compliance, audit management
  - Eric Ojeaga (CFO) - Corporate finance, investment management
  - Kevin Odiley (CTO) - Fintech solutions, full-stack development, blockchain
  - Kikelomo Abikele (Head, Investment & Partnerships) - Investment opportunities, partnerships
- Update mission statement to reflect actual business mission
- Update company description with correct business details
- Update stats with projected figures aligned to business plan

**Contact Page (contact/page.tsx):**

- Update email to: info@naijaconnect.com.ng (as per business plan)
- Update office address: Victoria Island, Lagos, Nigeria
- Add business hours: Monday to Friday, 8:00 AM - 6:00 PM WAT (support until 9:00 PM)
- Add reference to website: www.optifund.ng (domain reserved)

**Footer (Footer.tsx):**

- Update copyright year to 2025
- Ensure company description matches business plan tagline

**Calculator Page (calculator/page.tsx):**

- Update default values and examples to reflect realistic investment ranges (₦500,000 - ₦5M)
- Align with platform service fee of 2% of invested capital annually

## Impact

**Affected Capabilities:**

- Frontend Content (all static content pages)
- Brand Presentation
- User-facing Information

**Affected Code:**

- `src/app/page.tsx` - Homepage content updates
- `src/app/about/page.tsx` - About page complete rewrite
- `src/app/contact/page.tsx` - Contact information updates
- `src/components/Footer.tsx` - Footer updates

**Breaking Changes:**

- None - all changes are content updates only

**Risk Assessment:**

- **Low**: Content-only changes, no functionality affected
- **Low**: All information sourced from official business plan document

**Timeline:**

- Estimated: 1-2 hours for complete implementation

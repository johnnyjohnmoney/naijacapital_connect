# Design Document: Frontend Business Data Update

**Change ID:** `update-frontend-business-data`  
**Version:** 1.0  
**Last Updated:** 2025-12-13

## Overview

This document outlines the technical approach for updating the NaijaConnect Capital frontend with accurate business plan data, ensuring consistency, maintainability, and scalability.

## Architecture Decisions

### 1. Data Management Strategy

**Decision:** Use static content with centralized configuration files

**Rationale:**

- Company information changes infrequently
- No need for CMS complexity at this stage
- Easier to version control and review
- Better performance (no database queries for static content)
- Simpler deployment pipeline

**Implementation:**

- Create `src/config/company.ts` for centralized company data
- Create `src/config/team.ts` for team member profiles
- Create `src/config/products.ts` for product/service descriptions
- Import and use these configs across components

### 2. Component Structure

**Decision:** Create reusable content components

**Components to create/update:**

- `<TeamMemberCard>` - Reusable team profile display
- `<ProductCard>` - Consistent product/service presentation
- `<StatisticHighlight>` - Market statistics display
- `<CompanyInfo>` - Footer and contact information

**Benefits:**

- Consistent styling across pages
- Easy to update content in one place
- Testable components
- Better TypeScript support

### 3. Image Management

**Decision:** Use placeholder images with proper dimensions

**Approach:**

- Define standard dimensions for team photos (400x400px)
- Use `next/image` for optimization
- Create placeholder component for missing photos
- Use professional placeholder service (UI Avatars or similar)
- Prepare image directory structure for future real photos

**Directory structure:**

```
public/
  images/
    team/
      temitayo-ceo.jpg (placeholder)
      emmanuel-coo.jpg (placeholder)
      eric-cfo.jpg (placeholder)
      kevin-cto.jpg (placeholder)
      kikelomo-head-partnerships.jpg (placeholder)
    products/
      remitconnect.png
      investdirect.png
      impacttrack.png
      learning-hub.png
```

### 4. SEO & Metadata

**Decision:** Use Next.js metadata API for all pages

**Implementation:**

```typescript
// Each page exports metadata
export const metadata: Metadata = {
  title: "About Us - NaijaConnect Capital",
  description: "Meet the team behind NaijaConnect Capital...",
  keywords: ["team", "diaspora investment", "fintech Nigeria"],
  openGraph: {
    title: "About NaijaConnect Capital",
    description: "...",
    images: ["/images/og-about.jpg"],
  },
};
```

**Benefits:**

- Better search engine indexing
- Improved social media sharing
- Consistent metadata across pages

### 5. Content Validation

**Decision:** Use TypeScript interfaces for type safety

**Interfaces:**

```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  description: string;
  image: string;
  linkedin?: string;
  twitter?: string;
}

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  pricing: {
    amount: string;
    period?: string;
    note?: string;
  };
  features: string[];
  icon: any; // Heroicon component
}

interface CompanyInfo {
  legalName: string;
  tradingName: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  contact: {
    email: string;
    phone?: string;
    website: string;
  };
  registration: {
    status: "proposed" | "registered";
    authority: string;
    year: number;
  };
}
```

### 6. Internationalization Preparation

**Decision:** Structure content for future i18n support

**Approach:**

- Keep all user-facing strings in config files
- Use consistent key naming
- Prepare for future integration with next-intl or react-i18next

**Example:**

```typescript
export const content = {
  en: {
    hero: {
      title: "Transform Diaspora Remittances...",
      subtitle: "...",
    },
  },
  // Future: Add other languages
};
```

## Data Configuration Files

### src/config/company.ts

```typescript
export const companyInfo = {
  legalName: "NaijaConnect Capital Company Limited",
  tradingName: "NaijaConnect Capital",
  address: {
    street: "Victoria Island",
    city: "Lagos",
    country: "Nigeria",
  },
  contact: {
    email: "info@naijaconnect.com.ng",
    website: "www.optifund.ng",
  },
  registration: {
    status: "proposed" as const,
    authority: "CAMA 2020",
    year: 2025,
  },
  regulators: ["SEC", "CBN"],
  businessHours: {
    days: "Monday to Friday",
    hours: "8:00 AM - 6:00 PM WAT",
    liveChat: "8:00 AM - 9:00 PM WAT",
  },
};

export const marketStats = {
  remittanceVolume: {
    value: 20.98,
    currency: "USD",
    unit: "billion",
    year: 2024,
  },
  gdpPercentage: 6,
  diasporaPopulation: { value: 17, unit: "million" },
  targetInvestors: { value: 10000, timeframe: "3 years" },
  targetInvestment: {
    min: 3,
    max: 5,
    currency: "NGN",
    unit: "billion",
    year: 2028,
  },
};
```

### src/config/team.ts

```typescript
export const teamMembers = [
  {
    id: "temitayo-sunmonu-balogun",
    name: "Temitayo Sunmonu-Balogun",
    role: "CEO",
    title: "Chief Executive Officer",
    description:
      "A finance and management professional with over 10 years of experience in accounting, finance, and corporate leadership. She has a strong record of promoting growth, improving operations, and ensuring financial responsibility in both private and institutional settings.",
    image: "/images/team/temitayo-ceo.jpg",
    linkedin: undefined,
  },
  // ... other team members
];
```

### src/config/products.ts

```typescript
export const products = [
  {
    id: "remitconnect",
    name: "RemitConnect",
    tagline: "Low-Cost Remittance Gateway",
    description:
      "A payment channel that allows direct transfers from Nigerian expatriates to approved investment wallets, using blockchain for tracking.",
    pricing: {
      amount: "2.0%",
      period: "per transaction",
      note: "Below industry average of 4-6%",
    },
    features: [
      "Direct diaspora-to-investment transfers",
      "Blockchain transaction tracking",
      "Competitive exchange rates",
      "24/7 availability",
    ],
    icon: ArrowPathIcon,
  },
  // ... other products
];
```

## Component Examples

### TeamMemberCard Component

```typescript
interface TeamMemberCardProps {
  member: TeamMember;
  layout?: "horizontal" | "vertical";
}

export function TeamMemberCard({
  member,
  layout = "vertical",
}: TeamMemberCardProps) {
  return (
    <div className={layout === "horizontal" ? "flex gap-4" : "flex flex-col"}>
      <Image
        src={member.image}
        alt={member.name}
        width={layout === "horizontal" ? 150 : 400}
        height={layout === "horizontal" ? 150 : 400}
        className="rounded-lg"
      />
      <div>
        <h3 className="text-xl font-bold">{member.name}</h3>
        <p className="text-sm text-gray-600">{member.title}</p>
        <p className="mt-2 text-gray-700">{member.description}</p>
        {/* Social links */}
      </div>
    </div>
  );
}
```

## Migration Strategy

### Phase 1: Create Configuration Files

1. Create `src/config/` directory
2. Add company.ts, team.ts, products.ts
3. Validate data against business plan

### Phase 2: Update Components

1. Home page hero and features
2. About page company info and team
3. Products/services pages
4. Footer and contact information

### Phase 3: Testing & Validation

1. Visual regression testing
2. Content accuracy review
3. SEO metadata validation
4. Accessibility audit

### Phase 4: Deployment

1. Create PR with all changes
2. Request stakeholder review
3. Deploy to staging
4. Production deployment

## Rollback Plan

If issues are discovered post-deployment:

1. Keep git tags for easy revert
2. Configuration files can be quickly updated
3. No database migrations required
4. Zero downtime rollback possible

## Future Enhancements

1. **CMS Integration**: When content updates become frequent, consider Contentful or Sanity.io
2. **A/B Testing**: Test different value propositions and CTAs
3. **Personalization**: Show content based on user location/type
4. **Multi-language**: Add French, Portuguese for wider diaspora reach

## Performance Considerations

- All static content cached at CDN edge
- Images optimized with next/image
- No additional API calls required
- Minimal bundle size impact (< 50KB additional data)

## Security Considerations

- No sensitive data in client-side configs
- Email addresses properly encoded to prevent scraping
- Contact forms with rate limiting and CAPTCHA
- All external links with `rel="noopener noreferrer"`

## Accessibility

- All images have descriptive alt text
- Proper heading hierarchy (h1 → h2 → h3)
- Sufficient color contrast (WCAG AA)
- Keyboard navigation support
- Screen reader friendly content structure

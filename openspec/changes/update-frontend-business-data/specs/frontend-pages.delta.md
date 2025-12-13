# Frontend Pages - Spec Delta

**Capability:** frontend-pages  
**Change:** update-frontend-business-data  
**Status:** Draft

## MODIFIED Requirements

### R001: Home Page Content

**Original:** Generic placeholder content with fictional company data

**Modified:** Display accurate NaijaConnect Capital Company Limited business information

#### Scenario: User visits home page

**Given** a user navigates to the home page  
**When** the page loads  
**Then** the hero section displays "Transform Diaspora Remittances into Nigerian Investments"  
**And** the subtitle mentions the USD 20.98 billion remittance market  
**And** key statistics are visible: 17M diaspora, 6% GDP, target 10K investors

#### Scenario: User views platform features

**Given** a user scrolls to the features section  
**When** viewing the feature cards  
**Then** four products are displayed: RemitConnect, InvestDirect, ImpactTrack Dashboard, Diaspora Learning Hub  
**And** each product shows accurate pricing and descriptions from business plan  
**And** RemitConnect shows 2.0% transaction fee  
**And** InvestDirect shows 2% annual management fee

### R002: About Page Company Information

**Original:** Placeholder company description and fictional team members

**Modified:** Display official company registration details and actual founding team

#### Scenario: User reads company overview

**Given** a user navigates to the About page  
**When** viewing the company information section  
**Then** the legal name "NaijaConnect Capital Company Limited" is displayed  
**And** the business address "Victoria Island, Lagos, Nigeria" is shown  
**And** registration status "Proposed under CAMA 2020" is indicated  
**And** regulatory framework mentions SEC and CBN

#### Scenario: User views team profiles

**Given** a user scrolls to the team section  
**When** viewing team member cards  
**Then** five founders are displayed with accurate information:

- Temitayo Sunmonu-Balogun (CEO)
- Emmanuel Orevba (COO)
- Eric Ojeaga (CFO)
- Kevin Odiley (CTO)
- Kikelomo Abikele (Head, Investment & Partnerships)
  **And** each profile shows their actual title and experience summary from business plan  
  **And** professional photos or appropriate placeholders are displayed

### R003: Product/Service Pages

**Original:** Generic investment platform description

**Modified:** Detailed descriptions of four distinct products/services

#### Scenario: User views RemitConnect product

**Given** a user navigates to product information  
**When** viewing RemitConnect details  
**Then** the description explains "Low-cost remittance gateway for diaspora-to-investment transfers"  
**And** pricing shows 2.0% transaction fee  
**And** comparison note states "Below industry average of 4-6%"  
**And** blockchain tracking feature is highlighted

#### Scenario: User views InvestDirect product

**Given** a user navigates to product information  
**When** viewing InvestDirect details  
**Then** the description explains "Digital marketplace of pre-vetted Nigerian investment opportunities"  
**And** pricing shows 2% annual management fee (charged monthly on AUM)  
**And** investment sectors listed: agriculture, real estate, SMEs, infrastructure  
**And** due diligence process is mentioned

#### Scenario: User views ImpactTrack Dashboard

**Given** a user navigates to product information  
**When** viewing ImpactTrack details  
**Then** the description explains free investment tracking and impact reporting  
**And** pricing clearly states "Free for all registered investors"  
**And** features include ROI calculations, project updates, social impact metrics

#### Scenario: User views Diaspora Learning Hub

**Given** a user navigates to product information  
**When** viewing Learning Hub details  
**Then** the description explains financial education portal  
**And** pricing shows ₦5,000 per course or subscription  
**And** content types listed: webinars, reports, advisory services

## MODIFIED Requirements

### R004: Contact Information

**Original:** Generic contact form with no company details

**Modified:** Official contact channels with business address

#### Scenario: User accesses contact information

**Given** a user navigates to the Contact page  
**When** viewing contact details  
**Then** official email "info@naijaconnect.com.ng" is displayed  
**And** business address "Victoria Island, Lagos, Nigeria" is shown  
**And** business hours "Monday to Friday, 8:00 AM - 6:00 PM WAT" are indicated  
**And** live chat availability "8:00 AM - 9:00 PM WAT" is mentioned  
**And** social media links for X, LinkedIn, Instagram, Facebook are present

### R005: Footer Content

**Original:** Generic footer with placeholder information

**Modified:** Complete company legal and contact information

#### Scenario: User views footer on any page

**Given** a user is on any page of the website  
**When** scrolling to the footer  
**Then** company name "NaijaConnect Capital Company Limited" is displayed  
**And** address "Victoria Island, Lagos, Nigeria" is shown  
**And** contact email is present  
**And** regulatory note "Regulated by SEC and CBN (pending)" is visible  
**And** copyright shows "© 2025 NaijaConnect Capital"  
**And** links to Terms of Service, Privacy Policy, Compliance are present

### R006: SEO Metadata

**Original:** Generic or missing metadata

**Modified:** Accurate, keyword-rich metadata for all pages

#### Scenario: Search engine crawls home page

**Given** a search engine bot accesses the home page  
**When** parsing the HTML metadata  
**Then** title tag contains "NaijaConnect Capital - Diaspora Investment Platform"  
**And** meta description includes "Transform diaspora remittances into Nigerian investments"  
**And** keywords include "Nigerian investments, diaspora, remittances, fintech, NaijaConnect"  
**And** OpenGraph tags have accurate title, description, and image

#### Scenario: Social media shares about page

**Given** a user shares the About page on social media  
**When** the platform generates a preview  
**Then** OpenGraph title shows "About NaijaConnect Capital - Meet Our Team"  
**And** OpenGraph description summarizes the founding team  
**And** OpenGraph image displays a professional company banner

## ADDED Requirements

### R007: Market Statistics Display

**New requirement:** Display key market data to establish credibility

#### Scenario: User views market statistics

**Given** a user is on the home page  
**When** viewing the statistics section  
**Then** the following data points are prominently displayed:

- "USD 20.98 Billion in remittances (2024)"
- "17 Million Nigerians abroad"
- "6% of Nigeria's GDP"
- "Target: 10,000 investors in 3 years"
- "₦3-5 Billion target investment inflows by 2028"
  **And** each statistic has a source attribution or "Source: World Bank 2024" note

### R008: Regulatory Compliance Notices

**New requirement:** Display regulatory status and disclaimers

#### Scenario: User views investment-related pages

**Given** a user is on any page with investment information  
**When** viewing the page footer or disclaimer section  
**Then** a notice states "NaijaConnect Capital is in the process of registration with SEC and CBN"  
**And** investment risk warnings are clearly displayed  
**And** disclaimer mentions "Pending CAMA 2020 registration"  
**And** users are informed of regulatory compliance frameworks

### R009: Investment Range Guidance

**New requirement:** Provide clear investment amount expectations

#### Scenario: User explores investment opportunities

**Given** a user navigates to the opportunities or calculator page  
**When** viewing investment information  
**Then** typical investment range is stated: "₦500,000 - ₦5,000,000"  
**And** this range is noted as "Based on diaspora investor survey data (2025)"  
**And** users understand minimum and recommended investment amounts

## Implementation Notes

- All content changes are static and do not require database migrations
- Team photos should be added to `public/images/team/` directory
- Use TypeScript config files in `src/config/` for centralized data management
- All monetary amounts should use appropriate currency formatting (₦ for Naira, USD for dollars)
- Dates and times should include timezone (WAT - West Africa Time)
- All statistics should include source attribution for credibility

# NaijaConnect Capital - Website Requirements

1. Introduction

This document outlines the functional and non-functional requirements for the "NaijaConnect Capital" website, a FinTech solution designed to channel diaspora remittances directly into pre-vetted investment opportunities in Nigeria. The platform will be secure, transparent, and user-friendly, fostering economic growth and providing attractive returns for investors.

2. Target Audience

- Primary: Nigerians in the diaspora seeking secure and profitable investment opportunities.
- Secondary: Local Nigerian businesses seeking capital, pre-vetted and approved for listing.
- Tertiary: NaijaConnect Capital administrators managing the platform, investments, and user accounts.

3. Functional Requirements

   3.1. User Management & Authentication

- FR-1.1: New user registration with name, email, and secure password.
- FR-1.2: Email verification (not required for during building phase but to be implemented later).
- FR-1.3: Secure user login using email and password.
- FR-1.4: "Forgot Password" functionality via registered email.
- FR-1.5: Strong password policy enforcement (length, uppercase, lowercase, numbers, symbols).
- FR-1.6: User profile update (name, contact details).
- FR-1.7: Different user roles with specific access levels: Investor, Business Owner, Administrator.

  3.2. Investment Opportunities Listing

- FR-2.1: Display of available investment opportunities.
- FR-2.2: Each listing includes:
  - Project Title
  - Brief description
  - Target capital raise
  - Minimum investment amount
  - Expected returns (ROI, dividend payout schedule)
  - Investment timeline
  - Detailed business plan and financial projections (accessible upon login).
  - Company profile and management team bios.
- FR-2.3: Filtering and sorting of opportunities by industry, risk, and timeline.

  3.3. User Dashboard

- FR-3.1: Personalized dashboard upon login.
- FR-3.2: Investor dashboard:
  - Total invested capital summary.
  - List of active investments with real-time performance.
  - Investment transaction history.
  - Pending withdrawals and earnings.
  - Notifications for new opportunities, portfolio performance, and platform announcements.
- FR-3.3: Business owner dashboard:
  - Capital raise status.
  - List of investors (anonymized data).
  - Tools to upload and manage progress/financial reports.
  - Notifications regarding new investments and platform communications.
- FR-3.4: Administrator dashboard:

  - Overview of platform health.
  - Total users and new registrations.
  - Total capital raised.
  - List of pending investment applications.
  - User management tools (suspension, deactivation).
  - Analytics and reporting on platform usage and investment trends.

    3.4. Investment Process & Transaction Management

- FR-4.1: Logged-in users can initiate investments.
- FR-4.2: Investment process:
  - Specify investment amount.
  - Confirm terms and conditions.
  - Select payment method.
- FR-4.3: Integration with secure payment gateway e.g. Flutterwave, Paystack( to be implemented later ).
- FR-4.5: Secure withdrawal requests for earnings, subject to investment terms.

  3.5. Communication & Reporting

- FR-5.1: Secure messaging system for investor-administrator communication.
- FR-5.2: Email and in-app notifications from administrators to users.

1. Non-Functional Requirements

   4.1. Security (to be implemented later)

- NFR-4.1.1: Secure, encrypted server with valid SSL certificate.
- NFR-4.1.2: Encryption of sensitive user data (financial information, passwords) in transit and at rest.
- NFR-4.1.3: Robust protection against web vulnerabilities (SQL injection, XSS).

  4.2. Performance & Scalability

- NFR-4.2.1: Pages load within 3 seconds under normal load.
- NFR-4.2.2: Scalable system architecture for growing users/investments.
- NFR-4.2.3: High uptime of at least 99.9%.

  4.3. Usability & Accessibility

- NFR-4.3.1: Clean, intuitive, easy-to-navigate user interface.
- NFR-4.3.2: Mobile-responsive design.
- NFR-4.3.3: Clear and concise language.
- NFR-4.3.4: Adherence to web accessibility standards (WCAG 2.1).

  4.4. Technical

- NFR-4.4.1: Robust and modern technology stack.
- NFR-4.4.2: Comprehensive backup and disaster recovery plan.

1. Proposed Technology Stack (Example)

- Frontend: React.js
- Styling: CSS3
- Backend: Node.js,
- Database: PostgreSQL or MySQL

IMPORTANT NOTE:
Always make sure all links are valid and functional.
Use vanilla CSS for styling.
Do not duplicate code or folders.
Use proper indentation and formatting.

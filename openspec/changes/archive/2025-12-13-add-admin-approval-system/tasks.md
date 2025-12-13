## 1. Database Schema Changes

### 1.1 Update OpportunityStatus Enum

- [ ] Add PENDING_REVIEW status to OpportunityStatus enum
- [ ] Add NEEDS_REVISION status to OpportunityStatus enum
- [ ] Add REJECTED status to OpportunityStatus enum
- [ ] Add SUSPENDED status to OpportunityStatus enum
- [ ] Add FEATURED status option (separate boolean field)

### 1.2 Extend Business Model

- [ ] Add reviewedBy field (String, optional, references admin User.id)
- [ ] Add reviewedAt field (DateTime, optional)
- [ ] Add rejectionReason field (String, optional)
- [ ] Add adminNotes field (String, optional, for internal admin comments)
- [ ] Add revisionRequests field (String, optional, feedback to business owner)
- [ ] Add isFeatured field (Boolean, default false)
- [ ] Add submittedAt field (DateTime, track initial submission)

### 1.3 Extend User Model

- [ ] Add suspended field (Boolean, default false)
- [ ] Add suspendedAt field (DateTime, optional)
- [ ] Add suspensionReason field (String, optional)
- [ ] Add bannedAt field (DateTime, optional)
- [ ] Add banReason field (String, optional)
- [ ] Add verificationNotes field (String, optional)
- [ ] Add lastLoginAt field (DateTime, optional)

### 1.4 Create ReportedContent Model

- [ ] Define ReportedContent model with id, reportType, targetType, targetId
- [ ] Add reportedById, reportReason, description fields
- [ ] Add status (PENDING, REVIEWED, RESOLVED, DISMISSED)
- [ ] Add reviewedBy, reviewedAt, resolution fields
- [ ] Add timestamps (createdAt, updatedAt)

### 1.5 Create AdminAuditLog Model

- [ ] Define AdminAuditLog model with id, adminId, action, targetType, targetId
- [ ] Add details (JSON field for action context)
- [ ] Add ipAddress, userAgent fields
- [ ] Add timestamp field
- [ ] Set up relations to User model

### 1.6 Create PlatformSettings Model

- [ ] Define PlatformSettings model with id, key, value, description
- [ ] Add dataType field (STRING, NUMBER, BOOLEAN, JSON)
- [ ] Add updatedBy, updatedAt fields
- [ ] Add category field for grouping settings

### 1.7 Run Database Migration

- [ ] Create migration file with all schema changes
- [ ] Test migration on development database
- [ ] Create rollback migration script
- [ ] Document migration steps in README

## 2. Backend API Implementation

### 2.1 Opportunity Approval Endpoints

- [ ] Create POST /api/admin/opportunities/[id]/approve endpoint
- [ ] Create POST /api/admin/opportunities/[id]/reject endpoint
- [ ] Create POST /api/admin/opportunities/[id]/request-changes endpoint
- [ ] Create PATCH /api/admin/opportunities/[id]/feature endpoint
- [ ] Create PATCH /api/admin/opportunities/[id]/suspend endpoint
- [ ] Add admin role check middleware to all admin endpoints
- [ ] Implement audit logging for all approval actions

### 2.2 User Management Endpoints

- [ ] Create POST /api/admin/users/[id]/suspend endpoint
- [ ] Create POST /api/admin/users/[id]/unsuspend endpoint
- [ ] Create POST /api/admin/users/[id]/ban endpoint
- [ ] Create POST /api/admin/users/[id]/verify endpoint
- [ ] Create GET /api/admin/users endpoint with filters and pagination
- [ ] Create GET /api/admin/users/[id] endpoint for detailed user view
- [ ] Implement audit logging for user management actions

### 2.3 Compliance & Moderation Endpoints

- [ ] Create GET /api/admin/reports endpoint with filters
- [ ] Create POST /api/admin/reports/[id]/review endpoint
- [ ] Create POST /api/admin/reports/[id]/resolve endpoint
- [ ] Create POST /api/admin/reports/[id]/dismiss endpoint
- [ ] Create GET /api/admin/compliance/flags endpoint
- [ ] Implement automated flagging service (cron job or background task)

### 2.4 Financial Oversight Endpoints

- [ ] Create GET /api/admin/withdrawals endpoint with filters
- [ ] Create POST /api/admin/withdrawals/[id]/approve endpoint
- [ ] Create POST /api/admin/withdrawals/[id]/reject endpoint
- [ ] Create GET /api/admin/transactions endpoint with filters
- [ ] Create GET /api/admin/revenue/analytics endpoint
- [ ] Implement refund processing endpoint

### 2.5 Audit Log Endpoints

- [ ] Create GET /api/admin/audit-logs endpoint with filters
- [ ] Create admin-audit utility in src/lib/admin-audit.ts
- [ ] Implement log retention policy (auto-cleanup old logs)

### 2.6 Update Existing Endpoints

- [ ] Update POST /api/opportunities to set status as PENDING_REVIEW
- [ ] Update GET /api/opportunities to filter out non-OPEN opportunities for non-admins
- [ ] Update GET /api/opportunities/[id] to check status permissions
- [ ] Add status field to opportunity response DTOs

## 3. Email Notification System

### 3.1 Create Email Templates

- [ ] Create opportunity-approved template in src/lib/email-templates.ts
- [ ] Create opportunity-rejected template with reason
- [ ] Create opportunity-needs-revision template with feedback
- [ ] Create account-suspended template
- [ ] Create account-verified template
- [ ] Create withdrawal-approved/rejected templates

### 3.2 Email Service Integration

- [ ] Set up email service utility (NodeMailer or SendGrid)
- [ ] Add email sending function with template support
- [ ] Add email queue for async sending (optional)
- [ ] Add error handling and retry logic
- [ ] Configure SMTP settings in .env.example

## 4. Frontend Admin Components

### 4.1 Opportunity Review Panel

- [ ] Create OpportunityReviewPanel component
- [ ] Implement filtering by status (pending, approved, rejected)
- [ ] Add search by title, industry, business owner
- [ ] Create opportunity list table with key details
- [ ] Add bulk action checkboxes and bulk approve/reject
- [ ] Implement pagination for opportunity list

### 4.2 Opportunity Detail Modal

- [ ] Create OpportunityDetailModal component
- [ ] Display complete opportunity details (plan, financials, owner info)
- [ ] Show owner's history (other opportunities, success rate)
- [ ] Add admin action buttons (approve, reject, request changes)
- [ ] Add admin notes text area for internal comments
- [ ] Add revision request form with feedback fields
- [ ] Show approval history and audit trail

### 4.3 User Management Panel

- [ ] Create UserManagementPanel component
- [ ] Implement user search with filters (role, status, date)
- [ ] Create user list table with key details
- [ ] Add user detail view/modal with complete info
- [ ] Display user activity timeline (investments, businesses)
- [ ] Add action buttons (suspend, verify, ban, message)
- [ ] Show user's opportunities and investment history

### 4.4 Compliance Panel

- [ ] Create CompliancePanel component
- [ ] Create flagged content list with priority sorting
- [ ] Add report detail view with context and evidence
- [ ] Implement resolution workflow (review, resolve, dismiss)
- [ ] Add compliance metrics dashboard (pending, resolved, dismissed counts)
- [ ] Create automated flag configuration interface

### 4.5 Financial Oversight Panel

- [ ] Create FinancialOversightPanel component
- [ ] Build withdrawal request queue with filters
- [ ] Add transaction monitoring table with search
- [ ] Create revenue analytics dashboard with charts
- [ ] Implement withdrawal approval/rejection interface
- [ ] Add refund processing interface
- [ ] Display platform commission summary

### 4.6 Rebuild Administrator Dashboard

- [ ] Refactor AdministratorDashboard.tsx with new tab structure
- [ ] Remove "Educational Content" tab
- [ ] Add "Opportunity Reviews" tab (replace "Approvals")
- [ ] Add "User Management" tab
- [ ] Add "Compliance & Moderation" tab
- [ ] Add "Financial Oversight" tab
- [ ] Add "System Configuration" tab (replace "System Health")
- [ ] Keep "Overview" and "Analytics & Insights" tabs
- [ ] Update navigation and routing logic

### 4.7 System Configuration Panel

- [ ] Create SystemConfigurationPanel component
- [ ] Build platform settings editor (min/max investment limits)
- [ ] Add commission rate configuration
- [ ] Create feature flag toggles
- [ ] Implement email template editor
- [ ] Add maintenance mode toggle
- [ ] Display recent admin activity log

## 5. Business Logic & Utilities

### 5.1 Admin Authorization

- [ ] Create admin role check utility function
- [ ] Add admin-only route protection in middleware
- [ ] Implement permission checks in API routes
- [ ] Add admin session validation

### 5.2 Audit Logging

- [ ] Create logAdminAction utility function
- [ ] Capture admin ID, action type, target, details, IP, user agent
- [ ] Implement async logging to avoid blocking requests
- [ ] Add audit log query helpers

### 5.3 Notification Service

- [ ] Create notification utility for creating in-app notifications
- [ ] Link notification creation to email sending
- [ ] Implement notification templates
- [ ] Add notification preferences (email + in-app)

### 5.4 Status Transition Validation

- [ ] Create opportunity status transition validator
- [ ] Define valid status transition rules
- [ ] Add validation before status updates
- [ ] Return clear error messages for invalid transitions

## 6. Testing & Quality Assurance

### 6.1 Database Migration Testing

- [ ] Test migration on clean database
- [ ] Test migration with existing data
- [ ] Verify all constraints and relations work
- [ ] Test rollback migration

### 6.2 API Endpoint Testing

- [ ] Test opportunity approval workflow end-to-end
- [ ] Test user management actions
- [ ] Test admin authorization and permissions
- [ ] Test error handling and validation
- [ ] Verify audit logging captures all actions

### 6.3 UI Component Testing

- [ ] Test opportunity review panel with various filters
- [ ] Test bulk actions on opportunities
- [ ] Test user management search and filters
- [ ] Test all modal interactions
- [ ] Test responsive design on mobile/tablet

### 6.4 Integration Testing

- [ ] Test complete approval workflow (submit → review → approve → notify)
- [ ] Test rejection workflow with email notification
- [ ] Test user suspension cascading effects
- [ ] Test withdrawal approval workflow
- [ ] Verify compliance flag triggers work correctly

### 6.5 Email Testing

- [ ] Test all email templates render correctly
- [ ] Verify emails are sent on appropriate actions
- [ ] Test email links and CTAs work
- [ ] Check spam score of emails

## 7. Documentation

### 7.1 Admin User Guide

- [ ] Document opportunity approval workflow process
- [ ] Document user management capabilities
- [ ] Create compliance moderation guidelines
- [ ] Document financial oversight procedures
- [ ] Add screenshots and examples

### 7.2 Technical Documentation

- [ ] Document new database schema changes
- [ ] Document API endpoints and request/response formats
- [ ] Document admin audit log structure
- [ ] Add code comments for complex logic

### 7.3 Migration Guide

- [ ] Write step-by-step migration instructions
- [ ] Document data backup procedures
- [ ] Create troubleshooting guide
- [ ] Document rollback procedures

### 7.4 Update README

- [ ] Add admin features section to main README
- [ ] Document environment variables for email service
- [ ] Add admin account creation instructions
- [ ] Link to admin user guide

## 8. Deployment Preparation

### 8.1 Environment Configuration

- [ ] Add EMAIL*SERVICE*\* env variables to .env.example
- [ ] Add ADMIN_APPROVAL_REQUIRED flag to .env.example
- [ ] Add PLATFORM_COMMISSION_RATE to .env.example
- [ ] Document all new environment variables

### 8.2 Pre-Deployment Checklist

- [ ] Create database backup
- [ ] Run migration in staging environment
- [ ] Test admin features in staging
- [ ] Prepare rollback plan
- [ ] Create admin accounts for production

### 8.3 Post-Deployment Tasks

- [ ] Monitor error logs for first 24 hours
- [ ] Verify email notifications are working
- [ ] Check admin audit logs are being written
- [ ] Monitor approval workflow performance
- [ ] Gather initial admin feedback

## 9. Future Enhancements (Not in Scope)

- [ ] Multi-admin approval (2-factor approval for sensitive actions)
- [ ] Machine learning fraud detection
- [ ] Advanced KYC document scanning
- [ ] Two-factor authentication for admin accounts
- [ ] IP whitelist for admin access
- [ ] Real-time dashboard with WebSocket updates
- [ ] Export functionality for all admin data
- [ ] Advanced analytics with BI tools integration

# Admin Approval and Oversight System

## Overview

This change introduces a comprehensive administrative approval and oversight system for the NaijaCapital Connect platform. The system implements multi-phase admin capabilities including opportunity approval workflow, user management, compliance monitoring, and financial oversight.

## Status

🚧 **PENDING APPROVAL** - Not yet implemented

## Key Changes

### Phase 1: Opportunity Approval Workflow

- New opportunity statuses: `PENDING_REVIEW`, `NEEDS_REVISION`, `REJECTED`, `SUSPENDED`, `FEATURED`
- Admin review dashboard with filtering, search, and bulk actions
- Approval/rejection/revision request workflow
- Email notifications for all status changes
- Opportunity visibility rules (only OPEN visible to investors)

### Phase 2: User Management

- User search and filtering by role, status, registration date
- User detail view with activity history and portfolio
- Account actions: suspend, unsuspend, verify, ban
- Session management and termination
- Direct messaging to users

### Phase 3: Compliance & Moderation

- User reporting system for inappropriate content
- Automated compliance flagging (fraud patterns, suspicious activity)
- Report review workflow with resolution tracking
- Compliance metrics dashboard
- Audit trail for all compliance actions

### Phase 4: Financial Oversight

- Withdrawal request approval workflow
- Transaction monitoring and search
- Platform revenue analytics
- Refund and payout management
- Dispute resolution
- Financial reporting and metrics

### Phase 5: System Configuration

- Platform settings management (limits, commission rates)
- Feature flags and maintenance mode
- Email template customization
- Comprehensive admin audit logging

## Database Changes

### New Enums

- Added to `OpportunityStatus`: `PENDING_REVIEW`, `NEEDS_REVISION`, `REJECTED`, `SUSPENDED`
- New `ReportStatus`: `PENDING`, `UNDER_REVIEW`, `RESOLVED`, `DISMISSED`

### Extended Models

- **Business**: Added `reviewedBy`, `reviewedAt`, `rejectionReason`, `adminNotes`, `revisionRequests`, `isFeatured`, `submittedAt`
- **User**: Added `suspended`, `suspendedAt`, `suspensionReason`, `bannedAt`, `banReason`, `verificationNotes`, `lastLoginAt`

### New Models

- **ReportedContent**: User reports and automated flags for compliance monitoring
- **AdminAuditLog**: Immutable audit trail for all admin actions
- **PlatformSettings**: Configurable platform parameters and feature flags

## API Endpoints

### Opportunity Management

- `POST /api/admin/opportunities/[id]/approve`
- `POST /api/admin/opportunities/[id]/reject`
- `POST /api/admin/opportunities/[id]/request-changes`
- `PATCH /api/admin/opportunities/[id]/feature`
- `PATCH /api/admin/opportunities/[id]/suspend`

### User Management

- `GET /api/admin/users` - List with filters
- `GET /api/admin/users/[id]` - User details
- `POST /api/admin/users/[id]/suspend`
- `POST /api/admin/users/[id]/unsuspend`
- `POST /api/admin/users/[id]/ban`
- `POST /api/admin/users/[id]/verify`

### Compliance

- `GET /api/admin/reports` - List reports with filters
- `POST /api/admin/reports/[id]/review`
- `POST /api/admin/reports/[id]/resolve`
- `POST /api/admin/reports/[id]/dismiss`
- `GET /api/admin/compliance/flags`

### Financial Oversight

- `GET /api/admin/withdrawals` - List with filters
- `POST /api/admin/withdrawals/[id]/approve`
- `POST /api/admin/withdrawals/[id]/reject`
- `GET /api/admin/transactions`
- `GET /api/admin/revenue/analytics`

### Audit Logs

- `GET /api/admin/audit-logs` - Query audit trail

## UI Components

### New Components

- `OpportunityReviewPanel` - Main review dashboard
- `OpportunityDetailModal` - Detailed opportunity view with actions
- `UserManagementPanel` - User search and management
- `CompliancePanel` - Report and flag management
- `FinancialOversightPanel` - Transaction and withdrawal monitoring
- `SystemConfigurationPanel` - Platform settings

### Updated Components

- `AdministratorDashboard` - Complete rebuild with new tab structure

## Breaking Changes

### ⚠️ Database Migration Required

Existing opportunities need status migration. Run migration script to update:

- Existing OPEN opportunities → Add review metadata
- Update visibility rules in queries

### ⚠️ Business Owner Workflow Changed

Business owners can no longer publish opportunities directly. All new opportunities go through approval workflow.

### ⚠️ Investor Opportunity Visibility

Investors will only see OPEN, CLOSED, FULLY_FUNDED, and CANCELLED opportunities. PENDING_REVIEW, NEEDS_REVISION, REJECTED, and SUSPENDED are hidden.

## Migration Guide

1. **Backup Database**: Create full backup before migration
2. **Run Schema Migration**: Apply Prisma migrations
3. **Data Migration**: Update existing opportunities with review metadata
4. **Deploy API**: Deploy updated API endpoints
5. **Deploy UI**: Deploy updated admin dashboard
6. **Verify Email**: Test email notifications
7. **Monitor**: Watch logs for first 24-48 hours

## Configuration

### Required Environment Variables

```env
# Email Service (SMTP or SendGrid)
EMAIL_SERVICE_HOST=smtp.example.com
EMAIL_SERVICE_PORT=587
EMAIL_SERVICE_USER=admin@naijaconnect.com
EMAIL_SERVICE_PASSWORD=your-password

# Platform Settings
ADMIN_APPROVAL_REQUIRED=true
PLATFORM_COMMISSION_RATE=2.5
WITHDRAWAL_THRESHOLD_AMOUNT=1000000
FEATURED_OPPORTUNITY_SLOTS=5
```

## Testing Checklist

- [ ] Database migration on clean database
- [ ] Database migration with existing data
- [ ] Opportunity approval workflow end-to-end
- [ ] User suspension and unsuspension
- [ ] Email notifications for all actions
- [ ] Bulk operations (approve, reject, suspend)
- [ ] Audit log completeness
- [ ] Financial oversight workflows
- [ ] Compliance report resolution
- [ ] Admin authorization on all endpoints

## Documentation

- [Proposal](./proposal.md) - Full proposal with rationale
- [Design](./design.md) - Technical architecture and decisions
- [Tasks](./tasks.md) - Implementation checklist
- [Specs](./specs/) - Detailed requirements by capability

## Timeline

- **Phase 1**: 4-5 days (Opportunity Approval)
- **Phase 2**: 3-4 days (User Management)
- **Phase 3**: 3-4 days (Compliance)
- **Phase 4**: 3-4 days (Financial Oversight)
- **Phase 5**: 2-3 days (System Configuration)
- **Testing**: 3-4 days
- **Total**: 18-24 days (single developer)

## Success Criteria

- ✅ 100% of new opportunities go through approval workflow
- ✅ Average approval turnaround < 48 hours
- ✅ <5% false positive rate on compliance flags
- ✅ Admin audit log captures all critical operations
- ✅ Zero unauthorized opportunity publications
- ✅ All breaking changes communicated to users
- ✅ Email notifications working for all status changes

## Dependencies

- Email service configured (SMTP/SendGrid)
- Admin accounts created with ADMINISTRATOR role
- Database backup capability
- Email templates tested and working

## Related Changes

- None (first implementation of admin features)

## Questions or Issues?

Contact the development team or open an issue for clarification.

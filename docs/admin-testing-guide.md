# Admin System Testing Guide

## Phase 5: System Configuration - COMPLETE ✅

All 5 phases of the comprehensive admin approval system are now implemented:

### Phase 1: Opportunity Approval Workflow ✅

- API: `/api/admin/opportunities` (GET - list pending)
- API: `/api/admin/opportunities/[id]/approve` (POST)
- API: `/api/admin/opportunities/[id]/reject` (POST)
- API: `/api/admin/opportunities/[id]/request-changes` (POST)
- Component: `OpportunityReviewPanel.tsx`

### Phase 2: User Management ✅

- API: `/api/admin/users` (GET - list/search/filter)
- API: `/api/admin/users/[id]/suspend` (POST/DELETE)
- API: `/api/admin/users/[id]/verify` (POST/DELETE)
- API: `/api/admin/users/[id]/role` (PATCH)
- Component: `UserManagementPanel.tsx`

### Phase 3: Compliance & Reports ✅

- API: `/api/reports` (POST/GET - create and list reports)
- API: `/api/admin/reports/[id]` (PATCH/DELETE)
- API: `/api/admin/reports/stats` (GET)
- Component: `CompliancePanel.tsx`

### Phase 4: Financial Oversight ✅

- API: `/api/admin/withdrawals` (GET - list requests)
- API: `/api/admin/withdrawals/[id]/approve` (POST)
- API: `/api/admin/withdrawals/[id]/reject` (POST)
- API: `/api/admin/financial/stats` (GET)
- Component: `FinancialOversightPanel.tsx`
- Schema: WithdrawalRequest model updated with bank details

### Phase 5: System Configuration ✅

- API: `/api/admin/settings` (GET - list all settings)
- API: `/api/admin/settings/[key]` (GET/PATCH - view/update setting)
- API: `/api/admin/settings/initialize` (POST - create defaults)
- Component: `SystemConfigurationPanel.tsx`

## Testing Checklist

### 1. Initial Setup

```bash
# Start development server
npm run dev

# In another terminal, open Prisma Studio to monitor database
npx prisma studio
```

### 2. Create Admin User

```bash
# Run the admin creation script
node scripts/create-admin.js
# Or use TypeScript version:
npx ts-node scripts/create-admin.ts

# Enter details:
# Name: Test Admin
# Email: admin@test.com
# Password: AdminPassword123!
```

### 3. Test Authentication

- Navigate to: http://localhost:3000/auth/signin
- Login with admin credentials
- Verify redirect to dashboard
- Check role displayed as "ADMINISTRATOR"

### 4. Test Phase 1: Opportunity Reviews

1. **Create test opportunity** (as business owner):

   - Create another user with BUSINESS_OWNER role
   - Login and create an investment opportunity
   - Should be in PENDING_REVIEW status

2. **Test Approval**:

   - Login as admin
   - Navigate to "Opportunity Reviews" tab
   - Find pending opportunity
   - Click "Approve"
   - Verify status changes to OPEN
   - Check AdminAuditLog for APPROVE_OPPORTUNITY entry

3. **Test Rejection**:

   - Create another opportunity
   - Click "Reject"
   - Enter reason (min 20 chars)
   - Verify status changes to REJECTED
   - Check audit log

4. **Test Request Changes**:
   - Create another opportunity
   - Click "Request Changes"
   - Enter feedback (min 20 chars)
   - Verify status changes to NEEDS_REVISION
   - Check audit log

### 5. Test Phase 2: User Management

1. **Test Suspend User**:

   - Navigate to "User Management" tab
   - Find a non-admin user
   - Click "Suspend"
   - Enter reason (min 10 chars)
   - Verify user.suspended = true
   - Check audit log for SUSPEND_USER
   - Try logging in as that user (should fail)

2. **Test Unsuspend**:

   - Click "Unsuspend" on same user
   - Verify user.suspended = false
   - User can now login

3. **Test Verify User**:

   - Find unverified user
   - Click "Verify"
   - Add optional notes
   - Verify user.verified = true
   - Check audit log for VERIFY_USER

4. **Test Change Role**:

   - Find an INVESTOR user
   - Click "Change Role"
   - Select BUSINESS_OWNER
   - Enter reason (min 10 chars)
   - Verify role updated
   - Check audit log for CHANGE_USER_ROLE

5. **Test Search & Filter**:
   - Search by name/email
   - Filter by role (INVESTOR, BUSINESS_OWNER)
   - Filter by status (Active, Suspended, Verified)
   - Verify results update correctly

### 6. Test Phase 3: Compliance & Reports

1. **Test Report Creation** (as regular user):

   - Login as non-admin user
   - Navigate to report endpoint or UI
   - Create report with:
     ```json
     {
       "targetType": "BUSINESS",
       "targetId": "<business-id>",
       "reportReason": "Suspicious activity detected",
       "description": "Detailed description",
       "priority": "HIGH"
     }
     ```

2. **Test Review Reports** (as admin):

   - Navigate to "Compliance & Reports" tab
   - View pending reports
   - Check statistics (pending, under review, resolved)

3. **Test Update Report**:

   - Click "Review" on a report
   - Change status to UNDER_REVIEW
   - Then change to RESOLVED
   - Add resolution text
   - Verify reviewedBy and reviewedAt populated
   - Check audit log for UPDATE_REPORT

4. **Test Delete Report**:

   - Click delete on a report
   - Confirm deletion
   - Verify removed from database
   - Check audit log for DELETE_REPORT

5. **Test Filters**:
   - Filter by status (PENDING, UNDER_REVIEW, RESOLVED, DISMISSED)
   - Filter by priority (LOW, MEDIUM, HIGH, CRITICAL)
   - Filter by targetType
   - Verify results

### 7. Test Phase 4: Financial Oversight

1. **Setup Test Withdrawal** (needs schema & API):

   - Create withdrawal request via Prisma Studio or API:
     ```sql
     INSERT INTO withdrawal_requests (
       id, userId, amount, bankName, accountNumber,
       accountName, status, requestDate
     ) VALUES (
       'test1', '<user-id>', 50000, 'GTBank',
       '0123456789', 'John Doe', 'PENDING', datetime('now')
     );
     ```

2. **Test Approve Withdrawal**:

   - Navigate to "Financial Oversight" tab
   - View pending withdrawals
   - Click "Approve"
   - Enter transaction ID
   - Add optional notes
   - Verify status changes to APPROVED
   - Check approvedBy, approvedAt, transactionId populated
   - Check audit log for APPROVE_WITHDRAWAL

3. **Test Reject Withdrawal**:

   - Create another withdrawal request
   - Click "Reject"
   - Enter reason (min 10 chars)
   - Verify status changes to REJECTED
   - Check adminNotes populated
   - Check audit log for REJECT_WITHDRAWAL

4. **Test Financial Stats**:

   - Verify stats cards display:
     - Pending withdrawals count & amount
     - Approved withdrawals count & amount
     - Active investments count
     - Total investment volume
   - Check recent withdrawals list
   - Check recent investments list

5. **Test Filters**:
   - Filter by status (PENDING, APPROVED, REJECTED)
   - Verify pagination works
   - Check bank details display correctly

### 8. Test Phase 5: System Configuration

1. **Initialize Settings**:

   - Navigate to "System Configuration" tab
   - If no settings exist, click "Initialize Settings"
   - Verify 12 default settings created:
     - platform.commission_rate (5.0)
     - platform.withdrawal_fee (100)
     - investment.minimum_amount (10000)
     - investment.maximum_amount (50000000)
     - withdrawal.minimum_amount (5000)
     - withdrawal.auto_approve_threshold (100000)
     - features.email_notifications (true)
     - features.user_registration (true)
     - features.opportunity_creation (true)
     - features.maintenance_mode (false)
     - business.max_opportunities_per_user (10)
     - business.review_timeout_days (7)

2. **Test Update NUMBER Setting**:

   - Find "platform.commission_rate"
   - Click "Edit"
   - Change value to "7.5"
   - Click "Save"
   - Verify value updated
   - Check audit log for UPDATE_SETTING
   - Verify updatedBy shows current admin

3. **Test Update BOOLEAN Setting**:

   - Find "features.maintenance_mode"
   - Click "Edit"
   - Change to "true"
   - Save
   - Verify value updated
   - Change back to "false"

4. **Test Invalid Values**:

   - Try to set NUMBER to non-numeric value
   - Should show validation error
   - Try to set BOOLEAN to invalid value
   - Should show validation error

5. **Test Category Filter**:
   - Filter by INVESTMENT
   - Filter by COMMISSION
   - Filter by LIMITS
   - Filter by FEATURES
   - Verify correct settings shown

### 9. Test Audit Trail

1. **Query Audit Logs**:

   ```sql
   -- In Prisma Studio, view admin_audit_logs table
   -- Verify all admin actions logged:
   SELECT action, targetType, adminId, createdAt
   FROM admin_audit_logs
   ORDER BY createdAt DESC
   LIMIT 20;
   ```

2. **Verify Log Contents**:
   - Each action has correct adminId
   - targetType matches action
   - details JSON contains relevant info
   - ipAddress captured
   - userAgent captured
   - Timestamps are correct

### 10. Test Role-Based Access Control

1. **Test Non-Admin Access**:

   - Login as INVESTOR or BUSINESS_OWNER
   - Try to access admin endpoints directly:
     - GET /api/admin/users
     - POST /api/admin/opportunities/[id]/approve
     - PATCH /api/admin/settings/platform.commission_rate
   - All should return 403 Forbidden

2. **Test Unauthenticated Access**:
   - Logout
   - Try accessing any admin endpoint
   - Should return 401 Unauthorized

### 11. Test Edge Cases

1. **Self-Actions**:

   - Try to suspend yourself (should fail)
   - Try to change your own role (should fail)
   - Try to change another admin's role (should fail)

2. **Duplicate Actions**:

   - Approve already approved opportunity
   - Suspend already suspended user
   - Try to initialize settings twice

3. **Invalid IDs**:

   - Try actions with non-existent IDs
   - Should return 404 Not Found

4. **Validation**:
   - Submit forms with too-short reasons
   - Submit empty required fields
   - Verify proper error messages

## Expected Results Summary

After all tests:

- ✅ All admin actions complete successfully
- ✅ Database updates reflected correctly
- ✅ Audit logs capture all actions
- ✅ Role-based access working
- ✅ Validation preventing invalid data
- ✅ Error handling working properly
- ✅ UI updates reflect changes
- ✅ No console errors
- ✅ Build completes successfully: `npm run build`

## Build Verification

Final build should show 34 routes including:

- 20 admin API endpoints
- 5 admin panel components integrated
- All TypeScript compilation clean
- No runtime errors

```bash
npm run build
# Should see:
# ✓ Compiled successfully
# ✓ Generating static pages (34/34)
```

## Database State After Testing

AdminAuditLog should contain entries for:

- APPROVE_OPPORTUNITY
- REJECT_OPPORTUNITY
- REQUEST_OPPORTUNITY_CHANGES
- SUSPEND_USER
- UNSUSPEND_USER
- VERIFY_USER
- UNVERIFY_USER
- CHANGE_USER_ROLE
- UPDATE_REPORT
- DELETE_REPORT
- APPROVE_WITHDRAWAL
- REJECT_WITHDRAWAL
- UPDATE_SETTING

## Notes

- All email notifications are TODOs (not yet implemented)
- Consider rate limiting for production
- Add email notifications in next phase
- Consider adding bulk actions
- Add export functionality for audit logs

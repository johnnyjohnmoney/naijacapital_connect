# Opportunity Deletion & Cancellation Flow

## Overview

Business owners can delete or request cancellation of their opportunities based on the opportunity's state and investment status.

---

## Flow Decision Tree

```
Business Owner wants to remove opportunity
    │
    ├─ Status: PENDING_REVIEW, NEEDS_REVISION, or REJECTED
    │  └─ No investments
    │     └─ ✅ Direct Delete (DELETE /api/opportunities/[id])
    │
    ├─ Status: OPEN, FULLY_FUNDED
    │  OR Has investments
    │     └─ Request Cancellation (POST /api/opportunities/[id]/request-cancel)
    │        └─ Status becomes SUSPENDED
    │           └─ Admin reviews
    │              ├─ Approve (POST /api/admin/opportunities/[id]/cancel)
    │              │  └─ Status becomes CANCELLED
    │              │     └─ Investments refunded
    │              │
    │              └─ Reject (can reuse existing reject endpoint)
    │                 └─ Status reverts or stays as needed
```

---

## Implementation

### 1. Direct Delete (Business Owner)

**Endpoint:** `DELETE /api/opportunities/[id]`

**When Allowed:**

- Status is `PENDING_REVIEW`, `NEEDS_REVISION`, or `REJECTED`
- No active investments
- User is the owner

**Process:**

1. Verify ownership
2. Check status and investment count
3. Delete from database (cascade deletes related records)
4. Send notification to owner

**Response:**

```json
{
  "success": true,
  "message": "Opportunity deleted successfully"
}
```

**Error Response (requires cancellation):**

```json
{
  "error": "Cannot delete opportunity with investments or approved status",
  "message": "This opportunity has active investments. Please request cancellation instead.",
  "requiresCancellation": true
}
```

---

### 2. Request Cancellation (Business Owner)

**Endpoint:** `POST /api/opportunities/[id]/request-cancel`

**Body:**

```json
{
  "reason": "Detailed reason for cancellation (min 20 characters)"
}
```

**When Required:**

- Opportunity has `OPEN` or `FULLY_FUNDED` status
- Has active investments
- Owner wants to cancel

**Process:**

1. Verify ownership
2. Update status to `SUSPENDED` (pending admin review)
3. Store cancellation reason in `adminNotes`
4. Notify owner of submission
5. Notify admins of pending review (TODO: implement)

**Response:**

```json
{
  "success": true,
  "message": "Cancellation request submitted successfully",
  "opportunity": {
    "id": "...",
    "status": "SUSPENDED"
  }
}
```

---

### 3. Approve Cancellation (Admin)

**Endpoint:** `POST /api/admin/opportunities/[id]/cancel`

**Body:**

```json
{
  "refundInvestments": true,
  "adminNotes": "Optional admin notes about the cancellation decision"
}
```

**Process:**

1. Verify opportunity has `SUSPENDED` status
2. Update status to `CANCELLED`
3. If `refundInvestments: true`:
   - Mark all active investments as `CANCELLED`
   - Create refund notifications for all investors
   - TODO: Trigger actual payment processor refunds
4. Notify business owner of approval
5. Log admin action to audit trail

**Response:**

```json
{
  "success": true,
  "message": "Cancellation approved successfully",
  "opportunity": {
    "id": "...",
    "status": "CANCELLED"
  },
  "refundedInvestments": 3
}
```

---

## Status Flow Diagram

```
PENDING_REVIEW ─────┐
                    ├─────> [Direct Delete] ──> DELETED
NEEDS_REVISION ─────┘

REJECTED ────────────────> [Direct Delete] ──> DELETED

OPEN ────────────┐
                 ├─────> [Request Cancel] ──> SUSPENDED ──> [Admin Approves] ──> CANCELLED
FULLY_FUNDED ────┘                                      └──> [Admin Rejects] ──> OPEN
```

---

## Database Fields Used

### Business Model Fields:

- `status`: OpportunityStatus enum
  - `PENDING_REVIEW`, `NEEDS_REVISION`, `REJECTED` → Can delete
  - `OPEN`, `FULLY_FUNDED` → Must request cancellation
  - `SUSPENDED` → Cancellation pending
  - `CANCELLED` → Permanently cancelled
- `adminNotes`: Stores cancellation reason and admin notes
- `reviewedBy`: Admin who approved cancellation
- `reviewedAt`: Timestamp of approval

### Investment Model:

- `status`: InvestmentStatus enum
  - `ACTIVE` → Will be changed to `CANCELLED` on refund
  - `CANCELLED` → Investment refunded

---

## UI Integration Points

### For Business Owners:

**My Opportunities Page:**

```typescript
// Show delete/cancel button based on status
if (
  status === "PENDING_REVIEW" ||
  status === "NEEDS_REVISION" ||
  status === "REJECTED"
) {
  // Show "Delete Opportunity" button
  // On click: DELETE /api/opportunities/[id]
} else if (status === "OPEN" || status === "FULLY_FUNDED") {
  // Show "Request Cancellation" button
  // On click: Open modal with reason textarea
  // Submit: POST /api/opportunities/[id]/request-cancel
} else if (status === "SUSPENDED") {
  // Show "Cancellation Pending" badge
  // Disable further actions
}
```

### For Admins:

**Opportunity Review Panel:**

```typescript
// Add filter for SUSPENDED status
// Show opportunities pending cancellation review
// Add "Approve Cancellation" button
// On click: Modal with:
//   - Reason from business owner
//   - Investment count
//   - Checkbox: "Refund all investments"
//   - Textarea: "Admin notes"
// Submit: POST /api/admin/opportunities/[id]/cancel
```

---

## Security Considerations

✅ **Ownership Verification**

- Business owners can only delete/cancel their own opportunities

✅ **Investment Protection**

- Cannot delete opportunities with active investments
- Requires admin approval for cancellation

✅ **Admin Only**

- Only admins can approve final cancellations
- All admin actions logged to audit trail

✅ **Status Validation**

- Strict status checks prevent invalid operations
- Clear error messages guide users to correct action

---

## Audit Logging

All admin cancellation approvals are logged with:

- Action: `APPROVE_CANCELLATION`
- Target: `BUSINESS`
- Details:
  - Opportunity title
  - Owner ID and name
  - Investment count
  - Refund decision
  - Admin notes

---

## Notifications

### Business Owner Receives:

1. **On Direct Delete:**

   - "Opportunity Deleted" - Confirmation

2. **On Cancellation Request:**

   - "Cancellation Request Submitted" - Pending review

3. **On Admin Approval:**
   - "Cancellation Request Approved" - With refund info

### Investors Receive:

1. **On Approved Cancellation with Refund:**
   - "Investment Cancelled - Refund Initiated"
   - Amount being refunded
   - Processing timeline (3-5 business days)

---

## TODOs

### High Priority:

- [ ] Implement actual payment processor refunds
- [ ] Add admin notification for new cancellation requests
- [ ] Add email notifications for all parties

### Medium Priority:

- [ ] Add cancellation request list in admin dashboard
- [ ] Create UI components for business owner cancellation flow
- [ ] Add ability for admin to reject cancellation requests
- [ ] Track refund status separately from investment status

### Low Priority:

- [ ] Add cancellation history/timeline view
- [ ] Add bulk cancellation approval for admins
- [ ] Add analytics for cancellation reasons

---

## Testing Scenarios

### Test 1: Direct Delete

1. Business owner creates opportunity
2. Before admin approves, owner deletes it
3. Verify opportunity removed from database
4. Verify notification sent

### Test 2: Cannot Delete with Investments

1. Business owner creates and gets approved opportunity
2. Investor makes investment
3. Owner tries to delete
4. Verify error message: "requiresCancellation: true"

### Test 3: Request Cancellation

1. Business owner requests cancellation with reason
2. Verify status becomes SUSPENDED
3. Verify adminNotes contains reason
4. Verify notification sent

### Test 4: Admin Approves Cancellation

1. Admin views SUSPENDED opportunity
2. Admin approves with refund option
3. Verify status becomes CANCELLED
4. Verify all investments marked CANCELLED
5. Verify all investors notified
6. Verify audit log entry

### Test 5: Security - Cannot Delete Others' Opportunities

1. Business owner A creates opportunity
2. Business owner B tries to delete it
3. Verify 403 Forbidden error

---

## API Summary

| Endpoint                                 | Method | Role           | Purpose                        |
| ---------------------------------------- | ------ | -------------- | ------------------------------ |
| `/api/opportunities/[id]`                | DELETE | BUSINESS_OWNER | Direct delete (no investments) |
| `/api/opportunities/[id]/request-cancel` | POST   | BUSINESS_OWNER | Request cancellation           |
| `/api/admin/opportunities/[id]/cancel`   | POST   | ADMINISTRATOR  | Approve cancellation           |

---

## Implementation Status

✅ **Completed:**

- DELETE endpoint for direct deletion
- POST endpoint for cancellation requests
- POST endpoint for admin approval
- Status validation logic
- Ownership verification
- Investment refund marking
- Notification creation
- Audit logging

⚠️ **Pending:**

- Actual payment refund processing
- Admin notification system
- Email notifications
- UI components
- Admin dashboard integration

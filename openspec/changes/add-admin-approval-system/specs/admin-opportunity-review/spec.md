## ADDED Requirements

### Requirement: Opportunity Approval Workflow

The system SHALL implement a comprehensive approval workflow for investment opportunities where business owners submit opportunities for admin review before they become visible to investors.

#### Scenario: Business owner submits new opportunity

- **WHEN** a business owner creates a new investment opportunity
- **THEN** the opportunity status SHALL be set to PENDING_REVIEW
- **AND** the opportunity SHALL NOT be visible to investors
- **AND** the business owner SHALL receive confirmation that their submission is under review
- **AND** admins SHALL be notified of the new pending opportunity

#### Scenario: Admin approves opportunity

- **WHEN** an admin approves a PENDING_REVIEW opportunity
- **THEN** the opportunity status SHALL change to OPEN
- **AND** the opportunity SHALL become visible to all investors
- **AND** the reviewedBy field SHALL be set to the approving admin's ID
- **AND** the reviewedAt field SHALL be set to current timestamp
- **AND** an audit log entry SHALL be created recording the approval
- **AND** the business owner SHALL receive an email notification of approval
- **AND** the business owner SHALL receive an in-app notification

#### Scenario: Admin rejects opportunity

- **WHEN** an admin rejects a PENDING_REVIEW opportunity with a rejection reason
- **THEN** the opportunity status SHALL change to REJECTED
- **AND** the rejectionReason field SHALL be populated with admin's explanation
- **AND** the reviewedBy and reviewedAt fields SHALL be set
- **AND** an audit log entry SHALL be created recording the rejection
- **AND** the business owner SHALL receive an email notification with the rejection reason
- **AND** the business owner SHALL receive an in-app notification
- **AND** the opportunity SHALL remain invisible to investors

#### Scenario: Admin requests changes to opportunity

- **WHEN** an admin requests revisions to a PENDING_REVIEW opportunity
- **THEN** the opportunity status SHALL change to NEEDS_REVISION
- **AND** the revisionRequests field SHALL contain specific feedback for the business owner
- **AND** the reviewedBy and reviewedAt fields SHALL be set
- **AND** an audit log entry SHALL be created
- **AND** the business owner SHALL receive an email with detailed revision requests
- **AND** the business owner SHALL be able to edit and resubmit the opportunity

#### Scenario: Business owner resubmits revised opportunity

- **WHEN** a business owner updates a NEEDS_REVISION opportunity
- **THEN** the opportunity status SHALL change back to PENDING_REVIEW
- **AND** the revisionRequests field SHALL be cleared
- **AND** the reviewedBy and reviewedAt fields SHALL be cleared
- **AND** admins SHALL be notified of the resubmission
- **AND** the opportunity SHALL enter the review queue again

### Requirement: Opportunity Review Dashboard

The system SHALL provide admins with a comprehensive dashboard to review, filter, search, and manage investment opportunities across all statuses.

#### Scenario: Admin views pending opportunities

- **WHEN** an admin accesses the opportunity review dashboard
- **THEN** the system SHALL display all opportunities with status PENDING_REVIEW
- **AND** each opportunity SHALL show title, industry, target capital, business owner name, submission date
- **AND** opportunities SHALL be sorted by submission date (oldest first) by default
- **AND** the admin SHALL be able to click on any opportunity to view full details

#### Scenario: Admin filters opportunities by status

- **WHEN** an admin applies a status filter
- **THEN** the system SHALL display only opportunities matching the selected status
- **AND** supported statuses SHALL include PENDING_REVIEW, NEEDS_REVISION, APPROVED, REJECTED, SUSPENDED
- **AND** the count of opportunities in each status SHALL be displayed on filter tabs

#### Scenario: Admin searches opportunities

- **WHEN** an admin enters a search query
- **THEN** the system SHALL search opportunity titles, descriptions, industries, and business owner names
- **AND** results SHALL update in real-time as the admin types
- **AND** the search SHALL be case-insensitive
- **AND** the admin SHALL be able to combine search with status filters

#### Scenario: Admin views opportunity details

- **WHEN** an admin clicks on an opportunity to view details
- **THEN** the system SHALL display complete opportunity information including title, description, detailed business plan, financials, timeline, risk level
- **AND** the system SHALL display business owner information including name, email, account creation date
- **AND** the system SHALL display the owner's opportunity history including past opportunities, approval rate, success rate
- **AND** the system SHALL provide action buttons for approve, reject, request changes
- **AND** the system SHALL display any previous admin notes or revision requests

#### Scenario: Admin adds internal notes to opportunity

- **WHEN** an admin adds notes to an opportunity
- **THEN** the adminNotes field SHALL be updated
- **AND** the notes SHALL only be visible to admins
- **AND** the notes SHALL not be visible to business owners or investors
- **AND** the notes SHALL be preserved across status changes
- **AND** an audit log entry SHALL record who added the notes and when

### Requirement: Bulk Opportunity Actions

The system SHALL enable admins to perform actions on multiple opportunities simultaneously for operational efficiency.

#### Scenario: Admin bulk approves opportunities

- **WHEN** an admin selects multiple PENDING_REVIEW opportunities and clicks bulk approve
- **THEN** the system SHALL approve each selected opportunity
- **AND** each approval SHALL trigger individual audit logs, notifications, and emails
- **AND** the system SHALL display a progress indicator during bulk processing
- **AND** the system SHALL report success and failure counts after completion
- **AND** failed approvals SHALL display error reasons

#### Scenario: Admin bulk rejects opportunities

- **WHEN** an admin selects multiple opportunities and clicks bulk reject
- **THEN** the system SHALL prompt for a common rejection reason
- **AND** each selected opportunity SHALL be rejected with the provided reason
- **AND** individual notifications and audit logs SHALL be created for each
- **AND** the system SHALL report results after completion

### Requirement: Featured Opportunities

The system SHALL allow admins to feature high-quality opportunities for prominent display on the platform homepage and opportunity listings.

#### Scenario: Admin features an approved opportunity

- **WHEN** an admin marks an OPEN opportunity as featured
- **THEN** the isFeatured field SHALL be set to true
- **AND** the opportunity SHALL appear in a featured section on the homepage
- **AND** an audit log entry SHALL record the featuring action
- **AND** the business owner SHALL be notified that their opportunity has been featured

#### Scenario: System enforces featured opportunity limit

- **WHEN** the maximum number of featured opportunities has been reached
- **AND** an admin attempts to feature another opportunity
- **THEN** the system SHALL display an error message
- **AND** the system SHALL indicate which opportunities are currently featured
- **AND** the admin SHALL be able to unfeature an existing opportunity to make room

#### Scenario: Admin unfeatures an opportunity

- **WHEN** an admin removes featured status from an opportunity
- **THEN** the isFeatured field SHALL be set to false
- **AND** the opportunity SHALL be removed from featured sections
- **AND** the opportunity SHALL remain OPEN and visible in regular listings
- **AND** an audit log entry SHALL record the action

### Requirement: Opportunity Suspension

The system SHALL allow admins to temporarily suspend published opportunities in response to reports, compliance issues, or policy violations.

#### Scenario: Admin suspends an active opportunity

- **WHEN** an admin suspends an OPEN opportunity
- **THEN** the opportunity status SHALL change to SUSPENDED
- **AND** the opportunity SHALL become invisible to investors immediately
- **AND** existing investments SHALL not be affected
- **AND** new investments SHALL be prevented
- **AND** an audit log entry SHALL record the suspension with reason
- **AND** the business owner SHALL receive an email notification explaining the suspension

#### Scenario: Admin reinstates suspended opportunity

- **WHEN** an admin reinstates a SUSPENDED opportunity
- **THEN** the opportunity status SHALL change back to OPEN
- **AND** the opportunity SHALL become visible to investors again
- **AND** investors SHALL be able to invest in the opportunity
- **AND** an audit log entry SHALL record the reinstatement
- **AND** the business owner SHALL receive an email notification

### Requirement: Opportunity Visibility Rules

The system SHALL enforce status-based visibility rules to ensure only approved opportunities are accessible to investors while maintaining transparency for business owners and admins.

#### Scenario: Investor views opportunity listings

- **WHEN** an investor browses investment opportunities
- **THEN** the system SHALL only display opportunities with status OPEN, CLOSED, FULLY_FUNDED, or CANCELLED
- **AND** opportunities with status PENDING_REVIEW, NEEDS_REVISION, REJECTED, or SUSPENDED SHALL be hidden
- **AND** the investor SHALL not be able to access hidden opportunities via direct URL

#### Scenario: Business owner views their opportunities

- **WHEN** a business owner views their opportunity dashboard
- **THEN** the system SHALL display all opportunities they created regardless of status
- **AND** each opportunity SHALL clearly display its current status
- **AND** opportunities with status NEEDS_REVISION SHALL show revision requests
- **AND** opportunities with status REJECTED SHALL show rejection reasons
- **AND** the business owner SHALL be able to edit NEEDS_REVISION opportunities

#### Scenario: Admin views all opportunities

- **WHEN** an admin accesses opportunity listings
- **THEN** the system SHALL display opportunities with all statuses
- **AND** the admin SHALL be able to filter and search across all statuses
- **AND** the admin SHALL be able to access any opportunity regardless of status

### Requirement: Opportunity Status Transitions

The system SHALL enforce valid status transition rules to maintain data integrity and workflow consistency.

#### Scenario: Valid status transitions

- **GIVEN** an opportunity in any status
- **WHEN** a status change is requested
- **THEN** the system SHALL only allow valid transitions according to these rules:
  - PENDING_REVIEW → OPEN (admin approves)
  - PENDING_REVIEW → NEEDS_REVISION (admin requests changes)
  - PENDING_REVIEW → REJECTED (admin rejects)
  - NEEDS_REVISION → PENDING_REVIEW (owner resubmits)
  - OPEN → SUSPENDED (admin suspends)
  - OPEN → CLOSED (target reached or timeline expired)
  - OPEN → FULLY_FUNDED (target capital reached)
  - SUSPENDED → OPEN (admin reinstates)
  - Any status → CANCELLED (owner cancels or admin force-cancels)

#### Scenario: Invalid status transition

- **WHEN** an invalid status transition is attempted
- **THEN** the system SHALL reject the request with HTTP 400 error
- **AND** the error message SHALL explain why the transition is not allowed
- **AND** the error message SHALL indicate the current status
- **AND** no database changes SHALL occur

### Requirement: Admin Review Metrics

The system SHALL track and display key metrics about the opportunity review process to help admins monitor workload and performance.

#### Scenario: Admin views review metrics dashboard

- **WHEN** an admin accesses the review metrics section
- **THEN** the system SHALL display total count of opportunities in each status
- **AND** the system SHALL display average review turnaround time (submission to approval/rejection)
- **AND** the system SHALL display count of opportunities reviewed by each admin in selected time period
- **AND** the system SHALL display approval rate vs rejection rate
- **AND** the system SHALL display oldest pending opportunity and its wait time
- **AND** the system SHALL display featured opportunities count and available slots

#### Scenario: System tracks review turnaround time

- **WHEN** an opportunity is approved or rejected
- **THEN** the system SHALL calculate time difference between submittedAt and reviewedAt
- **AND** the system SHALL store this metric for reporting
- **AND** the system SHALL include this in aggregate statistics
- **AND** outliers (>7 days) SHALL be highlighted for investigation

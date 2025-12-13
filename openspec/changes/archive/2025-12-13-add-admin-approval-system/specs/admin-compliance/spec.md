## ADDED Requirements

### Requirement: User Report Submission

The system SHALL allow users to report inappropriate content, suspicious activity, or policy violations for admin review.

#### Scenario: User reports an opportunity

- **WHEN** a user clicks report on an investment opportunity
- **THEN** the system SHALL display a report form with reason categories
- **AND** available categories SHALL include Fraud/Scam, Misleading Information, Inappropriate Content, Duplicate Listing, Other
- **AND** the user SHALL be required to select a category
- **AND** the user SHALL be able to provide detailed description (optional, max 1000 characters)
- **AND** upon submission, a ReportedContent record SHALL be created with status PENDING
- **AND** the user SHALL receive confirmation that their report was submitted
- **AND** admins SHALL be notified of the new report

#### Scenario: User reports another user

- **WHEN** a user reports another user's profile or behavior
- **THEN** the system SHALL create a report with targetType USER
- **AND** available categories SHALL include Harassment, Fraud, Spam, Impersonation, Other
- **AND** the reporting user's identity SHALL be recorded for investigation
- **AND** the system SHALL prevent duplicate reports from same user for same target within 30 days

#### Scenario: Anonymous reporting

- **WHEN** the platform allows anonymous reports
- **THEN** the reportedById field MAY be null
- **AND** the report SHALL still be processed and reviewed
- **AND** follow-up communication SHALL not be possible for anonymous reports

### Requirement: Compliance Dashboard

The system SHALL provide admins with a centralized dashboard to monitor, review, and resolve reported content and compliance issues.

#### Scenario: Admin views pending reports

- **WHEN** an admin accesses the compliance dashboard
- **THEN** the system SHALL display all reports with status PENDING or UNDER_REVIEW
- **AND** reports SHALL be sorted by priority (CRITICAL, HIGH, MEDIUM, LOW) then by creation date
- **AND** each report SHALL display report type, target type, reporter name, creation date, and priority
- **AND** the admin SHALL be able to click any report to view full details

#### Scenario: Admin filters reports by status

- **WHEN** an admin applies a status filter
- **THEN** the system SHALL display only reports with the selected status
- **AND** available statuses SHALL include PENDING, UNDER_REVIEW, RESOLVED, DISMISSED
- **AND** the count of reports in each status SHALL be displayed

#### Scenario: Admin filters reports by target type

- **WHEN** an admin applies a target type filter
- **THEN** the system SHALL display only reports for the selected target type
- **AND** available types SHALL include BUSINESS (opportunities), USER, INVESTMENT
- **AND** the admin SHALL be able to combine multiple filters

#### Scenario: Admin filters reports by priority

- **WHEN** an admin applies a priority filter
- **THEN** the system SHALL display reports matching the selected priority
- **AND** priority levels SHALL be CRITICAL, HIGH, MEDIUM, LOW
- **AND** the system SHALL highlight CRITICAL priority reports with red indicator

### Requirement: Report Review Workflow

The system SHALL provide a structured workflow for admins to investigate, document, and resolve reported content.

#### Scenario: Admin reviews report details

- **WHEN** an admin clicks on a report to review
- **THEN** the system SHALL display complete report information including reporter name, report reason, description, timestamp
- **AND** the system SHALL display the reported content in context (full opportunity details or user profile)
- **AND** the system SHALL display history of previous reports against the same target
- **AND** the system SHALL display any automated flags associated with the target
- **AND** the admin SHALL see action buttons for Mark Under Review, Resolve, Dismiss

#### Scenario: Admin marks report as under review

- **WHEN** an admin marks a report as UNDER_REVIEW
- **THEN** the report status SHALL change to UNDER_REVIEW
- **AND** the reviewedBy field SHALL be set to the admin's ID
- **AND** the reviewedAt field SHALL be set to current timestamp
- **AND** an audit log entry SHALL be created
- **AND** the report SHALL be assigned to that admin
- **AND** other admins SHALL see who is reviewing the report

#### Scenario: Admin resolves report with action

- **WHEN** an admin resolves a report by taking action on the target
- **THEN** the admin SHALL select resolution type (Content Removed, User Suspended, Opportunity Suspended, Warning Issued)
- **AND** the admin SHALL provide resolution notes explaining the action taken
- **AND** the report status SHALL change to RESOLVED
- **AND** the resolution field SHALL contain the resolution notes
- **AND** an audit log entry SHALL be created
- **AND** the reporter SHALL receive notification that their report was reviewed and action was taken
- **AND** the reported user/owner SHALL receive notification of the action

#### Scenario: Admin dismisses report as unfounded

- **WHEN** an admin dismisses a report as invalid or unfounded
- **THEN** the admin SHALL provide dismissal reason
- **AND** the report status SHALL change to DISMISSED
- **AND** the resolution field SHALL contain the dismissal reason
- **AND** an audit log entry SHALL be created
- **AND** the reporter SHALL receive notification that their report was reviewed but no action was needed

#### Scenario: Admin escalates report

- **WHEN** an admin identifies a report requiring senior review or legal attention
- **THEN** the admin SHALL be able to escalate the report to CRITICAL priority
- **AND** the admin SHALL add escalation notes
- **AND** designated senior admins SHALL receive immediate notification
- **AND** the report SHALL be marked with escalation indicator

### Requirement: Automated Compliance Flagging

The system SHALL automatically detect and flag suspicious patterns, policy violations, and potentially fraudulent activity for admin review.

#### Scenario: System flags multiple failed investment attempts

- **WHEN** a user attempts 5 or more investments that fail within 24 hours
- **THEN** the system SHALL create an automated ReportedContent entry
- **AND** the report type SHALL be AUTOMATED_FLAG
- **AND** the report reason SHALL be "Multiple Failed Investment Attempts"
- **AND** the priority SHALL be set to HIGH
- **AND** admins SHALL be notified of the flag
- **AND** the user's account SHALL be monitored for additional suspicious activity

#### Scenario: System flags unusual withdrawal pattern

- **WHEN** a user makes an investment and immediately requests withdrawal of returns
- **AND** this pattern occurs within 48 hours of investment
- **THEN** the system SHALL create an automated flag
- **AND** the report reason SHALL be "Suspicious Withdrawal Pattern"
- **AND** the priority SHALL be set to HIGH
- **AND** the withdrawal request SHALL be marked for manual review

#### Scenario: System flags duplicate business descriptions

- **WHEN** a business owner submits an opportunity with description substantially similar to another opportunity
- **AND** similarity exceeds 80% based on text comparison
- **THEN** the system SHALL create an automated flag
- **AND** the report reason SHALL be "Duplicate/Plagiarized Content"
- **AND** the priority SHALL be set to MEDIUM
- **AND** both opportunities SHALL be linked in the flag details

#### Scenario: System flags high-risk ROI promises

- **WHEN** a business owner creates an opportunity with expectedROI greater than 100% annually
- **THEN** the system SHALL create an automated flag
- **AND** the report reason SHALL be "Unrealistic ROI Promise - Potential Fraud Indicator"
- **AND** the priority SHALL be set to HIGH
- **AND** the opportunity review SHALL require additional scrutiny

#### Scenario: System flags multiple accounts from same IP

- **WHEN** the system detects 3 or more BUSINESS_OWNER accounts created from the same IP address within 7 days
- **THEN** the system SHALL create an automated flag for each account
- **AND** the report reason SHALL be "Multiple Accounts from Same IP"
- **AND** all linked accounts SHALL be identified in the flag
- **AND** the priority SHALL be set to HIGH

#### Scenario: System flags rapid sequential investments

- **WHEN** a user makes 10 or more investments in less than 1 hour
- **THEN** the system SHALL create an automated flag
- **AND** the report reason SHALL be "Suspicious Investment Velocity"
- **AND** the priority SHALL be set to MEDIUM
- **AND** the admin SHALL review for bot activity or account compromise

### Requirement: Compliance Metrics Dashboard

The system SHALL track and display key compliance metrics to help admins monitor platform health and identify trends.

#### Scenario: Admin views compliance overview

- **WHEN** an admin accesses the compliance metrics dashboard
- **THEN** the system SHALL display total reports by status (pending, under review, resolved, dismissed)
- **AND** the system SHALL display count of automated flags generated in last 7/30/90 days
- **AND** the system SHALL display average resolution time for reports
- **AND** the system SHALL display most common report reasons
- **AND** the system SHALL display report volume trend chart
- **AND** the system SHALL highlight any spike in report volume

#### Scenario: Admin views flagging effectiveness

- **WHEN** an admin reviews automated flag metrics
- **THEN** the system SHALL display total automated flags generated
- **AND** the system SHALL display false positive rate (flags dismissed as invalid)
- **AND** the system SHALL display true positive rate (flags confirmed as violations)
- **AND** the system SHALL display breakdown by flag type
- **AND** the system SHALL allow adjustment of flag sensitivity thresholds

#### Scenario: Admin views report resolution statistics

- **WHEN** an admin views resolution metrics
- **THEN** the system SHALL display resolution breakdown (content removed, suspension, warning, dismissed)
- **AND** the system SHALL display average time to first review
- **AND** the system SHALL display average time to resolution
- **AND** the system SHALL identify bottlenecks (reports pending >7 days)
- **AND** the system SHALL display resolution rate by admin

### Requirement: Target Context in Reports

The system SHALL provide comprehensive context about reported targets to enable informed admin decisions.

#### Scenario: Admin views reported opportunity context

- **WHEN** an admin reviews a report about an opportunity
- **THEN** the system SHALL display the complete opportunity details
- **AND** the system SHALL display the business owner's profile and history
- **AND** the system SHALL display count of previous reports against this opportunity
- **AND** the system SHALL display count of previous reports against this business owner
- **AND** the system SHALL display the opportunity's performance metrics (views, investments, comments)
- **AND** the system SHALL provide quick action buttons (suspend opportunity, contact owner, request changes)

#### Scenario: Admin views reported user context

- **WHEN** an admin reviews a report about a user
- **THEN** the system SHALL display the user's complete profile
- **AND** the system SHALL display the user's activity history (investments, opportunities, messages)
- **AND** the system SHALL display count of previous reports against this user
- **AND** the system SHALL display any warnings or suspensions in user's history
- **AND** the system SHALL display user's account age and verification status
- **AND** the system SHALL provide quick action buttons (suspend user, send warning, ban user)

### Requirement: Bulk Report Actions

The system SHALL enable admins to process multiple similar reports efficiently through bulk operations.

#### Scenario: Admin bulk dismisses spam reports

- **WHEN** an admin identifies multiple reports as spam or invalid
- **AND** the admin selects those reports and clicks bulk dismiss
- **THEN** the system SHALL prompt for a common dismissal reason
- **AND** all selected reports SHALL be dismissed with the provided reason
- **AND** individual audit log entries SHALL be created for each
- **AND** reporters SHALL receive automated notifications
- **AND** the system SHALL display success count after completion

#### Scenario: Admin bulk resolves related reports

- **WHEN** multiple reports are filed against the same target
- **AND** the admin takes action on the target (e.g., suspends opportunity)
- **THEN** the admin SHALL be able to bulk resolve all related reports
- **AND** all reports SHALL reference the common resolution action
- **AND** all reporters SHALL be notified of the resolution

### Requirement: Compliance Notification System

The system SHALL notify admins of compliance issues requiring attention and notify users of compliance actions taken.

#### Scenario: Admin receives high-priority report notification

- **WHEN** a report with HIGH or CRITICAL priority is created
- **THEN** admins SHALL receive an immediate email notification
- **AND** the notification SHALL include report type, target, reporter, and reason
- **AND** the notification SHALL include direct link to review the report
- **AND** admins SHALL receive in-app notification badge

#### Scenario: Admin receives daily compliance digest

- **WHEN** the daily digest job runs (configurable time)
- **THEN** admins SHALL receive an email summarizing pending compliance items
- **AND** the digest SHALL include count of pending reports, automated flags, escalated items
- **AND** the digest SHALL include links to the compliance dashboard
- **AND** the digest SHALL only be sent if there are pending items

#### Scenario: User receives report outcome notification

- **WHEN** a report submitted by a user is resolved or dismissed
- **THEN** the user SHALL receive an email notification
- **AND** the notification SHALL state whether action was taken
- **AND** the notification SHALL not disclose specific actions for privacy
- **AND** the notification SHALL thank the user for reporting
- **AND** the notification SHALL encourage reporting of future issues

### Requirement: Compliance Configuration

The system SHALL allow admins to configure automated flagging rules and compliance thresholds through the admin interface.

#### Scenario: Admin adjusts automated flag thresholds

- **WHEN** an admin accesses compliance configuration settings
- **THEN** the admin SHALL be able to adjust threshold for failed investment attempts (default: 5 in 24 hours)
- **AND** the admin SHALL be able to adjust ROI flag threshold (default: >100% annually)
- **AND** the admin SHALL be able to adjust duplicate content similarity threshold (default: 80%)
- **AND** the admin SHALL be able to enable/disable specific automated flags
- **AND** changes SHALL be logged in audit trail

#### Scenario: Admin configures report categories

- **WHEN** an admin manages report categories
- **THEN** the admin SHALL be able to add custom report reasons
- **AND** the admin SHALL be able to deactivate unused categories
- **AND** the admin SHALL be able to set default priority for each category
- **AND** changes SHALL affect future reports immediately

### Requirement: Compliance Audit Trail

The system SHALL maintain a complete audit trail of all compliance-related actions for regulatory and accountability purposes.

#### Scenario: System logs all compliance actions

- **WHEN** an admin performs any compliance action
- **THEN** an AdminAuditLog entry SHALL be created
- **AND** the log SHALL include action type, target details, admin ID, timestamp
- **AND** the log SHALL include full context (report ID, resolution, notes)
- **AND** the log SHALL include admin's IP address and user agent
- **AND** audit logs SHALL be immutable (no updates or deletes allowed)

#### Scenario: Admin reviews compliance audit logs

- **WHEN** an admin accesses the compliance audit log
- **THEN** the system SHALL display all compliance-related actions chronologically
- **AND** the admin SHALL be able to filter by action type, target type, date range, admin
- **AND** the admin SHALL be able to search audit logs by keyword
- **AND** the admin SHALL be able to export audit logs to CSV
- **AND** exports SHALL be logged in the audit trail

#### Scenario: System enforces audit log retention

- **WHEN** audit logs reach the configured retention period (default: 2 years)
- **THEN** the system SHALL archive old logs to long-term storage
- **AND** archived logs SHALL remain queryable but read-only
- **AND** the retention policy SHALL be configurable by admins
- **AND** compliance-related logs SHALL have extended retention (5+ years)

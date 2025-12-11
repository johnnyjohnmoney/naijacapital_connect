## ADDED Requirements

### Requirement: User Account Search and Filtering

The system SHALL provide admins with comprehensive search and filtering capabilities to locate and manage user accounts efficiently.

#### Scenario: Admin searches users by name or email

- **WHEN** an admin enters a search query in the user management dashboard
- **THEN** the system SHALL search user names and email addresses
- **AND** results SHALL be displayed in real-time as the admin types
- **AND** the search SHALL be case-insensitive
- **AND** partial matches SHALL be included in results

#### Scenario: Admin filters users by role

- **WHEN** an admin applies a role filter
- **THEN** the system SHALL display only users with the selected role
- **AND** available roles SHALL include INVESTOR, BUSINESS_OWNER, ADMINISTRATOR
- **AND** the count of users in each role SHALL be displayed

#### Scenario: Admin filters users by account status

- **WHEN** an admin applies a status filter
- **THEN** the system SHALL display users matching the selected status
- **AND** available statuses SHALL include Active, Suspended, Banned, Unverified
- **AND** the system SHALL display count of users in each status category

#### Scenario: Admin filters users by registration date

- **WHEN** an admin selects a date range filter
- **THEN** the system SHALL display users registered within that date range
- **AND** the admin SHALL be able to use preset ranges (Last 7 days, Last 30 days, Last 90 days)
- **AND** the admin SHALL be able to specify custom date ranges

### Requirement: User Detail View

The system SHALL display comprehensive user information to admins for account management and compliance purposes.

#### Scenario: Admin views user profile details

- **WHEN** an admin clicks on a user to view details
- **THEN** the system SHALL display user's personal information including name, email, phone, address
- **AND** the system SHALL display account status, role, creation date, last login date
- **AND** the system SHALL display verification status and verification notes
- **AND** the system SHALL display suspension status, suspension date, and suspension reason if applicable
- **AND** the system SHALL display ban status, ban date, and ban reason if applicable

#### Scenario: Admin views user activity history

- **WHEN** an admin views a user's activity section
- **THEN** the system SHALL display all investments made by the user with amounts and dates
- **AND** the system SHALL display all business opportunities created by the user if they are a business owner
- **AND** the system SHALL display total investment amount and total returns received
- **AND** the system SHALL display message activity summary
- **AND** the system SHALL display recent notifications received by the user

#### Scenario: Admin views user's business opportunities

- **WHEN** an admin views a business owner's opportunities
- **THEN** the system SHALL display all opportunities created by the user
- **AND** each opportunity SHALL show title, status, target capital, amount raised, approval status
- **AND** the system SHALL calculate and display success rate (approved/submitted ratio)
- **AND** the system SHALL display any rejected opportunities with rejection reasons

#### Scenario: Admin views user's investment portfolio

- **WHEN** an admin views an investor's portfolio
- **THEN** the system SHALL display all active investments
- **AND** the system SHALL display completed investments with final returns
- **AND** the system SHALL calculate total investment amount, current value, and ROI
- **AND** the system SHALL display investment diversification across industries

### Requirement: User Account Suspension

The system SHALL allow admins to temporarily suspend user accounts for policy violations, suspicious activity, or compliance issues while preserving user data and maintaining reversibility.

#### Scenario: Admin suspends user account

- **WHEN** an admin suspends a user account with a suspension reason
- **THEN** the suspended field SHALL be set to true
- **AND** the suspendedAt field SHALL be set to current timestamp
- **AND** the suspensionReason field SHALL be populated with admin's explanation
- **AND** all active user sessions SHALL be invalidated immediately
- **AND** an audit log entry SHALL be created recording the suspension
- **AND** the user SHALL receive an email notification explaining the suspension
- **AND** the user SHALL receive an in-app notification

#### Scenario: Suspended user attempts to login

- **WHEN** a suspended user attempts to authenticate
- **THEN** the system SHALL reject the login attempt
- **AND** the system SHALL display a message stating "Your account has been suspended. Reason: [suspension reason]. Please contact support."
- **AND** the system SHALL not create a session token
- **AND** the login attempt SHALL be logged in audit trail

#### Scenario: Suspended user's existing sessions

- **WHEN** a user account is suspended
- **THEN** the system SHALL invalidate all existing JWT tokens immediately
- **AND** ongoing requests with the user's session SHALL be rejected
- **AND** the user SHALL be logged out from all devices and browsers

#### Scenario: Suspended user's content visibility

- **WHEN** a user is suspended
- **THEN** their business opportunities SHALL remain visible but marked as "Owner suspended"
- **AND** their existing investments SHALL remain active and continue to accrue returns
- **AND** their messages SHALL remain accessible to recipients
- **AND** the suspended user SHALL not be able to create new content

#### Scenario: Admin unsuspends user account

- **WHEN** an admin removes suspension from a user account
- **THEN** the suspended field SHALL be set to false
- **AND** the suspensionReason SHALL be preserved for audit purposes
- **AND** an audit log entry SHALL be created recording the unsuspension
- **AND** the user SHALL receive an email notification that their account has been restored
- **AND** the user SHALL be able to login and access the platform normally

### Requirement: User Account Ban

The system SHALL allow admins to permanently ban user accounts for severe policy violations, fraud, or legal reasons, preventing future access while maintaining data integrity.

#### Scenario: Admin bans user account

- **WHEN** an admin bans a user account with a ban reason
- **THEN** the bannedAt field SHALL be set to current timestamp
- **AND** the banReason field SHALL be populated with admin's explanation
- **AND** the suspended field SHALL be set to true
- **AND** all active user sessions SHALL be invalidated immediately
- **AND** an audit log entry SHALL be created recording the ban
- **AND** the user SHALL receive an email notification of account termination

#### Scenario: Banned user attempts to login

- **WHEN** a banned user attempts to authenticate
- **THEN** the system SHALL reject the login attempt
- **AND** the system SHALL display a message stating "Your account has been permanently terminated."
- **AND** the system SHALL not provide detailed ban reason in the login error
- **AND** the login attempt SHALL be logged

#### Scenario: Banned user's content

- **WHEN** a user account is banned
- **THEN** all their business opportunities SHALL be set to SUSPENDED status
- **AND** their opportunities SHALL be hidden from investors
- **AND** their existing investments SHALL remain active for investor protection
- **AND** their profile SHALL be hidden from public view

#### Scenario: Ban is permanent

- **WHEN** a user is banned
- **THEN** admins SHALL NOT be able to unban the account through the UI
- **AND** unbanning SHALL require direct database access or superadmin action
- **AND** the ban SHALL be recorded in audit logs permanently

### Requirement: User Verification Management

The system SHALL allow admins to manually verify user accounts for KYC compliance, trust indicators, and access to premium features.

#### Scenario: Admin verifies user account

- **WHEN** an admin marks a user as verified with optional verification notes
- **THEN** the verified field SHALL be set to true
- **AND** the verificationNotes field SHALL be populated with admin's comments
- **AND** an audit log entry SHALL be created recording the verification
- **AND** the user SHALL receive an email notification of successful verification
- **AND** the user SHALL see a verification badge on their profile

#### Scenario: Verified user benefits

- **WHEN** a user's account is verified
- **THEN** the user SHALL be able to create investment opportunities (if business owner)
- **AND** the user's profile SHALL display a "Verified" badge
- **AND** the user's opportunities SHALL be marked as "From Verified Owner"
- **AND** the user SHALL have higher credibility in the platform

#### Scenario: Admin removes verification

- **WHEN** an admin removes verification from a user account
- **THEN** the verified field SHALL be set to false
- **AND** the previous verificationNotes SHALL be preserved
- **AND** an audit log entry SHALL be created
- **AND** the user SHALL receive an email notification
- **AND** the verification badge SHALL be removed from the user's profile

### Requirement: User Activity Timeline

The system SHALL provide admins with a chronological timeline of user actions for investigation and support purposes.

#### Scenario: Admin views user timeline

- **WHEN** an admin accesses a user's activity timeline
- **THEN** the system SHALL display events in reverse chronological order (most recent first)
- **AND** each event SHALL include timestamp, action type, and relevant details
- **AND** event types SHALL include: account created, login, opportunity created, investment made, message sent, notification received, status changed

#### Scenario: Admin filters timeline by event type

- **WHEN** an admin applies an event type filter to the timeline
- **THEN** the system SHALL display only events of the selected type
- **AND** the admin SHALL be able to select multiple event types
- **AND** the timeline SHALL update immediately

#### Scenario: Admin exports user timeline

- **WHEN** an admin clicks export timeline
- **THEN** the system SHALL generate a CSV file with all timeline events
- **AND** the export SHALL include event timestamp, type, description, and related IDs
- **AND** the export action SHALL be logged in admin audit log

### Requirement: Bulk User Actions

The system SHALL enable admins to perform actions on multiple user accounts simultaneously for operational efficiency.

#### Scenario: Admin bulk suspends users

- **WHEN** an admin selects multiple users and clicks bulk suspend
- **THEN** the system SHALL prompt for a common suspension reason
- **AND** each selected user SHALL be suspended with the provided reason
- **AND** individual notifications and audit logs SHALL be created for each user
- **AND** the system SHALL report success and failure counts after completion

#### Scenario: Admin bulk verifies users

- **WHEN** an admin selects multiple users and clicks bulk verify
- **THEN** the system SHALL verify each selected user
- **AND** individual notifications and audit logs SHALL be created for each
- **AND** the system SHALL report results after completion

### Requirement: User Account Statistics

The system SHALL track and display key metrics about user accounts to help admins monitor platform health and identify trends.

#### Scenario: Admin views user statistics dashboard

- **WHEN** an admin accesses the user statistics section
- **THEN** the system SHALL display total user count by role
- **AND** the system SHALL display count of active, suspended, and banned users
- **AND** the system SHALL display verification rate (verified/total ratio)
- **AND** the system SHALL display new user registrations in last 7/30/90 days
- **AND** the system SHALL display user growth trend chart
- **AND** the system SHALL display user distribution by registration date

#### Scenario: Admin views investor metrics

- **WHEN** an admin filters statistics by investor role
- **THEN** the system SHALL display total number of investors
- **AND** the system SHALL display active investors (made at least 1 investment)
- **AND** the system SHALL display total investment volume
- **AND** the system SHALL display average investment per investor
- **AND** the system SHALL display investor retention rate

#### Scenario: Admin views business owner metrics

- **WHEN** an admin filters statistics by business owner role
- **THEN** the system SHALL display total number of business owners
- **AND** the system SHALL display active business owners (created at least 1 opportunity)
- **AND** the system SHALL display opportunity approval rate
- **AND** the system SHALL display average opportunities per business owner
- **AND** the system SHALL display successful funding rate

### Requirement: User Session Management

The system SHALL allow admins to view and manage active user sessions for security and troubleshooting purposes.

#### Scenario: Admin views user's active sessions

- **WHEN** an admin accesses a user's session information
- **THEN** the system SHALL display all active sessions for that user
- **AND** each session SHALL show device type, browser, IP address, location, login time
- **AND** the system SHALL highlight suspicious sessions (unusual location, multiple concurrent logins)

#### Scenario: Admin terminates user session

- **WHEN** an admin terminates a specific user session
- **THEN** the system SHALL invalidate that session token immediately
- **AND** the user SHALL be logged out from that device/browser
- **AND** an audit log entry SHALL be created
- **AND** other sessions SHALL remain active

#### Scenario: Admin terminates all user sessions

- **WHEN** an admin terminates all sessions for a user
- **THEN** the system SHALL invalidate all session tokens for that user
- **AND** the user SHALL be logged out from all devices
- **AND** an audit log entry SHALL be created
- **AND** the user SHALL need to re-authenticate to access the platform

### Requirement: User Communication Tools

The system SHALL provide admins with tools to communicate directly with users for support, warnings, or notifications.

#### Scenario: Admin sends direct message to user

- **WHEN** an admin composes and sends a message to a user
- **THEN** the message SHALL be created in the messaging system
- **AND** the message SHALL be marked as from ADMINISTRATOR
- **AND** the user SHALL receive an email notification about the admin message
- **AND** the user SHALL receive an in-app notification
- **AND** the user SHALL be able to reply to the admin message
- **AND** an audit log entry SHALL record the admin communication

#### Scenario: Admin sends warning notice to user

- **WHEN** an admin sends a warning notice for policy violation
- **THEN** the system SHALL create a high-priority notification for the user
- **AND** the notification SHALL be marked as "Official Warning"
- **AND** the user SHALL receive an email with the warning details
- **AND** the warning SHALL be logged in the user's account history
- **AND** the warning SHALL be visible to other admins reviewing the user

#### Scenario: Admin broadcasts message to user group

- **WHEN** an admin selects multiple users and sends a broadcast message
- **THEN** each user SHALL receive the message individually
- **AND** the message SHALL appear as a direct admin communication
- **AND** individual audit log entries SHALL be created for each recipient
- **AND** failed deliveries SHALL be reported to the admin

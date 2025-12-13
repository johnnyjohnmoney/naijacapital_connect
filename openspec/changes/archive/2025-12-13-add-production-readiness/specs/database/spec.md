## MODIFIED Requirements

### Requirement: Database Connection
The application SHALL use PostgreSQL as the primary database instead of SQLite for production deployments.

#### Scenario: Connection string from environment
- **WHEN** the application starts
- **THEN** it SHALL read the `DATABASE_URL` environment variable for database connection

#### Scenario: Connection validation on startup
- **WHEN** the application starts
- **THEN** it SHALL attempt to connect to the database and fail fast if connection is unsuccessful

#### Scenario: Connection pooling enabled
- **WHEN** running in production mode
- **THEN** Prisma SHALL use connection pooling to handle concurrent requests efficiently

### Requirement: Database Schema Provider
The Prisma schema SHALL be configured for PostgreSQL compatibility.

#### Scenario: PostgreSQL provider configured
- **WHEN** the Prisma schema is read
- **THEN** the datasource provider SHALL be set to `postgresql`

#### Scenario: Schema migrations work with PostgreSQL
- **WHEN** `prisma migrate deploy` is executed
- **THEN** migrations SHALL apply successfully to the PostgreSQL database

### Requirement: Data Migration from SQLite
The system SHALL provide tooling to migrate existing SQLite data to PostgreSQL.

#### Scenario: SQLite export creates backup
- **WHEN** the migration export command is run
- **THEN** it SHALL create a `backup.sql` file containing all SQLite data

#### Scenario: Migration documentation exists
- **WHEN** a developer needs to migrate data
- **THEN** clear step-by-step migration instructions SHALL be available in documentation

**BREAKING CHANGE**: SQLite is no longer supported in production. All production deployments MUST use PostgreSQL with the `DATABASE_URL` environment variable.

## ADDED Requirements

### Requirement: Docker Multi-Stage Build
The application SHALL provide a Dockerfile that supports production deployment.

#### Scenario: Dockerfile builds successfully
- **WHEN** `docker build -t naijacapital:latest .` is executed
- **THEN** the build SHALL complete without errors

#### Scenario: Multi-stage build reduces image size
- **WHEN** the Docker image is built
- **THEN** the final runtime image SHALL NOT include build tools or source files

#### Scenario: Non-root user in runtime
- **WHEN** the container runs
- **THEN** the application SHALL run as a non-root user `appuser`

### Requirement: Environment Variable Configuration
The application SHALL load all configuration from environment variables.

#### Scenario: Required variables validated on startup
- **WHEN** the application starts
- **THEN** it SHALL validate that all required environment variables are set

#### Scenario: Missing required variable fails fast
- **WHEN** a required environment variable is missing
- **THEN** the application SHALL exit with a clear error message

#### Scenario: Environment variable schema documented
- **WHEN** a developer needs to configure the application
- **THEN** `.env.example` SHALL document all available environment variables

### Requirement: Environment Variables
The following environment variables SHALL be required for production deployment.

#### Scenario: DATABASE_URL required
- **WHEN** the application starts in production
- **THEN** `DATABASE_URL` MUST be set to a valid PostgreSQL connection string

#### Scenario: NEXTAUTH_SECRET required
- **WHEN** the application starts in production
- **THEN** `NEXTAUTH_SECRET` MUST be set to a string of at least 32 characters

#### Scenario: NEXTAUTH_URL required
- **WHEN** the application starts in production
- **THEN** `NEXTAUTH_URL` MUST be set to the public URL of the application

#### Scenario: ADMIN_SECRET_KEY required
- **WHEN** admin creation is attempted
- **THEN** `ADMIN_SECRET_KEY` MUST be set (no hardcoded fallback)

### Requirement: Docker Deployment Documentation
The project SHALL provide clear documentation for Docker deployment.

#### Scenario: Docker build instructions available
- **WHEN** a developer wants to build the Docker image
- **THEN** `docs/deployment/docker-deployment.md` SHALL provide step-by-step instructions

#### Scenario: Environment variable reference available
- **WHEN** a developer needs to configure production environment
- **THEN** `docs/deployment/environment-variables.md` SHALL document all variables with examples

#### Scenario: Database migration guide available
- **WHEN** a developer needs to migrate from SQLite to PostgreSQL
- **THEN** `docs/deployment/database-migration.md` SHALL provide migration steps

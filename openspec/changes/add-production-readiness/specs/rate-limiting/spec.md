## ADDED Requirements

### Requirement: Rate Limiting for Authentication Endpoints
The application SHALL implement rate limiting on authentication endpoints to prevent brute-force attacks.

#### Scenario: Login rate limit enforced
- **WHEN** a client makes more than 5 requests to `/api/auth/signin` within 15 minutes from the same IP
- **THEN** subsequent requests SHALL return HTTP 429 (Too Many Requests) with a `Retry-After` header

#### Scenario: Registration rate limit enforced
- **WHEN** a client makes more than 3 requests to `/api/auth/register` within 60 minutes from the same IP
- **THEN** subsequent requests SHALL return HTTP 429 (Too Many Requests) with a `Retry-After` header

#### Scenario: Admin creation rate limit enforced
- **WHEN** a client makes more than 2 requests to `/api/admin/create` within 60 minutes from the same IP
- **THEN** subsequent requests SHALL return HTTP 429 (Too Many Requests) with a `Retry-After` header

#### Scenario: Rate limit resets after window expires
- **WHEN** the rate limit window expires (15 or 60 minutes)
- **THEN** the request counter SHALL reset and new requests SHALL be allowed

#### Scenario: Successful request under limit
- **WHEN** a client makes a request within the rate limit
- **THEN** the request SHALL proceed normally without returning 429

### Requirement: IP Address Extraction
The rate limiter SHALL correctly identify client IP addresses behind proxies and load balancers.

#### Scenario: Direct connection IP used
- **WHEN** a request comes directly from a client (no proxy)
- **THEN** the rate limiter SHALL use the socket IP address

#### Scenario: Proxy forwarded IP used
- **WHEN** a request includes `X-Forwarded-For` or `X-Real-IP` headers
- **THEN** the rate limiter SHALL use the forwarded IP address

### Requirement: Rate Limit Response Format
Rate-limited responses SHALL provide clear feedback to clients.

#### Scenario: Rate limit response includes retry information
- **WHEN** a request is rate-limited
- **THEN** the response SHALL include:
  - HTTP status code 429
  - `Retry-After` header with seconds until reset
  - JSON body with message: `{ "error": "Too many requests, please try again later" }`

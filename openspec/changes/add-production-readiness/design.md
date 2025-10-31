## Context

NaijaCapital Connect is a Next.js 14+ investment platform connecting Nigerian investors with business opportunities. Current state:
- **Database**: SQLite (file-based, not production-ready)
- **Authentication**: NextAuth.js with bcrypt password hashing
- **Deployment**: None (development only)
- **Security**: Basic (no headers, no rate limiting, hardcoded secrets)
- **Constraints**: Capstone project, no real payments, free-tier services only

## Goals / Non-Goals

### Goals
1. Enable safe public deployment of the capstone demo
2. Protect against common web vulnerabilities (XSS, CSRF, clickjacking)
3. Prevent brute-force attacks on authentication endpoints
4. Support Docker-based deployment on any hosting platform
5. Use only free-tier services (Postgres, hosting, error tracking)
6. Maintain development experience (hot reload, easy local setup)

### Non-Goals
- Payment processing (out of scope for capstone)
- Comprehensive test coverage (future work)
- Advanced monitoring/APM (beyond basic error tracking)
- Multi-region deployment or high availability
- Enterprise-grade security (penetration testing, SOC2 compliance)

## Decisions

### 1. Database: SQLite → PostgreSQL

**Decision**: Migrate to PostgreSQL using Supabase or Neon free tier.

**Rationale**:
- SQLite doesn't support concurrent writes (breaks in production)
- Supabase/Neon offer 500MB-1GB free tier (sufficient for capstone)
- PostgreSQL is production-standard and well-supported by Prisma
- Easy migration path via Prisma schema change

**Alternatives Considered**:
- MySQL/PlanetScale: Similar benefits, but Postgres has better JSON support
- MongoDB Atlas: Free tier available, but relational data model is better fit
- Stick with SQLite: Not viable for multi-user production deployment

**Implementation**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Security Headers via Next.js Middleware

**Decision**: Implement security headers in `middleware.ts` + `next.config.ts`.

**Rationale**:
- Next.js middleware runs on Edge (fast, low latency)
- Headers can be set per-route or globally
- No external dependencies required
- Covers OWASP Top 10 header recommendations

**Headers Implemented**:
- `Strict-Transport-Security`: Force HTTPS (1 year max-age)
- `X-Frame-Options`: Prevent clickjacking (DENY)
- `X-Content-Type-Options`: Prevent MIME sniffing (nosniff)
- `Referrer-Policy`: Limit referrer leakage (strict-origin-when-cross-origin)
- `Content-Security-Policy`: XSS protection (restrictive but functional)
- `Permissions-Policy`: Disable unnecessary browser features

**Alternatives Considered**:
- Helmet.js: Requires server-side rendering setup, Next.js headers are simpler
- CDN-level headers: Not portable across hosting platforms
- Skip headers: Too risky for public deployment

### 3. Rate Limiting: In-Memory Store

**Decision**: Use simple in-memory Map-based rate limiter.

**Rationale**:
- No external dependencies (free)
- Sufficient for single-instance deployments
- Easy to implement and test
- Can upgrade to Redis later if needed

**Limitations**:
- Resets on server restart (acceptable for demo)
- Doesn't work across multiple instances (acceptable for free-tier hosting)
- Memory grows unbounded (mitigated by TTL cleanup)

**Implementation Strategy**:
```typescript
// src/lib/rate-limiter.ts
const store = new Map<string, { count: number; resetAt: number }>();
- Track by IP address (req.ip or x-forwarded-for)
- Sliding window: 15 min for auth endpoints
- Limits: 5 login attempts, 3 registrations, 2 admin creates
```

**Alternatives Considered**:
- Redis (Upstash free tier): Adds complexity, not needed for single instance
- API Gateway rate limiting: Platform-specific, not portable
- No rate limiting: Too risky for public-facing auth endpoints

### 4. Docker Multi-Stage Build

**Decision**: Use multi-stage Dockerfile with separate build and runtime images.

**Rationale**:
- Smaller final image size (runtime only, no build tools)
- Faster deployments (less data to transfer)
- Security: Runtime image doesn't contain source code
- Industry standard for Node.js deployments

**Dockerfile Structure**:
1. **Builder stage**: Install deps, build Next.js app
2. **Runner stage**: Copy artifacts, run as non-root user

**Optimizations**:
- Use `npm ci` instead of `npm install` (faster, deterministic)
- Copy package files first (leverage Docker layer caching)
- Run as non-root user `appuser` (security best practice)
- Use Alpine base image (smaller footprint)

**Alternatives Considered**:
- Single-stage build: Larger image, slower deployments
- Standalone output: Requires `output: 'standalone'` in next.config, breaks some features
- Buildpacks: Less control, harder to customize

### 5. Environment Variables Validation

**Decision**: Use Zod schema to validate required environment variables at startup.

**Rationale**:
- Fail fast (catch config errors before deployment)
- Type-safe environment variable access
- Self-documenting (schema defines requirements)
- Already using Zod for API validation

**Required Variables**:
```typescript
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  ADMIN_SECRET_KEY: z.string().min(20),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  CORS_ORIGINS: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
});
```

**Alternatives Considered**:
- Manual validation: Error-prone, not type-safe
- dotenv-safe: Extra dependency, less flexible than Zod
- Skip validation: Runtime errors are harder to debug

### 6. Logging: Winston vs Pino

**Decision**: Use Winston for structured logging.

**Rationale**:
- More mature ecosystem (transports, formatters)
- Better documentation and examples
- JSON output for production (easy to parse)
- Console output for development (human-readable)

**Configuration**:
```typescript
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});
```

**Alternatives Considered**:
- Pino: Slightly faster, but less ecosystem support
- console.log: Not structured, hard to filter/search
- No logging: Can't debug production issues

### 7. Error Tracking: Sentry (Optional)

**Decision**: Add optional Sentry integration via environment variable.

**Rationale**:
- Free tier: 5,000 events/month (sufficient for capstone)
- Automatic error grouping and stack traces
- Performance monitoring included
- Easy Next.js integration

**Implementation**:
- Only initialize if `SENTRY_DSN` is set
- Capture unhandled errors and API route exceptions
- Add user context (ID, role) to error reports

**Alternatives Considered**:
- LogRocket: More expensive, focused on session replay
- File-based logging: Hard to query, no alerting
- Skip error tracking: Blind to production issues

## Risks / Trade-offs

### Risk: Database Migration Data Loss
- **Mitigation**: Document backup procedure, test migration locally first
- **Rollback**: Keep SQLite file as backup, can rebuild Postgres from backup.sql

### Risk: Rate Limiting False Positives
- **Mitigation**: Use conservative limits (100 req/15min), add bypass for trusted IPs
- **Monitoring**: Log rate limit hits, adjust limits based on real usage

### Risk: Docker Build Failures
- **Mitigation**: Test locally before deploying, add Docker build to CI
- **Rollback**: Keep previous working image tagged, redeploy if needed

### Trade-off: In-Memory Rate Limiter
- **Limitation**: Doesn't scale across instances
- **Acceptable**: Free-tier hosting is single-instance, can upgrade to Redis later

### Trade-off: Medium Security Scope
- **Limitation**: Not enterprise-grade (no WAF, DDoS protection, pentest)
- **Acceptable**: Capstone project with no real money, mitigates common attacks

## Migration Plan

### Phase 1: Infrastructure (Week 1)
1. Add Dockerfile and `.env.example`
2. Update Prisma schema for Postgres
3. Test Docker build locally
4. Set up Supabase/Neon free tier account

### Phase 2: Security (Week 2)
1. Add middleware.ts with security headers
2. Update next.config.ts with CORS and headers
3. Implement rate limiter utility
4. Add rate limiting to auth endpoints
5. Remove hardcoded secrets

### Phase 3: Observability (Week 2)
1. Add Winston logger
2. Replace console.log calls
3. Add health check endpoint
4. Optional: Set up Sentry account

### Phase 4: Testing & Docs (Week 3)
1. Test Docker deployment end-to-end
2. Migrate test database from SQLite to Postgres
3. Write deployment documentation
4. Create deployment checklist

### Rollback Procedure
If deployment fails:
1. Tag current working commit: `git tag stable-v1.0`
2. Revert changes: `git revert <commit-hash>`
3. Rebuild Docker image from previous commit
4. Restore database from `backup.sql` if needed

### Data Migration Steps
```bash
# 1. Backup SQLite
sqlite3 prisma/dev.db .dump > backup.sql

# 2. Set up Postgres
# Create free tier database at supabase.com or neon.tech
# Copy connection string

# 3. Update .env.local
DATABASE_URL="postgresql://user:pass@host:5432/db"

# 4. Migrate schema
npx prisma migrate deploy

# 5. Test connection
npx prisma studio
```

## Open Questions

1. **Hosting Platform**: Which free-tier platform to recommend?
   - Options: Fly.io (preferred), Railway, Render, Vercel (with Postgres addon)
   - Decision: Document all options, let user choose

2. **Email Service**: Do we need transactional emails now?
   - Decision: Out of scope for initial deployment, add in future iteration

3. **Session Storage**: Should we move sessions to database?
   - Current: JWT tokens (stateless)
   - Decision: Keep JWT for simplicity, no database session table needed

4. **Image Uploads**: Do we need file storage (S3/Cloudinary)?
   - Current: No image uploads implemented
   - Decision: Out of scope, add when feature is implemented

5. **CI/CD**: Should we add GitHub Actions now?
   - Decision: Document manually, CI/CD is Phase 2 improvement

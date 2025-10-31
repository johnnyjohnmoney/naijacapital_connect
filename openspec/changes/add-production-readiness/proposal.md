## Why

The NaijaCapital Connect application is currently configured for local development only (SQLite database, no security middleware, hardcoded secrets, missing deployment infrastructure). To safely deploy this capstone project as a public demo, we need production-grade infrastructure and essential security hardening—without over-engineering beyond what's required for a non-payment, educational project.

**Constraints:**
- This is a capstone/portfolio project (not handling real money)
- No payment gateway integration required
- Medium-scope security only (essential protections, not enterprise-grade)
- All proposed services must have free tiers
- Must support Docker deployment for portability

## What Changes

**Infrastructure:**
- Add multi-stage `Dockerfile` for containerized deployment
- Add `.env.example` documenting required environment variables
- Migrate from SQLite to production-ready Postgres (free tier: Supabase/Neon)
- Update `prisma/schema.prisma` to use `DATABASE_URL` environment variable

**Security & Middleware:**
- Add `middleware.ts` for route protection and security headers
- Update `next.config.ts` with production security headers (HSTS, CSP, X-Frame-Options, etc.)
- Implement simple in-memory rate limiting for authentication endpoints
- Add CORS configuration with environment-based origin allowlist
- Remove hardcoded admin secret from `scripts/create-admin.ts`

**Observability:**
- Add structured logging utility (Winston/Pino)
- Add optional Sentry integration for error tracking (free tier)
- Add health check API endpoint (`/api/health`)

**Documentation:**
- Add deployment guide with Docker build/run instructions
- Document database migration steps (SQLite → Postgres)
- Add production environment variable reference

**Out of Scope:**
- Payment gateway integration (Paystack/Flutterwave)
- Advanced KYC/AML compliance features
- Comprehensive test suite (unit/integration/E2E)
- CI/CD pipeline setup
- Advanced monitoring (APM, distributed tracing)

## Impact

**Affected Capabilities:**
- Authentication & Authorization (new middleware protection)
- Database Layer (SQLite → Postgres migration)
- Deployment Infrastructure (new Docker support)
- Security Posture (headers, rate limiting, CORS)
- Error Handling & Logging (new structured logging)

**Affected Code:**
- `prisma/schema.prisma` - datasource provider change
- `next.config.ts` - security headers configuration
- New files: `middleware.ts`, `src/lib/logger.ts`, `src/lib/rate-limiter.ts`
- Auth routes: `src/app/api/auth/*/route.ts` - add rate limiting
- Admin script: `scripts/create-admin.ts` - remove hardcoded secret
- New API: `src/app/api/health/route.ts`

**Breaking Changes:**
- **BREAKING**: SQLite database must be migrated to Postgres before deployment
- **BREAKING**: `ADMIN_SECRET_KEY` environment variable now required (no fallback)
- **BREAKING**: `DATABASE_URL` must be set (no default file path)

**Migration Path:**
1. Export existing SQLite data: `sqlite3 dev.db .dump > backup.sql`
2. Set up Postgres instance (Supabase/Neon free tier)
3. Update `DATABASE_URL` in `.env.local`
4. Run `npx prisma migrate deploy`
5. Manually import critical data if needed

**Risk Assessment:**
- **Low**: Docker build failures → Comprehensive Dockerfile testing before merge
- **Medium**: Database migration data loss → Document backup/restore procedures
- **Low**: Rate limiting false positives → Use conservative limits (100 req/15min)

**Timeline:**
- Phase 1 (Core Infrastructure): 3-5 days
- Phase 2 (Security Hardening): 2-3 days
- Phase 3 (Testing & Documentation): 2-3 days
- **Total**: 7-11 days (single developer)

## 1. Infrastructure Setup

- [ ] 1.1 Create multi-stage `Dockerfile` with build and runtime stages
- [ ] 1.2 Create `.env.example` with all required environment variables
- [ ] 1.3 Add `.dockerignore` file to optimize build context
- [ ] 1.4 Update `prisma/schema.prisma` datasource to use PostgreSQL
- [ ] 1.5 Create database migration guide in `docs/deployment/database-migration.md`

## 2. Security Middleware

- [ ] 2.1 Create `middleware.ts` with route protection logic
- [ ] 2.2 Add security headers middleware (HSTS, CSP, X-Frame-Options, etc.)
- [ ] 2.3 Implement authentication guard for `/dashboard/*` routes
- [ ] 2.4 Add redirect logic for unauthenticated users
- [ ] 2.5 Update `next.config.ts` with security headers configuration

## 3. Rate Limiting

- [ ] 3.1 Create `src/lib/rate-limiter.ts` utility with in-memory store
- [ ] 3.2 Add rate limiting to `/api/auth/signin` (max 5 attempts per 15 min)
- [ ] 3.3 Add rate limiting to `/api/auth/register` (max 3 attempts per hour)
- [ ] 3.4 Add rate limiting to `/api/admin/create` (max 2 attempts per hour)
- [ ] 3.5 Return proper HTTP 429 responses with Retry-After header

## 4. CORS Configuration

- [ ] 4.1 Add CORS configuration in `next.config.ts`
- [ ] 4.2 Use `CORS_ORIGINS` environment variable for allowed origins
- [ ] 4.3 Set secure defaults (no wildcards in production)
- [ ] 4.4 Add CORS headers to API route responses

## 5. Logging & Observability

- [ ] 5.1 Install Winston or Pino (`npm install winston`)
- [ ] 5.2 Create `src/lib/logger.ts` with structured logging
- [ ] 5.3 Replace all `console.log` in API routes with logger calls
- [ ] 5.4 Add request ID generation for log correlation
- [ ] 5.5 Create health check endpoint at `/api/health`
- [ ] 5.6 Add optional Sentry integration in `src/lib/error-tracker.ts`

## 6. Environment & Secrets Management

- [ ] 6.1 Remove hardcoded admin secret from `scripts/create-admin.ts`
- [ ] 6.2 Validate required environment variables on app startup
- [ ] 6.3 Add environment variable validation schema (Zod)
- [ ] 6.4 Update `.gitignore` to ensure `.env*` files are excluded
- [ ] 6.5 Document all environment variables in `.env.example`

## 7. Database Migration

- [ ] 7.1 Create Postgres migration strategy document
- [ ] 7.2 Test migration locally with Supabase/Neon free tier
- [ ] 7.3 Create data export script for SQLite backup
- [ ] 7.4 Add connection pooling configuration for Prisma
- [ ] 7.5 Update Prisma client generation in Dockerfile

## 8. Documentation

- [ ] 8.1 Create `docs/deployment/docker-deployment.md`
- [ ] 8.2 Create `docs/deployment/environment-variables.md`
- [ ] 8.3 Create `docs/deployment/database-migration.md`
- [ ] 8.4 Add Docker build/run commands to README.md
- [ ] 8.5 Document free hosting options (Fly.io, Railway, Render)

## 9. Testing & Validation

- [ ] 9.1 Test Docker build locally (`docker build -t naijacapital:test .`)
- [ ] 9.2 Test Docker run with environment variables
- [ ] 9.3 Verify security headers in browser DevTools
- [ ] 9.4 Test rate limiting with multiple requests
- [ ] 9.5 Verify auth protection on `/dashboard` routes
- [ ] 9.6 Test Postgres connection with free tier database
- [ ] 9.7 Verify health check endpoint returns 200 OK
- [ ] 9.8 Test CORS with different origins

## 10. Final Polish

- [ ] 10.1 Add production-ready error pages (500, 404, etc.)
- [ ] 10.2 Optimize Next.js config for production builds
- [ ] 10.3 Add compression and caching headers
- [ ] 10.4 Review and update dependencies for security vulnerabilities
- [ ] 10.5 Add deployment checklist to documentation

# Production Readiness Change — `add-production-readiness`

This OpenSpec change proposal prepares NaijaCapital Connect for production deployment as a capstone/demo project.

## 📋 Change Structure

```
add-production-readiness/
├── proposal.md          # Why this change, what's changing, impact analysis
├── tasks.md            # 50 implementation tasks across 10 phases
├── design.md           # Technical decisions, trade-offs, migration plan
├── specs/              # Spec deltas for affected capabilities
│   ├── security/       # ADDED: Security headers, route protection, CORS
│   ├── rate-limiting/  # ADDED: Rate limiting for auth endpoints
│   ├── database/       # MODIFIED: SQLite → PostgreSQL migration
│   ├── observability/  # ADDED: Logging, error tracking, health checks
│   └── deployment/     # ADDED: Docker, environment variables, docs
└── README.md          # This file
```

## 🎯 Quick Summary

**Problem**: App configured for local dev only (SQLite, no security, hardcoded secrets)

**Solution**: Add essential production infrastructure (Docker, Postgres, security headers, rate limiting)

**Constraints**:
- Capstone project (no real payments)
- Medium-scope security only
- All services must have free tiers
- Docker deployment support required

**Timeline**: 7-11 days (single developer)

## 📚 How to Navigate This Change

### 1. Start with `proposal.md`
Read the **Why**, **What Changes**, and **Impact** sections to understand the scope.

### 2. Review `design.md`
Understand the technical decisions:
- Database: SQLite → PostgreSQL (Supabase/Neon free tier)
- Security: Next.js middleware for headers + route protection
- Rate limiting: In-memory store (simple, no Redis needed)
- Docker: Multi-stage build
- Logging: Winston with JSON output
- Error tracking: Optional Sentry integration

### 3. Check `tasks.md`
See the 50 implementation tasks organized in 10 phases:
1. Infrastructure Setup (Dockerfile, .env, Prisma)
2. Security Middleware
3. Rate Limiting
4. CORS Configuration
5. Logging & Observability
6. Environment & Secrets
7. Database Migration
8. Documentation
9. Testing & Validation
10. Final Polish

### 4. Explore Spec Deltas
Each capability has its own spec file:

**`specs/security/spec.md`** — Security headers and route protection
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Route protection for `/dashboard/*`
- CORS configuration

**`specs/rate-limiting/spec.md`** — Brute-force attack prevention
- Login: 5 attempts per 15 min
- Registration: 3 attempts per hour
- Admin creation: 2 attempts per hour

**`specs/database/spec.md`** — Production database migration
- PostgreSQL provider configuration
- Connection pooling
- SQLite → Postgres migration guide

**`specs/observability/spec.md`** — Logging and monitoring
- Structured logging (Winston)
- Sentry error tracking (optional)
- Health check endpoint

**`specs/deployment/spec.md`** — Docker and environment config
- Multi-stage Dockerfile
- Environment variable validation
- Deployment documentation

## 🚀 Implementation Path

### Phase 1: Core Infrastructure (Days 1-3)
```bash
# Already completed:
✅ Dockerfile created
✅ .env.example created

# Next steps:
- Update prisma/schema.prisma to use PostgreSQL
- Create database migration guide
```

### Phase 2: Security Hardening (Days 4-5)
```bash
# To implement:
- Create middleware.ts with security headers
- Update next.config.ts with CORS and headers
- Add rate limiter utility
- Protect auth endpoints
```

### Phase 3: Observability (Days 6-7)
```bash
# To implement:
- Add Winston logger
- Create health check endpoint
- Optional: Set up Sentry
```

### Phase 4: Testing & Docs (Days 8-11)
```bash
# To implement:
- Write deployment documentation
- Test Docker build end-to-end
- Create deployment checklist
```

## 🔐 Security Features (Medium Scope)

This change implements **essential** security features only:

✅ **Included**:
- Security headers (OWASP recommendations)
- Route protection (auth middleware)
- Rate limiting (brute-force prevention)
- CORS configuration
- Environment variable validation
- Non-root Docker user

❌ **Excluded** (out of scope for capstone):
- WAF (Web Application Firewall)
- DDoS protection
- Penetration testing
- SOC2 compliance
- Advanced threat detection

## 💰 Free Services Used

All proposed services have free tiers:

- **Database**: Supabase (500MB) or Neon (1GB) — PostgreSQL free tier
- **Hosting**: Fly.io, Railway, or Render — Docker deployment
- **Error Tracking**: Sentry (5K events/month) — optional
- **Email**: Mailgun/SendGrid free tier — future use
- **Logging**: Winston (built-in) — no external service

## 📖 Reading the Spec Deltas

Each spec file follows this format:

```markdown
## ADDED Requirements
### Requirement: Feature Name
Description of what the system SHALL do.

#### Scenario: Specific use case
- **WHEN** trigger condition
- **THEN** expected outcome

## MODIFIED Requirements
### Requirement: Changed Feature
**BREAKING CHANGE**: Description of breaking change
```

Every requirement MUST have at least one scenario.

## 🎓 Learning from This Change

This change demonstrates:
1. **Spec-driven development**: Requirements → Implementation
2. **Production readiness**: What it takes to deploy safely
3. **Trade-off analysis**: When to use simple vs complex solutions
4. **Migration planning**: How to move from dev to prod
5. **Documentation**: Making changes understandable

## ❓ Open Questions

See `design.md` for full list. Key questions:

1. **Hosting platform**: Fly.io vs Railway vs Render?
   - Recommendation: Document all, let user choose

2. **Email service**: Needed now?
   - Decision: Out of scope for initial deployment

3. **CI/CD**: GitHub Actions now?
   - Decision: Manual first, CI/CD is Phase 2

## 🔄 Next Steps After Approval

1. Mark tasks in `tasks.md` as you complete them
2. Implement in order (infrastructure → security → observability)
3. Test each phase before moving to next
4. Update docs as you go
5. After deployment, archive this change to `openspec/changes/archive/`

## 📝 Validation

To validate this change proposal:

```bash
# If openspec CLI is available:
openspec validate add-production-readiness --strict

# Manual validation:
- ✅ proposal.md has Why/What/Impact sections
- ✅ tasks.md has actionable checklist
- ✅ design.md has decisions and trade-offs
- ✅ All specs have ADDED/MODIFIED headers
- ✅ Every requirement has at least one scenario
- ✅ Scenarios use #### header format (not bullets)
```

## 🎉 Success Criteria

This change is complete when:

- [ ] Docker image builds successfully
- [ ] App runs in Docker with environment variables
- [ ] Security headers present in all responses
- [ ] Auth routes protected and redirect when unauthenticated
- [ ] Rate limiting prevents brute-force attempts
- [ ] Health check endpoint returns 200 OK
- [ ] Database connected to Postgres (not SQLite)
- [ ] Deployment documentation complete
- [ ] All tasks in `tasks.md` checked off

---

**Questions?** Review `proposal.md` for rationale, `design.md` for technical details, or `tasks.md` for implementation steps.

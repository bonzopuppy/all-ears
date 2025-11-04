# Deployment Guide
**All Ears - Musical Journey Feature**

**Last Updated:** [DATE]
**Platform:** Vercel
**Repository:** [GitHub URL]

---

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Vercel Configuration](#vercel-configuration)
- [Database Setup](#database-setup)
- [Deployment Process](#deployment-process)
- [Post-Deployment](#post-deployment)
- [Rollback Procedure](#rollback-procedure)

---

## Overview

All Ears is deployed on Vercel with:
- Serverless API functions
- Vercel Postgres database
- Vercel KV (Redis) cache
- Spotify OAuth integration
- Anthropic Claude API integration

---

## Prerequisites

### Required Accounts

- [ ] Vercel account (with team if applicable)
- [ ] GitHub account (repository access)
- [ ] Spotify Developer account
- [ ] Anthropic API account

### Required Tools

```bash
# Vercel CLI
npm install -g vercel

# Node.js 18+
node --version

# npm
npm --version
```

---

## Environment Variables

### Production Environment Variables

**Set in Vercel Dashboard → Project → Settings → Environment Variables**

```bash
# Spotify OAuth
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
REDIRECT_URI=https://your-app.vercel.app/api/auth/callback
FRONTEND_URL=https://your-app.vercel.app

# Anthropic AI
ANTHROPIC_API_KEY=your_api_key

# Database (auto-configured by Vercel)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Cache (auto-configured by Vercel)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Feature Flags (optional)
ENABLE_JOURNEY_FEATURE=true
```

---

### Local Development Variables

**File:** `.env` (gitignored)

```bash
# Same as production but with local URLs
REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback
FRONTEND_URL=http://127.0.0.1:3000

# Use development credentials
SPOTIFY_CLIENT_ID=your_dev_client_id
SPOTIFY_CLIENT_SECRET=your_dev_client_secret
ANTHROPIC_API_KEY=your_dev_api_key
```

---

## Vercel Configuration

### `vercel.json`

```json
{
  "framework": "create-react-app",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

---

### Serverless Function Configuration

**Location:** `/api/` directory

**Runtime:** Node.js 18

**Timeout:** 30 seconds (adjustable per function)

**Memory:** 1024 MB

---

## Database Setup

### Vercel Postgres Setup

1. **Create Database:**
   ```bash
   vercel postgres create all-ears-db
   ```

2. **Link to Project:**
   ```bash
   vercel postgres link all-ears-db
   ```

3. **Run Migration:**
   [Migration steps to be added]

---

### Vercel KV Setup

1. **Create KV Store:**
   ```bash
   vercel kv create all-ears-cache
   ```

2. **Link to Project:**
   ```bash
   vercel kv link all-ears-cache
   ```

---

## Deployment Process

### First-Time Deployment

```bash
# 1. Clone repository
git clone [repository-url]
cd all-ears

# 2. Install dependencies
npm install

# 3. Login to Vercel
vercel login

# 4. Deploy to preview
vercel

# 5. Deploy to production
vercel --prod
```

---

### Continuous Deployment

**GitHub Integration:** Automatic deployments on:
- `main` branch → Production
- Pull requests → Preview deployments

**Deployment Triggers:**
[Trigger details to be added]

---

### Manual Deployment

```bash
# Deploy current branch to preview
vercel

# Deploy to production
vercel --prod

# Deploy specific branch
git checkout feature-branch
vercel
```

---

## Post-Deployment

### Verification Checklist

- [ ] Site loads at production URL
- [ ] Spotify OAuth login works
- [ ] Journey creation works
- [ ] Database queries execute
- [ ] Cache reads/writes work
- [ ] AI narrative generation works
- [ ] No console errors
- [ ] Performance metrics acceptable

---

### Smoke Tests

```bash
# Test OAuth flow
curl https://your-app.vercel.app/api/auth/login

# Test journey API (requires auth token)
curl -H "Authorization: Bearer {token}" \
  https://your-app.vercel.app/api/journeys

# Test health check
[Health check details to be added]
```

---

## Rollback Procedure

### Via Vercel Dashboard

1. Navigate to Project → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

---

### Via CLI

```bash
# List recent deployments
vercel list

# Rollback to specific deployment
vercel rollback [deployment-url]
```

---

## Monitoring

### Logs

```bash
# View real-time logs
vercel logs --follow

# View logs for specific function
vercel logs /api/journeys
```

---

### Metrics

**Vercel Dashboard provides:**
- Request count
- Error rate
- Response time
- Bandwidth usage

---

## Troubleshooting

### Common Issues

**Issue:** OAuth redirect fails
**Solution:** [Solution to be added]

---

**Issue:** Database connection timeout
**Solution:** [Solution to be added]

---

**Issue:** Environment variables not updating
**Solution:** [Solution to be added]

---

## References

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Architecture](./ARCHITECTURE.md) - System architecture
- [API Routes](./API-ROUTES.md) - API documentation

---

*Last Updated: [DATE]*
*Version: [VERSION]*

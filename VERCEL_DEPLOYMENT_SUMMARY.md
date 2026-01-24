# Vercel Deployment Configuration - Summary

This document summarizes the complete Vercel deployment configuration for Dyad using GitHub Actions.

## What Was Configured

### 1. GitHub Actions Workflow (`.github/workflows/deploy-vercel.yml`)

A fully automated CI/CD pipeline that:
- Triggers on push to `main` (production) and on Pull Requests (preview)
- Uses Vercel CLI to deploy the application
- Adds deployment URL comments to Pull Requests
- Requires three GitHub secrets to be configured

**Required GitHub Secrets:**
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization/team ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### 2. Vercel Configuration (`vercel.json`)

Defines the deployment structure:
- **API Routes**: `/api/*` → Serverless function at `api/index.ts`
- **Static Assets**: `/assets/*` → Built frontend assets
- **SPA Routing**: All other routes → `index.html` (for client-side routing)
- **Build Command**: `npm run web:build`
- **Output Directory**: `dist`

### 3. Serverless API Handler (`api/index.ts`)

A Vercel-compatible serverless function that:
- Initializes Express.js application
- Sets up CORS and JSON parsing middleware
- Initializes SQLite database (with graceful error handling)
- Registers all API routes from `server/routes`
- Exports the Express app for Vercel's serverless runtime

### 4. Build Process Updates

Updated `package.json` scripts:
- `web:build` now includes postbuild step
- `web:postbuild` copies `index-web.html` to `index.html`
- Ensures Vercel can serve the frontend correctly

### 5. Optimization Files

**`.vercelignore`**: Excludes unnecessary files from deployment:
- Test files and e2e tests
- Development files
- Electron-specific files
- Documentation (except deployment guides)
- Build artifacts (except dist)

**`tsconfig.api.json`**: TypeScript configuration for API directory

### 6. Documentation

Created three comprehensive guides:

**`VERCEL_DEPLOYMENT.md`** (Detailed Guide):
- Complete step-by-step setup instructions
- Environment variable configuration
- Database considerations and limitations
- WebSocket limitations and alternatives
- Troubleshooting section
- Deployment verification steps

**`VERCEL_QUICKSTART.md`** (Quick Start):
- Condensed 5-minute setup guide
- Essential steps only
- Quick reference for common tasks

**Updated `DEPLOYMENT.md`**:
- Added Vercel with GitHub Actions section
- Links to detailed guides
- Quick setup overview

### 7. Environment Variables

Updated `.env.example` with Vercel-specific variables:
- `PORT` - Server port (default: 3000)
- `DATABASE_PATH` - SQLite database path (Vercel: `/tmp/dyad.db`)
- `NODE_ENV` - Environment (production)

## Architecture Overview

```
GitHub Push/PR
    ↓
GitHub Actions Workflow
    ↓
    ├─ Install Dependencies (npm ci)
    ├─ Pull Vercel Config
    ├─ Build Project (vercel build)
    └─ Deploy (vercel deploy)
        ↓
Vercel Platform
    ├─ API Routes (/api/*) → api/index.ts (Serverless Function)
    │                            ├─ Express.js
    │                            ├─ SQLite Database
    │                            └─ API Handlers
    │
    └─ Frontend (/*) → dist/ (Static Files)
                          ├─ index.html
                          ├─ assets/
                          └─ React App
```

## Key Features

✅ **Automated Deployments**: Push to deploy, no manual intervention
✅ **Preview Deployments**: Every PR gets its own preview URL
✅ **Clean Separation**: API and frontend properly configured
✅ **SPA Support**: Client-side routing works correctly
✅ **TypeScript Support**: Full TypeScript compilation for API
✅ **Security Scanned**: Passed CodeQL security analysis
✅ **Code Reviewed**: Addressed all review comments
✅ **Well Documented**: Three-tier documentation approach

## Important Limitations

⚠️ **Database Persistence**
- SQLite on Vercel uses `/tmp` directory (ephemeral)
- Data is lost on redeployment
- Recommended: Migrate to Vercel Postgres, Neon, or Supabase for production

⚠️ **WebSocket Support**
- Vercel serverless functions have 60-second timeout
- WebSocket server from `server/websocket.ts` won't work as-is
- Recommended: Use Server-Sent Events (SSE) or Vercel Edge Functions

⚠️ **File System Access**
- Only `/tmp` is writable (max 512MB, ephemeral)
- For file storage, use Vercel Blob, S3, or similar

## Next Steps After Deployment

1. **Monitor First Deployment**: Check logs in Vercel dashboard
2. **Test API Endpoints**: Visit `/api/health` to verify
3. **Configure Environment Variables**: Add API keys in Vercel settings
4. **Consider Database Migration**: For production use, migrate to managed database
5. **Implement Alternative to WebSockets**: If real-time features are needed

## How to Use

### For Repository Maintainers

1. Follow setup in `VERCEL_QUICKSTART.md`
2. Configure the three GitHub secrets
3. Merge this PR to enable automated deployments

### For Contributors

- No action needed
- PRs will automatically get preview deployments
- Check PR comments for preview URL

## Files Changed

- `.github/workflows/deploy-vercel.yml` (new)
- `vercel.json` (new)
- `api/index.ts` (new)
- `.vercelignore` (new)
- `tsconfig.api.json` (new)
- `VERCEL_DEPLOYMENT.md` (new)
- `VERCEL_QUICKSTART.md` (new)
- `VERCEL_DEPLOYMENT_SUMMARY.md` (new - this file)
- `DEPLOYMENT.md` (updated)
- `.env.example` (updated)
- `package.json` (updated)

## Support

For issues:
- Setup questions: See `VERCEL_QUICKSTART.md`
- Detailed help: See `VERCEL_DEPLOYMENT.md`
- Deployment errors: Check Vercel dashboard logs
- General deployment: See `DEPLOYMENT.md`

## Security

✅ No security vulnerabilities detected by CodeQL
✅ No sensitive data in configuration files
✅ Secrets properly managed via GitHub Secrets
✅ CORS configured for API security

# Vercel Deployment Setup Guide

This guide will help you deploy Dyad to Vercel using GitHub Actions.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A GitHub repository for your Dyad fork
3. Node.js 20 or later installed locally (for testing)

## Setup Steps

### 1. Create a Vercel Project

1. Log in to your Vercel dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run web:client:build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Get Vercel Credentials

You need three pieces of information from Vercel:

#### A. Vercel Token
1. Go to [Vercel Account Settings > Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions Deploy")
4. Copy the token (you won't be able to see it again!)

#### B. Vercel Organization ID
1. Go to your Vercel dashboard
2. Click on your profile/organization name in the top right
3. Go to Settings
4. Copy the "Organization ID" (or "Team ID")

#### C. Vercel Project ID
1. Go to your Vercel project
2. Go to Settings
3. Scroll down to "General" section
4. Copy the "Project ID"

### 3. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret" and add each of these:

   - **Name**: `VERCEL_TOKEN`  
     **Value**: Your Vercel token from step 2A

   - **Name**: `VERCEL_ORG_ID`  
     **Value**: Your Vercel organization ID from step 2B

   - **Name**: `VERCEL_PROJECT_ID`  
     **Value**: Your Vercel project ID from step 2C

### 4. Trigger Deployment

Once the secrets are configured, deployments will happen automatically:

- **Production Deployment**: Push to the `main` branch
- **Preview Deployment**: Open or update a Pull Request

You can also manually trigger a deployment:
1. Go to "Actions" tab in your GitHub repository
2. Select "Deploy to Vercel" workflow
3. Click "Run workflow"

### 5. Verify Deployment

After the workflow completes:

1. Check the Actions tab to see the deployment status
2. For PRs, a comment will be added with the preview URL
3. For main branch, check your Vercel dashboard for the production URL

## Environment Variables

If you need to add environment variables (API keys, etc.):

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add your variables for Production, Preview, and Development environments

Common environment variables for Dyad:
- `OPENAI_API_KEY` - Your OpenAI API key
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `DATABASE_PATH` - Path to SQLite database (default: `/tmp/dyad.db` for Vercel)

## Important Notes

### Database Considerations

⚠️ **SQLite Limitations on Vercel**:
- Vercel's serverless functions have ephemeral file systems
- Data stored in `/tmp` will be lost between deployments
- For production use, consider migrating to a managed database:
  - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
  - [Neon](https://neon.tech/)
  - [Supabase](https://supabase.com/)

### WebSocket Limitations

⚠️ **WebSocket Support**:
- Vercel serverless functions have a 60-second timeout
- For real-time features, consider:
  - Using Vercel's [Edge Functions](https://vercel.com/docs/functions/edge-functions) with streaming
  - Implementing Server-Sent Events (SSE) instead of WebSockets
  - Using a dedicated WebSocket service like [Ably](https://ably.com/) or [Pusher](https://pusher.com/)

### File System Access

⚠️ **File System**:
- Only `/tmp` directory is writable (max 512MB, ephemeral)
- For file uploads/storage, use:
  - [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
  - AWS S3
  - Cloudflare R2

## Troubleshooting

### Build Fails

If the build fails in GitHub Actions:
1. Check the workflow logs in the Actions tab
2. Verify all dependencies are listed in `package.json`
3. Test the build locally: `npm run web:client:build`

### Deployment Fails

If deployment fails:
1. Verify all three secrets are correctly set in GitHub
2. Check that your Vercel project is properly configured
3. Review the Vercel deployment logs in your Vercel dashboard

### Application Doesn't Work

If the app deploys but doesn't work:
1. Check the Vercel Function logs in your project dashboard
2. Verify environment variables are set in Vercel
3. Check browser console for errors
4. Ensure API routes are accessible (test `/api/health`)

## Manual Deployment (Alternative)

If you prefer to deploy manually without GitHub Actions:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Rolling Back

To rollback to a previous deployment:

1. Go to your Vercel project dashboard
2. Navigate to "Deployments"
3. Find the working deployment
4. Click the three dots menu
5. Select "Promote to Production"

## Support

For issues with:
- **Dyad Application**: Open an issue on [GitHub](https://github.com/dyad-sh/dyad/issues)
- **Vercel Deployment**: Check [Vercel Documentation](https://vercel.com/docs)
- **GitHub Actions**: Check [GitHub Actions Documentation](https://docs.github.com/actions)

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment guide
- [WEB_README.md](./WEB_README.md) - Web application architecture

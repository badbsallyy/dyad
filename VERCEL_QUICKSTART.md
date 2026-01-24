# Quick Start: Deploying Dyad to Vercel

This is a condensed guide for deploying Dyad to Vercel using GitHub Actions. For detailed information, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).

## Prerequisites

1. Vercel account ([sign up here](https://vercel.com))
2. GitHub repository with Dyad code
3. 5 minutes of setup time

## Setup Steps

### 1. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Keep the default settings (Vercel will auto-detect the configuration)
5. Click "Deploy" (this first deployment may fail - that's okay!)

### 2. Get Vercel Credentials

You need three values from Vercel:

#### Vercel Token
1. Go to [Account Settings → Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token (save it somewhere safe!)

#### Organization ID
1. Go to [Settings](https://vercel.com/account)
2. Find and copy your "Organization ID" (or "Team ID")

#### Project ID
1. Open your Vercel project
2. Go to Settings → General
3. Copy the "Project ID"

### 3. Add Secrets to GitHub

1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret" for each:

```
Name: VERCEL_TOKEN
Value: [paste your Vercel token]

Name: VERCEL_ORG_ID
Value: [paste your organization ID]

Name: VERCEL_PROJECT_ID
Value: [paste your project ID]
```

### 4. Deploy

**Automatic deployment:**
- Push to `main` branch → Production deployment
- Open a Pull Request → Preview deployment

**Manual deployment:**
1. Go to Actions tab in GitHub
2. Select "Deploy to Vercel"
3. Click "Run workflow"

## Verification

After deployment:
1. Check the GitHub Actions tab for the deployment status
2. For PRs: A comment will show the preview URL
3. For main: Find the production URL in Vercel dashboard

## Next Steps

### Add Environment Variables (Optional)

If you need API keys:

1. Go to Vercel project → Settings → Environment Variables
2. Add variables like:
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - etc.

### Important Limitations

⚠️ **Database**: SQLite data on Vercel is ephemeral (lost on redeployment)
- For production, consider Vercel Postgres or another managed database
- See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md#database-considerations) for details

⚠️ **WebSockets**: Limited support on Vercel
- Consider using Server-Sent Events (SSE) or Edge Functions
- See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md#websocket-limitations) for alternatives

## Troubleshooting

**Build fails?**
- Check the Actions tab for error logs
- Verify all dependencies are in package.json
- Test locally: `npm run web:build`

**Can't access the site?**
- Verify the deployment succeeded in Vercel dashboard
- Check browser console for errors
- Test the API: Visit `https://your-app.vercel.app/api/health`

**Need help?**
- Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed troubleshooting
- Open an issue on [GitHub](https://github.com/dyad-sh/dyad/issues)

## Additional Resources

- [Full Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [General Deployment Options](./DEPLOYMENT.md)
- [Web Architecture](./WEB_README.md)

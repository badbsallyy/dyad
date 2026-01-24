# Deploying Dyad Web Application

This guide covers various deployment options for the Dyad web application.

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start development servers
npm run web:dev
```

This will start:
- Backend server on http://localhost:3000
- Frontend dev server on http://localhost:5173 (with proxying to backend)

## Production Build

### Build Both Client and Server

```bash
npm run web:build
```

### Run Production Server

```bash
npm run web:start
```

The server will be available at http://localhost:3000

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start
docker-compose -f docker-compose.web.yml up -d

# View logs
docker-compose -f docker-compose.web.yml logs -f

# Stop
docker-compose -f docker-compose.web.yml down
```

### Using Docker Directly

```bash
# Build image
docker build -f Dockerfile.web -t dyad-web .

# Run container
docker run -p 3000:3000 -v dyad-data:/app/userData dyad-web
```

## Platform-Specific Deployment

### Heroku

1. Create a new Heroku app:
```bash
heroku create your-dyad-app
```

2. Set buildpack:
```bash
heroku buildpacks:set heroku/nodejs
```

3. Create a `Procfile`:
```
web: npm run web:start
```

4. Add build script to package.json:
```json
{
  "scripts": {
    "heroku-postbuild": "npm run web:build"
  }
}
```

5. Deploy:
```bash
git push heroku main
```

### Railway

1. Create a new project on Railway.app
2. Connect your GitHub repository
3. Set the build command: `npm run web:build`
4. Set the start command: `npm run web:start`
5. Deploy

### DigitalOcean App Platform

1. Create a new App on DigitalOcean
2. Connect your repository
3. Configure the service:
   - Build Command: `npm run web:build`
   - Run Command: `npm run web:start`
4. Deploy

### AWS (EC2)

1. Launch an EC2 instance (Ubuntu recommended)
2. SSH into the instance
3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone your repository:
```bash
git clone https://github.com/yourusername/dyad.git
cd dyad
```

5. Install dependencies and build:
```bash
npm install
npm run web:build
```

6. Set up PM2 for process management:
```bash
npm install -g pm2
pm2 start npm --name "dyad-web" -- run web:start
pm2 save
pm2 startup
```

7. Configure nginx as reverse proxy (optional):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3000/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### Vercel (Frontend only)

Note: Vercel works best for frontend-only deployments. You'll need a separate backend.

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Create `vercel.json`:
```json
{
  "buildCommand": "npm run web:client:build",
  "outputDirectory": "dist",
  "framework": null
}
```

3. Deploy:
```bash
vercel
```

For the backend, use a separate service like Railway or Heroku.

## Environment Variables

Set these environment variables in your deployment platform:

```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=/app/userData/dyad.db

# Optional: API keys for AI services
OPENAI_API_KEY=your-key
ANTHROPIC_API_KEY=your-key
```

## Database

The web version uses SQLite by default (same as desktop). For production:

### Option 1: SQLite (Simple, Single Server)
- Good for small to medium deployments
- Data persists in the `userData` directory
- Make sure to mount this as a volume in Docker

### Option 2: PostgreSQL (Scalable, Multi-Server)
- Recommended for production with multiple servers
- Would require modifying the database layer
- Use services like Supabase, Neon, or AWS RDS

## Monitoring

### Health Check Endpoint

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "version": "0.34.0-beta.1"
}
```

### Logs

- Development: Console output
- Docker: `docker logs <container-id>`
- PM2: `pm2 logs dyad-web`

## Security Considerations

1. **Add Authentication**: The basic web version doesn't include auth
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly for your domain
4. **Rate Limiting**: Add rate limiting middleware
5. **Input Validation**: Validate all user inputs
6. **Environment Variables**: Never commit secrets to git

## Performance Optimization

1. **Enable Compression**:
```javascript
import compression from 'compression';
app.use(compression());
```

2. **Add Caching Headers** for static assets

3. **Use CDN** for frontend assets

4. **Database Connection Pooling** if switching to PostgreSQL

## Troubleshooting

### Server Won't Start

Check:
- Port 3000 is not already in use: `lsof -i :3000`
- All dependencies are installed: `npm install`
- Build completed successfully: `npm run web:build`

### WebSocket Connection Fails

- Ensure WebSocket upgrade is properly configured in your reverse proxy
- Check CORS settings
- Verify the WebSocket URL is correct

### Database Issues

- Check userData directory permissions
- Verify DATABASE_PATH environment variable
- Check disk space

## Backup

### SQLite Database

```bash
# Backup
cp userData/dyad.db userData/dyad.db.backup

# Restore
cp userData/dyad.db.backup userData/dyad.db
```

### Automated Backups

Set up a cron job:
```bash
0 2 * * * cp /app/userData/dyad.db /backups/dyad-$(date +\%Y\%m\%d).db
```

## Scaling

For high-traffic scenarios:

1. **Horizontal Scaling**: Deploy multiple instances behind a load balancer
2. **Database**: Switch from SQLite to PostgreSQL
3. **File Storage**: Use S3 or similar for file uploads
4. **Caching**: Add Redis for session management
5. **CDN**: Use CloudFront or similar for static assets

## Support

For issues or questions:
- GitHub Issues: https://github.com/dyad-sh/dyad/issues
- Documentation: See WEB_README.md

# Web Component Deployment Guide

Complete step-by-step guide for deploying the WMCA Blog Web Component.

## Prerequisites

- Node.js 16+ installed
- npm or yarn installed
- Git repository initialized
- Access to a hosting platform (Vercel, Azure, AWS, etc.)
- Access to a CDN for static files (optional but recommended)

## Deployment Overview

```
1. Build Web Component
   ├─ npm run web-component:build
   └─ Output: web-component-dist/wmca-blog-component.js

2. Build Next.js App
   ├─ npm run next:build
   └─ Output: .next/ (with standalone mode enabled)

3. Deploy Next.js App
   ├─ Vercel (easiest)
   ├─ Self-hosted (Node.js)
   └─ Serverless (AWS Lambda, Azure Functions)

4. Upload Web Component Script
   ├─ CDN (recommended)
   ├─ Self-hosted static server
   └─ Git-hosted (GitHub Pages, jsDelivr)

5. Update Template/Website
   └─ Add <wmca-blog> and <script> tags
```

---

## Step 1: Build the Web Component

### Prerequisites
Ensure you're in the project root directory and all dependencies are installed:

```bash
cd /path/to/wmca-blog
npm install  # If not already done
```

### Build

```bash
npm run web-component:build
```

### Verify Build

```bash
ls -la web-component-dist/
# Should show:
# -rw-r--r--  web-component-dist/wmca-blog-component.js
```

The file should be at least a few KB in size.

---

## Step 2: Build Next.js Application

### Build for Production

```bash
npm run next:build
```

### Verify Build

```bash
ls -la .next/
# Should contain standalone, static, and other build artifacts
```

### Test Build Locally

```bash
npm run next:start
# App should start on http://localhost:3000
```

Visit http://localhost:3000 in your browser to verify it works.

---

## Step 3: Deploy Next.js App

### Option A: Vercel (Recommended - Easiest)

Vercel is the creator of Next.js and handles deployment automatically.

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Deploy

```bash
vercel deploy
```

Follow the prompts to:
- Link your Vercel account
- Select the project
- Choose production deployment

#### 3. Get Your URL

After deployment completes, you'll see:
```
Deployed to https://wmca-blog.vercel.app
```

**Advantages**: 
- ✅ Zero configuration
- ✅ Automatic deployments on git push
- ✅ Free tier available
- ✅ Built-in analytics and monitoring

---

### Option B: Azure App Service

Deploy to Microsoft Azure.

#### 1. Create Resource Group (if needed)

```bash
az group create \
  --name wmca-blog-rg \
  --location uksouth
```

#### 2. Create App Service Plan

```bash
az appservice plan create \
  --name wmca-blog-plan \
  --resource-group wmca-blog-rg \
  --sku B1 \
  --is-linux
```

#### 3. Create Web App

```bash
az webapp create \
  --resource-group wmca-blog-rg \
  --plan wmca-blog-plan \
  --name wmca-blog-app \
  --runtime "node|18-lts"
```

#### 4. Deploy

```bash
# Install Azure App Service deployment extension
az extension add --name webapp

# Deploy zip file
zip -r app.zip .next/ pages/ public/ package*.json server/
az webapp deployment source config-zip \
  --resource-group wmca-blog-rg \
  --name wmca-blog-app \
  --src app.zip
```

Or use Azure DevOps for CI/CD.

**Advantages**:
- ✅ Integrated with Microsoft ecosystem
- ✅ Can use managed identity for Umbraco API
- ✅ Scalable upward

---

### Option C: Self-Hosted (Node.js Server)

Deploy to your own Linux server with Node.js.

#### 1. Prepare Server

```bash
# SSH into server
ssh user@your-server.com

# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Upload Files

```bash
# From your local machine
scp -r . user@your-server.com:/var/www/wmca-blog
```

#### 3. Install & Start

```bash
cd /var/www/wmca-blog
npm install --production
npm run next:build
pm2 start "npm run next:start" --name "wmca-blog"
pm2 startup
pm2 save
```

#### 4. Configure Reverse Proxy (Nginx)

```nginx
server {
  listen 80;
  server_name blog.wmca.org.uk;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

**Advantages**:
- ✅ Full control
- ✅ Can integrate with existing infrastructure
- ✅ Cost-effective

---

### Option D: Docker Deployment

Deploy using Docker containers.

#### 1. Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built app
COPY .next ./.next
COPY public ./public
COPY pages ./pages
COPY src ./src

# Build
RUN npm run next:build

EXPOSE 3000

CMD ["npm", "run", "next:start"]
```

#### 2. Build Docker Image

```bash
docker build -t wmca-blog:latest .
```

#### 3. Run Locally (Test)

```bash
docker run -p 3000:3000 wmca-blog:latest
```

#### 4. Deploy

Push to Docker Hub or registry:

```bash
# Tag for registry
docker tag wmca-blog:latest myregistry/wmca-blog:latest

# Push
docker push myregistry/wmca-blog:latest

# On server: Pull and run
docker pull myregistry/wmca-blog:latest
docker run -p 3000:3000 -d myregistry/wmca-blog:latest
```

**Advantages**:
- ✅ Consistent across environments
- ✅ Works with Kubernetes
- ✅ Scalable

---

## Step 4: Upload Web Component Script

### Option A: CDN (Recommended)

#### Upload to Existing CDN

If you have an existing CDN (e.g., Cloudflare, AWS CloudFront):

```bash
# Upload the file
aws s3 cp web-component-dist/wmca-blog-component.js \
  s3://your-cdn-bucket/wmcaassets/apps/blog/

# Make public
aws s3api put-object-acl \
  --bucket your-cdn-bucket \
  --key wmcaassets/apps/blog/wmca-blog-component.js \
  --acl public-read
```

Your URL: `https://your-cdn.com/wmcaassets/apps/blog/wmca-blog-component.js`

#### Use jsDelivr (Free)

jsDelivr automatically hosts files from GitHub:

1. Push to GitHub repo
2. Use the URL format: `https://cdn.jsdelivr.net/gh/user/repo@version/path/file.js`

Example:
```html
<script src="https://cdn.jsdelivr.net/gh/wmca/wmca-blog@main/web-component-dist/wmca-blog-component.js"></script>
```

**Advantages**:
- No storage costs
- Global CDN
- Automatic version management

---

### Option B: Self-Hosted Static Server

Host the script on the same server as your blog app or a static file server.

#### Nginx Configuration

```nginx
server {
  listen 80;
  server_name static.wmca.org.uk;

  location /wmcaassets/apps/blog/ {
    alias /var/www/static/wmcaassets/apps/blog/;
    expires 30d;
    add_header Cache-Control "public, immutable";
  }
}
```

#### Update Path

```html
<script src="https://static.wmca.org.uk/wmcaassets/apps/blog/wmca-blog-component.js"></script>
```

---

### Option C: Same Domain

Serve from the same Next.js app (not recommended for high traffic):

```bash
# Copy to public directory
cp web-component-dist/wmca-blog-component.js public/
```

Access at: `https://your-blog.vercel.app/wmca-blog-component.js`

```html
<script src="/wmca-blog-component.js"></script>
```

---

## Step 5: Update Website Templates

### For Umbraco

See [docs/umbraco-template-example.cshtml](./umbraco-template-example.cshtml) for complete example, or use this template snippet:

```cshtml
@* Your Umbraco template *@
<section class="blog-container">
    <wmca-blog 
        app-url="https://wmca-blog.vercel.app"
        height="900px"
        theme="light">
    </wmca-blog>
</section>

<script src="https://your-cdn.com/wmcaassets/apps/blog/wmca-blog-component.js"></script>
```

### For Your Website

Add to any HTML page:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Blog</title>
</head>
<body>
  <header>
    <h1>Welcome to My Blog</h1>
  </header>

  <!-- Blog Component -->
  <main>
    <wmca-blog app-url="https://wmca-blog.vercel.app" height="900px"></wmca-blog>
  </main>

  <!-- Load Web Component -->
  <script src="https://your-cdn.com/wmcaassets/apps/blog/wmca-blog-component.js"></script>
</body>
</html>
```

---

## Post-Deployment Checklist

- [ ] Next.js app is running and publicly accessible
- [ ] Web component script is accessible at CDN URL
- [ ] Website loads the web component without console errors
- [ ] Blog content displays correctly in the embedded component
- [ ] Navigation works (articles, authors, filtering)
- [ ] Responsive design works on mobile/tablet
- [ ] Dark/light themes render correctly
- [ ] API calls to Umbraco work (check Network tab)
- [ ] Performance is acceptable (Lighthouse score)
- [ ] SSL/HTTPS enabled on all domains
- [ ] CORS headers configured correctly
- [ ] Analytics tracking works (if enabled)

### Manual Testing

```bash
# Test from command line
curl -I https://wmca-blog.vercel.app
curl -I https://your-cdn.com/wmcaassets/apps/blog/wmca-blog-component.js

# Test in browser console
fetch('https://wmca-blog.vercel.app').then(r => console.log(r.status))
fetch('https://your-cdn.com/wmcaassets/apps/blog/wmca-blog-component.js')
  .then(r => console.log(r.status))
```

---

## Environment Variables

Set these in your deployment platform:

### Vercel

Go to Settings → Environment Variables:

```
UMBRACO_API_KEY=your_key_here
NEXT_PUBLIC_BLOG_URL=https://wmca-blog.vercel.app
REACT_APP_UMBRACO_API_KEY=your_key_here
```

### Azure App Service

```bash
az webapp config appsettings set \
  --resource-group wmca-blog-rg \
  --name wmca-blog-app \
  --settings UMBRACO_API_KEY="your_key" \
  NEXT_PUBLIC_BLOG_URL="https://wmca-blog.vercel.app"
```

### Self-Hosted (.env)

```bash
# In /var/www/wmca-blog/.env
UMBRACO_API_KEY=your_key_here
NEXT_PUBLIC_BLOG_URL=https://blog.wmca.org.uk
```

---

## Monitoring & Troubleshooting

### Check Deployment Status

```bash
# Vercel
vercel ls

# Docker
docker ps | grep wmca-blog

# Node/PM2
pm2 status
```

### View Logs

```bash
# Vercel (via dashboard)
# https://vercel.com/dashboard

# Docker
docker logs container_id

# Self-hosted PM2
pm2 logs wmca-blog

# Nginx
sudo tail -f /var/log/nginx/error.log
```

### Common Issues

- **503 Service Unavailable**: Next.js app not running
- **404 Web Component Not Found**: CDN URL incorrect
- **CORS Errors**: Missing CORS headers in Next.js config
- **Blank Component**: Blog app not accessible or wrong URL

See [docs/WEB-COMPONENT-README.md](./WEB-COMPONENT-README.md#troubleshooting) for troubleshooting.

---

## Rollback

### Vercel

```bash
vercel rollback
```

### Docker

```bash
docker run -p 3000:3000 -d myregistry/wmca-blog:previous
```

### Azure

```bash
az webapp deployment slot swap \
  --resource-group wmca-blog-rg \
  --name wmca-blog-app \
  --slot staging
```

---

## Performance Optimization

### Image Optimization

Ensure `next/image` is configured for Umbraco media:

```javascript
// next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cms.wmca.org.uk',
    },
  ],
}
```

### Caching Headers

Set aggressive caching for static assets:

```javascript
// next.config.js
headers: async () => [
  {
    source: '/:path*.(js|css|png|jpg|jpeg|svg|webp|ico)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
]
```

### Web Component Script Loading

Load script asynchronously to avoid blocking page:

```html
<script src="..." async></script>
```

---

## Security Best Practices

1. **Enable HTTPS**: Use SSL/TLS on all domains
2. **API Keys**: Store in environment variables, never in code
3. **CORS**: Only allow specific origins
4. **CSP Headers**: Restrict script execution
5. **Regular Updates**: Keep dependencies updated

```bash
npm audit
npm audit fix
npm update
```

---

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
deploy_vercel:
  stage: deploy
  script:
    - npm run next:build
    - vercel deploy --prod
  only:
    - main
```

---

## Support

For deployment issues:
- Check platform-specific documentation
- Review logs for error messages
- Test with curl/fetch commands
- Verify environment variables are set
- Check CORS and CSP headers

---

**Last Updated**: March 2024 | **Version**: 1.0.0

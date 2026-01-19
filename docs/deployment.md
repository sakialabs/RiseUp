# Deployment Guide

Complete deployment instructions for RiseUp Collective.

## Table of Contents

- [Web App (Netlify)](#web-app-netlify)
- [Backend API (Render)](#backend-api-render)
- [Environment Variables](#environment-variables)

---

## Web App (Netlify)

Deploy the Next.js web frontend to Netlify.

### Quick Deploy

1. **Connect Repository**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider and repository

2. **Configure Build**
   - Base directory: `web`
   - Build command: `npm run build`
   - Publish directory: `web/.next`

3. **Add Environment Variable**
   - Go to Site settings → Environment variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-api-url.com/api/v1`

4. **Deploy**
   - Click "Deploy site"
   - Wait ~2-3 minutes for build

### Build Configuration

The `netlify.toml` file contains all build settings (Node 18, Next.js plugin, redirects).

### Troubleshooting

**Build fails**: Ensure `web/lib/` folder is committed to git
**API calls fail**: Verify `NEXT_PUBLIC_API_URL` is set correctly
**404 on refresh**: Already handled by `netlify.toml` redirects

---

## Backend API (Render)

Deploy the FastAPI backend to Render.

### Prerequisites

- Render account (free tier available)
- GitHub/GitLab repository

### Step 1: Create PostgreSQL Database

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `riseup-db`
   - Database: `riseup`
   - User: `riseup`
   - Region: Choose closest to your users
   - Plan: Free (or paid for production)
4. Click "Create Database"
5. **Save the Internal Database URL** (starts with `postgresql://`)

### Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - Name: `riseup-api`
   - Region: Same as database
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Plan: Free (or paid for production)

### Step 3: Add Environment Variables

In the web service settings, add these environment variables:

```
DATABASE_URL=<your-internal-database-url>
SECRET_KEY=<generate-a-random-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7
BACKEND_CORS_ORIGINS=https://your-netlify-site.netlify.app
```

**Generate SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Install dependencies
   - Run database migrations (if configured)
   - Start the API server
3. Your API will be available at: `https://riseup-api.onrender.com`

### Step 5: Run Database Migrations

After first deploy, run migrations:

1. Go to your web service → "Shell" tab
2. Run:
   ```bash
   alembic upgrade head
   python scripts/seed.py  # Optional: seed demo data
   ```

### Step 6: Update Web App

Update your Netlify environment variable:
- `NEXT_PUBLIC_API_URL` = `https://riseup-api.onrender.com/api/v1`

Redeploy your Netlify site to pick up the new API URL.

### Render Configuration File (Optional)

Create `render.yaml` in the root directory for infrastructure as code:

```yaml
databases:
  - name: riseup-db
    databaseName: riseup
    user: riseup
    plan: free

services:
  - type: web
    name: riseup-api
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: riseup-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: ALGORITHM
        value: HS256
      - key: ACCESS_TOKEN_EXPIRE_DAYS
        value: 7
      - key: BACKEND_CORS_ORIGINS
        value: https://your-netlify-site.netlify.app
```

### Monitoring & Logs

- **Logs**: Available in Render dashboard under "Logs" tab
- **Metrics**: View CPU, memory, and request metrics
- **Health checks**: Render automatically monitors your service

### Troubleshooting

**Build fails**:
- Check that `requirements.txt` is in the `backend/` directory
- Verify Python version compatibility

**Database connection fails**:
- Ensure `DATABASE_URL` is set correctly
- Check that database and web service are in the same region

**CORS errors**:
- Verify `BACKEND_CORS_ORIGINS` includes your Netlify URL
- Check that URL doesn't have trailing slash

**Service won't start**:
- Check logs for errors
- Verify start command is correct
- Ensure port binding uses `$PORT` environment variable

---

## Environment Variables

### Web App (Netlify)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://riseup-api.onrender.com/api/v1` |

### Backend API (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `SECRET_KEY` | JWT signing key | `<random-32-char-string>` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_DAYS` | Token expiration | `7` |
| `BACKEND_CORS_ORIGINS` | Allowed origins (comma-separated) | `https://your-site.netlify.app` |

---

## Alternative Deployment Options

### Backend Alternatives

- **Railway**: Similar to Render, easy setup
- **Fly.io**: Global edge deployment
- **DigitalOcean App Platform**: Simple PaaS
- **AWS/GCP/Azure**: Full control, more complex

### Web App Alternatives

- **Vercel**: Optimized for Next.js
- **Cloudflare Pages**: Fast global CDN
- **AWS Amplify**: AWS-native hosting

---

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] Database migrations run
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] Web app deployed
- [ ] Web app points to production API
- [ ] Test login/registration
- [ ] Test creating events
- [ ] Test all major features
- [ ] Monitor logs for errors
- [ ] Set up custom domain (optional)

---

For local development setup, see [docs/setup.md](../docs/setup.md).

# Deployment Guide

This guide covers how to publish the Gdansk Mosque Quiz app to production.

## ✅ Database: PostgreSQL

Your app uses **PostgreSQL** which works great on all hosting platforms including serverless (Vercel, Netlify).

**Free PostgreSQL Providers**:
- [Neon](https://neon.tech) - Serverless PostgreSQL (recommended)
- [Supabase](https://supabase.com) - PostgreSQL with additional features
- [Railway](https://railway.app) - PostgreSQL database service
- [Render](https://render.com) - PostgreSQL database service

---

## Option 1: Deploy to Vercel (Recommended for Next.js)

Vercel is made by the Next.js team and offers the easiest deployment experience.

### Quick Deploy (GitHub Integration)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign up/login with GitHub

3. **Click "New Project"** → Import your GitHub repository

4. **Configure the project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Set up PostgreSQL database**:
   
   **Option A: Vercel Postgres** (Integrated):
   - In Vercel dashboard → Project Settings → Storage → Create Database → Postgres
   - Vercel automatically provides `POSTGRES_PRISMA_URL` or `DATABASE_URL`
   
   **Option B: External PostgreSQL Provider** (Recommended for free tier):
   - [Neon](https://neon.tech) - Free serverless PostgreSQL (recommended)
   - [Supabase](https://supabase.com) - Free PostgreSQL
   - Create a database and copy the connection string
   - Add `DATABASE_URL` environment variable in Vercel dashboard

6. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add `DATABASE_URL` from your database provider (if using external provider)
   - Vercel Postgres automatically provides the connection string

7. **Deploy**: Click "Deploy" - Vercel will build and deploy automatically

8. **Set up database schema** (after first deploy):
   - Run: `npx prisma db push` via Vercel CLI or terminal
   - Or add to build command: `npm run db:generate && npx prisma db push && npm run build`

8. **Set up database migrations**:
   - In Vercel dashboard → Settings → Build & Development Settings
   - Add build command: `npm run db:generate && npm run build`
   - Or use Vercel's post-deploy hooks

### Manual Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

---

## Option 2: Deploy to Railway

Railway makes deployment simple and provides PostgreSQL databases.

### Steps:

1. **Push code to GitHub** (same as above)

2. **Go to [railway.app](https://railway.app)** and sign up/login with GitHub

3. **Click "New Project"** → "Deploy from GitHub repo"

4. **Select your repository**

5. **Railway will auto-detect Next.js** and start building

6. **Add PostgreSQL Database**:
   - Click "+ New" → "Database" → "Add PostgreSQL"
   - Railway will automatically provide `DATABASE_URL` environment variable
   - No manual configuration needed!

7. **Deploy**: Railway will automatically deploy on every push

8. **Set up database schema**:
   - After first deploy, run: `npx prisma db push` via Railway's CLI or terminal
   - Or add to build command: `npm run db:generate && npx prisma db push && npm run build`

9. **Generate Domain**: Railway provides a free `.railway.app` domain

---

## Option 3: Deploy to Render

### Steps:

1. **Push code to GitHub**

2. **Go to [render.com](https://render.com)** and sign up

3. **Create New Web Service**:
   - Connect your GitHub repository
   - Select your repo

4. **Configure**:
   - **Name**: `gdansk-mosque-quiz`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run db:generate && npm run build`
   - **Start Command**: `npm start`

5. **Add PostgreSQL Database** (Recommended):
   - Go to Dashboard → "New +" → "PostgreSQL"
   - Render will provide `DATABASE_URL`
   - Update Prisma schema (as shown above)
   - Add `DATABASE_URL` as environment variable

6. **Deploy**: Click "Create Web Service"

---

## Option 4: Deploy to Netlify

Netlify works well but requires Next.js adapter configuration.

### Steps:

1. **Install Netlify adapter**:
   ```bash
   npm install @netlify/plugin-nextjs
   ```

2. **Create `netlify.toml`**:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Push to GitHub** and connect to Netlify

4. **Set up PostgreSQL Database**: 
   - Add PostgreSQL database service on Netlify or use external provider
   - Add `DATABASE_URL` environment variable

---

## Pre-Deployment Checklist

- [ ] Test locally: `npm run build && npm start`
- [ ] Set up PostgreSQL database (local or cloud provider)
- [ ] Create `.env` file with `DATABASE_URL`
- [ ] Run `npm run db:generate && npm run db:push` locally to verify database connection
- [ ] Seed database: `npm run db:seed` (optional)
- [ ] Push code to GitHub
- [ ] Choose hosting platform (Vercel recommended)
- [ ] Add `DATABASE_URL` environment variable on hosting platform
- [ ] Configure build commands (add `npm run db:generate` if needed)
- [ ] Deploy and test
- [ ] Run database migrations/schema push after first deploy if needed
- [ ] Test quiz functionality in production

---

## Quick Start Commands

```bash
# Build for production locally
npm run build

# Test production build
npm start

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database
npm run db:seed
```

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment

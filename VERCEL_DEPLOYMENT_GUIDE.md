# Vercel Deployment Guide - PostgreSQL Migration

## Overview
This guide walks you through deploying the Painting Buddy app to Vercel with Vercel Postgres (powered by Neon).

## Prerequisites
- Vercel account (free tier is fine)
- Git repository pushed to GitHub/GitLab/Bitbucket
- Vercel CLI installed (optional but helpful): `npm i -g vercel`

---

## Step 1: Create Vercel Project & Postgres Database

### Option A: Using Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Create New Project**
   - Click "Add New..." → "Project"
   - Import your Git repository
   - Select the repository: `mobile_first_painting_app`

3. **Configure Project Settings**
   - Framework Preset: **Next.js**
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Vercel Postgres**
   - Go to your project dashboard
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose "Hobby" plan (free)
   - Click "Create"

5. **Copy Database Connection Strings**
   - After database is created, go to the ".env.local" tab
   - Copy these variables (you'll need them):
     - `POSTGRES_URL` (for pooled connections)
     - `POSTGRES_URL_NON_POOLING` (for migrations)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (will create project)
vercel

# Add Postgres storage
vercel storage create postgres
```

---

## Step 2: Configure Environment Variables

### In Vercel Dashboard:

Go to **Project Settings → Environment Variables** and add:

```bash
# Database (automatically added if you created Postgres in Vercel)
DATABASE_URL="<POSTGRES_URL from Vercel>"
DIRECT_URL="<POSTGRES_URL_NON_POOLING from Vercel>"

# NextAuth (IMPORTANT!)
NEXTAUTH_SECRET="<generate a random 32+ character string>"
NEXTAUTH_URL="https://your-app-name.vercel.app"

# Note: Generate NEXTAUTH_SECRET using:
# openssl rand -base64 32
# Or use: https://generate-secret.vercel.app/32
```

**Important**: Make sure to set these for **Production**, **Preview**, and **Development** environments.

---

## Step 3: Update Local Environment for Testing

Create a `.env.production.local` file (DO NOT COMMIT):

```bash
# Copy this from Vercel's .env.local tab
DATABASE_URL="<POSTGRES_URL>"
DIRECT_URL="<POSTGRES_URL_NON_POOLING>"

NEXTAUTH_SECRET="<same as Vercel>"
NEXTAUTH_URL="http://localhost:3005"
```

---

## Step 4: Run Database Migrations

### Initial Migration (First Time Only)

```bash
# Generate Prisma Client for PostgreSQL
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# This will:
# 1. Create migration files in prisma/migrations/
# 2. Apply migration to your local dev database (if DATABASE_URL points to local Postgres)
```

### Deploy Migration to Vercel Postgres

```bash
# Set DATABASE_URL to Vercel Postgres (use DIRECT_URL from Vercel)
$env:DATABASE_URL="<POSTGRES_URL_NON_POOLING from Vercel>"

# Run migration against production database
npx prisma migrate deploy

# Verify migration
npx prisma migrate status
```

---

## Step 5: Seed Production Database

After migrations are complete, seed the database with initial data:

```bash
# Make sure DATABASE_URL is set to Vercel Postgres DIRECT_URL
$env:DATABASE_URL="<POSTGRES_URL_NON_POOLING from Vercel>"

# Run seed script
npm run prisma:seed
```

This will create:
- Admin user: `admin@example.com` / `admin123`
- Supervisor user: `supervisor@example.com` / `super123`
- Employee user: `painter@example.com` / `paint123`

**IMPORTANT**: Change these passwords immediately after first login!

---

## Step 6: Migrate Existing Data from SQLite (Optional)

If you have test data in SQLite you want to keep:

### Option A: Manual Export/Import (Small datasets)

1. **Export SQLite data to JSON**:
   ```bash
   # Use Prisma Studio to view data
   npx prisma studio

   # Manually copy important records
   # Or write a custom script to export data
   ```

2. **Import to Postgres**:
   - Use Prisma Studio connected to Postgres
   - Or write a migration script

### Option B: Use a migration tool (Recommended for large datasets)

Create `scripts/migrate-sqlite-to-postgres.ts`:

```typescript
// This is a template - customize based on your needs
import { PrismaClient as SqliteClient } from '@prisma/client'
import { PrismaClient as PostgresClient } from '@prisma/client'

const sqlite = new SqliteClient({
  datasources: { db: { url: 'file:./prisma/dev.db' } }
})

const postgres = new PostgresClient({
  datasources: { db: { url: process.env.DATABASE_URL! } }
})

async function migrate() {
  console.log('Starting migration...')

  // 1. Migrate users
  const users = await sqlite.user.findMany()
  for (const user of users) {
    await postgres.user.create({ data: user })
  }

  // 2. Migrate job sites
  // 3. Migrate floors
  // 4. Migrate areas
  // 5. Migrate tasks
  // 6. Migrate assignments
  // 7. Migrate time entries

  console.log('Migration complete!')
}

migrate()
  .catch(console.error)
  .finally(() => {
    sqlite.$disconnect()
    postgres.$disconnect()
  })
```

**Note**: For initial testing, it's easier to just use the seed script and create fresh test data.

---

## Step 7: Deploy to Vercel

### Option A: Git Push (Recommended)

```bash
# Commit your changes
git add .
git commit -m "chore: configure for Vercel Postgres deployment"

# Push to GitHub (triggers automatic deployment)
git push origin develop
```

Vercel will automatically:
1. Detect the push
2. Build the app
3. Run migrations (if configured in build script)
4. Deploy to production

### Option B: Manual Deploy via CLI

```bash
# Deploy to production
vercel --prod
```

---

## Step 8: Verify Deployment

1. **Visit your Vercel URL**: `https://your-app-name.vercel.app`

2. **Test Login**:
   - Try logging in with admin credentials
   - Verify all features work

3. **Check Database**:
   ```bash
   # Connect to Vercel Postgres
   $env:DATABASE_URL="<POSTGRES_URL_NON_POOLING>"
   npx prisma studio
   ```

4. **Monitor Logs**:
   - Go to Vercel Dashboard → Your Project → Logs
   - Check for any errors

---

## Troubleshooting

### Issue: "Can't reach database server"
- **Solution**: Make sure you're using `DIRECT_URL` (non-pooling) for migrations
- Use `DATABASE_URL` (pooling) for the app runtime

### Issue: "Prisma Client not generated"
- **Solution**: Run `npx prisma generate` before building
- Or add `postinstall` script to package.json (already added)

### Issue: "Environment variable not found"
- **Solution**: Double-check all env vars are set in Vercel dashboard
- Make sure they're set for the correct environment (Production/Preview/Development)

### Issue: "NextAuth error"
- **Solution**: Verify `NEXTAUTH_URL` matches your Vercel domain
- Ensure `NEXTAUTH_SECRET` is set and is a strong random string

### Issue: Migration fails
- **Solution**: Use `DIRECT_URL` (non-pooling connection) for migrations
- Run `npx prisma migrate status` to check migration state
- If needed, reset with `npx prisma migrate reset` (⚠️ deletes all data!)

---

## Post-Deployment Tasks

1. **Change Default Passwords**
   - Login as admin and change password
   - Update supervisor and employee passwords

2. **Configure Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain

3. **Set Up Monitoring**
   - Enable Vercel Analytics (built-in)
   - Consider adding error tracking (Sentry, etc.)

4. **Create Production Admin User**
   - Use the app UI to create real users
   - Delete or disable the seed data users

5. **Backup Strategy**
   - Vercel Postgres has automatic backups
   - Consider exporting data regularly for safety

---

## Useful Commands

```bash
# Check Prisma connection
npx prisma db pull

# View database in browser
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (⚠️ DANGEROUS - deletes all data!)
npx prisma migrate reset

# Seed database
npm run prisma:seed
```

---

## Local Development After Migration

To continue local development with PostgreSQL instead of SQLite:

1. **Option A**: Keep using SQLite for local dev
   - Keep `.env` with `file:./prisma/dev.db`
   - Use `.env.production.local` for Vercel Postgres testing

2. **Option B**: Use local PostgreSQL
   - Install PostgreSQL locally
   - Update `.env` with local Postgres URL
   - Run migrations: `npx prisma migrate dev`

3. **Option C**: Connect to Vercel Postgres from local
   - Use `.env.production.local` with Vercel URLs
   - Be careful not to corrupt production data!

---

## Next Steps

- ✅ Test all features on Vercel
- ✅ Run through the PRE_MIGRATION_TESTING_CHECKLIST.md
- ✅ Create real production users
- ✅ Import any production data if needed
- ✅ Set up monitoring and alerts
- ✅ Document any production-specific configurations

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Prisma + Vercel**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- **Next.js on Vercel**: https://nextjs.org/docs/deployment

# PaintingBuddy - Database Setup Guide

This guide covers database setup for the PaintingBuddy application using PostgreSQL and Prisma ORM.

## Database Schema Overview

The application uses 9 main models:

1. **User** - Admin, Supervisor, and Employee (Painter) accounts
2. **JobSite** - Painting job sites/projects
3. **Floor** - Floors within a job site
4. **Area** - Rooms, hallways, bathrooms, and closets within floors
5. **Task** - Painting tasks (Cut, Roll, Trim, Touch-up) within areas
6. **Assignment** - Painter assignments to job sites, floors, or areas
7. **TimeEntry** - Clock in/out records for painters
8. **ActivityLog** - Audit trail of all changes
9. **Flag** - Issues, material wait, and inspection flags

## Local Development Setup

### Option 1: Local PostgreSQL (Optional)

If you want to run PostgreSQL locally:

1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)

2. Create a database:
```bash
createdb paintingbuddy_dev
```

3. Update your `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/paintingbuddy_dev"
```

4. Run migrations:
```bash
npm run prisma:migrate
```

### Option 2: Vercel Postgres (Recommended)

1. Create a Vercel Postgres database:
   - Go to your Vercel project dashboard
   - Navigate to Storage tab
   - Create a new Postgres database
   - Copy the `DATABASE_URL` from the `.env.local` tab

2. Update your local `.env` file with the Vercel Postgres URL

3. Run migrations:
```bash
npm run prisma:migrate
```

### Option 3: Supabase (Alternative)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > Database and copy the connection string
3. Update `.env` with your Supabase connection string
4. Run migrations

## Prisma Commands

### Generate Prisma Client
Generates TypeScript types and the Prisma Client:
```bash
npm run prisma:generate
# or
npx prisma generate
```

### Create Migrations
Creates a new migration based on schema changes:
```bash
npm run prisma:migrate
# or
npx prisma migrate dev --name description_of_changes
```

### Reset Database
Drops all data and re-runs migrations:
```bash
npx prisma migrate reset
```

### Seed Database
Populates the database with test data:
```bash
npm run prisma:seed
# or
npx prisma db seed
```

### Prisma Studio
Opens a GUI to view and edit your database:
```bash
npm run prisma:studio
# or
npx prisma studio
```

Prisma Studio will open at http://localhost:5555

## Environment Variables

Required environment variable in `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

For production, set this in your Vercel project settings.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add Vercel Postgres database in Storage tab
4. Environment variables are automatically configured
5. Migrations run automatically on deployment via `postinstall` script

### Manual Migration on Production

If needed, you can manually run migrations:

```bash
npx prisma migrate deploy
```

## Troubleshooting

### "Can't reach database server"
- Check that your `DATABASE_URL` is correct
- Verify the database is running (for local PostgreSQL)
- Check firewall settings

### "Prisma Client not found"
Run:
```bash
npm run prisma:generate
```

### Schema drift detected
Your database schema doesn't match your Prisma schema. Run:
```bash
npx prisma migrate dev
```

### Type errors after schema changes
1. Update your schema in `prisma/schema.prisma`
2. Run `npx prisma format` to format it
3. Run `npm run prisma:generate` to regenerate the client
4. Restart your TypeScript server in VS Code

## Database Diagram

```
User (Admin/Supervisor/Employee)
  └── supervisedSites → JobSite
                          ├── floors → Floor
                          │             ├── areas → Area
                          │             │            ├── parentArea (closets)
                          │             │            └── tasks → Task
                          │             │
                          │             └── assignments → Assignment
                          │
                          └── timeEntries → TimeEntry
                          └── flags → Flag
```

## Test Data

The seed script creates:
- 1 Admin user (admin@paintingbuddy.com / Admin123!)
- 1 Supervisor (supervisor@paintingbuddy.com / Super123!)
- 6 Painters (painter1-6@paintingbuddy.com / Painter123!)
- 1 Job site: Riverside Apartments
- 3 Floors with realistic areas and tasks
- Sample assignments, time entries, and flags

## Security Notes

- Never commit your `.env` file
- Use strong passwords in production
- Rotate credentials regularly
- Use connection pooling for production (Prisma Data Proxy or PgBouncer)

# PaintingBuddy App - Mobile-First Development Roadmap
## Complete Waterfall Development Plan with Vercel Deployment

---

## 📋 Overview

This roadmap is designed for **sequential, waterfall development** where you'll use **Claude Code** to build a mobile-first painting contractor management application. Each milestone includes:

1. **Exact prompts** to give Claude Code
2. **When to make git commits** (with commit messages)
3. **Testing checkpoints** with expected results
4. **Validation steps** before moving to the next milestone
5. **Deployment instructions** for Vercel hosting

---

## 🎯 Application Overview

**PaintingBuddy** is a mobile-first web application for painting contractors to:
- Manage painting job sites with hierarchical structure (Sites → Floors → Areas → Tasks)
- Track painter time (clock in/out)
- Monitor real-time progress on painting tasks
- Assign painters to specific areas
- Generate reports and track completion

**User Roles:**
- **Admin**: Full system access, manage all sites and users
- **Supervisor**: Manage assigned job sites and painters
- **Employee (Painter)**: Clock in/out, update task progress, view assignments

**Technology Stack:**
- **Frontend**: Next.js 14+ with App Router, React, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js with JWT
- **Hosting**: Vercel (frontend + serverless API)
- **Database Host**: Vercel Postgres or Supabase

---

## 🚀 Development Approach

### Your Role
- Read each milestone section
- Copy prompts to Claude Code
- Review generated code
- Run tests and verify results
- Make git commits at specified points
- Move to next milestone only after validation passes

### Claude Code's Role
- Generate all code based on your prompts
- Create files and folder structures
- Write tests
- Debug issues
- Optimize for mobile-first experience

### Workflow Pattern
```
Read Milestone → Prompt Claude Code → Review Code → Test → Commit → Validate → Next Milestone
```

---

## 🗂️ PROJECT PHASES

### Phase 1: Foundation & Database (Milestones 1-3)
### Phase 2: Backend API Development (Milestones 4-9)
### Phase 3: Mobile-First Frontend (Milestones 10-16)
### Phase 4: Testing & Polish (Milestone 17)
### Phase 5: Vercel Deployment (Milestones 18-19)

---

# PHASE 1: FOUNDATION & DATABASE

---

## MILESTONE 1: Project Initialization
**Duration**: 30-45 minutes
**Goal**: Initialize Next.js project with TypeScript and Tailwind CSS

### Step 1.1: Create Next.js Project

**Prompt for Claude Code**:
```
Create a new Next.js 14 project with TypeScript and Tailwind CSS for a mobile-first painting contractor management app called "PaintingBuddy".

Requirements:
- Use create-next-app with TypeScript and Tailwind CSS
- App Router (not Pages Router)
- ESLint configuration
- Create the following folder structure in the app directory:
  app/
  ├── (auth)/           # Auth-related pages (login, register)
  ├── (admin)/          # Admin dashboard and pages
  ├── (employee)/       # Employee/painter pages
  ├── api/              # API routes
  └── components/       # Shared components

- Create src/ directory with:
  src/
  ├── lib/              # Utilities and helpers
  ├── types/            # TypeScript types
  └── config/           # Configuration files

- Update tailwind.config.ts with mobile-first breakpoints
- Create .gitignore for Next.js
- Create .env.example with placeholder environment variables:
  - DATABASE_URL
  - NEXTAUTH_SECRET
  - NEXTAUTH_URL
  - JWT_SECRET

- Update package.json with scripts:
  - dev: next dev
  - build: next build
  - start: next start
  - lint: next lint
  - test: jest
  - test:watch: jest --watch
```

**Expected Output**:
- Next.js project initialized
- Folder structure created
- Tailwind CSS configured
- Environment variables template ready

**Validation Checklist**:
- [ ] Project runs with `npm run dev`
- [ ] Tailwind CSS is working (test with a styled component)
- [ ] TypeScript compiles without errors
- [ ] Folder structure matches requirements

**🔄 GIT COMMIT #1**:
```bash
git init
git add .
git commit -m "chore: initialize Next.js project with TypeScript and Tailwind"
git branch -M main
git checkout -b develop
```

---

### Step 1.2: Configure Mobile-First Theme

**Prompt for Claude Code**:
```
Set up a mobile-first design system with Tailwind CSS based on the wireframes in timesheet-wireframes.jsx.

Requirements:
1. Update tailwind.config.ts with:
   - Custom color palette (blue primary, green success, red error, gray neutrals)
   - Mobile-first breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
   - Custom spacing scale
   - Font family configuration

2. Create src/lib/theme.ts with:
   - Color constants
   - Spacing constants
   - Typography scales

3. Create app/globals.css with:
   - Mobile-first base styles
   - Custom scrollbar styling
   - Focus states for accessibility
   - Touch-friendly button sizes (min 44x44px)

4. Create a simple test page at app/page.tsx that shows:
   - Responsive layout
   - Color palette showcase
   - Typography samples
   - Button styles

Design should match the clean, modern mobile UI from timesheet-wireframes.jsx with blue primary colors.
```

**Expected Output**:
- Tailwind theme configured
- Theme constants defined
- Global styles applied
- Test page showing design system

**Testing Checkpoint #1: Verify Theme**:
```bash
npm run dev
# Open http://localhost:3000
# Resize browser window to test responsive breakpoints
# Expected: Mobile-first layout that adapts to larger screens
```

**Validation Checklist**:
- [ ] Colors match wireframe design
- [ ] Layout is mobile-first (looks great on 375px width)
- [ ] Touch targets are large enough (44x44px minimum)
- [ ] Responsive breakpoints work correctly

**🔄 GIT COMMIT #2**:
```bash
git add .
git commit -m "feat: configure mobile-first theme with Tailwind CSS"
```

---

### Step 1.3: Set Up Testing Framework

**Prompt for Claude Code**:
```
Configure Jest and React Testing Library for Next.js.

Requirements:
- Install dependencies:
  - jest
  - @testing-library/react
  - @testing-library/jest-dom
  - @testing-library/user-event
  - jest-environment-jsdom

- Create jest.config.js for Next.js
- Create jest.setup.js with Testing Library extensions
- Add test script to package.json
- Create a sample test file: app/page.test.tsx

The test should verify that the home page renders correctly.
```

**Testing Checkpoint #2: Run Tests**:
```bash
npm test

# Expected Output:
# PASS app/page.test.tsx
#   Home Page
#     ✓ renders without crashing (XX ms)
```

**Validation Checklist**:
- [ ] Tests run successfully
- [ ] Jest configuration is correct
- [ ] Testing Library is properly set up

**🔄 GIT COMMIT #3**:
```bash
git add .
git commit -m "test: configure Jest and React Testing Library"
```

---

**✅ MILESTONE 1 VALIDATION**

Before proceeding to Milestone 2, verify:
- [ ] Next.js dev server runs without errors
- [ ] Mobile-first layout looks good on phone screen width
- [ ] All tests pass
- [ ] TypeScript compiles with no errors
- [ ] Git history shows 3 commits on develop branch

**If any validation fails**: Fix issues before proceeding. Ask Claude Code: "The [specific test/feature] is not working. Here's the error: [paste error]. Please help me fix it."

---

## MILESTONE 2: Database Schema & Prisma Setup
**Duration**: 60-75 minutes
**Goal**: Complete PostgreSQL setup with Prisma ORM and all tables

### Step 2.1: Install and Configure Prisma

**Prompt for Claude Code**:
```
Set up Prisma ORM for PostgreSQL in the Next.js project.

Requirements:
- Install @prisma/client and prisma as dev dependency
- Initialize Prisma: npx prisma init
- Configure prisma/schema.prisma:
  - PostgreSQL as database provider
  - Output directory: node_modules/.prisma/client

- Create src/lib/prisma.ts as a singleton Prisma client (handle Next.js hot reload)
- Add scripts to package.json:
  - prisma:generate: prisma generate
  - prisma:migrate: prisma migrate dev
  - prisma:studio: prisma studio
  - prisma:seed: tsx prisma/seed.ts
  - postinstall: prisma generate

- Update .env.example with DATABASE_URL template
- Create .env with a local PostgreSQL connection (or note to use Vercel Postgres later)

Use the Next.js best practice pattern for Prisma client to avoid multiple instances during development.
```

**Expected Output**:
- Prisma installed and configured
- Singleton Prisma client created
- Database scripts ready

**🔄 GIT COMMIT #4**:
```bash
git add .
git commit -m "chore: install and configure Prisma ORM"
```

---

### Step 2.2: Create Complete Database Schema

**Prompt for Claude Code**:
```
Create the complete Prisma schema for PaintingBuddy in prisma/schema.prisma.

Requirements - Create these models with proper relationships:

1. User
   - id (String, @id @default(cuid()))
   - email (String, @unique, lowercase)
   - passwordHash (String)
   - firstName (String)
   - lastName (String)
   - role (UserRole enum: ADMIN, SUPERVISOR, EMPLOYEE)
   - phone (String?, optional)
   - isActive (Boolean, default: true)
   - createdAt (DateTime, @default(now()))
   - updatedAt (DateTime, @updatedAt)
   - Relations: supervisedSites[], assignments[], timeEntries[], activityLogs[], createdFlags[], resolvedFlags[]

2. JobSite
   - id (String, @id @default(cuid()))
   - name (String)
   - address (String)
   - notes (String?, optional)
   - supervisorId (String)
   - startDate (DateTime)
   - completionPercentage (Int, default: 0)
   - isActive (Boolean, default: true)
   - createdAt (DateTime)
   - updatedAt (DateTime)
   - Relations: supervisor (User), floors[], assignments[], timeEntries[], flags[]

3. Floor
   - id (String, @id @default(cuid()))
   - jobSiteId (String)
   - name (String)
   - floorNumber (Int)
   - completionPercentage (Int, default: 0)
   - notes (String?, optional)
   - createdAt (DateTime)
   - updatedAt (DateTime)
   - Relations: jobSite (JobSite), areas[], assignments[], timeEntries[], flags[]
   - @@unique([jobSiteId, floorNumber])

4. Area
   - id (String, @id @default(cuid()))
   - floorId (String)
   - parentAreaId (String?, optional for closets)
   - name (String)
   - areaType (AreaType enum: ROOM, HALLWAY, BATHROOM, CLOSET)
   - completionPercentage (Int, default: 0)
   - notes (String?, optional)
   - createdAt (DateTime)
   - updatedAt (DateTime)
   - Relations: floor (Floor), parentArea (Area?, self-reference), subAreas[], tasks[], assignments[], timeEntries[], flags[]

5. Task
   - id (String, @id @default(cuid()))
   - areaId (String)
   - name (String) - e.g., "Cut", "Roll", "Trim", "Touch-up"
   - taskOrder (Int) - for display order
   - completionPercentage (Int, default: 0)
   - notes (String?, optional)
   - createdAt (DateTime)
   - updatedAt (DateTime)
   - Relations: area (Area), activityLogs[]
   - @@unique([areaId, taskOrder])

6. Assignment
   - id (String, @id @default(cuid()))
   - userId (String)
   - assignableType (AssignableType enum: JOB_SITE, FLOOR, AREA)
   - assignableId (String) - polymorphic reference
   - jobSiteId (String?, optional)
   - floorId (String?, optional)
   - areaId (String?, optional)
   - assignedAt (DateTime, @default(now()))
   - assignedBy (String)
   - Relations: user (User), assigner (User), jobSite?, floor?, area?
   - @@unique([userId, assignableType, assignableId])

7. TimeEntry
   - id (String, @id @default(cuid()))
   - userId (String)
   - jobSiteId (String)
   - floorId (String?, optional)
   - areaId (String?, optional)
   - clockIn (DateTime)
   - clockOut (DateTime?, optional)
   - totalHours (Decimal?, optional)
   - notes (String?, optional)
   - createdAt (DateTime)
   - updatedAt (DateTime)
   - Relations: user (User), jobSite (JobSite), floor?, area?

8. ActivityLog
   - id (String, @id @default(cuid()))
   - userId (String)
   - entityType (String) - e.g., "Task", "Area"
   - entityId (String)
   - action (String) - e.g., "updated progress", "added note"
   - changes (Json?, optional) - JSON object with before/after
   - taskId (String?, optional)
   - createdAt (DateTime, @default(now()))
   - Relations: user (User), task?

9. Flag
   - id (String, @id @default(cuid()))
   - flaggableType (String) - e.g., "JobSite", "Floor", "Area"
   - flaggableId (String)
   - jobSiteId (String?, optional)
   - floorId (String?, optional)
   - areaId (String?, optional)
   - flagType (FlagType enum: ISSUE, WAITING_MATERIALS, INSPECTION_NEEDED, OTHER)
   - description (String)
   - status (FlagStatus enum: OPEN, IN_PROGRESS, RESOLVED)
   - createdBy (String)
   - resolvedBy (String?, optional)
   - createdAt (DateTime, @default(now()))
   - resolvedAt (DateTime?, optional)
   - Relations: creator (User), resolver?, jobSite?, floor?, area?

**Enums:**
- UserRole: ADMIN, SUPERVISOR, EMPLOYEE
- AreaType: ROOM, HALLWAY, BATHROOM, CLOSET
- AssignableType: JOB_SITE, FLOOR, AREA
- FlagType: ISSUE, WAITING_MATERIALS, INSPECTION_NEEDED, OTHER
- FlagStatus: OPEN, IN_PROGRESS, RESOLVED

Use camelCase for all field names (Prisma convention).
Add @@map directives to use snake_case table names in the database.
Include proper indexes for foreign keys and frequently queried fields.
Add cascade deletes where appropriate (e.g., deleting a site deletes floors, areas, tasks).
```

**Expected Output**:
- Complete schema.prisma with all 9 models
- All enums defined
- Proper relationships and constraints
- Database-level indexes

**Validation Checklist**:
- [ ] Schema file has no syntax errors (`npx prisma format`)
- [ ] All enums are defined
- [ ] Foreign keys are correct
- [ ] Unique constraints are in place

**🔄 GIT COMMIT #5**:
```bash
git add .
git commit -m "feat: create complete database schema with 9 models"
```

---

### Step 2.3: Create Initial Migration

**Prompt for Claude Code**:
```
Create the initial database migration for PaintingBuddy.

Requirements:
1. Format the schema: npx prisma format
2. Generate Prisma client: npx prisma generate
3. Create migration: npx prisma migrate dev --name init

Note: If you don't have a local PostgreSQL database yet, you can skip the migrate step for now and do it later when you have the database URL. For now, just generate the Prisma client.

Create a README-database.md file with:
- Instructions for setting up local PostgreSQL (optional)
- Instructions for using Vercel Postgres
- How to run migrations
- How to access Prisma Studio
```

**Expected Output**:
- Prisma client generated
- Migration files created (if database available)
- Database setup documentation

**Testing Checkpoint #3: Verify Database Setup**:
```bash
# Generate Prisma client
npx prisma generate

# If you have PostgreSQL running locally:
npx prisma migrate dev --name init
npx prisma studio

# Expected: Prisma Studio opens showing all 9 tables
```

**Validation Checklist**:
- [ ] Prisma client generates successfully
- [ ] Migration files exist in prisma/migrations/
- [ ] Documentation is clear and helpful

**🔄 GIT COMMIT #6**:
```bash
git add .
git commit -m "feat: create initial database migration"
```

---

### Step 2.4: Create Database Seed Script

**Prompt for Claude Code**:
```
Create a comprehensive seed script in prisma/seed.ts that populates the database with realistic painting contractor test data.

Requirements:
- Install tsx and bcryptjs for running TypeScript seed file and password hashing
- Install @types/bcryptjs for TypeScript support

Create these seed data:

**Users:**
1. Admin: admin@paintingbuddy.com / Admin123!
   - firstName: "Admin", lastName: "User", role: ADMIN

2. Supervisor: supervisor@paintingbuddy.com / Super123!
   - firstName: "John", lastName: "Smith", role: SUPERVISOR

3. 6 Painters (Employees):
   - painter1@paintingbuddy.com through painter6@paintingbuddy.com
   - All with password: Painter123!
   - Names: Mike Wilson, Sarah Chen, Tom Brown, Lisa Garcia, James Martinez, Emma Johnson
   - role: EMPLOYEE

**Job Site:** "Riverside Apartments"
- Address: "123 Riverside Drive, Portland, OR 97201"
- Supervisor: John Smith
- Start Date: September 15, 2025
- Notes: "New construction, all interior painting"

**Floors:**
- Floor 1 (ground floor)
- Floor 2
- Floor 3

**For Floor 1, create these areas:**

Rooms:
- Room 101 (Living Room) with all 4 tasks:
  1. Cut (100% complete)
  2. Roll (100% complete)
  3. Trim (75% complete)
  4. Touch-up (50% complete)

- Room 102 (Bedroom) with all 4 tasks (60% average)
- Room 103 (Kitchen) with all 4 tasks (40% average)

Hallways:
- Hallway A (Main corridor) with all 4 tasks (60% complete)

Closets (as sub-areas):
- Closet A (under Room 101) - 90% complete
- Closet B (under Room 102) - 70% complete

**For Floor 2:**
- Create 3 rooms (201, 202, 203) with varying progress
- Create 1 hallway
- Leave some tasks incomplete to show realistic work in progress

**Assignments:**
- Assign Mike Wilson, Sarah Chen, and Tom Brown to Riverside Apartments (site level)
- Assign Lisa Garcia to Floor 2 specifically
- Assign James Martinez to Room 201 (area level)

**Time Entries:**
- Create 5-6 time entries for different painters from the past few days
- Some clocked out, some still clocked in
- Vary the hours worked (6-8 hours per entry)

**Flags:**
- Add 2-3 flags:
  * ISSUE flag on Room 103: "Water damage on ceiling, needs repair before painting"
  * WAITING_MATERIALS flag on Floor 3: "Paint order delayed, expected Friday"
  * INSPECTION_NEEDED flag on Room 101: "Final walkthrough needed"

Add proper console logging for each step with emojis to show progress.
Calculate completion percentages based on task progress.

Update package.json to include:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```
```

**Testing Checkpoint #4: Run Seed Script**:
```bash
# Install dependencies
npm install bcryptjs tsx
npm install -D @types/bcryptjs

# Run seed
npm run prisma:seed

# Expected Output:
# 🌱 Seeding database...
# ✅ Created admin user
# ✅ Created supervisor user
# ✅ Created 6 painter users
# ✅ Created job site: Riverside Apartments
# ✅ Created 3 floors
# ✅ Created areas for Floor 1: 3 rooms, 1 hallway, 2 closets
# ✅ Created painting tasks (Cut, Roll, Trim, Touch-up)
# ✅ Created areas for Floor 2
# ✅ Created 5 assignments
# ✅ Created 6 time entries
# ✅ Created 3 flags
# 🎉 Seeding completed!
#
# 📊 Summary:
# - 8 users
# - 1 job site
# - 3 floors
# - 10 areas
# - 40 tasks
# - 5 assignments
# - 6 time entries
# - 3 flags

# Verify in Prisma Studio
npx prisma studio

# Check that all tables have realistic data
```

**Validation Checklist**:
- [ ] Seed script runs without errors
- [ ] All users created with hashed passwords
- [ ] Job site hierarchy is complete and realistic
- [ ] Task completion percentages are varied
- [ ] Assignments are properly linked
- [ ] Time entries show realistic work patterns
- [ ] Flags are in different statuses

**🔄 GIT COMMIT #7**:
```bash
git add .
git commit -m "feat: create comprehensive database seed with painting contractor data"
```

---

**✅ MILESTONE 2 VALIDATION**

Before proceeding to Milestone 3, verify:
- [ ] Prisma client generates successfully
- [ ] Seed script runs and populates all tables
- [ ] Prisma Studio shows all data correctly
- [ ] Relationships between tables work (can query with includes)
- [ ] All passwords are properly hashed
- [ ] Git history shows commits #4-7

**If any validation fails**: Ask Claude Code to help debug the specific issue.

---

## MILESTONE 3: Authentication Setup
**Duration**: 45-60 minutes
**Goal**: Implement NextAuth.js with JWT authentication

### Step 3.1: Install and Configure NextAuth.js

**Prompt for Claude Code**:
```
Set up NextAuth.js v5 (Auth.js) for authentication in the Next.js app.

Requirements:
- Install next-auth@beta (v5)
- Install bcryptjs for password verification
- Create src/lib/auth.ts with NextAuth configuration:
  * JWT strategy
  * Credentials provider (email + password)
  * Session callback to include user role and id
  * JWT callback to add custom fields

- Create app/api/auth/[...nextauth]/route.ts (Next.js 14 App Router)

- Create auth middleware in middleware.ts:
  * Protect admin routes: /admin/*
  * Protect employee routes: /employee/*
  * Redirect to /login if not authenticated
  * Allow access to /api/auth/* and public routes

- Create login utilities in src/lib/auth-utils.ts:
  * verifyPassword(password, hash)
  * getUserFromEmail(email)
  * createSession(user)

- Add to .env.example:
  * NEXTAUTH_SECRET
  * NEXTAUTH_URL

Session should include: { user: { id, email, firstName, lastName, role }, expires }
```

**Expected Output**:
- NextAuth.js configured
- Authentication endpoints working
- Middleware protecting routes
- Session management ready

**🔄 GIT COMMIT #8**:
```bash
git add .
git commit -m "feat: configure NextAuth.js with JWT authentication"
```

---

### Step 3.2: Create Login Page (Mobile-First)

**Prompt for Claude Code**:
```
Create a mobile-first login page at app/(auth)/login/page.tsx.

Requirements:
- Match the clean, modern design from timesheet-wireframes.jsx
- Mobile-first responsive design (looks great on 375px width)
- Form with email and password fields
- Large, touch-friendly buttons (min 44px height)
- Error message display (invalid credentials, etc.)
- Loading state during sign in
- Remember me checkbox (optional)
- Link to forgot password (can be a placeholder for now)

Use:
- Tailwind CSS for styling
- React Hook Form for form handling
- NextAuth signIn() function
- useRouter for redirect after login
- Redirect based on user role:
  * ADMIN/SUPERVISOR → /admin
  * EMPLOYEE → /employee

Form validation:
- Email format validation
- Password required
- Show inline error messages

Design features:
- Gradient background
- White card container with shadow
- Blue primary button
- Smooth animations
- Mobile-first with responsive scaling

Create also:
- app/(auth)/layout.tsx for auth pages layout
- Loading spinner component if needed
```

**Testing Checkpoint #5: Test Login**:
```bash
npm run dev

# Navigate to http://localhost:3000/login

# Test Cases:
1. Try logging in with admin@paintingbuddy.com / Admin123!
   Expected: Redirect to /admin

2. Try logging in with painter1@paintingbuddy.com / Painter123!
   Expected: Redirect to /employee

3. Try invalid credentials
   Expected: Error message "Invalid email or password"

4. Test on mobile viewport (375px width)
   Expected: Layout looks perfect, buttons are easy to tap

5. Verify protected routes redirect to login when not authenticated
```

**Validation Checklist**:
- [ ] Login page looks professional on mobile
- [ ] Form validation works
- [ ] Authentication succeeds with correct credentials
- [ ] Role-based redirect works
- [ ] Error messages display properly
- [ ] Protected routes require authentication

**🔄 GIT COMMIT #9**:
```bash
git add .
git commit -m "feat: create mobile-first login page with NextAuth integration"
```

---

### Step 3.3: Create Auth Helper Hooks and Components

**Prompt for Claude Code**:
```
Create authentication helper hooks and components.

Requirements:

1. src/hooks/useCurrentUser.ts
   - Custom hook to get current user from session
   - Returns: { user, isLoading, isAdmin, isSupervisor, isEmployee }

2. src/hooks/useRequireAuth.ts
   - Hook to protect pages (redirect if not authenticated)
   - Optional role parameter to check specific roles

3. src/components/auth/ProtectedRoute.tsx
   - Component wrapper for protected content
   - Shows loading state while checking auth
   - Redirects if not authorized

4. src/components/auth/UserMenu.tsx
   - Mobile-friendly user menu component
   - Shows user name and role
   - Logout button
   - Profile link
   - Dropdown or modal for mobile

5. app/(auth)/unauthorized/page.tsx
   - Page shown when user doesn't have permission
   - "You don't have permission to access this page"
   - Back button

Test file: Create tests for useCurrentUser hook
```

**Expected Output**:
- Auth hooks ready to use
- Protected route component
- User menu component
- Unauthorized page

**🔄 GIT COMMIT #10**:
```bash
git add .
git commit -m "feat: create auth helper hooks and components"
```

---

**✅ MILESTONE 3 VALIDATION**

Before proceeding to Milestone 4, verify:
- [ ] Login works for all user types
- [ ] Role-based redirects work correctly
- [ ] Protected routes require authentication
- [ ] Session persists on page refresh
- [ ] User menu shows correct user info
- [ ] Logout works and redirects to login
- [ ] Mobile layout is perfect
- [ ] Git history shows commits #8-10

---

# PHASE 2: BACKEND API DEVELOPMENT

---

## MILESTONE 4: API Structure & Error Handling
**Duration**: 30-45 minutes
**Goal**: Set up consistent API patterns and error handling

### Step 4.1: Create API Utilities

**Prompt for Claude Code**:
```
Create API utilities and error handling for Next.js API routes.

Requirements:

1. src/lib/api/errors.ts
   - Custom error classes:
     * ApiError (base class)
     * NotFoundError (404)
     * UnauthorizedError (401)
     * ForbiddenError (403)
     * ValidationError (400)
   - Error handler function for API routes
   - Error response formatter

2. src/lib/api/response.ts
   - Success response helper: successResponse(data, statusCode)
   - Error response helper: errorResponse(error)
   - Pagination response helper: paginatedResponse(data, total, page, limit)

3. src/lib/api/validation.ts
   - Request validation helpers using Zod
   - Common validation schemas (email, password, cuid, etc.)
   - Validate request body helper

4. src/lib/api/auth.ts
   - Get user from request
   - Require authentication middleware
   - Require role middleware (requireAdmin, requireSupervisor, etc.)
   - Check permissions helper

5. src/types/api.ts
   - TypeScript types for API responses
   - Generic ApiResponse<T> type
   - PaginatedResponse<T> type
   - ErrorResponse type

All API responses should follow this structure:
```typescript
{
  success: boolean,
  data?: T,
  error?: {
    message: string,
    code: string,
    details?: any
  },
  pagination?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```
```

**Expected Output**:
- Consistent API utilities
- Error handling framework
- Validation helpers
- Auth middleware

**🔄 GIT COMMIT #11**:
```bash
git add .
git commit -m "feat: create API utilities and error handling"
```

---

### Step 4.2: Create Health Check and Test Endpoint

**Prompt for Claude Code**:
```
Create a health check endpoint and test the API structure.

Requirements:

1. app/api/health/route.ts
   - GET endpoint
   - Returns health status
   - Checks database connection
   - Returns:
     * status: "ok" | "error"
     * timestamp: current time
     * database: "connected" | "disconnected"
     * version: app version from package.json

2. app/api/test/protected/route.ts
   - GET endpoint (protected, requires auth)
   - Test authentication middleware
   - Returns current user info

3. Create tests:
   - Test health endpoint
   - Test protected endpoint (with/without auth)
   - Test error handling

Use the API utilities from Step 4.1.
```

**Testing Checkpoint #6: Test API Endpoints**:
```bash
npm run dev

# Test health endpoint
curl http://localhost:3000/api/health

# Expected:
# {
#   "success": true,
#   "data": {
#     "status": "ok",
#     "timestamp": "2025-10-17T...",
#     "database": "connected",
#     "version": "0.1.0"
#   }
# }

# Test protected endpoint (should fail without auth)
curl http://localhost:3000/api/test/protected

# Expected:
# {
#   "success": false,
#   "error": {
#     "message": "Unauthorized",
#     "code": "UNAUTHORIZED"
#   }
# }

# Test with authentication (use browser or Postman after logging in)
```

**Validation Checklist**:
- [ ] Health endpoint returns correct data
- [ ] Database connection check works
- [ ] Protected endpoint requires authentication
- [ ] Error responses are consistent
- [ ] Tests pass

**🔄 GIT COMMIT #12**:
```bash
git add .
git commit -m "feat: create health check and protected test endpoints"
```

---

**✅ MILESTONE 4 VALIDATION**

Before proceeding to Milestone 5, verify:
- [ ] API utilities work correctly
- [ ] Error handling is consistent
- [ ] Health endpoint responds
- [ ] Auth middleware works
- [ ] Tests pass
- [ ] Git history shows commits #11-12

---

## MILESTONE 5: Job Sites API
**Duration**: 60-75 minutes
**Goal**: Complete CRUD operations for job sites

### Step 5.1: Create Job Site Service Layer

**Prompt for Claude Code**:
```
Create a service layer for job site management in src/services/jobSiteService.ts.

Requirements:

**Interfaces (create in src/types/jobSite.ts):**
- CreateJobSiteDto
- UpdateJobSiteDto
- JobSiteFilters
- JobSiteWithProgress

**JobSiteService methods:**

1. getAllJobSites(filters?, userId?, userRole?)
   - Get all job sites (admin sees all, supervisor sees only their sites)
   - Filter by: supervisorId, isActive, search (name or address)
   - Include: supervisor info, floor count, active worker count
   - Sort by: createdAt DESC by default
   - Calculate completion percentage from floors

2. getJobSiteById(id, userId?, userRole?)
   - Get single job site with full details
   - Include: supervisor, floors with areas and tasks
   - Check permissions (supervisor can only view their sites unless admin)
   - Throw NotFoundError if site doesn't exist
   - Throw ForbiddenError if user doesn't have access

3. getJobSiteHierarchy(id, userId?, userRole?)
   - Get complete nested structure:
     * Site → Floors → Areas → Tasks
     * Include all progress percentages
     * Include assigned workers count per floor/area
     * Include flags for each level

4. createJobSite(data, createdBy)
   - Create new job site
   - Validate required fields
   - Set initial completion to 0%
   - Only ADMIN can create sites
   - Return created site

5. updateJobSite(id, data, userId, userRole)
   - Update job site details
   - Admin or site supervisor can update
   - Cannot change supervisor if site has active workers
   - Return updated site

6. deleteJobSite(id, userId, userRole)
   - Soft delete (set isActive = false)
   - Only ADMIN can delete
   - Cascade: deactivate all assignments, but keep time entries
   - Return success message

7. calculateSiteProgress(id)
   - Calculate from all floors
   - Average of floor percentages weighted by area count
   - Update site.completionPercentage
   - Return updated percentage

8. getActivePainters(siteId)
   - Get all painters currently clocked in at this site
   - Include their current location (floor/area)
   - Include hours worked today

Use Prisma for all database operations.
Implement proper error handling.
Add TypeScript types for all parameters and return values.
```

**Expected Output**:
- Complete JobSiteService implementation
- TypeScript types for job sites
- Proper error handling and validation

**🔄 GIT COMMIT #13**:
```bash
git add .
git commit -m "feat: implement job site service layer"
```

---

### Step 5.2: Create Job Sites API Routes

**Prompt for Claude Code**:
```
Create API routes for job site management.

Requirements:

1. app/api/job-sites/route.ts
   - GET: Get all job sites (filtered by user role)
     * Admin sees all
     * Supervisor sees only their sites
     * Employees see only assigned sites
     * Support query params: search, supervisorId, isActive
   - POST: Create new job site (admin only)
     * Validate request body with Zod
     * Required: name, address, supervisorId, startDate
     * Optional: notes

2. app/api/job-sites/[id]/route.ts
   - GET: Get single job site by ID
     * Include full details
     * Check permissions
   - PATCH: Update job site
     * Admin or site supervisor only
     * Validate partial update
   - DELETE: Soft delete job site
     * Admin only

3. app/api/job-sites/[id]/hierarchy/route.ts
   - GET: Get complete site hierarchy
     * Nested structure with all floors, areas, tasks
     * Include progress data
     * Include painter assignments

4. app/api/job-sites/[id]/painters/route.ts
   - GET: Get all painters assigned to this site
     * Include current status (clocked in/out)
     * Include today's hours

All routes:
- Use API utilities from Milestone 4
- Implement proper authentication and authorization
- Return consistent API responses
- Handle errors appropriately
- Include TypeScript types

Create Zod validation schemas in src/lib/validations/jobSite.ts
```

**Testing Checkpoint #7: Test Job Sites API**:
```bash
npm run dev

# Test: Get all job sites (as admin)
curl http://localhost:3000/api/job-sites \
  -H "Authorization: Bearer <admin-token>"

# Expected: List of all job sites with completion percentages

# Test: Get single job site
curl http://localhost:3000/api/job-sites/<site-id>

# Expected: Full job site details

# Test: Create job site (admin only)
curl -X POST http://localhost:3000/api/job-sites \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Site",
    "address": "123 Test St",
    "supervisorId": "<supervisor-id>",
    "startDate": "2025-11-01"
  }'

# Expected: Created job site object

# Test: Update job site
curl -X PATCH http://localhost:3000/api/job-sites/<site-id> \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'

# Expected: Updated job site

# Test: Get hierarchy
curl http://localhost:3000/api/job-sites/<site-id>/hierarchy

# Expected: Complete nested structure
```

**Validation Checklist**:
- [ ] GET all job sites works with filters
- [ ] GET single site returns full details
- [ ] POST creates new site (admin only)
- [ ] PATCH updates site correctly
- [ ] DELETE soft deletes (admin only)
- [ ] Hierarchy endpoint returns nested data
- [ ] Permissions are enforced
- [ ] Validation works correctly

**🔄 GIT COMMIT #14**:
```bash
git add .
git commit -m "feat: create job sites API routes with CRUD operations"
```

---

### Step 5.3: Create Job Sites API Tests

**Prompt for Claude Code**:
```
Create comprehensive tests for job sites API routes.

Test file: app/api/job-sites/route.test.ts

Test cases:
1. GET /api/job-sites
   - Returns all sites for admin
   - Returns only supervised sites for supervisor
   - Returns only assigned sites for employee
   - Filters by search term
   - Filters by supervisorId
   - Filters by isActive

2. POST /api/job-sites
   - Creates site with valid data (admin)
   - Rejects creation for non-admin
   - Validates required fields
   - Rejects invalid supervisorId

3. GET /api/job-sites/[id]
   - Returns site details for authorized user
   - Returns 404 for non-existent site
   - Returns 403 for unauthorized access

4. PATCH /api/job-sites/[id]
   - Updates site for admin
   - Updates site for supervisor (own site)
   - Rejects update for non-authorized user
   - Validates update data

5. DELETE /api/job-sites/[id]
   - Soft deletes for admin
   - Rejects delete for non-admin
   - Returns 404 for non-existent site

Use mock data and test utilities.
```

**Testing Checkpoint #8: Run API Tests**:
```bash
npm test api/job-sites

# Expected: All tests pass
```

**Validation Checklist**:
- [ ] All test cases pass
- [ ] Code coverage is good
- [ ] Edge cases are tested

**🔄 GIT COMMIT #15**:
```bash
git add .
git commit -m "test: add comprehensive job sites API tests"
```

---

**✅ MILESTONE 5 VALIDATION**

Before proceeding to Milestone 6, verify:
- [ ] All CRUD operations work for job sites
- [ ] Permissions are properly enforced
- [ ] Filters and search work correctly
- [ ] Hierarchy endpoint returns complete data
- [ ] All tests pass
- [ ] API responses are consistent
- [ ] Git history shows commits #13-15

---

## MILESTONE 6: Floors & Areas API
**Duration**: 90 minutes
**Goal**: Complete CRUD for floors and areas with hierarchical structure

### Step 6.1: Create Floors Service & API

**Prompt for Claude Code**:
```
Create service layer and API routes for floor management.

Requirements:

**1. Service Layer (src/services/floorService.ts):**

FloorService methods:
- getAllFloors(jobSiteId, userId?, userRole?)
  * Get all floors for a job site
  * Include area count, completion percentage
  * Check site access permissions

- getFloorById(id, userId?, userRole?)
  * Get single floor with areas
  * Include tasks for each area
  * Calculate progress

- createFloor(jobSiteId, data, createdBy)
  * Create single floor
  * Auto-increment floorNumber
  * Validate site exists and user has permission

- createFloorsBulk(jobSiteId, count, createdBy)
  * Create multiple floors at once
  * Auto-name: "Floor 1", "Floor 2", etc.
  * Return array of created floors

- updateFloor(id, data, userId, userRole)
  * Update floor details
  * Recalculate progress if needed

- deleteFloor(id, userId, userRole)
  * Delete floor and cascade to areas/tasks
  * Check for active time entries

- calculateFloorProgress(id)
  * Aggregate from all areas
  * Update floor.completionPercentage

**2. API Routes:**

app/api/floors/route.ts (for bulk operations)
- POST: Create multiple floors at once

app/api/job-sites/[siteId]/floors/route.ts
- GET: Get all floors for a site
- POST: Create a single floor

app/api/floors/[id]/route.ts
- GET: Get floor details
- PATCH: Update floor
- DELETE: Delete floor

app/api/floors/[id]/areas/route.ts
- GET: Get all areas for a floor

**3. Types (src/types/floor.ts):**
- CreateFloorDto
- UpdateFloorDto
- BulkCreateFloorsDto
- FloorWithAreas

**4. Validation (src/lib/validations/floor.ts):**
- Zod schemas for create/update

Use consistent API patterns from previous milestones.
Implement proper authorization (admin and site supervisor can manage).
```

**Expected Output**:
- Complete floors service
- Floors API routes
- TypeScript types and validation

**Testing Checkpoint #9: Test Floors API**:
```bash
# Create a floor
curl -X POST http://localhost:3000/api/job-sites/<site-id>/floors \
  -H "Content-Type: application/json" \
  -d '{"name": "Floor 4", "floorNumber": 4}'

# Create multiple floors
curl -X POST http://localhost:3000/api/floors \
  -H "Content-Type: application/json" \
  -d '{"jobSiteId": "<site-id>", "count": 5}'

# Get floors for a site
curl http://localhost:3000/api/job-sites/<site-id>/floors

# Update floor
curl -X PATCH http://localhost:3000/api/floors/<floor-id> \
  -H "Content-Type: application/json" \
  -d '{"name": "Ground Floor"}'
```

**Validation Checklist**:
- [ ] Can create single floor
- [ ] Can create multiple floors at once
- [ ] Auto-numbering works
- [ ] Progress calculation is correct
- [ ] Permissions are enforced
- [ ] Cascade delete works

**🔄 GIT COMMIT #16**:
```bash
git add .
git commit -m "feat: implement floors service and API routes"
```

---

### Step 6.2: Create Areas Service & API

**Prompt for Claude Code**:
```
Create service layer and API routes for area management (rooms, hallways, closets).

Requirements:

**1. Service Layer (src/services/areaService.ts):**

AreaService methods:
- getAllAreas(floorId, userId?, userRole?)
  * Get all areas for a floor
  * Include parent-child relationships (closets under rooms)
  * Include task count and progress

- getAreaById(id, userId?, userRole?)
  * Get single area with tasks
  * Include sub-areas (closets)
  * Include assigned painters

- createArea(floorId, data, createdBy)
  * Create room, hallway, or bathroom
  * Auto-create default painting tasks:
    1. Cut (order: 1)
    2. Roll (order: 2)
    3. Trim (order: 3)
    4. Touch-up (order: 4)
  * Validate area type

- createSubArea(parentAreaId, data, createdBy)
  * Create closet under a room/hallway
  * Validate parent exists and is not a closet
  * Auto-create tasks for closet too

- createAreasBulk(floorId, areaConfigs, createdBy)
  * Create multiple areas at once
  * areaConfigs: [{ name, areaType, notes }]
  * Auto-create tasks for each

- updateArea(id, data, userId, userRole)
  * Update area details
  * Cannot change areaType if tasks exist

- deleteArea(id, userId, userRole)
  * Delete area and cascade to tasks and sub-areas
  * Check for active painters

- calculateAreaProgress(id)
  * Average of task percentages
  * Include sub-area progress
  * Update area.completionPercentage

**2. API Routes:**

app/api/floors/[floorId]/areas/route.ts
- GET: Get all areas for a floor (hierarchical)
- POST: Create an area

app/api/areas/route.ts
- POST: Bulk create areas

app/api/areas/[id]/route.ts
- GET: Get area details with tasks
- PATCH: Update area
- DELETE: Delete area

app/api/areas/[id]/sub-areas/route.ts
- GET: Get sub-areas (closets)
- POST: Create sub-area under this area

app/api/areas/[id]/tasks/route.ts
- GET: Get all tasks for an area

**3. Types (src/types/area.ts):**
- CreateAreaDto
- UpdateAreaDto
- BulkCreateAreasDto
- AreaWithTasks
- AreaHierarchy

**4. Validation (src/lib/validations/area.ts):**
- Zod schemas for area operations
- Validate area types
- Validate parent-child relationships

**Important:**
- When creating a room/hallway, ALWAYS auto-create the 4 painting tasks
- Support hierarchical structure (parent-child for closets)
- Calculate progress from tasks
```

**Testing Checkpoint #10: Test Areas API**:
```bash
# Create a room (should auto-create tasks)
curl -X POST http://localhost:3000/api/floors/<floor-id>/areas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Room 401",
    "areaType": "ROOM",
    "notes": "Master bedroom"
  }'

# Verify tasks were auto-created
curl http://localhost:3000/api/areas/<area-id>/tasks

# Expected: 4 tasks (Cut, Roll, Trim, Touch-up) all at 0%

# Create a closet under the room
curl -X POST http://localhost:3000/api/areas/<room-id>/sub-areas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Closet A",
    "areaType": "CLOSET"
  }'

# Get areas hierarchically
curl http://localhost:3000/api/floors/<floor-id>/areas

# Expected: Rooms with nested closets

# Bulk create areas
curl -X POST http://localhost:3000/api/areas \
  -H "Content-Type: application/json" \
  -d '{
    "floorId": "<floor-id>",
    "areas": [
      {"name": "Room 402", "areaType": "ROOM"},
      {"name": "Hallway B", "areaType": "HALLWAY"}
    ]
  }'
```

**Validation Checklist**:
- [ ] Areas are created correctly
- [ ] Tasks are auto-created for rooms/hallways
- [ ] Closets can be created as sub-areas
- [ ] Cannot create closet under closet
- [ ] Hierarchical structure works
- [ ] Progress calculation includes sub-areas
- [ ] Bulk creation works

**🔄 GIT COMMIT #17**:
```bash
git add .
git commit -m "feat: implement areas service and API with hierarchical structure"
```

---

### Step 6.3: Create Tasks Service & API

**Prompt for Claude Code**:
```
Create service layer and API routes for task management.

Requirements:

**1. Service Layer (src/services/taskService.ts):**

TaskService methods:
- getAllTasks(areaId, userId?, userRole?)
  * Get all tasks for an area
  * Ordered by taskOrder
  * Include completion percentage

- getTaskById(id, userId?, userRole?)
  * Get single task details
  * Include area info
  * Include recent activity logs

- updateTaskProgress(id, percentage, userId, notes?)
  * Update task completion percentage
  * Create activity log entry
  * Recalculate area/floor/site progress
  * Only assigned painter or supervisor/admin can update

- updateTask(id, data, userId, userRole)
  * Update task details (name, notes)
  * Cannot change taskOrder if you don't have permission

- deleteTask(id, userId, userRole)
  * Delete task (admin only)
  * Used if custom tasks were added

- createCustomTask(areaId, data, createdBy)
  * Add custom task beyond the default 4
  * Admin or supervisor only

**2. API Routes:**

app/api/areas/[areaId]/tasks/route.ts
- GET: Get all tasks for area
- POST: Create custom task

app/api/tasks/[id]/route.ts
- GET: Get task details
- PATCH: Update task details
- DELETE: Delete task

app/api/tasks/[id]/progress/route.ts
- PATCH: Update task progress (main endpoint for painters)
  * Body: { percentage: number, notes?: string }
  * Creates activity log
  * Recalculates all parent progress

**3. Types (src/types/task.ts):**
- UpdateTaskProgressDto
- CreateCustomTaskDto
- TaskWithHistory

**4. Validation (src/lib/validations/task.ts):**
- Progress must be 0-100
- Percentage must be in increments of 5 (0, 5, 10, ..., 95, 100)

**Important:**
- Updating task progress triggers recalculation of:
  1. Area completion percentage
  2. Floor completion percentage
  3. Site completion percentage
- Create activity log for every progress update
- Only assigned painters can update their tasks (or supervisor/admin)
```

**Testing Checkpoint #11: Test Tasks API**:
```bash
# Get tasks for an area
curl http://localhost:3000/api/areas/<area-id>/tasks

# Update task progress (as painter)
curl -X PATCH http://localhost:3000/api/tasks/<task-id>/progress \
  -H "Content-Type: application/json" \
  -d '{
    "percentage": 75,
    "notes": "Completed 3 walls, need to finish 4th wall tomorrow"
  }'

# Verify progress updated
curl http://localhost:3000/api/tasks/<task-id>

# Verify area progress recalculated
curl http://localhost:3000/api/areas/<area-id>

# Create custom task (admin)
curl -X POST http://localhost:3000/api/areas/<area-id>/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ceiling Detail",
    "taskOrder": 5
  }'
```

**Validation Checklist**:
- [ ] Task progress updates work
- [ ] Progress recalculation cascades up
- [ ] Activity logs are created
- [ ] Only authorized users can update
- [ ] Custom tasks can be added
- [ ] Percentage validation works (0-100, increments of 5)

**🔄 GIT COMMIT #18**:
```bash
git add .
git commit -m "feat: implement tasks service and API with progress tracking"
```

---

**✅ MILESTONE 6 VALIDATION**

Before proceeding to Milestone 7, verify:
- [ ] Floors CRUD works completely
- [ ] Areas CRUD works with hierarchical structure
- [ ] Tasks auto-create when areas are created
- [ ] Closets can be nested under rooms
- [ ] Task progress updates cascade to parent entities
- [ ] Bulk operations work correctly
- [ ] All permissions are enforced
- [ ] Git history shows commits #16-18

---

## MILESTONE 7: Time Tracking & Assignments API
**Duration**: 75-90 minutes
**Goal**: Complete time entry and assignment management

### Step 7.1: Create Assignments Service & API

**Prompt for Claude Code**:
```
Create service layer and API routes for painter assignments.

Requirements:

**1. Service Layer (src/services/assignmentService.ts):**

AssignmentService methods:
- getAssignmentsForUser(userId)
  * Get all assignments for a painter
  * Include site/floor/area details
  * Show hierarchy clearly

- getAssignmentsForSite(siteId, userId?, userRole?)
  * Get all painter assignments for a site
  * Group by site/floor/area
  * Show assignment counts

- assignPainterToSite(userId, siteId, assignedBy)
  * Assign painter to entire site
  * Create assignment record
  * Validate painter role and site exists

- assignPainterToFloor(userId, floorId, assignedBy)
  * Assign painter to specific floor
  * Validate painter and floor

- assignPainterToArea(userId, areaId, assignedBy)
  * Assign painter to specific room/area
  * Validate painter and area

- removeAssignment(assignmentId, removedBy, userRole)
  * Remove assignment
  * Only admin or supervisor can remove
  * Check for active time entries

- bulkAssign(assignments[], assignedBy)
  * Assign multiple painters at once
  * assignments: [{ userId, assignableType, assignableId }]

**2. API Routes:**

app/api/users/[userId]/assignments/route.ts
- GET: Get assignments for a user (painter's view)

app/api/job-sites/[siteId]/assignments/route.ts
- GET: Get all assignments for a site
- POST: Assign painter(s) to site

app/api/floors/[floorId]/assignments/route.ts
- POST: Assign painter(s) to floor

app/api/areas/[areaId]/assignments/route.ts
- POST: Assign painter(s) to area

app/api/assignments/[id]/route.ts
- DELETE: Remove assignment

app/api/assignments/bulk/route.ts
- POST: Bulk assign painters

**3. Types (src/types/assignment.ts):**
- CreateAssignmentDto
- BulkAssignDto
- AssignmentWithDetails

**4. Validation (src/lib/validations/assignment.ts):**
- Validate assignable types
- Validate user has EMPLOYEE role
- Prevent duplicate assignments

**Important:**
- A painter can be assigned at multiple levels
- Assignment hierarchy: Site > Floor > Area
- When querying painter's work, check all assignment levels
- Supervisor can only assign to their own sites
```

**Testing Checkpoint #12: Test Assignments API**:
```bash
# Assign painter to site
curl -X POST http://localhost:3000/api/job-sites/<site-id>/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<painter-id>"
  }'

# Assign painter to specific room
curl -X POST http://localhost:3000/api/areas/<area-id>/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<painter-id>"
  }'

# Get painter's assignments
curl http://localhost:3000/api/users/<painter-id>/assignments

# Bulk assign
curl -X POST http://localhost:3000/api/assignments/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "assignments": [
      {"userId": "<painter1-id>", "assignableType": "AREA", "assignableId": "<area1-id>"},
      {"userId": "<painter2-id>", "assignableType": "AREA", "assignableId": "<area2-id>"}
    ]
  }'
```

**Validation Checklist**:
- [ ] Can assign painters to sites
- [ ] Can assign painters to floors
- [ ] Can assign painters to specific areas
- [ ] Cannot assign same painter twice
- [ ] Bulk assignment works
- [ ] Can remove assignments
- [ ] Permissions enforced

**🔄 GIT COMMIT #19**:
```bash
git add .
git commit -m "feat: implement assignments service and API"
```

---

### Step 7.2: Create Time Tracking Service & API

**Prompt for Claude Code**:
```
Create service layer and API routes for time tracking (clock in/out).

Requirements:

**1. Service Layer (src/services/timeEntryService.ts):**

TimeEntryService methods:
- clockIn(userId, jobSiteId, floorId?, areaId?, notes?)
  * Create time entry with clockIn time
  * Validate painter is assigned to this location
  * Cannot clock in if already clocked in
  * Return time entry

- clockOut(userId, notes?)
  * Find active time entry for user
  * Set clockOut to current time
  * Calculate totalHours
  * Update time entry and return

- getCurrentTimeEntry(userId)
  * Get active (unclosed) time entry for user
  * Return null if not clocked in

- getTimeEntriesForUser(userId, startDate?, endDate?)
  * Get time entries for date range
  * Default to current week
  * Include site/floor/area info

- getTimeEntriesForSite(siteId, date?, userId?, userRole?)
  * Get all time entries for a site
  * Filter by date
  * Admin sees all, supervisor sees their site only

- getTodayHours(userId)
  * Calculate total hours worked today
  * Include active entry (ongoing)

- getActiveWorkers(siteId?)
  * Get all currently clocked-in painters
  * Optional filter by site
  * Include current location

**2. API Routes:**

app/api/time-entries/clock-in/route.ts
- POST: Clock in
  * Body: { jobSiteId, floorId?, areaId?, notes? }
  * Returns time entry

app/api/time-entries/clock-out/route.ts
- POST: Clock out
  * Body: { notes? }
  * Returns completed time entry

app/api/time-entries/current/route.ts
- GET: Get current active time entry for logged-in user

app/api/time-entries/route.ts
- GET: Get time entries
  * Query: userId?, startDate?, endDate?

app/api/job-sites/[siteId]/time-entries/route.ts
- GET: Get time entries for a site

app/api/time-entries/active-workers/route.ts
- GET: Get all currently clocked-in painters
  * Query: siteId?

app/api/users/[userId]/today-hours/route.ts
- GET: Get total hours worked today

**3. Types (src/types/timeEntry.ts):**
- ClockInDto
- ClockOutDto
- TimeEntryWithDetails
- ActiveWorker

**4. Validation (src/lib/validations/timeEntry.ts):**
- Validate site/floor/area exist
- Validate painter is assigned
- Validate not already clocked in

**Important:**
- Only one active time entry per painter at a time
- Validate assignment before allowing clock in
- Calculate hours as decimal (e.g., 7.5 hours)
- Handle timezone correctly
```

**Testing Checkpoint #13: Test Time Tracking API**:
```bash
# Clock in (as painter)
curl -X POST http://localhost:3000/api/time-entries/clock-in \
  -H "Content-Type: application/json" \
  -d '{
    "jobSiteId": "<site-id>",
    "floorId": "<floor-id>",
    "areaId": "<area-id>",
    "notes": "Starting work on Room 101"
  }'

# Get current time entry
curl http://localhost:3000/api/time-entries/current

# Expected: Active time entry with clockIn time

# Clock out
curl -X POST http://localhost:3000/api/time-entries/clock-out \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Completed trim work"
  }'

# Get today's hours
curl http://localhost:3000/api/users/<user-id>/today-hours

# Get active workers
curl http://localhost:3000/api/time-entries/active-workers

# Get time entries for a period
curl "http://localhost:3000/api/time-entries?userId=<user-id>&startDate=2025-10-01&endDate=2025-10-17"
```

**Validation Checklist**:
- [ ] Clock in creates time entry
- [ ] Cannot clock in twice
- [ ] Clock out calculates hours correctly
- [ ] Current time entry endpoint works
- [ ] Active workers list is accurate
- [ ] Time entry history works
- [ ] Validates assignments before clock in

**🔄 GIT COMMIT #20**:
```bash
git add .
git commit -m "feat: implement time tracking service and API with clock in/out"
```

---

**✅ MILESTONE 7 VALIDATION**

Before proceeding to Milestone 8, verify:
- [ ] Assignments CRUD works
- [ ] Can assign painters at different levels
- [ ] Clock in/out works correctly
- [ ] Hours calculation is accurate
- [ ] Active workers endpoint works
- [ ] Cannot clock in without assignment
- [ ] Cannot clock in twice
- [ ] Git history shows commits #19-20

---

## MILESTONE 8: Activity Logs & Flags API
**Duration**: 45 minutes
**Goal**: Implement activity logging and flag management

### Step 8.1: Create Activity Logs & Flags API

**Prompt for Claude Code**:
```
Create service layer and API routes for activity logs and flags.

Requirements:

**1. Activity Logs Service (src/services/activityLogService.ts):**

ActivityLogService methods:
- createLog(userId, entityType, entityId, action, changes?)
  * Create activity log entry
  * Used automatically when tasks are updated
  * Store JSON changes (before/after)

- getLogsForEntity(entityType, entityId, limit?)
  * Get activity history for a task/area
  * Most recent first
  * Include user who made the change

- getLogsForUser(userId, startDate?, endDate?)
  * Get all activities by a user
  * Useful for user activity reports

- getRecentActivity(siteId?, limit?)
  * Get recent activity across site or all sites
  * For admin dashboard

**2. Flags Service (src/services/flagService.ts):**

FlagService methods:
- createFlag(data, createdBy)
  * Create flag for site/floor/area
  * Types: ISSUE, WAITING_MATERIALS, INSPECTION_NEEDED, OTHER
  * Status: OPEN by default

- updateFlag(id, data, userId)
  * Update flag description or status
  * Only creator or admin can update

- resolveFlag(id, resolvedBy)
  * Set status to RESOLVED
  * Set resolvedAt timestamp
  * Set resolvedBy user

- deleteFlag(id, userId, userRole)
  * Delete flag (admin only)

- getFlagsForSite(siteId, status?, type?)
  * Get all flags for a site
  * Filter by status (OPEN, IN_PROGRESS, RESOLVED)
  * Filter by type

- getFlagsForEntity(flaggableType, flaggableId)
  * Get flags for specific floor/area

**3. API Routes:**

app/api/activity-logs/route.ts
- GET: Get activity logs
  * Query: entityType?, entityId?, userId?, limit?

app/api/job-sites/[siteId]/activity/route.ts
- GET: Get recent activity for a site

app/api/flags/route.ts
- POST: Create flag

app/api/flags/[id]/route.ts
- PATCH: Update flag
- DELETE: Delete flag

app/api/flags/[id]/resolve/route.ts
- POST: Resolve flag

app/api/job-sites/[siteId]/flags/route.ts
- GET: Get flags for site
  * Query: status?, type?

**4. Types:**
- CreateFlagDto (src/types/flag.ts)
- ActivityLogEntry (src/types/activityLog.ts)

**5. Validation:**
- Validate flag types and statuses
- Validate flaggable entities exist

**Important:**
- Activity logs are auto-created when task progress changes
- Flags can be added to sites, floors, or areas
- Activity logs are read-only (cannot edit/delete)
```

**Testing Checkpoint #14: Test Logs & Flags**:
```bash
# Create a flag
curl -X POST http://localhost:3000/api/flags \
  -H "Content-Type: application/json" \
  -d '{
    "flaggableType": "Area",
    "flaggableId": "<area-id>",
    "flagType": "ISSUE",
    "description": "Water damage on ceiling needs repair"
  }'

# Get flags for site
curl "http://localhost:3000/api/job-sites/<site-id>/flags?status=OPEN"

# Resolve flag
curl -X POST http://localhost:3000/api/flags/<flag-id>/resolve

# Get activity logs
curl "http://localhost:3000/api/activity-logs?entityType=Task&entityId=<task-id>"

# Get recent activity for site
curl http://localhost:3000/api/job-sites/<site-id>/activity
```

**Validation Checklist**:
- [ ] Can create flags
- [ ] Can filter flags by status/type
- [ ] Can resolve flags
- [ ] Activity logs show task updates
- [ ] Recent activity endpoint works

**🔄 GIT COMMIT #21**:
```bash
git add .
git commit -m "feat: implement activity logs and flags API"
```

---

## MILESTONE 9: Users & Reports API
**Duration**: 45 minutes
**Goal**: User management and reporting endpoints

### Step 9.1: Create Users API & Reports

**Prompt for Claude Code**:
```
Create API routes for user management and reporting.

Requirements:

**1. Users API:**

app/api/users/route.ts
- GET: Get all users (admin only)
  * Query: role?, search?, isActive?
- POST: Create new user (admin only)

app/api/users/[id]/route.ts
- GET: Get user details
- PATCH: Update user (admin or self)
- DELETE: Deactivate user (admin only)

app/api/users/[id]/stats/route.ts
- GET: Get user statistics
  * Total hours (week/month/all-time)
  * Sites worked on
  * Tasks completed
  * Activity summary

**2. Reports API:**

app/api/reports/site-summary/[siteId]/route.ts
- GET: Site summary report
  * Overall progress
  * Floor-by-floor breakdown
  * Total hours logged
  * Active painters count
  * Open flags count

app/api/reports/painter-hours/route.ts
- GET: Painter hours report
  * Query: startDate, endDate, siteId?, userId?
  * Total hours per painter
  * Breakdown by site/date

app/api/reports/progress-report/[siteId]/route.ts
- GET: Detailed progress report
  * All floors → areas → tasks
  * Completion percentages
  * Color-coded by status (not started, in progress, complete)

**3. Service layers:**
- src/services/userService.ts (user CRUD)
- src/services/reportService.ts (report generation)

**4. Types:**
- UserStats (src/types/user.ts)
- SiteSummary (src/types/report.ts)
- PainterHoursReport (src/types/report.ts)

**Important:**
- All report endpoints require authentication
- Supervisors can only see reports for their sites
- Employees can see their own stats only
```

**Testing Checkpoint #15: Test Users & Reports**:
```bash
# Get all users (admin)
curl http://localhost:3000/api/users

# Get user stats
curl http://localhost:3000/api/users/<user-id>/stats

# Site summary report
curl http://localhost:3000/api/reports/site-summary/<site-id>

# Painter hours report
curl "http://localhost:3000/api/reports/painter-hours?startDate=2025-10-01&endDate=2025-10-17&siteId=<site-id>"

# Progress report
curl http://localhost:3000/api/reports/progress-report/<site-id>
```

**Validation Checklist**:
- [ ] User CRUD works
- [ ] Stats calculation is accurate
- [ ] Reports return correct data
- [ ] Permissions are enforced

**🔄 GIT COMMIT #22**:
```bash
git add .
git commit -m "feat: implement users API and reporting endpoints"
```

---

**✅ MILESTONE 9 VALIDATION (End of Phase 2)**

Before proceeding to Phase 3 (Frontend), verify:
- [ ] All backend API endpoints work
- [ ] Authentication and authorization work correctly
- [ ] Database operations are efficient
- [ ] All services have proper error handling
- [ ] API responses are consistent
- [ ] Tests pass for all endpoints
- [ ] Git history shows commits #11-22

**Test the complete backend:**
```bash
# Run all tests
npm test

# Test API health
curl http://localhost:3000/api/health

# Verify all major endpoints work as expected
```

---

# PHASE 3: MOBILE-FIRST FRONTEND

---

## MILESTONE 10: Shared Components & Layout
**Duration**: 60 minutes
**Goal**: Create reusable mobile-first UI components

### Step 10.1: Create Core UI Components

**Prompt for Claude Code**:
```
Create core reusable UI components based on the design from timesheet-wireframes.jsx.

Requirements:

Create these components in app/components/ui/:

1. **Button.tsx**
   - Variants: primary, secondary, outline, ghost, danger
   - Sizes: sm, md, lg (all touch-friendly, min 44px height)
   - Loading state with spinner
   - Disabled state
   - Full width option
   - Icon support

2. **Card.tsx**
   - Clean white card with shadow
   - Optional header, body, footer slots
   - Hover state for clickable cards

3. **Input.tsx**
   - Text input with label
   - Error state and message
   - Icon support (left/right)
   - Mobile-optimized input types

4. **Select.tsx**
   - Dropdown select
   - Mobile-friendly touch target
   - Label and error support

5. **ProgressBar.tsx**
   - Horizontal progress bar
   - Color variants based on percentage:
     * 0-49%: red
     * 50-74%: yellow
     * 75-100%: green
   - Show percentage label

6. **Badge.tsx**
   - Small status badge
   - Color variants: success, warning, error, info, neutral

7. **Modal.tsx**
   - Mobile-first modal/bottom sheet
   - On mobile: slide up from bottom
   - On desktop: center modal
   - Backdrop with close on click outside

8. **BottomNav.tsx**
   - Fixed bottom navigation bar
   - Icons with labels
   - Active state highlighting
   - 4-5 nav items max

9. **Header.tsx**
   - Sticky top header
   - Title, back button, action buttons
   - Search bar variant

10. **Spinner.tsx**
    - Loading spinner
    - Sizes: sm, md, lg
    - Color variants

All components:
- Use Tailwind CSS for styling
- TypeScript with proper props types
- Mobile-first responsive
- Accessible (ARIA labels, keyboard nav)
- Match the design from wireframes

Also create:
- app/components/ui/index.ts (barrel export)
```

**Expected Output**:
- 10+ reusable UI components
- Consistent design system
- TypeScript types
- Mobile-optimized

**Testing Checkpoint #16: Test Components**:
```bash
# Create a test page: app/test-components/page.tsx
# Show all components with different states
npm run dev

# Open http://localhost:3000/test-components
# Test on mobile width (375px)
# Expected: All components look good and are touch-friendly
```

**Validation Checklist**:
- [ ] All components render correctly
- [ ] Mobile layout is perfect
- [ ] Touch targets are adequate
- [ ] Colors match wireframe design
- [ ] Components are reusable

**🔄 GIT COMMIT #23**:
```bash
git add .
git commit -m "feat: create core UI components library"
```

---

### Step 10.2: Create Layout Components

**Prompt for Claude Code**:
```
Create layout components for different user roles.

Requirements:

1. **app/components/layout/AdminLayout.tsx**
   - Wrapper for admin pages
   - Top header with title and user menu
   - Bottom navigation (Sites, Time, Team, More)
   - Content area with padding
   - User menu dropdown (profile, settings, logout)

2. **app/components/layout/EmployeeLayout.tsx**
   - Wrapper for employee/painter pages
   - Top header with greeting and notifications
   - Bottom navigation (Home, Clock, Profile)
   - Content area

3. **app/components/layout/AuthLayout.tsx**
   - Wrapper for login/register pages
   - Centered card on gradient background
   - No navigation

4. **app/components/common/UserMenu.tsx**
   - User profile dropdown/modal
   - Show user name, role
   - Links: Profile, Settings
   - Logout button

5. **app/components/common/NotificationButton.tsx**
   - Bell icon with badge
   - Shows unread count
   - Opens notifications modal

6. **app/components/common/SearchBar.tsx**
   - Search input with icon
   - Mobile-optimized
   - Debounced search

All layouts should:
- Be mobile-first
- Use the UI components from Step 10.1
- Include proper spacing and padding
- Handle different screen sizes
- Match wireframe design
```

**Expected Output**:
- Layout components for each user type
- Consistent navigation
- Reusable common components

**🔄 GIT COMMIT #24**:
```bash
git add .
git commit -m "feat: create layout components for admin and employee views"
```

---

### Step 10.3: Create Job Site Components

**Prompt for Claude Code**:
```
Create specialized components for job site management.

Requirements:

1. **app/components/job-sites/SiteCard.tsx**
   - Display job site in card format
   - Show: name, address, progress bar, supervisor, active workers
   - "Manage Site" button
   - Match design from AdminDashboard in wireframes

2. **app/components/job-sites/FloorAccordion.tsx**
   - Collapsible floor view
   - Show floor name, progress, worker count
   - Expand to show areas
   - Match design from AdminSiteDetail in wireframes

3. **app/components/job-sites/AreaItem.tsx**
   - Display area (room/hallway/closet)
   - Show name, type icon, progress
   - Expandable to show tasks
   - Support nested closets

4. **app/components/job-sites/TaskItem.tsx**
   - Display single task with progress
   - Checkmark if 100% complete
   - Progress bar
   - Percentage label
   - Match design from wireframes

5. **app/components/job-sites/HierarchyView.tsx**
   - Complete hierarchical view
   - Site → Floors → Areas → Tasks
   - Expand/collapse functionality
   - Progress indicators at each level

6. **app/components/job-sites/ProgressCard.tsx**
   - Show overall site/floor/area progress
   - Large percentage display
   - Color-coded progress bar
   - Statistics (start date, workers, etc.)

All components:
- Use data from API (TypeScript types)
- Handle loading and error states
- Mobile-first design
- Match wireframe aesthetics
```

**Expected Output**:
- Job site display components
- Hierarchical view components
- Progress visualization components

**🔄 GIT COMMIT #25**:
```bash
git add .
git commit -m "feat: create job site display components"
```

---

**✅ MILESTONE 10 VALIDATION**

Before proceeding to Milestone 11, verify:
- [ ] All UI components work and look good
- [ ] Layout components provide proper structure
- [ ] Job site components display data correctly
- [ ] Mobile layout is perfect (test at 375px width)
- [ ] Design matches wireframes
- [ ] Git history shows commits #23-25

---

## MILESTONE 11: Admin Dashboard Page
**Duration**: 75 minutes
**Goal**: Build admin dashboard with job site management

### Step 11.1: Create Admin Dashboard

**Prompt for Claude Code**:
```
Create the admin dashboard page at app/(admin)/admin/page.tsx.

Requirements:

**Match the AdminDashboard design from timesheet-wireframes.jsx:**

1. **Top Section:**
   - Sticky header with "Admin Dashboard" title
   - Notification and user menu buttons
   - Search bar for sites/employees

2. **Stats Cards (3 columns):**
   - Active Sites count (blue)
   - Clocked In painters count (green)
   - Average Progress percentage (orange)
   - Fetch from API in real-time

3. **Filter/Sort:**
   - Sort dropdown: By Completion, By Start Date, By Supervisor
   - Filter chips (optional): Active sites, My sites (for supervisors)

4. **Job Sites List:**
   - Use SiteCard component for each site
   - Show: name, address, progress bar, supervisor, active workers
   - "Manage Site" button → navigate to /admin/sites/[id]
   - Sorted/filtered based on selection

5. **Add New Site Button:**
   - Dashed border button at bottom
   - Opens modal/drawer to create new site

6. **Bottom Navigation:**
   - 4 tabs: Sites (active), Time, Team, More

**Data fetching:**
- Use React Server Components where possible
- Use TanStack Query for client-side data fetching
- Show loading skeletons
- Handle errors gracefully

**Mobile-first:**
- Perfect on 375px width
- Responsive up to desktop
- Touch-friendly interactions
- Fast and smooth

Create also:
- app/(admin)/layout.tsx (use AdminLayout component)
- Loading state: app/(admin)/admin/loading.tsx
- Error state: app/(admin)/admin/error.tsx

Install: @tanstack/react-query, @tanstack/react-query-devtools
```

**Testing Checkpoint #17: Test Admin Dashboard**:
```bash
npm run dev

# Login as admin: admin@paintingbuddy.com / Admin123!

# Expected:
1. Dashboard loads with stats
2. Job sites list shows all sites
3. Search works
4. Sort works
5. Click "Manage Site" navigates to detail page
6. Bottom nav works
7. Layout is perfect on mobile

# Test on:
- Mobile (375px)
- Tablet (768px)
- Desktop (1280px)
```

**Validation Checklist**:
- [ ] Dashboard matches wireframe design
- [ ] Stats show correct data
- [ ] Search filters sites
- [ ] Sort changes order
- [ ] Navigation works
- [ ] Mobile layout is perfect
- [ ] Loading states show
- [ ] Errors are handled

**🔄 GIT COMMIT #26**:
```bash
git add .
git commit -m "feat: create admin dashboard page"
```

---

### Step 11.2: Create Site Detail Page

**Prompt for Claude Code**:
```
Create the job site detail page at app/(admin)/admin/sites/[id]/page.tsx.

Requirements:

**Match the AdminSiteDetail design from timesheet-wireframes.jsx:**

1. **Header:**
   - Back button → return to dashboard
   - Site name (large title)
   - Site address (subtitle)

2. **Overall Progress Card:**
   - Large percentage display
   - Progress bar
   - Stats: Start date, active workers count

3. **Action Buttons (2 columns):**
   - "Add Floor" → modal to create floor(s)
   - "Edit Site" → modal to edit site details

4. **Hierarchical Structure:**
   - Use FloorAccordion component for each floor
   - Expand to show areas
   - Expand areas to show tasks
   - Show closets nested under rooms
   - Match the exact hierarchy from wireframes

5. **Floor Card:**
   - Floor name, worker count, progress percentage
   - Chevron to expand/collapse
   - Progress bar when expanded
   - "Add Room/Hallway" button within floor

6. **Room/Area Card:**
   - Room name, worker count, progress
   - Expand to show tasks
   - Tasks: Cut, Roll, Trim, Touch-up with checkmarks/progress
   - Nested closets shown as sub-items

**Interactions:**
- Click floor to expand/collapse
- Click area to expand/collapse
- Click "Add Floor" to create new floors
- Click "Add Room/Hallway" to create areas
- Progress updates in real-time

**Data fetching:**
- Use API: GET /api/job-sites/[id]/hierarchy
- Use React Query for caching and updates
- Optimistic updates when creating floors/areas

Create modals:
- AddFloorModal.tsx
- EditSiteModal.tsx
- AddAreaModal.tsx
```

**Testing Checkpoint #18: Test Site Detail Page**:
```bash
# Navigate to a site from dashboard

# Expected:
1. Site hierarchy displays correctly
2. Can expand/collapse floors and rooms
3. Progress bars show correct percentages
4. Can add new floors
5. Can add new areas
6. Closets show nested under rooms
7. Mobile layout is perfect

# Test interactions:
- Expand Floor 1 → see rooms
- Expand Room 101 → see tasks
- See Closet A nested under Room 101
- Add a new floor
- Add a new room to a floor
```

**Validation Checklist**:
- [ ] Hierarchy displays correctly
- [ ] Expand/collapse works smoothly
- [ ] Progress percentages are accurate
- [ ] Can create floors and areas
- [ ] Nested closets show correctly
- [ ] Mobile layout is perfect
- [ ] Matches wireframe design

**🔄 GIT COMMIT #27**:
```bash
git add .
git commit -m "feat: create job site detail page with hierarchy view"
```

---

**✅ MILESTONE 11 VALIDATION**

Before proceeding to Milestone 12, verify:
- [ ] Admin dashboard works completely
- [ ] Site detail page shows hierarchy
- [ ] All interactions work smoothly
- [ ] Mobile layout is perfect
- [ ] Data loads correctly from API
- [ ] Git history shows commits #26-27

---

## MILESTONE 12: Time Tracking Dashboard (Admin)
**Duration**: 45 minutes
**Goal**: Build time tracking view for admins

### Step 12.1: Create Time Tracking Page

**Prompt for Claude Code**:
```
Create the admin time tracking page at app/(admin)/admin/time/page.tsx.

Requirements:

**Match the AdminTimeTracking design from timesheet-wireframes.jsx:**

1. **Header:**
   - "Time Tracking" title
   - Date selector (date input + "Today" button)
   - Quick stats (3 cards):
     * Active workers (green)
     * Offline workers (gray)
     * Total hours today (blue)

2. **Filter Tabs:**
   - All Workers (default)
   - Filter by site (tabs for each site)
   - Horizontal scroll on mobile

3. **Workers List:**
   - Card for each painter
   - Show:
     * Name, avatar/initials
     * Status (Active/Offline) with colored dot
     * Hours worked today
     * If active: Site, floor, room, clock in time
     * "Reassign Worker" button (if active)
   - Sort: Active first, then by hours

4. **Active Worker Card:**
   - Green "Active" indicator
   - Current location details
   - Clock in time
   - Hours accumulated
   - "Reassign Worker" button

5. **Offline Worker Card:**
   - Gray "Offline" indicator
   - Hours worked today (if any)
   - Simpler layout

**Data fetching:**
- GET /api/time-entries/active-workers
- GET /api/reports/painter-hours?date=[selected-date]
- Refresh every 60 seconds for active workers

**Bottom Navigation:**
- Time tab is active

Create also:
- ReassignWorkerModal.tsx (allow admin to update worker assignment)
```

**Testing Checkpoint #19: Test Time Tracking**:
```bash
# Navigate to Time tab from admin dashboard

# Expected:
1. See all painters with status
2. Active painters show location
3. Offline painters show hours (if worked)
4. Can filter by site
5. Can select different dates
6. Stats update correctly
7. Mobile layout is perfect

# Test with different data:
- Have some painters clocked in
- Have some clocked out
- Check hours calculation
```

**Validation Checklist**:
- [ ] Workers list shows correctly
- [ ] Active/offline status is accurate
- [ ] Hours calculation is correct
- [ ] Date selector works
- [ ] Filter by site works
- [ ] Auto-refresh works
- [ ] Mobile layout is perfect

**🔄 GIT COMMIT #28**:
```bash
git add .
git commit -m "feat: create admin time tracking dashboard"
```

---

## MILESTONE 13: Team Management (Admin)
**Duration**: 30 minutes
**Goal**: Build team/user management page

### Step 13.1: Create Team Management Page

**Prompt for Claude Code**:
```
Create the team management page at app/(admin)/admin/team/page.tsx.

Requirements:

1. **Header:**
   - "Team Management" title
   - Search bar (search by name or email)
   - "Add Team Member" button

2. **Filter Tabs:**
   - All
   - Admins
   - Supervisors
   - Painters

3. **Team Members List:**
   - Card for each user
   - Show:
     * Name, email
     * Role badge
     * Phone (if available)
     * Status (Active/Inactive)
     * Stats: Sites assigned, hours this week
     * Actions: View, Edit, Deactivate

4. **Add/Edit User Modal:**
   - Form fields:
     * First name, last name
     * Email
     * Phone
     * Role (dropdown)
     * Password (only for new users)
   - Validation
   - Save → API call

**Data fetching:**
- GET /api/users
- POST /api/users (create)
- PATCH /api/users/[id] (update)

**Mobile-first:**
- Card layout on mobile
- Table layout on desktop (optional)
```

**Testing Checkpoint #20: Test Team Management**:
```bash
# Navigate to Team tab

# Expected:
1. See all users
2. Filter by role works
3. Search works
4. Can add new user
5. Can edit user
6. Can deactivate user

# Test:
- Create new painter
- Edit supervisor details
- Deactivate a user
```

**Validation Checklist**:
- [ ] Users list displays
- [ ] Filters work
- [ ] Search works
- [ ] Can create users
- [ ] Can edit users
- [ ] Can deactivate users
- [ ] Validation works

**🔄 GIT COMMIT #29**:
```bash
git add .
git commit -m "feat: create team management page"
```

---

**✅ MILESTONE 13 VALIDATION**

Before proceeding to Milestone 14, verify:
- [ ] Time tracking page works
- [ ] Team management works
- [ ] All admin pages are functional
- [ ] Navigation between pages works
- [ ] Mobile layout is perfect throughout
- [ ] Git history shows commits #28-29

---

## MILESTONE 14: Employee Dashboard
**Duration**: 60 minutes
**Goal**: Build painter/employee mobile interface

### Step 14.1: Create Employee Dashboard

**Prompt for Claude Code**:
```
Create the employee dashboard at app/(employee)/employee/page.tsx.

Requirements:

**Match the EmployeeDashboard design from timesheet-wireframes.jsx:**

1. **Header:**
   - Welcome message: "Welcome, [FirstName]"
   - Current date
   - Notification button

2. **Clock Status Card (Large, prominent):**
   - Gradient background (blue)
   - Current status: "Clocked In" or "Not Clocked In"
   - If clocked in: Hours today, location
   - Large "Clock In" or "Clock Out" button
   - Click → navigate to /employee/clock

3. **Today's Summary Card:**
   - 2 stats:
     * Hours Today (green)
     * Tasks Updated (blue)

4. **My Assignments Section:**
   - "My Assignments" heading
   - Card for each assigned site/area
   - Show:
     * Site name
     * Floor • Room (if assigned to specific area)
     * Your progress percentage
     * Progress bar
     * "Update Progress" button → /employee/progress/[areaId]
     * Location icon (optional)

5. **Bottom Navigation:**
   - 3 tabs: Home (active), Clock, Profile

**Data fetching:**
- GET /api/users/[userId]/assignments
- GET /api/time-entries/current
- GET /api/users/[userId]/today-hours
- Use useCurrentUser hook to get logged-in user

**Mobile-first:**
- Optimized for 375px width
- Large, easy to tap buttons
- Clear visual hierarchy

Create also:
- app/(employee)/layout.tsx (use EmployeeLayout)
```

**Testing Checkpoint #21: Test Employee Dashboard**:
```bash
# Login as painter: painter1@paintingbuddy.com / Painter123!

# Expected:
1. Welcome message shows painter name
2. Clock status card shows current status
3. If not clocked in: large "Clock In" button
4. Summary shows today's stats
5. Assignments list shows assigned sites/areas
6. Mobile layout is perfect

# Test:
- View as different painters
- With/without clock in
- With/without assignments
```

**Validation Checklist**:
- [ ] Dashboard shows correct data
- [ ] Clock status is accurate
- [ ] Assignments list is correct
- [ ] Navigation works
- [ ] Mobile layout is perfect
- [ ] Matches wireframe design

**🔄 GIT COMMIT #30**:
```bash
git add .
git commit -m "feat: create employee dashboard page"
```

---

## MILESTONE 15: Clock In/Out Page (Employee)
**Duration**: 45 minutes
**Goal**: Build time clock interface for painters

### Step 15.1: Create Clock In/Out Page

**Prompt for Claude Code**:
```
Create the clock page at app/(employee)/employee/clock/page.tsx.

Requirements:

**Match the EmployeeClock design from timesheet-wireframes.jsx:**

1. **Header:**
   - Back button
   - "Time Clock" title

2. **Current Time Display:**
   - Large gradient card (blue)
   - Clock icon
   - Current time (large: "2:34 PM")
   - Current date
   - Update every second

3. **If NOT clocked in:**
   - "Select Work Location" section
   - Dropdown: Job Site (required)
   - Dropdown: Floor (required, loads based on site)
   - Dropdown: Area/Room (optional)
   - Large green "Clock In" button
   - Disabled until site and floor selected

4. **If clocked in:**
   - "Currently Clocked In" card
   - Green pulsing dot indicator
   - Show:
     * Site, floor, room
     * Clock in time
     * Hours accumulated (updates every minute)
   - Large red "Clock Out" button

5. **Recent Activity Section:**
   - "Recent Activity" heading
   - List of recent time entries (last 5)
   - Show: Site - Floor, Date, Hours worked

**Functionality:**
- Clock in: POST /api/time-entries/clock-in
- Clock out: POST /api/time-entries/clock-out
- Get current entry: GET /api/time-entries/current
- Validate assignment before allowing clock in
- Show error if not assigned to selected location

**Bottom Navigation:**
- Clock tab is active

Create also:
- useTimer hook (for live time display)
- useClockStatus hook (manage clock state)
```

**Testing Checkpoint #22: Test Clock In/Out**:
```bash
# Navigate to Clock tab as painter

# Test Clock In:
1. Select job site → dropdown populates
2. Select floor → dropdown updates
3. Click "Clock In" → success
4. Verify status changes to "Clocked In"
5. See hours timer incrementing

# Test Clock Out:
1. Click "Clock Out" → confirm
2. Verify status changes to "Not Clocked In"
3. Verify hours calculated correctly

# Edge Cases:
- Try to clock in without assignment → error
- Try to clock in twice → error
- Refresh page while clocked in → status persists
```

**Validation Checklist**:
- [ ] Clock in works correctly
- [ ] Clock out works correctly
- [ ] Location selector works
- [ ] Hours timer updates live
- [ ] Recent activity shows
- [ ] Validation works
- [ ] Mobile layout is perfect

**🔄 GIT COMMIT #31**:
```bash
git add .
git commit -m "feat: create clock in/out page for employees"
```

---

## MILESTONE 16: Progress Update Page (Employee)
**Duration**: 45 minutes
**Goal**: Build task progress update interface

### Step 16.1: Create Progress Update Page

**Prompt for Claude Code**:
```
Create the progress update page at app/(employee)/employee/progress/[areaId]/page.tsx.

Requirements:

**Match the EmployeeProgress design from timesheet-wireframes.jsx:**

1. **Header:**
   - Back button
   - "Update Progress" title
   - Subtitle: "Site • Floor • Room"

2. **Overall Progress Card:**
   - "Room Progress" heading
   - Large percentage (calculated from tasks)
   - Progress bar

3. **Task Progress Sliders:**
   - "Task Completion" section
   - Slider for each task:
     * Task name with icon (checkmark if 100%)
     * Current percentage
     * Range slider (0-100, step: 5)
     * Visual progress bar that fills as slider moves
   - Tasks: Cut, Roll, Trim, Touch-up

4. **Notes Section:**
   - "Add Note (Optional)" heading
   - Textarea for notes
   - Placeholder: "Any updates or issues to report..."

5. **Action Buttons:**
   - "Save Progress" button (primary, blue)
   - "Cancel" button (secondary, gray)

6. **Quick Stats:**
   - 2 cards:
     * Tasks Complete (green)
     * In Progress (yellow)

**Functionality:**
- Load area and tasks: GET /api/areas/[areaId]
- Update progress: PATCH /api/tasks/[taskId]/progress
- Batch update: Update all tasks at once
- Calculate room progress from task averages
- Create activity log for changes
- Optimistic UI updates

**Interactions:**
- Move slider → progress bar updates instantly
- Save → update all changed tasks
- Cancel → discard changes and go back

Create also:
- ProgressSlider component (custom range slider with visual feedback)
```

**Testing Checkpoint #23: Test Progress Update**:
```bash
# Navigate to an assignment, click "Update Progress"

# Test:
1. See all 4 tasks with current percentages
2. Move slider for "Trim" from 75% to 85%
   - Progress bar updates instantly
   - Room percentage recalculates
3. Add note: "Completed north wall"
4. Click "Save Progress"
   - Success message
   - Navigate back to dashboard
   - Verify progress updated

# Edge Cases:
- Move multiple sliders
- Cancel without saving → changes discarded
- Save with no changes → no API calls
```

**Validation Checklist**:
- [ ] Tasks load correctly
- [ ] Sliders work smoothly
- [ ] Progress bar updates in real-time
- [ ] Room percentage recalculates
- [ ] Notes save correctly
- [ ] Activity log is created
- [ ] Optimistic updates work
- [ ] Mobile layout is perfect

**🔄 GIT COMMIT #32**:
```bash
git add .
git commit -m "feat: create progress update page for employees"
```

---

### Step 16.2: Create Profile Page

**Prompt for Claude Code**:
```
Create the employee profile page at app/(employee)/employee/profile/page.tsx.

Requirements:

1. **Header:**
   - "Profile" title

2. **Profile Info Card:**
   - Avatar/initials
   - Name
   - Email
   - Phone
   - Role badge

3. **Stats Cards:**
   - This Week: Hours worked
   - This Month: Hours worked
   - All Time: Total hours
   - Sites worked on

4. **Settings Section:**
   - Change password button
   - Notification settings (toggle)
   - Language (dropdown - optional)

5. **Logout Button:**
   - Red, prominent
   - Confirm before logout

**Bottom Navigation:**
- Profile tab is active
```

**Testing Checkpoint #24: Test Profile**:
```bash
# Navigate to Profile tab

# Expected:
1. Profile info displays correctly
2. Stats show accurate hours
3. Can logout

# Test logout:
- Click logout
- Confirm
- Redirected to login page
```

**Validation Checklist**:
- [ ] Profile displays correctly
- [ ] Stats are accurate
- [ ] Logout works
- [ ] Mobile layout is perfect

**🔄 GIT COMMIT #33**:
```bash
git add .
git commit -m "feat: create employee profile page"
```

---

**✅ MILESTONE 16 VALIDATION (End of Phase 3)**

Before proceeding to Phase 4, verify:
- [ ] Employee dashboard works
- [ ] Clock in/out works correctly
- [ ] Progress update works smoothly
- [ ] Profile page displays
- [ ] All employee pages are mobile-first
- [ ] Navigation works perfectly
- [ ] Design matches wireframes
- [ ] Git history shows commits #30-33

**Test complete employee flow:**
1. Login as painter
2. View dashboard and assignments
3. Clock in to a site
4. Update progress on tasks
5. Clock out
6. View profile and stats
7. Logout

---

# PHASE 4: TESTING & POLISH

---

## MILESTONE 17: Testing, Optimization & Polish
**Duration**: 90-120 minutes
**Goal**: Comprehensive testing and performance optimization

### Step 17.1: Add Component Tests

**Prompt for Claude Code**:
```
Create comprehensive tests for all React components.

Requirements:

Test files to create:

1. **UI Components Tests:**
   - app/components/ui/Button.test.tsx
   - app/components/ui/ProgressBar.test.tsx
   - app/components/ui/Modal.test.tsx
   - etc.

2. **Job Site Components Tests:**
   - app/components/job-sites/SiteCard.test.tsx
   - app/components/job-sites/FloorAccordion.test.tsx
   - app/components/job-sites/TaskItem.test.tsx

3. **Page Tests:**
   - app/(admin)/admin/page.test.tsx
   - app/(employee)/employee/page.test.tsx
   - app/(employee)/employee/clock/page.test.tsx

Test scenarios:
- Component renders correctly
- Props are handled properly
- User interactions work
- Loading states show
- Error states display
- Accessibility (ARIA labels, keyboard navigation)

Use React Testing Library and Jest.
Aim for 80%+ code coverage on components.
```

**Testing Checkpoint #25: Run All Tests**:
```bash
npm test

# Expected: All tests pass

npm run test:coverage

# Expected: 80%+ coverage on components
```

**🔄 GIT COMMIT #34**:
```bash
git add .
git commit -m "test: add comprehensive component tests"
```

---

### Step 17.2: Performance Optimization

**Prompt for Claude Code**:
```
Optimize the application for performance, especially on mobile.

Requirements:

1. **Image Optimization:**
   - Use Next.js Image component for all images
   - Add loading="lazy" for off-screen images
   - Optimize image formats (WebP)

2. **Code Splitting:**
   - Use dynamic imports for modals and heavy components
   - Lazy load admin pages (not immediately needed)
   - Split vendor bundles

3. **React Optimization:**
   - Add React.memo to expensive components
   - Use useMemo for expensive calculations
   - Use useCallback for event handlers passed to children
   - Optimize re-renders (especially in hierarchical views)

4. **API Optimization:**
   - Add request deduplication in React Query
   - Set proper staleTime and cacheTime
   - Implement pagination for large lists
   - Add optimistic updates where appropriate

5. **Mobile Optimization:**
   - Reduce bundle size (analyze with next/bundle-analyzer)
   - Minimize JavaScript execution
   - Optimize CSS (remove unused Tailwind classes)
   - Add font preloading

6. **Progressive Web App (PWA):**
   - Add manifest.json
   - Add service worker for offline support
   - Enable "Add to Home Screen"
   - Cache API responses for offline use

Create:
- next.config.js optimizations
- Service worker configuration
- Bundle analyzer setup

Run Lighthouse audit and aim for:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+
```

**Testing Checkpoint #26: Performance Audit**:
```bash
# Build production version
npm run build

# Analyze bundle
npm run analyze

# Start production server
npm start

# Run Lighthouse audit on mobile
# Test pages:
- /admin (admin dashboard)
- /employee (employee dashboard)
- /employee/clock (clock page)

# Expected scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+
```

**Validation Checklist**:
- [ ] Bundle size is optimized
- [ ] Images are optimized
- [ ] Code splitting works
- [ ] Lighthouse scores are high
- [ ] App works offline (PWA)
- [ ] Mobile performance is excellent

**🔄 GIT COMMIT #35**:
```bash
git add .
git commit -m "perf: optimize performance and add PWA support"
```

---

### Step 17.3: Mobile UX Polish

**Prompt for Claude Code**:
```
Add final mobile UX polish and improvements.

Requirements:

1. **Touch Interactions:**
   - Add haptic feedback for important actions (if supported)
   - Add swipe gestures where appropriate
   - Improve tap highlight feedback
   - Add pull-to-refresh on list pages

2. **Animations:**
   - Add smooth page transitions
   - Animate modal/drawer open/close
   - Animate progress bar fills
   - Add micro-interactions (button press, checkbox toggle)
   - Use Framer Motion or CSS animations

3. **Loading States:**
   - Add skeleton loaders for all data fetching
   - Add optimistic UI updates for actions
   - Add progress indicators for multi-step processes

4. **Error Handling:**
   - Add friendly error messages
   - Add retry buttons
   - Add error boundaries
   - Add offline detection banner

5. **Mobile-Specific Features:**
   - Add "Add to Home Screen" prompt
   - Add mobile-friendly date/time pickers
   - Add bottom sheets instead of modals on mobile
   - Optimize keyboard behavior (auto-focus, close on submit)

6. **Accessibility:**
   - Add proper ARIA labels
   - Ensure keyboard navigation works
   - Add screen reader support
   - Ensure color contrast meets WCAG AA
   - Add focus indicators

Create:
- app/components/common/PullToRefresh.tsx
- app/components/common/BottomSheet.tsx
- app/components/common/SkeletonLoader.tsx
- app/components/common/ErrorBoundary.tsx
- app/components/common/OfflineBanner.tsx
```

**Testing Checkpoint #27: UX Testing**:
```bash
# Test on real mobile device (or Chrome DevTools mobile emulation)

# Test:
1. Pull to refresh on lists → data refreshes
2. Swipe gestures work smoothly
3. Animations are smooth (60fps)
4. Loading skeletons show during data fetch
5. Error messages are clear and helpful
6. Keyboard behavior is correct
7. App feels fast and responsive

# Accessibility:
- Navigate with keyboard only
- Use screen reader (VoiceOver/TalkBack)
- Check color contrast
- Verify ARIA labels
```

**Validation Checklist**:
- [ ] Touch interactions feel native
- [ ] Animations are smooth
- [ ] Loading states are clear
- [ ] Errors are handled gracefully
- [ ] Accessibility is excellent
- [ ] Mobile UX is polished

**🔄 GIT COMMIT #36**:
```bash
git add .
git commit -m "feat: add mobile UX polish and accessibility improvements"
```

---

**✅ MILESTONE 17 VALIDATION**

Before proceeding to deployment, verify:
- [ ] All tests pass
- [ ] Code coverage is 80%+
- [ ] Performance is optimized
- [ ] Lighthouse scores are high
- [ ] PWA features work
- [ ] Mobile UX is polished
- [ ] Accessibility is excellent
- [ ] Git history shows commits #34-36

---

# PHASE 5: VERCEL DEPLOYMENT

---

## MILESTONE 18: Database Deployment
**Duration**: 30-45 minutes
**Goal**: Set up production database on Vercel Postgres

### Step 18.1: Set Up Vercel Postgres

**Instructions:**

```
1. Create Vercel Account (if not already):
   - Go to https://vercel.com
   - Sign up with GitHub

2. Install Vercel CLI:
   npm install -g vercel

3. Create Vercel Postgres Database:
   - Log in to Vercel dashboard
   - Go to Storage tab
   - Create new Postgres database
   - Name: "paintingbuddy-db"
   - Region: Choose closest to your users
   - Click "Create"

4. Get Database Connection String:
   - Click on the database
   - Go to ".env.local" tab
   - Copy the DATABASE_URL

5. Update Local Environment:
   - Create .env.local file
   - Add:
     DATABASE_URL="[your-vercel-postgres-url]"
     NEXTAUTH_SECRET="[generate with: openssl rand -base64 32]"
     NEXTAUTH_URL="http://localhost:3000"

6. Run Migrations:
   npx prisma migrate deploy

7. Seed Database:
   npm run prisma:seed

8. Verify:
   npx prisma studio
   # Check that all tables have data
```

**Alternative: Use Supabase (if preferred)**

```
1. Create Supabase Project:
   - Go to https://supabase.com
   - Create new project
   - Name: "paintingbuddy"

2. Get Connection String:
   - Go to Settings → Database
   - Copy "Connection string" (Transaction mode)
   - Replace [YOUR-PASSWORD] with your actual password

3. Update .env.local:
   DATABASE_URL="[supabase-connection-string]"

4. Run migrations and seed as above
```

**Validation Checklist**:
- [ ] Database created successfully
- [ ] Connection string works
- [ ] Migrations ran successfully
- [ ] Seed data is populated
- [ ] Can query database from local app

**🔄 GIT COMMIT #37**:
```bash
# Update .env.example with Vercel Postgres instructions
git add .env.example
git commit -m "docs: add Vercel Postgres setup instructions"
```

---

## MILESTONE 19: Vercel Deployment
**Duration**: 45-60 minutes
**Goal**: Deploy application to Vercel

### Step 19.1: Configure Vercel Project

**Prompt for Claude Code**:
```
Prepare the application for Vercel deployment.

Requirements:

1. **Update next.config.js:**
   - Add output: 'standalone' for optimal performance
   - Configure images domain if using external images
   - Add security headers
   - Configure redirects if needed

2. **Create vercel.json:**
   - Configure build settings
   - Set environment variables
   - Configure regions

3. **Update Environment Variables:**
   - Create .env.production with:
     * DATABASE_URL (will be set in Vercel)
     * NEXTAUTH_SECRET (will be set in Vercel)
     * NEXTAUTH_URL (will be production URL)
     * NODE_ENV=production

4. **Create Deployment Documentation:**
   - Create DEPLOYMENT.md with:
     * Prerequisites
     * Step-by-step deployment instructions
     * Environment variables needed
     * Post-deployment steps
     * Troubleshooting guide

5. **Optimize Build:**
   - Ensure production build works locally
   - Check bundle size
   - Verify all environment variables are used correctly
```

**Expected Output**:
- Vercel configuration ready
- Environment variables documented
- Deployment guide created

**Testing Checkpoint #28: Test Production Build**:
```bash
# Build for production
npm run build

# Expected: Build completes successfully with no errors

# Check build output
# Expected: Optimized bundle, all pages rendered

# Start production server locally
npm start

# Test application
# Expected: Everything works as in development
```

**🔄 GIT COMMIT #38**:
```bash
git add .
git commit -m "chore: configure Vercel deployment"
```

---

### Step 19.2: Deploy to Vercel

**Instructions:**

```
1. Push to GitHub:
   git push origin develop

   # Merge to main
   git checkout main
   git merge develop
   git push origin main

2. Deploy with Vercel CLI:
   vercel

   # Follow prompts:
   - Link to existing project? No
   - Project name: paintingbuddy
   - Directory: ./
   - Override settings? No

3. Set Environment Variables in Vercel:
   vercel env add DATABASE_URL production
   # Paste your Vercel Postgres connection string

   vercel env add NEXTAUTH_SECRET production
   # Paste your generated secret

   vercel env add NEXTAUTH_URL production
   # Enter: https://paintingbuddy.vercel.app (or your domain)

4. Deploy to Production:
   vercel --prod

5. Verify Deployment:
   - Open the deployed URL
   - Test all functionality
   - Check that database connections work
   - Test login
   - Test admin and employee flows

6. Run Database Migrations on Production:
   # In Vercel dashboard → Settings → Environment Variables
   # Ensure DATABASE_URL is set

   # Then in your local terminal connected to Vercel:
   vercel env pull .env.production.local
   npx prisma migrate deploy
```

**Alternative: Deploy via GitHub Integration**

```
1. Push code to GitHub (if not already)

2. Go to Vercel Dashboard:
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     * Framework Preset: Next.js
     * Root Directory: ./
     * Build Command: npm run build
     * Output Directory: .next

3. Add Environment Variables:
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL

4. Click "Deploy"

5. Wait for deployment to complete

6. Visit your production URL
```

**Testing Checkpoint #29: Test Production Deployment**:
```bash
# Open production URL in browser
# Test as Admin:
1. Login: admin@paintingbuddy.com / Admin123!
2. View dashboard
3. View site details
4. Check time tracking
5. Manage team

# Test as Employee:
1. Login: painter1@paintingbuddy.com / Painter123!
2. View dashboard
3. Clock in
4. Update progress
5. Clock out
6. View profile

# Test on Mobile:
1. Open on real mobile device
2. Test all interactions
3. Check performance
4. Test offline mode (PWA)
5. Test "Add to Home Screen"

# Run Lighthouse Audit:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+
```

**Validation Checklist**:
- [ ] Application deployed successfully
- [ ] Database connection works
- [ ] Authentication works
- [ ] All pages load correctly
- [ ] API routes work
- [ ] Mobile experience is excellent
- [ ] PWA features work
- [ ] Performance is good
- [ ] No console errors

**🔄 GIT COMMIT #39**:
```bash
# Tag release
git tag -a v1.0.0 -m "Release v1.0.0 - PaintingBuddy production deployment"
git push origin v1.0.0
```

---

### Step 19.3: Post-Deployment Setup

**Prompt for Claude Code**:
```
Create post-deployment documentation and monitoring setup.

Requirements:

1. **Create PRODUCTION.md:**
   - Production URL
   - Database information
   - Environment variables
   - Admin credentials (securely documented)
   - User roles and test accounts
   - Known issues/limitations
   - Future enhancements roadmap

2. **Set Up Monitoring:**
   - Vercel Analytics (built-in)
   - Error tracking (consider Sentry)
   - Performance monitoring
   - Uptime monitoring

3. **Create User Documentation:**
   - README.md (updated with production info)
   - USER_GUIDE.md:
     * For Admins: How to manage sites, teams, time
     * For Painters: How to use the app
     * Screenshots of key features

4. **Security Checklist:**
   - Ensure all secrets are in environment variables
   - Verify no sensitive data in git
   - Check CORS settings
   - Review API rate limiting
   - Verify authentication security

5. **Backup Strategy:**
   - Document database backup process
   - Set up automated backups (Vercel Postgres handles this)
   - Document restore process
```

**Expected Output**:
- Production documentation
- User guides
- Monitoring setup
- Security verified

**🔄 GIT COMMIT #40**:
```bash
git add .
git commit -m "docs: add production documentation and user guides"
git push origin main
```

---

**✅ MILESTONE 19 VALIDATION (FINAL)**

**Complete Application Checklist:**

**Functionality:**
- [ ] Authentication works (login/logout)
- [ ] Admin dashboard displays correctly
- [ ] Job sites CRUD works
- [ ] Hierarchical structure (sites → floors → areas → tasks)
- [ ] Task progress updates work
- [ ] Time tracking (clock in/out) works
- [ ] Assignments work
- [ ] Reports display correctly
- [ ] User management works
- [ ] Flags and activity logs work

**Mobile-First:**
- [ ] Perfect layout on mobile (375px)
- [ ] Touch-friendly interactions
- [ ] Bottom navigation works
- [ ] Responsive up to desktop
- [ ] PWA features work
- [ ] Can add to home screen

**Performance:**
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 95+
- [ ] Fast page loads
- [ ] Smooth animations
- [ ] Optimized images

**Design:**
- [ ] Matches wireframe design
- [ ] Consistent color scheme
- [ ] Clean, professional UI
- [ ] Good typography
- [ ] Proper spacing

**Deployment:**
- [ ] Deployed on Vercel
- [ ] Database on Vercel Postgres
- [ ] Environment variables set
- [ ] Custom domain (optional)
- [ ] HTTPS enabled
- [ ] Monitoring active

**Documentation:**
- [ ] README.md complete
- [ ] User guides created
- [ ] Deployment docs written
- [ ] Code is well-commented
- [ ] API documented

---

## 🎉 CONGRATULATIONS!

You have successfully built and deployed **PaintingBuddy**, a complete mobile-first painting contractor management application!

**What you built:**
- ✅ Full-stack Next.js application
- ✅ PostgreSQL database with Prisma ORM
- ✅ NextAuth.js authentication
- ✅ Mobile-first responsive UI
- ✅ Admin and employee interfaces
- ✅ Time tracking and progress management
- ✅ Real-time updates
- ✅ PWA with offline support
- ✅ Deployed on Vercel

**Production URLs:**
- **App**: https://paintingbuddy.vercel.app
- **Database**: Vercel Postgres

**Test Credentials:**
- Admin: admin@paintingbuddy.com / Admin123!
- Supervisor: supervisor@paintingbuddy.com / Super123!
- Painter: painter1@paintingbuddy.com / Painter123!

---

## 📱 Next Steps

**Enhancements to Consider:**

1. **Mobile Apps:**
   - Convert to React Native for native iOS/Android apps
   - Publish to App Store and Google Play

2. **Advanced Features:**
   - Photo uploads for progress tracking
   - Push notifications
   - GPS location verification
   - Barcode scanning for materials
   - Invoice generation
   - Payment integration
   - Customer portal

3. **Reporting:**
   - Advanced analytics dashboard
   - PDF report generation
   - Email reports
   - Export to Excel

4. **Integrations:**
   - Calendar integration
   - Accounting software (QuickBooks)
   - CRM integration
   - Email/SMS notifications

5. **Scalability:**
   - Add Redis caching
   - Implement rate limiting
   - Add database indexing
   - Optimize queries
   - Add CDN for static assets

---

## 🐛 Troubleshooting

**Common Issues:**

1. **Database Connection Fails:**
   - Check DATABASE_URL in Vercel environment variables
   - Verify database is running
   - Check Prisma schema is generated

2. **Authentication Not Working:**
   - Check NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches deployment URL
   - Check JWT configuration

3. **Build Fails:**
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Check Next.js version compatibility

4. **Slow Performance:**
   - Check Lighthouse audit
   - Optimize images
   - Review bundle size
   - Check database query efficiency

**Support:**
- Check deployment logs in Vercel dashboard
- Review browser console for errors
- Check Network tab for failed API calls

---

## 📄 License

MIT License - feel free to use this for your painting contractor business or modify as needed!

---

**Built with ❤️ using Claude Code**

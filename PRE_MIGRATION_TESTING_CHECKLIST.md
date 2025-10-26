# Pre-Migration Testing Checklist
**Before migrating from SQLite to Production Database**

---

## 🔧 Outstanding Issues to Fix First

### ✅ Fixed
- [x] **Issue #2**: Job site deletion not working
- [x] **Issue #4**: Nested button hydration error in FloorAccordion

### ⚠️ Still Need Fixing
- [ ] **Issue #1**: Time Tracking Dashboard counters (Total Entries & Total Hours always zero)
- [ ] **Issue #3**: Team Management assignment removal and task-level assignments

---

## 📋 Admin User Testing

### Authentication & Navigation
- [ ] Log in as admin user
- [ ] Verify redirect to `/admin` dashboard
- [ ] Navigate through all admin pages without errors
- [ ] Log out successfully (verify no port 3005 error)

### Dashboard & Job Sites
- [ ] View all job sites on admin dashboard
- [ ] Verify "Active" vs "Inactive" status displays correctly
- [ ] Check floor count and active painters count are accurate
- [ ] Click "Recalculate All Progress" button
  - [ ] Verify confirmation dialog appears
  - [ ] Confirm and check success message
  - [ ] Verify progress values update correctly

### Job Site Management
- [ ] **Create New Job Site**
  - [ ] Fill in all required fields (name, address, supervisor, start date)
  - [ ] Add optional notes
  - [ ] Submit and verify redirect to job site detail page
  - [ ] Verify job site appears in dashboard list

- [ ] **View Job Site Details**
  - [ ] Click on a job site card
  - [ ] Verify all statistics display correctly (floor count, active painters)
  - [ ] Check progress bar shows correct percentage
  - [ ] Verify supervisor information displays

- [ ] **Edit Job Site**
  - [ ] Click pencil icon next to job site name
  - [ ] Modify name, address, supervisor, start date, and/or notes
  - [ ] Save changes
  - [ ] Verify changes persist and display correctly

- [ ] **Delete Job Site**
  - [ ] Click delete button on job site card
  - [ ] Verify confirmation dialog shows cascade warning
  - [ ] Confirm deletion
  - [ ] Verify job site is completely removed from list
  - [ ] Verify all related data is deleted (floors, areas, tasks, assignments)

### Floor Management
- [ ] **Add Floor to Job Site**
  - [ ] Navigate to job site detail page
  - [ ] Click "Add Floor" button
  - [ ] Enter floor name and number
  - [ ] Submit and verify floor appears in list

- [ ] **View Floor (Expand Accordion)**
  - [ ] Click on floor to expand
  - [ ] Verify areas list displays
  - [ ] Check floor progress percentage

- [ ] **Delete Floor**
  - [ ] Click delete icon on floor
  - [ ] Verify warning about cascading deletes (areas, tasks)
  - [ ] Confirm deletion
  - [ ] Verify floor and all children are removed

### Area Management
- [ ] **Add Area to Floor**
  - [ ] Click "Add Area" in expanded floor
  - [ ] Enter area name and select type (Room, Hallway, etc.)
  - [ ] **NEW: Select tasks using checkboxes**
    - [ ] Try "MINIMAL" preset (Cut, Roll, Trim, Touch-up)
    - [ ] Try "STANDARD" preset
    - [ ] Try "FULL" preset (all 11 tasks)
    - [ ] Try custom selection
    - [ ] Verify "Select All" and "Clear" buttons work
    - [ ] Check selected count updates in submit button
  - [ ] Submit and verify area with selected tasks is created
  - [ ] Verify tasks appear in correct order (by task number)

- [ ] **View Area Details**
  - [ ] Expand area accordion
  - [ ] Verify all tasks display
  - [ ] Check task progress bars

- [ ] **Delete Area**
  - [ ] Click delete icon on area
  - [ ] Verify cascade warning (tasks)
  - [ ] Confirm deletion
  - [ ] Verify area and tasks are removed

### Assignment Management
- [ ] Navigate to Team Management page
- [ ] **View Assignments**
  - [ ] Check Job Site level assignments
  - [ ] Check Floor level assignments
  - [ ] Check Area level assignments
  - [ ] ⚠️ TODO: Should also show Task level assignments

- [ ] **Create Assignments**
  - [ ] Assign employee to job site
  - [ ] Assign employee to specific floor
  - [ ] Assign employee to specific area
  - [ ] ⚠️ TODO: Should be able to assign to specific tasks

- [ ] **Remove Assignments**
  - [ ] ⚠️ TODO: Should have remove button next to each assignment
  - [ ] ⚠️ TODO: Click remove and verify assignment is deleted

### Time Tracking Dashboard
- [ ] Navigate to Time Tracking page
- [ ] **Active Workers**
  - [ ] Verify list of currently clocked-in workers
  - [ ] Check worker details (name, site, floor, area, hours)
  - [ ] **Admin Clock Out**
    - [ ] Click "Clock Out" button for a worker
    - [ ] Verify confirmation dialog
    - [ ] Confirm and verify worker is clocked out
    - [ ] Check worker disappears from active list

- [ ] **Time Entries & Statistics**
  - [ ] ⚠️ TODO: Select date range
  - [ ] ⚠️ TODO: Filter by job site
  - [ ] ⚠️ TODO: Verify "Total Entries" counter shows correct count
  - [ ] ⚠️ TODO: Verify "Total Hours" shows correct sum
  - [ ] View individual time entries
  - [ ] Check entries show correct clock in/out times and durations

### Auto Active Status
- [ ] Find an inactive job site (no workers clocked in)
- [ ] Have an employee clock into that site
- [ ] Return to admin dashboard
- [ ] Verify job site status changed to "Active" (green badge)
- [ ] Clock out all workers from that site
- [ ] Verify job site status changes to "Inactive" (gray badge)

### Team Management
- [ ] View all users
- [ ] **Create New User**
  - [ ] Add employee with all required fields
  - [ ] Verify user appears in list
  - [ ] Check role is set correctly (EMPLOYEE vs ADMIN)

- [ ] **Edit User**
  - [ ] Click edit on user
  - [ ] Modify user details
  - [ ] Save and verify changes persist

- [ ] **Delete User**
  - [ ] ⚠️ Should prevent deletion if user has active time entries
  - [ ] Delete user without active entries
  - [ ] Verify user is removed

---

## 👷 Employee User Testing

### Authentication
- [ ] Log in as employee user
- [ ] Verify redirect to `/employee` dashboard
- [ ] Verify only employee-appropriate pages are accessible
- [ ] Log out successfully

### Employee Dashboard
- [ ] **View Assigned Job Sites**
  - [ ] Verify only assigned sites appear
  - [ ] Check site details (name, address, progress)
  - [ ] Click on assigned job site

- [ ] **View Current Assignment Details**
  - [ ] If assigned to specific floor, verify it shows
  - [ ] If assigned to specific area, verify it shows
  - [ ] View available areas for progress updates

### Clock In/Out
- [ ] Navigate to Clock page
- [ ] **Clock In**
  - [ ] Select job site from dropdown (only assigned sites)
  - [ ] Optionally select floor
  - [ ] Optionally select area
  - [ ] Add optional notes
  - [ ] Click "Clock In"
  - [ ] Verify success message
  - [ ] Verify clock in time displays
  - [ ] Check job site becomes "Active" status

- [ ] **Clock Out**
  - [ ] While clocked in, return to Clock page
  - [ ] Verify current clock in details display
  - [ ] See current hours worked (ticking up)
  - [ ] Add optional notes
  - [ ] Click "Clock Out"
  - [ ] Verify success message
  - [ ] Check total hours for the day updates

### Progress Updates
- [ ] Navigate to assigned job site
- [ ] View areas assigned to you
- [ ] **Update Task Progress**
  - [ ] Click on an area
  - [ ] View tasks for that area
  - [ ] Update progress slider for a task (e.g., 25% → 50%)
  - [ ] Add optional notes
  - [ ] Submit update
  - [ ] Verify progress saves
  - [ ] Check that area progress updates (average of tasks)
  - [ ] Verify floor progress updates
  - [ ] Verify job site progress updates

- [ ] **Mark Task Complete**
  - [ ] Set task to 100%
  - [ ] Verify task shows as complete
  - [ ] Check cascade effect on area/floor/site progress

### Verify Limited Access
- [ ] Try to access `/admin` URL directly
- [ ] Verify redirect to unauthorized page
- [ ] Verify cannot see other employees' time entries
- [ ] Verify cannot delete or edit job sites/floors/areas
- [ ] Verify cannot manage team or assignments

---

## 🧪 Data Integrity Tests

### Progress Calculation Cascade
- [ ] Update a task progress
- [ ] Verify area progress recalculates (average of task percentages)
- [ ] Verify floor progress recalculates (average of area percentages)
- [ ] Verify job site progress recalculates (weighted by area count)

### Deletion Cascade
- [ ] Delete a job site
- [ ] Verify ALL related data is deleted:
  - [ ] Floors
  - [ ] Areas
  - [ ] Tasks
  - [ ] Assignments
  - [ ] Time Entries
  - [ ] Flags
- [ ] Verify activity logs are preserved (audit trail)

### Assignment Validation
- [ ] Try to clock in to unassigned job site
- [ ] Verify error message prevents clock in
- [ ] Assign employee, then verify they can clock in

### Role-Based Access
- [ ] Supervisor can only see their own job sites
- [ ] Supervisor can only edit their own job sites
- [ ] Admin can see all job sites
- [ ] Admin can edit any job site
- [ ] Employee can only see assigned job sites

---

## 📱 Mobile Responsiveness

### Test on Mobile Device or Browser DevTools
- [ ] Admin dashboard displays correctly on mobile
- [ ] Job site cards stack vertically
- [ ] Forms are usable on mobile (proper input sizes)
- [ ] Modals fit on mobile screen
- [ ] Navigation menu works on mobile
- [ ] Clock in/out page is mobile-friendly
- [ ] Progress update sliders work on touch

---

## ⚡ Performance & Edge Cases

### Large Data Sets
- [ ] Create job site with 10+ floors
- [ ] Create floor with 20+ areas
- [ ] Verify pagination or loading works
- [ ] Check that accordions help manage large lists

### Concurrent Users
- [ ] Have 2+ employees clock in simultaneously
- [ ] Verify all clock-ins register correctly
- [ ] Check active workers list updates properly

### Error Handling
- [ ] Try to submit forms with missing required fields
- [ ] Try to delete job site while employee is clocked in (should work)
- [ ] Try to clock in without selecting job site
- [ ] Test network failure scenarios

### Data Validation
- [ ] Try to create area with no tasks selected (should fail)
- [ ] Try to enter invalid dates
- [ ] Try to enter negative progress values
- [ ] Try to enter progress > 100%

---

## 🔍 Database Verification (SQLite)

### Before Migration
- [ ] Export current SQLite database as backup
- [ ] Run database integrity check: `sqlite3 prisma/dev.db "PRAGMA integrity_check;"`
- [ ] Verify row counts for each table
- [ ] Check for orphaned records
- [ ] Verify all foreign key relationships

### SQL Queries to Run
```sql
-- Count records in each table
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'Job Sites', COUNT(*) FROM job_sites
UNION ALL SELECT 'Floors', COUNT(*) FROM floors
UNION ALL SELECT 'Areas', COUNT(*) FROM areas
UNION ALL SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL SELECT 'Assignments', COUNT(*) FROM assignments
UNION ALL SELECT 'Time Entries', COUNT(*) FROM time_entries
UNION ALL SELECT 'Flags', COUNT(*) FROM flags
UNION ALL SELECT 'Activity Logs', COUNT(*) FROM activity_logs;

-- Check for orphaned areas (areas without floors)
SELECT * FROM areas WHERE floor_id NOT IN (SELECT id FROM floors);

-- Check for orphaned tasks (tasks without areas)
SELECT * FROM tasks WHERE area_id NOT IN (SELECT id FROM areas);

-- Find active time entries (not clocked out)
SELECT u.first_name, u.last_name, js.name as job_site, te.clock_in
FROM time_entries te
JOIN users u ON te.user_id = u.id
JOIN job_sites js ON te.job_site_id = js.id
WHERE te.clock_out IS NULL;
```

---

## ✅ Sign-Off Checklist

Before proceeding with production database migration:

- [ ] All critical bugs fixed
- [ ] All admin features tested and working
- [ ] All employee features tested and working
- [ ] Progress calculation working correctly
- [ ] Deletion cascades working properly
- [ ] Auto active status working
- [ ] Task selection with all 11 task types working
- [ ] Mobile responsive design verified
- [ ] Database integrity verified
- [ ] SQLite backup created
- [ ] Documentation updated

---

## 📝 Notes & Issues Found

**Date Tested**: ___________
**Tester**: ___________

### Issues Found During Testing:
1.
2.
3.

### Items That Need Fixing Before Migration:
1. Issue #1: Time Tracking Dashboard counters
2. Issue #3: Team Management assignment removal
3.

### Nice-to-Have Improvements (Post-Migration):
1. Item #4: Printable Reports
2. Item #5: Delete with Report Option
3.

---

## 🚀 Ready for Migration?

After completing this checklist and fixing all critical issues:

**[ ] YES - Ready to migrate to production database**
**[ ] NO - Issues found that need fixing first**

---

*Generated as part of Phase 1-3 implementation*
*Last Updated: 2025-10-25*

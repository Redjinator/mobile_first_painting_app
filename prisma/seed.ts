import { PrismaClient, UserRole, AreaType, AssignableType, FlagType, FlagStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

  // Clear existing data (in reverse order of dependencies)
  await prisma.activityLog.deleteMany()
  await prisma.flag.deleteMany()
  await prisma.timeEntry.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.task.deleteMany()
  await prisma.area.deleteMany()
  await prisma.floor.deleteMany()
  await prisma.jobSite.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Cleared existing data\n')

  // Create Users
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@paintingbuddy.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      phone: '555-0100',
    },
  })
  console.log('✅ Created admin user')

  const supervisorPassword = await bcrypt.hash('Super123!', 10)
  const supervisor = await prisma.user.create({
    data: {
      email: 'supervisor@paintingbuddy.com',
      passwordHash: supervisorPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: UserRole.SUPERVISOR,
      phone: '555-0101',
    },
  })
  console.log('✅ Created supervisor user')

  const painterPassword = await bcrypt.hash('Painter123!', 10)
  const painterNames = [
    { first: 'Mike', last: 'Wilson', email: 'painter1@paintingbuddy.com', phone: '555-0201' },
    { first: 'Sarah', last: 'Chen', email: 'painter2@paintingbuddy.com', phone: '555-0202' },
    { first: 'Tom', last: 'Brown', email: 'painter3@paintingbuddy.com', phone: '555-0203' },
    { first: 'Lisa', last: 'Garcia', email: 'painter4@paintingbuddy.com', phone: '555-0204' },
    { first: 'James', last: 'Martinez', email: 'painter5@paintingbuddy.com', phone: '555-0205' },
    { first: 'Emma', last: 'Johnson', email: 'painter6@paintingbuddy.com', phone: '555-0206' },
  ]

  const painters = []
  for (const painterData of painterNames) {
    const painter = await prisma.user.create({
      data: {
        email: painterData.email,
        passwordHash: painterPassword,
        firstName: painterData.first,
        lastName: painterData.last,
        role: UserRole.EMPLOYEE,
        phone: painterData.phone,
      },
    })
    painters.push(painter)
  }
  console.log('✅ Created 6 painter users\n')

  // Create Job Site
  const jobSite = await prisma.jobSite.create({
    data: {
      name: 'Riverside Apartments',
      address: '123 Riverside Drive, Portland, OR 97201',
      notes: 'New construction, all interior painting',
      supervisorId: supervisor.id,
      startDate: new Date('2025-09-15'),
      completionPercentage: 0,
    },
  })
  console.log('✅ Created job site: Riverside Apartments\n')

  // Create Floors
  const floor1 = await prisma.floor.create({
    data: {
      jobSiteId: jobSite.id,
      name: 'Ground Floor',
      floorNumber: 1,
      completionPercentage: 0,
    },
  })

  const floor2 = await prisma.floor.create({
    data: {
      jobSiteId: jobSite.id,
      name: 'Second Floor',
      floorNumber: 2,
      completionPercentage: 0,
    },
  })

  const floor3 = await prisma.floor.create({
    data: {
      jobSiteId: jobSite.id,
      name: 'Third Floor',
      floorNumber: 3,
      completionPercentage: 0,
    },
  })
  console.log('✅ Created 3 floors\n')

  // Floor 1 Areas
  const room101 = await prisma.area.create({
    data: {
      floorId: floor1.id,
      name: 'Room 101 - Living Room',
      areaType: AreaType.ROOM,
      completionPercentage: 0,
    },
  })

  const room102 = await prisma.area.create({
    data: {
      floorId: floor1.id,
      name: 'Room 102 - Bedroom',
      areaType: AreaType.ROOM,
      completionPercentage: 0,
    },
  })

  const room103 = await prisma.area.create({
    data: {
      floorId: floor1.id,
      name: 'Room 103 - Kitchen',
      areaType: AreaType.ROOM,
      completionPercentage: 0,
    },
  })

  const hallwayA = await prisma.area.create({
    data: {
      floorId: floor1.id,
      name: 'Hallway A - Main Corridor',
      areaType: AreaType.HALLWAY,
      completionPercentage: 0,
    },
  })

  // Closets as sub-areas
  const closetA = await prisma.area.create({
    data: {
      floorId: floor1.id,
      parentAreaId: room101.id,
      name: 'Closet A',
      areaType: AreaType.CLOSET,
      completionPercentage: 90,
    },
  })

  const closetB = await prisma.area.create({
    data: {
      floorId: floor1.id,
      parentAreaId: room102.id,
      name: 'Closet B',
      areaType: AreaType.CLOSET,
      completionPercentage: 70,
    },
  })
  console.log('✅ Created areas for Floor 1: 3 rooms, 1 hallway, 2 closets\n')

  // Create tasks for Room 101 - Living Room
  await prisma.task.createMany({
    data: [
      { areaId: room101.id, name: 'Cut', taskOrder: 1, completionPercentage: 100 },
      { areaId: room101.id, name: 'Roll', taskOrder: 2, completionPercentage: 100 },
      { areaId: room101.id, name: 'Trim', taskOrder: 3, completionPercentage: 75 },
      { areaId: room101.id, name: 'Touch-up', taskOrder: 4, completionPercentage: 50 },
    ],
  })

  // Create tasks for Room 102 - Bedroom
  await prisma.task.createMany({
    data: [
      { areaId: room102.id, name: 'Cut', taskOrder: 1, completionPercentage: 80 },
      { areaId: room102.id, name: 'Roll', taskOrder: 2, completionPercentage: 70 },
      { areaId: room102.id, name: 'Trim', taskOrder: 3, completionPercentage: 50 },
      { areaId: room102.id, name: 'Touch-up', taskOrder: 4, completionPercentage: 40 },
    ],
  })

  // Create tasks for Room 103 - Kitchen
  await prisma.task.createMany({
    data: [
      { areaId: room103.id, name: 'Cut', taskOrder: 1, completionPercentage: 60 },
      { areaId: room103.id, name: 'Roll', taskOrder: 2, completionPercentage: 40 },
      { areaId: room103.id, name: 'Trim', taskOrder: 3, completionPercentage: 30 },
      { areaId: room103.id, name: 'Touch-up', taskOrder: 4, completionPercentage: 0 },
    ],
  })

  // Create tasks for Hallway A
  await prisma.task.createMany({
    data: [
      { areaId: hallwayA.id, name: 'Cut', taskOrder: 1, completionPercentage: 80 },
      { areaId: hallwayA.id, name: 'Roll', taskOrder: 2, completionPercentage: 70 },
      { areaId: hallwayA.id, name: 'Trim', taskOrder: 3, completionPercentage: 50 },
      { areaId: hallwayA.id, name: 'Touch-up', taskOrder: 4, completionPercentage: 40 },
    ],
  })

  // Floor 2 Areas
  const room201 = await prisma.area.create({
    data: {
      floorId: floor2.id,
      name: 'Room 201 - Living Room',
      areaType: AreaType.ROOM,
      completionPercentage: 0,
    },
  })

  const room202 = await prisma.area.create({
    data: {
      floorId: floor2.id,
      name: 'Room 202 - Bedroom',
      areaType: AreaType.ROOM,
      completionPercentage: 0,
    },
  })

  const room203 = await prisma.area.create({
    data: {
      floorId: floor2.id,
      name: 'Room 203 - Kitchen',
      areaType: AreaType.ROOM,
      completionPercentage: 0,
    },
  })

  const hallwayB = await prisma.area.create({
    data: {
      floorId: floor2.id,
      name: 'Hallway B - Main Corridor',
      areaType: AreaType.HALLWAY,
      completionPercentage: 0,
    },
  })

  // Create tasks for Floor 2 areas with varying progress
  await prisma.task.createMany({
    data: [
      // Room 201
      { areaId: room201.id, name: 'Cut', taskOrder: 1, completionPercentage: 90 },
      { areaId: room201.id, name: 'Roll', taskOrder: 2, completionPercentage: 80 },
      { areaId: room201.id, name: 'Trim', taskOrder: 3, completionPercentage: 60 },
      { areaId: room201.id, name: 'Touch-up', taskOrder: 4, completionPercentage: 20 },
      // Room 202
      { areaId: room202.id, name: 'Cut', taskOrder: 1, completionPercentage: 50 },
      { areaId: room202.id, name: 'Roll', taskOrder: 2, completionPercentage: 30 },
      { areaId: room202.id, name: 'Trim', taskOrder: 3, completionPercentage: 0 },
      { areaId: room202.id, name: 'Touch-up', taskOrder: 4, completionPercentage: 0 },
      // Room 203
      { areaId: room203.id, name: 'Cut', taskOrder: 1, completionPercentage: 20 },
      { areaId: room203.id, name: 'Roll', taskOrder: 2, completionPercentage: 10 },
      { areaId: room203.id, name: 'Trim', taskOrder: 3, completionPercentage: 0 },
      { areaId: room203.id, name: 'Touch-up', taskOrder: 4, completionPercentage: 0 },
      // Hallway B
      { areaId: hallwayB.id, name: 'Cut', taskOrder: 1, completionPercentage: 40 },
      { areaId: hallwayB.id, name: 'Roll', taskOrder: 2, completionPercentage: 20 },
      { areaId: hallwayB.id, name: 'Trim', taskOrder: 3, completionPercentage: 0 },
      { areaId: hallwayB.id, name: 'Touch-up', taskOrder: 4, completionPercentage: 0 },
    ],
  })
  console.log('✅ Created areas for Floor 2\n')
  console.log('✅ Created painting tasks (Cut, Roll, Trim, Touch-up)\n')

  // Create Assignments
  const assignments = await prisma.assignment.createMany({
    data: [
      // Site-level assignments
      {
        userId: painters[0].id, // Mike Wilson
        assignableType: AssignableType.JOB_SITE,
        assignableId: jobSite.id,
        jobSiteId: jobSite.id,
        assignedBy: supervisor.id,
      },
      {
        userId: painters[1].id, // Sarah Chen
        assignableType: AssignableType.JOB_SITE,
        assignableId: jobSite.id,
        jobSiteId: jobSite.id,
        assignedBy: supervisor.id,
      },
      {
        userId: painters[2].id, // Tom Brown
        assignableType: AssignableType.JOB_SITE,
        assignableId: jobSite.id,
        jobSiteId: jobSite.id,
        assignedBy: supervisor.id,
      },
      // Floor-level assignment
      {
        userId: painters[3].id, // Lisa Garcia
        assignableType: AssignableType.FLOOR,
        assignableId: floor2.id,
        jobSiteId: jobSite.id,
        floorId: floor2.id,
        assignedBy: supervisor.id,
      },
      // Area-level assignment
      {
        userId: painters[4].id, // James Martinez
        assignableType: AssignableType.AREA,
        assignableId: room201.id,
        jobSiteId: jobSite.id,
        floorId: floor2.id,
        areaId: room201.id,
        assignedBy: supervisor.id,
      },
    ],
  })
  console.log('✅ Created 5 assignments\n')

  // Create Time Entries
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const twoDaysAgo = new Date(today)
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  await prisma.timeEntry.createMany({
    data: [
      // Mike Wilson - clocked out yesterday
      {
        userId: painters[0].id,
        jobSiteId: jobSite.id,
        floorId: floor1.id,
        areaId: room101.id,
        clockIn: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000), // 8 AM
        clockOut: new Date(yesterday.getTime() + 16 * 60 * 60 * 1000), // 4 PM
        totalHours: 8.0,
        notes: 'Completed trim work in Room 101',
      },
      // Sarah Chen - clocked out yesterday
      {
        userId: painters[1].id,
        jobSiteId: jobSite.id,
        floorId: floor1.id,
        areaId: room102.id,
        clockIn: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000),
        clockOut: new Date(yesterday.getTime() + 15.5 * 60 * 60 * 1000),
        totalHours: 7.5,
        notes: 'Working on bedroom rolling',
      },
      // Tom Brown - currently clocked in
      {
        userId: painters[2].id,
        jobSiteId: jobSite.id,
        floorId: floor1.id,
        areaId: hallwayA.id,
        clockIn: new Date(today.getTime() + 8 * 60 * 60 * 1000),
        clockOut: null,
        totalHours: null,
      },
      // Lisa Garcia - clocked out two days ago
      {
        userId: painters[3].id,
        jobSiteId: jobSite.id,
        floorId: floor2.id,
        areaId: room202.id,
        clockIn: new Date(twoDaysAgo.getTime() + 7.5 * 60 * 60 * 1000),
        clockOut: new Date(twoDaysAgo.getTime() + 16 * 60 * 60 * 1000),
        totalHours: 8.5,
        notes: 'Started cutting in Room 202',
      },
      // James Martinez - currently clocked in
      {
        userId: painters[4].id,
        jobSiteId: jobSite.id,
        floorId: floor2.id,
        areaId: room201.id,
        clockIn: new Date(today.getTime() + 7 * 60 * 60 * 1000),
        clockOut: null,
        totalHours: null,
      },
      // Emma Johnson - clocked out yesterday
      {
        userId: painters[5].id,
        jobSiteId: jobSite.id,
        floorId: floor2.id,
        areaId: hallwayB.id,
        clockIn: new Date(yesterday.getTime() + 8.5 * 60 * 60 * 1000),
        clockOut: new Date(yesterday.getTime() + 16.5 * 60 * 60 * 1000),
        totalHours: 8.0,
      },
    ],
  })
  console.log('✅ Created 6 time entries\n')

  // Create Flags
  await prisma.flag.createMany({
    data: [
      {
        flaggableType: 'AREA',
        flaggableId: room103.id,
        jobSiteId: jobSite.id,
        floorId: floor1.id,
        areaId: room103.id,
        type: FlagType.ISSUE,
        description: 'Water damage on ceiling, needs repair before painting',
        status: FlagStatus.OPEN,
        createdBy: painters[1].id,
      },
      {
        flaggableType: 'FLOOR',
        flaggableId: floor3.id,
        jobSiteId: jobSite.id,
        floorId: floor3.id,
        type: FlagType.WAITING_MATERIALS,
        description: 'Paint order delayed, expected Friday',
        status: FlagStatus.IN_PROGRESS,
        createdBy: supervisor.id,
      },
      {
        flaggableType: 'AREA',
        flaggableId: room101.id,
        jobSiteId: jobSite.id,
        floorId: floor1.id,
        areaId: room101.id,
        type: FlagType.INSPECTION_NEEDED,
        description: 'Final walkthrough needed',
        status: FlagStatus.OPEN,
        createdBy: painters[0].id,
      },
    ],
  })
  console.log('✅ Created 3 flags\n')

  // Calculate and update completion percentages
  // For demonstration purposes, we'll update Room 101's completion based on tasks
  const room101Tasks = await prisma.task.findMany({
    where: { areaId: room101.id },
  })
  const room101Completion = Math.round(
    room101Tasks.reduce((sum, task) => sum + task.completionPercentage, 0) / room101Tasks.length
  )
  await prisma.area.update({
    where: { id: room101.id },
    data: { completionPercentage: room101Completion },
  })

  console.log('🎉 Seeding completed!\n')

  // Summary
  const userCount = await prisma.user.count()
  const jobSiteCount = await prisma.jobSite.count()
  const floorCount = await prisma.floor.count()
  const areaCount = await prisma.area.count()
  const taskCount = await prisma.task.count()
  const assignmentCount = await prisma.assignment.count()
  const timeEntryCount = await prisma.timeEntry.count()
  const flagCount = await prisma.flag.count()

  console.log('📊 Summary:')
  console.log(`   - ${userCount} users (1 admin, 1 supervisor, ${userCount - 2} painters)`)
  console.log(`   - ${jobSiteCount} job site`)
  console.log(`   - ${floorCount} floors`)
  console.log(`   - ${areaCount} areas`)
  console.log(`   - ${taskCount} tasks`)
  console.log(`   - ${assignmentCount} assignments`)
  console.log(`   - ${timeEntryCount} time entries`)
  console.log(`   - ${flagCount} flags`)
  console.log('\n✨ Database is ready for development!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

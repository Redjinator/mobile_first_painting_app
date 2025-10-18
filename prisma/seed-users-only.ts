import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding users only...\n');

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@paintingbuddy.com' },
    update: {},
    create: {
      email: 'admin@paintingbuddy.com',
      firstName: 'Admin',
      lastName: 'User',
      passwordHash: await hash('Admin123!', 10),
      role: 'ADMIN',
      phoneNumber: '(555) 000-0001',
      isActive: true,
    },
  });

  const painter1 = await prisma.user.upsert({
    where: { email: 'painter1@paintingbuddy.com' },
    update: {},
    create: {
      email: 'painter1@paintingbuddy.com',
      firstName: 'John',
      lastName: 'Painter',
      passwordHash: await hash('Painter123!', 10),
      role: 'EMPLOYEE',
      phoneNumber: '(555) 001-0001',
      isActive: true,
    },
  });

  console.log('✅ Created users:');
  console.log('  - Admin:', admin.email);
  console.log('  - Employee:', painter1.email);
  console.log('\n✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

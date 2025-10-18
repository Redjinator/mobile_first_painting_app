import { hash } from 'bcryptjs';

async function generateHashes() {
  console.log('\n🔐 Generating password hashes...\n');

  const admin123Hash = await hash('Admin123!', 10);
  const painter123Hash = await hash('Painter123!', 10);

  console.log('Admin password hash (for Admin123!):');
  console.log(admin123Hash);
  console.log('\n');

  console.log('Employee password hash (for Painter123!):');
  console.log(painter123Hash);
  console.log('\n');

  console.log('✅ Copy these hashes and use them in Prisma Studio for the passwordHash field');
}

generateHashes();

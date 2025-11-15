import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zayiflamaplan.com' },
    update: {},
    create: {
      email: 'admin@zayiflamaplan.com',
      username: 'admin',
      name: 'Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Admin user created:')
  console.log('   Email: admin@zayiflamaplan.com')
  console.log('   Password: admin123')
  console.log('   Role: ADMIN')

  // Create a test user
  const userPassword = await bcrypt.hash('test123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      passwordHash: userPassword,
      role: 'USER',
      emailVerified: new Date(),
      currentWeight: 80,
      targetWeight: 70,
      height: 175,
    },
  })

  console.log('✅ Test user created:')
  console.log('   Email: test@example.com')
  console.log('   Password: test123')
  console.log('   Role: USER')

  console.log('\n🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@zayiflamaplan.com'
  const password = 'admin123'
  
  // Check if admin exists
  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    console.log('✅ Admin user already exists:', email)
    console.log('Role:', existing.role)
    return
  }

  // Create admin user
  const passwordHash = await bcrypt.hash(password, 10)
  
  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: 'Admin',
      username: 'admin',
      role: 'ADMIN',
    }
  })

  console.log('✅ Admin user created successfully!')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('Role:', admin.role)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

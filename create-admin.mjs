import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createAdmin() {
  const email = 'admin@test.com'
  const password = '123456'
  const passwordHash = await bcrypt.hash(password, 10)

  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: 'Admin',
      username: 'admin',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin oluşturuldu!')
  console.log('Email:', email)
  console.log('Şifre:', password)
  console.log('ID:', admin.id)
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

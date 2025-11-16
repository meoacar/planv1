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

  // Create shop items
  const shopItems = [
    {
      key: 'profile_frame_gold',
      name: 'Altın Çerçeve',
      description: 'Profiline özel altın çerçeve ekle',
      icon: '🏆',
      category: 'cosmetic',
      price: 500,
      stock: null,
      metadata: JSON.stringify({ color: 'gold', rarity: 'epic' }),
    },
    {
      key: 'profile_frame_silver',
      name: 'Gümüş Çerçeve',
      description: 'Profiline özel gümüş çerçeve ekle',
      icon: '🥈',
      category: 'cosmetic',
      price: 250,
      stock: null,
      metadata: JSON.stringify({ color: 'silver', rarity: 'rare' }),
    },
    {
      key: 'xp_boost_2x',
      name: '2x XP Boost',
      description: '24 saat boyunca 2 kat XP kazan',
      icon: '⚡',
      category: 'boost',
      price: 300,
      stock: null,
      metadata: JSON.stringify({ duration: 24, multiplier: 2 }),
    },
    {
      key: 'streak_freeze',
      name: 'Seri Dondurma',
      description: '1 gün seri kaybını engelle',
      icon: '❄️',
      category: 'recovery',
      price: 100,
      stock: null,
      metadata: JSON.stringify({ days: 1 }),
    },
    {
      key: 'custom_badge',
      name: 'Özel Rozet',
      description: 'Kendi özel rozetini oluştur',
      icon: '🎨',
      category: 'special',
      price: 1000,
      stock: 50,
      metadata: JSON.stringify({ customizable: true }),
    },
    {
      key: 'name_color_rainbow',
      name: 'Gökkuşağı İsim',
      description: 'İsmini gökkuşağı renginde göster',
      icon: '🌈',
      category: 'cosmetic',
      price: 400,
      stock: null,
      metadata: JSON.stringify({ effect: 'rainbow' }),
    },
  ]

  for (const item of shopItems) {
    await prisma.shopItem.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    })
  }

  console.log('✅ Shop items created')

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

import { PrismaClient, ShopCategory } from '@prisma/client'
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
    // === PROFIL ÇERÇEVELERİ (Cosmetic) ===
    {
      key: 'profile_frame_gold',
      name: 'Altın Çerçeve',
      description: 'Profiline özel altın çerçeve ekle. Prestijini göster!',
      icon: '🏆',
      category: ShopCategory.cosmetic as const,
      price: 500,
      stock: null,
      sortOrder: 1,
      metadata: JSON.stringify({ color: 'gold', rarity: 'epic', type: 'frame' }),
    },
    {
      key: 'profile_frame_silver',
      name: 'Gümüş Çerçeve',
      description: 'Profiline özel gümüş çerçeve ekle',
      icon: '🥈',
      category: ShopCategory.cosmetic,
      price: 250,
      stock: null,
      sortOrder: 2,
      metadata: JSON.stringify({ color: 'silver', rarity: 'rare', type: 'frame' }),
    },
    {
      key: 'profile_frame_diamond',
      name: 'Elmas Çerçeve',
      description: 'En nadir çerçeve! Profilinde parla',
      icon: '💎',
      category: ShopCategory.cosmetic,
      price: 1000,
      stock: null,
      sortOrder: 3,
      metadata: JSON.stringify({ color: 'diamond', rarity: 'legendary', type: 'frame' }),
    },
    {
      key: 'profile_frame_rainbow',
      name: 'Gökkuşağı Çerçeve',
      description: 'Renkli ve eğlenceli çerçeve',
      icon: '🌈',
      category: ShopCategory.cosmetic,
      price: 600,
      stock: null,
      sortOrder: 4,
      metadata: JSON.stringify({ color: 'rainbow', rarity: 'epic', type: 'frame' }),
    },
    {
      key: 'profile_frame_fire',
      name: 'Ateş Çerçeve',
      description: 'Profilini ateşle çevrele!',
      icon: '🔥',
      category: ShopCategory.cosmetic,
      price: 450,
      stock: null,
      sortOrder: 5,
      metadata: JSON.stringify({ color: 'fire', rarity: 'epic', type: 'frame' }),
    },
    {
      key: 'profile_frame_ice',
      name: 'Buz Çerçeve',
      description: 'Soğuk ve havalı görün',
      icon: '❄️',
      category: ShopCategory.cosmetic,
      price: 450,
      stock: null,
      sortOrder: 6,
      metadata: JSON.stringify({ color: 'ice', rarity: 'epic', type: 'frame' }),
    },

    // === İSİM RENKLERİ (Cosmetic) ===
    {
      key: 'name_color_rainbow',
      name: 'Gökkuşağı İsim',
      description: 'İsmini gökkuşağı renginde göster',
      icon: '🌈',
      category: ShopCategory.cosmetic,
      price: 400,
      stock: null,
      sortOrder: 10,
      metadata: JSON.stringify({ effect: 'rainbow', type: 'nameColor' }),
    },
    {
      key: 'name_color_gold',
      name: 'Altın İsim',
      description: 'İsmini altın renginde göster',
      icon: '✨',
      category: ShopCategory.cosmetic,
      price: 350,
      stock: null,
      sortOrder: 11,
      metadata: JSON.stringify({ effect: 'gold', type: 'nameColor' }),
    },
    {
      key: 'name_color_red',
      name: 'Kırmızı İsim',
      description: 'İsmini kırmızı renginde göster',
      icon: '❤️',
      category: ShopCategory.cosmetic,
      price: 200,
      stock: null,
      sortOrder: 12,
      metadata: JSON.stringify({ effect: 'red', type: 'nameColor' }),
    },
    {
      key: 'name_color_blue',
      name: 'Mavi İsim',
      description: 'İsmini mavi renginde göster',
      icon: '💙',
      category: ShopCategory.cosmetic,
      price: 200,
      stock: null,
      sortOrder: 13,
      metadata: JSON.stringify({ effect: 'blue', type: 'nameColor' }),
    },
    {
      key: 'name_color_purple',
      name: 'Mor İsim',
      description: 'İsmini mor renginde göster',
      icon: '💜',
      category: ShopCategory.cosmetic,
      price: 200,
      stock: null,
      sortOrder: 14,
      metadata: JSON.stringify({ effect: 'purple', type: 'nameColor' }),
    },

    // === PROFIL TEMAları (Cosmetic) ===
    {
      key: 'theme_dark',
      name: 'Karanlık Tema',
      description: 'Profiline karanlık tema uygula',
      icon: '🌙',
      category: ShopCategory.cosmetic,
      price: 300,
      stock: null,
      sortOrder: 20,
      metadata: JSON.stringify({ theme: 'dark', type: 'theme' }),
    },
    {
      key: 'theme_ocean',
      name: 'Okyanus Teması',
      description: 'Profiline okyanus teması uygula',
      icon: '🌊',
      category: ShopCategory.cosmetic,
      price: 350,
      stock: null,
      sortOrder: 21,
      metadata: JSON.stringify({ theme: 'ocean', type: 'theme' }),
    },
    {
      key: 'theme_sunset',
      name: 'Gün Batımı Teması',
      description: 'Profiline gün batımı teması uygula',
      icon: '🌅',
      category: ShopCategory.cosmetic,
      price: 350,
      stock: null,
      sortOrder: 22,
      metadata: JSON.stringify({ theme: 'sunset', type: 'theme' }),
    },
    {
      key: 'theme_forest',
      name: 'Orman Teması',
      description: 'Profiline orman teması uygula',
      icon: '🌲',
      category: ShopCategory.cosmetic,
      price: 350,
      stock: null,
      sortOrder: 23,
      metadata: JSON.stringify({ theme: 'forest', type: 'theme' }),
    },

    // === BOOST ÜRÜNLERİ ===
    {
      key: 'xp_boost_2x',
      name: '2x XP Boost',
      description: '24 saat boyunca 2 kat XP kazan',
      icon: '⚡',
      category: ShopCategory.boost,
      price: 300,
      stock: null,
      sortOrder: 30,
      metadata: JSON.stringify({ duration: 24, multiplier: 2, type: 'xpBoost' }),
    },
    {
      key: 'xp_boost_3x',
      name: '3x XP Boost',
      description: '12 saat boyunca 3 kat XP kazan',
      icon: '⚡⚡',
      category: ShopCategory.boost,
      price: 500,
      stock: null,
      sortOrder: 31,
      metadata: JSON.stringify({ duration: 12, multiplier: 3, type: 'xpBoost' }),
    },
    {
      key: 'coin_boost_2x',
      name: '2x Coin Boost',
      description: '24 saat boyunca 2 kat coin kazan',
      icon: '🪙',
      category: ShopCategory.boost,
      price: 400,
      stock: null,
      sortOrder: 32,
      metadata: JSON.stringify({ duration: 24, multiplier: 2, type: 'coinBoost' }),
    },

    // === KURTARMA ÜRÜNLERİ ===
    {
      key: 'streak_freeze',
      name: 'Seri Dondurma',
      description: '1 gün seri kaybını engelle',
      icon: '❄️',
      category: ShopCategory.recovery,
      price: 100,
      stock: null,
      sortOrder: 40,
      metadata: JSON.stringify({ days: 1, type: 'streakFreeze' }),
    },
    {
      key: 'streak_freeze_3',
      name: '3x Seri Dondurma',
      description: '3 gün seri kaybını engelle',
      icon: '❄️❄️❄️',
      category: ShopCategory.recovery,
      price: 250,
      stock: null,
      sortOrder: 41,
      metadata: JSON.stringify({ days: 3, type: 'streakFreeze' }),
    },

    // === ÖZEL ÜRÜNLER ===
    {
      key: 'custom_badge',
      name: 'Özel Rozet',
      description: 'Kendi özel rozetini oluştur',
      icon: '🎨',
      category: ShopCategory.special,
      price: 1000,
      stock: 50,
      sortOrder: 50,
      metadata: JSON.stringify({ customizable: true, type: 'badge' }),
    },
    {
      key: 'title_champion',
      name: 'Şampiyon Unvanı',
      description: 'Profilinde "Şampiyon" unvanını göster',
      icon: '👑',
      category: ShopCategory.special,
      price: 800,
      stock: null,
      sortOrder: 51,
      metadata: JSON.stringify({ title: 'Şampiyon', type: 'title' }),
    },
    {
      key: 'title_legend',
      name: 'Efsane Unvanı',
      description: 'Profilinde "Efsane" unvanını göster',
      icon: '⭐',
      category: ShopCategory.special,
      price: 1200,
      stock: null,
      sortOrder: 52,
      metadata: JSON.stringify({ title: 'Efsane', type: 'title' }),
    },
    {
      key: 'title_master',
      name: 'Usta Unvanı',
      description: 'Profilinde "Usta" unvanını göster',
      icon: '🎯',
      category: ShopCategory.special,
      price: 600,
      stock: null,
      sortOrder: 53,
      metadata: JSON.stringify({ title: 'Usta', type: 'title' }),
    },
    {
      key: 'title_warrior',
      name: 'Savaşçı Unvanı',
      description: 'Profilinde "Savaşçı" unvanını göster',
      icon: '⚔️',
      category: ShopCategory.special,
      price: 500,
      stock: null,
      sortOrder: 54,
      metadata: JSON.stringify({ title: 'Savaşçı', type: 'title' }),
    },
    {
      key: 'custom_emoji',
      name: 'Özel Emoji',
      description: 'Profilinde özel emoji kullan',
      icon: '😎',
      category: ShopCategory.special,
      price: 300,
      stock: null,
      sortOrder: 55,
      metadata: JSON.stringify({ customizable: true, type: 'emoji' }),
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

  // Create Season and Leagues
  const now = new Date()
  const seasonStart = new Date(now.getFullYear(), now.getMonth(), 1) // Bu ayın 1'i
  const seasonEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59) // Bu ayın son günü

  const season = await prisma.season.upsert({
    where: { id: 'default-season' },
    update: {},
    create: {
      id: 'default-season',
      name: `${now.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })} Sezonu`,
      description: 'Yarış, puan kazan ve ligde yüksel!',
      startDate: seasonStart,
      endDate: seasonEnd,
      isActive: true,
    },
  })

  console.log('✅ Season created')

  // Create Leagues
  const leagues = [
    {
      tier: 'bronze' as const,
      name: 'Bronz Ligi',
      description: 'Yolculuğun başlangıcı',
      minPoints: 0,
      maxPoints: 999,
      icon: '🥉',
    },
    {
      tier: 'silver' as const,
      name: 'Gümüş Ligi',
      description: 'İlerliyorsun!',
      minPoints: 1000,
      maxPoints: 2499,
      icon: '🥈',
    },
    {
      tier: 'gold' as const,
      name: 'Altın Ligi',
      description: 'Harika gidiyorsun',
      minPoints: 2500,
      maxPoints: 4999,
      icon: '🥇',
    },
    {
      tier: 'platinum' as const,
      name: 'Platin Ligi',
      description: 'Elit seviyedesin',
      minPoints: 5000,
      maxPoints: 9999,
      icon: '💎',
    },
    {
      tier: 'diamond' as const,
      name: 'Elmas Ligi',
      description: 'En iyilerin arasındasın!',
      minPoints: 10000,
      maxPoints: null,
      icon: '💠',
    },
  ]

  for (const league of leagues) {
    await prisma.league.upsert({
      where: {
        seasonId_tier: {
          seasonId: season.id,
          tier: league.tier,
        },
      },
      update: {},
      create: {
        seasonId: season.id,
        ...league,
      },
    })
  }

  console.log('✅ Leagues created')

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

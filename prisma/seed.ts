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

  // Create Blog Categories
  const blogCategories = [
    {
      name: 'Beslenme',
      slug: 'beslenme',
      description: 'Sağlıklı beslenme, diyet ve besin değerleri hakkında bilgiler',
      icon: '🥗',
      color: '#10b981',
      order: 1,
    },
    {
      name: 'Egzersiz',
      slug: 'egzersiz',
      description: 'Spor, fitness ve egzersiz programları',
      icon: '💪',
      color: '#3b82f6',
      order: 2,
    },
    {
      name: 'Motivasyon',
      slug: 'motivasyon',
      description: 'Motivasyon hikayeleri ve ilham verici içerikler',
      icon: '⭐',
      color: '#f59e0b',
      order: 3,
    },
    {
      name: 'Tarifler',
      slug: 'tarifler',
      description: 'Sağlıklı ve lezzetli tarifler',
      icon: '🍳',
      color: '#ef4444',
      order: 4,
    },
    {
      name: 'Sağlık',
      slug: 'saglik',
      description: 'Genel sağlık, wellness ve yaşam tarzı',
      icon: '❤️',
      color: '#ec4899',
      order: 5,
    },
    {
      name: 'Psikoloji',
      slug: 'psikoloji',
      description: 'Duygusal yeme, stres yönetimi ve zihinsel sağlık',
      icon: '🧠',
      color: '#8b5cf6',
      order: 6,
    },
    {
      name: 'Başarı Hikayeleri',
      slug: 'basari-hikayeleri',
      description: 'Gerçek kullanıcı deneyimleri ve dönüşüm hikayeleri',
      icon: '🏆',
      color: '#f97316',
      order: 7,
    },
    {
      name: 'Yaşam Tarzı',
      slug: 'yasam-tarzi',
      description: 'Günlük alışkanlıklar, uyku ve yaşam kalitesi',
      icon: '🌟',
      color: '#06b6d4',
      order: 8,
    },
    {
      name: 'Uzman Tavsiyeleri',
      slug: 'uzman-tavsiyeleri',
      description: 'Diyetisyen, doktor ve antrenörlerden profesyonel öneriler',
      icon: '👨‍⚕️',
      color: '#14b8a6',
      order: 9,
    },
    {
      name: 'Hızlı İpuçları',
      slug: 'hizli-ipuclari',
      description: 'Pratik ve uygulanabilir günlük ipuçları',
      icon: '💡',
      color: '#eab308',
      order: 10,
    },
  ]

  for (const category of blogCategories) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('✅ Blog categories created')

  // Create sample blog posts
  const beslenmeCategory = await prisma.blogCategory.findUnique({ where: { slug: 'beslenme' } })
  const egzersizCategory = await prisma.blogCategory.findUnique({ where: { slug: 'egzersiz' } })
  const motivasyonCategory = await prisma.blogCategory.findUnique({ where: { slug: 'motivasyon' } })
  const tariflerCategory = await prisma.blogCategory.findUnique({ where: { slug: 'tarifler' } })
  const saglikCategory = await prisma.blogCategory.findUnique({ where: { slug: 'saglik' } })

  if (beslenmeCategory && egzersizCategory && motivasyonCategory && tariflerCategory && saglikCategory) {
    const samplePosts = [
      {
        title: 'Sağlıklı Kilo Vermenin 10 Altın Kuralı',
        slug: 'saglikli-kilo-vermenin-10-altin-kurali',
        content: `<h2>Giriş</h2>
<p>Sağlıklı kilo vermek, sadece daha iyi görünmekle ilgili değil; aynı zamanda genel sağlığınızı iyileştirmek ve yaşam kalitenizi artırmakla ilgilidir. Bu yazıda, sürdürülebilir ve sağlıklı kilo verme yolculuğunuzda size rehberlik edecek 10 temel kuralı paylaşacağız.</p>

<h2>1. Gerçekçi Hedefler Belirleyin</h2>
<p>Haftada 0.5-1 kg kilo vermek sağlıklı ve sürdürülebilir bir hedeftir. Aşırı hızlı kilo verme, kas kaybına ve metabolizmanın yavaşlamasına neden olabilir.</p>

<h2>2. Kalori Açığı Oluşturun</h2>
<p>Kilo vermek için harcadığınız kaloriden daha az kalori almanız gerekir. Ancak bu açık çok büyük olmamalı - günlük 500-750 kalori açığı idealdir.</p>

<h2>3. Protein Tüketiminizi Artırın</h2>
<p>Protein, tokluk hissi verir, kas kütlesini korur ve metabolizmayı hızlandırır. Her öğünde kaliteli protein kaynağı bulundurun.</p>

<h2>4. Bol Su İçin</h2>
<p>Günde en az 2-3 litre su içmek, metabolizmayı hızlandırır ve açlık hissini azaltır. Bazen susuzluğu açlıkla karıştırabiliriz.</p>

<h2>5. Düzenli Egzersiz Yapın</h2>
<p>Haftada en az 150 dakika orta şiddette egzersiz yapın. Kardiyo ve kuvvet antrenmanlarını birleştirin.</p>

<h2>6. Yeterli Uyuyun</h2>
<p>Uyku eksikliği, açlık hormonlarını etkiler ve kilo vermeyi zorlaştırır. Günde 7-9 saat kaliteli uyku hedefleyin.</p>

<h2>7. Stres Yönetimi</h2>
<p>Kronik stres, kortizol seviyesini artırır ve kilo almaya neden olabilir. Meditasyon, yoga veya nefes egzersizleri deneyin.</p>

<h2>8. İşlenmiş Gıdalardan Kaçının</h2>
<p>Tam, doğal gıdaları tercih edin. İşlenmiş gıdalar genellikle yüksek kalorili ve düşük besin değerlidir.</p>

<h2>9. Öğün Atlama</h2>
<p>Düzenli öğünler, metabolizmanızı aktif tutar ve aşırı yeme isteğini önler. Günde 3 ana öğün ve 2 ara öğün ideal olabilir.</p>

<h2>10. Sabırlı Olun</h2>
<p>Kilo verme bir maraton, sprint değil. Küçük adımlarla ilerleyin ve süreçten keyif alın. Hatalar yaptığınızda kendinizi affetmeyi öğrenin.</p>

<h2>Sonuç</h2>
<p>Bu 10 kuralı hayatınıza entegre ederek, sağlıklı ve sürdürülebilir bir kilo verme yolculuğuna başlayabilirsiniz. Unutmayın, en önemli şey tutarlılıktır!</p>`,
        excerpt: 'Sağlıklı ve sürdürülebilir kilo verme için bilmeniz gereken 10 temel kural. Gerçekçi hedeflerden stres yönetimine kadar her şey bu yazıda.',
        coverImage: '/blog/saglikli-kilo-verme.jpg',
        coverImageAlt: 'Sağlıklı beslenme ve egzersiz',
        metaTitle: 'Sağlıklı Kilo Vermenin 10 Altın Kuralı | Zayıflama Planı',
        metaDescription: 'Sağlıklı kilo vermek için bilmeniz gereken 10 temel kural. Gerçekçi hedefler, kalori açığı, protein tüketimi ve daha fazlası.',
        status: 'PUBLISHED',
        featured: true,
        featuredOrder: 1,
        authorId: admin.id,
        categoryId: beslenmeCategory.id,
        readingTime: 5,
        viewCount: 245,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 gün önce
      },
      {
        title: 'Evde Yapabileceğiniz 15 Dakikalık HIIT Antrenmanı',
        slug: 'evde-yapabileceginiz-15-dakikalik-hiit-antrenman',
        content: `<h2>HIIT Nedir?</h2>
<p>HIIT (High Intensity Interval Training), yüksek yoğunluklu egzersizlerin kısa dinlenme periyotlarıyla birleştirildiği bir antrenman yöntemidir. Kısa sürede maksimum kalori yakar ve metabolizmayı saatlerce hızlı tutar.</p>

<h2>Isınma (3 dakika)</h2>
<ul>
<li>Yerinde yürüyüş - 1 dakika</li>
<li>Kol çevirme - 30 saniye</li>
<li>Bacak sallamaları - 30 saniye</li>
<li>Hafif zıplamalar - 1 dakika</li>
</ul>

<h2>Ana Antrenman (10 dakika)</h2>
<p>Her hareketi 40 saniye yapın, 20 saniye dinlenin. 2 tur tekrarlayın.</p>

<h3>1. Jumping Jacks</h3>
<p>Klasik bir kardiyo hareketi. Kollarınızı ve bacaklarınızı açıp kapatarak zıplayın.</p>

<h3>2. Squat</h3>
<p>Ayaklar omuz genişliğinde, kalçayı geriye iterek çömelme hareketi yapın.</p>

<h3>3. Mountain Climbers</h3>
<p>Plank pozisyonunda, dizlerinizi göğsünüze doğru hızlıca çekin.</p>

<h3>4. Burpees</h3>
<p>Tam vücut hareketi: Çömel, plank yap, şınav çek, zıpla.</p>

<h3>5. High Knees</h3>
<p>Yerinde koşarken dizlerinizi mümkün olduğunca yukarı kaldırın.</p>

<h2>Soğuma (2 dakika)</h2>
<ul>
<li>Yavaş yürüyüş - 1 dakika</li>
<li>Germe hareketleri - 1 dakika</li>
</ul>

<h2>İpuçları</h2>
<ul>
<li>Hareketleri doğru formda yapmaya odaklanın</li>
<li>Kendi temponu bul, aşırı zorlama</li>
<li>Haftada 3-4 kez yapabilirsiniz</li>
<li>Bol su için</li>
</ul>

<h2>Sonuç</h2>
<p>Bu 15 dakikalık HIIT antrenmanı, yoğun bir gününüzde bile yapabileceğiniz etkili bir egzersizdir. Düzenli yapıldığında harika sonuçlar verir!</p>`,
        excerpt: 'Sadece 15 dakikada evde yapabileceğiniz etkili HIIT antrenmanı. Ekipman gerektirmez, maksimum kalori yakar!',
        coverImage: '/blog/hiit-antrenman.jpg',
        coverImageAlt: 'HIIT antrenmanı yapan kişi',
        metaTitle: '15 Dakikalık Evde HIIT Antrenmanı | Zayıflama Planı',
        metaDescription: 'Evde ekipmansız yapabileceğiniz 15 dakikalık HIIT antrenmanı. Maksimum kalori yakın, fit kalın!',
        status: 'PUBLISHED',
        featured: true,
        featuredOrder: 2,
        authorId: admin.id,
        categoryId: egzersizCategory.id,
        readingTime: 4,
        viewCount: 189,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 gün önce
      },
      {
        title: '30 Kilo Verdim: Benim Hikayem',
        slug: '30-kilo-verdim-benim-hikayem',
        content: `<h2>Başlangıç</h2>
<p>Merhaba! Ben Ayşe, 32 yaşındayım ve 18 ayda 30 kilo verdim. Bu yazıda sizlerle yolculuğumu, zorluklarımı ve başarı sırlarımı paylaşmak istiyorum.</p>

<h2>Neden Karar Verdim?</h2>
<p>95 kiloydum ve kendimi hiç iyi hissetmiyordum. Merdiven çıkarken nefes nefese kalıyor, eski kıyafetlerim artık olmuyor, fotoğraf çektirilmekten kaçınıyordum. Bir gün aynaya baktım ve "yeter" dedim.</p>

<h2>İlk Adımlar</h2>
<p>Önce küçük değişikliklerle başladım:</p>
<ul>
<li>Şekerli içecekleri bıraktım</li>
<li>Porsiyon kontrolü yapmaya başladım</li>
<li>Günde 10.000 adım yürümeye başladım</li>
<li>Su tüketimimi artırdım</li>
</ul>

<h2>Zorluklar</h2>
<p>Tabii ki her şey pembe değildi. İlk 3 ay çok zordu. Sosyal ortamlarda yemek seçmek, arkadaşlarımın "bir tane yesen ne olur" baskısı, plato dönemleri... Ama pes etmedim.</p>

<h2>Dönüm Noktası</h2>
<p>4. ayda spor salonuna yazdım. Başta çok utanıyordum ama herkes kendi işine bakıyordu. Kuvvet antrenmanı yapmaya başladığımda her şey değişti. Sadece kilo vermekle kalmadım, vücudum şekillendi.</p>

<h2>Beslenme Düzenim</h2>
<ul>
<li><strong>Kahvaltı:</strong> Yumurta, tam buğday ekmeği, avokado</li>
<li><strong>Ara öğün:</strong> Meyve veya kuruyemiş</li>
<li><strong>Öğle:</strong> Izgara tavuk/balık, salata, bulgur</li>
<li><strong>Ara öğün:</strong> Yoğurt veya protein bar</li>
<li><strong>Akşam:</strong> Sebze yemeği, protein kaynağı</li>
</ul>

<h2>Egzersiz Programım</h2>
<ul>
<li>Pazartesi, Çarşamba, Cuma: Kuvvet antrenmanı (45 dk)</li>
<li>Salı, Perşembe: Kardiyo (30 dk)</li>
<li>Cumartesi: Aktif dinlenme (yürüyüş, yoga)</li>
<li>Pazar: Tam dinlenme</li>
</ul>

<h2>Öğrendiklerim</h2>
<ol>
<li>Kilo verme bir maraton, sprint değil</li>
<li>Mükemmel olmak zorunda değilsiniz</li>
<li>Kendinizi sevmek en önemlisi</li>
<li>Destek sistemi çok önemli</li>
<li>Sabır ve tutarlılık her şeydir</li>
</ol>

<h2>Şimdi</h2>
<p>65 kiloyum ve kendimi harika hissediyorum. Enerji doluyum, özgüvenim arttı, sağlığım çok daha iyi. Ama en önemlisi, artık sağlıklı yaşamı bir diyet değil, yaşam tarzı olarak görüyorum.</p>

<h2>Size Tavsiyem</h2>
<p>Eğer siz de bu yolculuğa başlamayı düşünüyorsanız, bugün başlayın. Mükemmel zamanı beklemeyin. Küçük adımlarla başlayın ve asla pes etmeyin. Siz de yapabilirsiniz!</p>`,
        excerpt: '18 ayda 30 kilo veren Ayşe\'nin ilham verici hikayesi. Zorluklardan başarıya giden yolda neler yaşadı?',
        coverImage: '/blog/basari-hikayesi.jpg',
        coverImageAlt: 'Başarı hikayesi - önce ve sonra',
        metaTitle: '30 Kilo Verdim: İlham Verici Başarı Hikayesi | Zayıflama Planı',
        metaDescription: '18 ayda 30 kilo veren Ayşe\'nin gerçek hikayesi. Zorluklardan başarıya giden yolda neler yaşadı, nasıl başardı?',
        status: 'PUBLISHED',
        featured: true,
        featuredOrder: 3,
        authorId: admin.id,
        categoryId: motivasyonCategory.id,
        readingTime: 6,
        viewCount: 412,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 gün önce
      },
      {
        title: 'Protein Pancake Tarifi: Sağlıklı ve Lezzetli',
        slug: 'protein-pancake-tarifi-saglikli-ve-lezzetli',
        content: `<h2>Malzemeler</h2>
<ul>
<li>1 orta boy muz</li>
<li>2 yumurta</li>
<li>30g yulaf unu</li>
<li>1 ölçek protein tozu (vanilya)</li>
<li>1 çay kaşığı kabartma tozu</li>
<li>Tarçın (isteğe bağlı)</li>
<li>Hindistan cevizi yağı (pişirmek için)</li>
</ul>

<h2>Besin Değerleri (1 porsiyon)</h2>
<ul>
<li><strong>Kalori:</strong> 320 kcal</li>
<li><strong>Protein:</strong> 28g</li>
<li><strong>Karbonhidrat:</strong> 35g</li>
<li><strong>Yağ:</strong> 8g</li>
</ul>

<h2>Hazırlanışı</h2>

<h3>Adım 1: Hamuru Hazırlayın</h3>
<p>Muzu bir kaseye alın ve çatalla ezin. Yumurtaları ekleyin ve iyice karıştırın.</p>

<h3>Adım 2: Kuru Malzemeleri Ekleyin</h3>
<p>Yulaf unu, protein tozu, kabartma tozu ve tarçını ekleyin. Pürüzsüz bir hamur elde edene kadar karıştırın.</p>

<h3>Adım 3: Pişirin</h3>
<p>Yapışmaz bir tavayı orta ateşte ısıtın. Hindistan cevizi yağı sürün. Hamurdan kepçe ile alıp tavaya dökün. Her iki tarafı da 2-3 dakika pişirin.</p>

<h3>Adım 4: Servis Yapın</h3>
<p>Pancake'leri tabağa alın. Üzerine taze meyveler, bal veya fıstık ezmesi ekleyebilirsiniz.</p>

<h2>İpuçları</h2>
<ul>
<li>Hamur çok koyu olursa biraz süt ekleyebilirsiniz</li>
<li>Tavayı çok sıcak yapmayın, yanabilir</li>
<li>Önceden hazırlayıp buzdolabında saklayabilirsiniz</li>
<li>Dondurucuda 1 ay saklanabilir</li>
</ul>

<h2>Varyasyonlar</h2>

<h3>Çikolatalı Versiyon</h3>
<p>1 yemek kaşığı kakao tozu ekleyin ve çikolata parçacıkları serpin.</p>

<h3>Yaban Mersinli Versiyon</h3>
<p>Hamura bir avuç yaban mersini ekleyin.</p>

<h3>Fıstık Ezmeli Versiyon</h3>
<p>Hamura 1 yemek kaşığı fıstık ezmesi ekleyin.</p>

<h2>Neden Bu Tarif?</h2>
<p>Bu protein pancake tarifi, yüksek protein içeriği sayesinde tokluk hissi verir ve kas yapımını destekler. Kahvaltıda veya antrenman sonrası mükemmel bir seçenektir. Ayrıca çok lezzetli!</p>

<h2>Sonuç</h2>
<p>Sağlıklı beslenmenin sıkıcı olması gerekmiyor. Bu protein pancake tarifi hem lezzetli hem de besleyici. Hemen deneyin!</p>`,
        excerpt: 'Yüksek proteinli, düşük kalorili ve çok lezzetli pancake tarifi. Kahvaltıda veya antrenman sonrası ideal!',
        coverImage: '/blog/protein-pancake.jpg',
        coverImageAlt: 'Protein pancake tabağı',
        metaTitle: 'Protein Pancake Tarifi: Sağlıklı Kahvaltı | Zayıflama Planı',
        metaDescription: 'Yüksek proteinli, düşük kalorili protein pancake tarifi. Sadece 5 malzeme ile hazırlayın!',
        status: 'PUBLISHED',
        featured: false,
        authorId: admin.id,
        categoryId: tariflerCategory.id,
        readingTime: 3,
        viewCount: 156,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 gün önce
      },
      {
        title: 'Su İçmenin Kilo Vermeye Etkisi',
        slug: 'su-icmenin-kilo-vermeye-etkisi',
        content: `<h2>Giriş</h2>
<p>Su içmek, kilo verme sürecinde en çok göz ardı edilen faktörlerden biridir. Ancak yeterli su tüketimi, metabolizmayı hızlandırır ve kilo vermeyi kolaylaştırır. Bu yazıda, suyun kilo vermeye etkilerini bilimsel açıdan inceleyeceğiz.</p>

<h2>Su ve Metabolizma</h2>
<p>Araştırmalar, 500 ml su içmenin metabolizmayı %30 oranında hızlandırdığını gösteriyor. Bu etki yaklaşık 30-40 dakika sürer. Günde 2 litre su içmek, ekstra 96 kalori yakmanıza yardımcı olabilir.</p>

<h2>Tokluk Hissi</h2>
<p>Yemeklerden önce 1-2 bardak su içmek, tokluk hissini artırır ve daha az kalori almanıza yardımcı olur. Bir çalışmada, yemek öncesi su içen kişilerin %44 daha fazla kilo verdiği bulunmuş.</p>

<h2>Susuzluk vs Açlık</h2>
<p>Beyin bazen susuzluğu açlıkla karıştırabilir. Su içmek, gereksiz atıştırmaları önleyebilir. Açlık hissettiğinizde önce bir bardak su için ve 10 dakika bekleyin.</p>

<h2>Günde Ne Kadar Su İçmeliyiz?</h2>
<ul>
<li><strong>Kadınlar:</strong> 2-2.5 litre</li>
<li><strong>Erkekler:</strong> 2.5-3 litre</li>
<li><strong>Egzersiz yapıyorsanız:</strong> +500-1000 ml</li>
<li><strong>Sıcak havalarda:</strong> +500-1000 ml</li>
</ul>

<h2>Su İçme İpuçları</h2>

<h3>1. Sabah Kalkar Kalkmaz</h3>
<p>Uyandığınızda 1-2 bardak su için. Bu metabolizmayı uyandırır.</p>

<h3>2. Her Öğün Öncesi</h3>
<p>Yemeklerden 30 dakika önce su için.</p>

<h3>3. Hatırlatıcı Kullanın</h3>
<p>Telefon uygulamaları veya alarm kurun.</p>

<h3>4. Şişe Taşıyın</h3>
<p>Yanınızda her zaman su şişesi bulundurun.</p>

<h3>5. Lezzet Katın</h3>
<p>Limon, salatalık veya nane ekleyerek suyu daha lezzetli hale getirin.</p>

<h2>Suyun Diğer Faydaları</h2>
<ul>
<li>Cildi nemlendirir ve parlatır</li>
<li>Toksinleri atar</li>
<li>Enerji seviyesini artırır</li>
<li>Baş ağrısını önler</li>
<li>Sindirim sistemini düzenler</li>
<li>Böbrek sağlığını korur</li>
</ul>

<h2>Dikkat Edilmesi Gerekenler</h2>
<p>Aşırı su tüketimi (günde 4-5 litreden fazla) hiponatremi (kan sodyum seviyesinin düşmesi) riskini artırabilir. Dengeli olun.</p>

<h2>Sonuç</h2>
<p>Su içmek, kilo verme yolculuğunuzda en basit ama en etkili adımlardan biridir. Bugün su tüketiminizi artırın ve farkı görün!</p>`,
        excerpt: 'Su içmenin kilo vermeye bilimsel olarak kanıtlanmış etkileri. Metabolizmayı hızlandırır, tokluk hissi verir.',
        coverImage: '/blog/su-icmek.jpg',
        coverImageAlt: 'Su içen kişi',
        metaTitle: 'Su İçmenin Kilo Vermeye Etkisi | Bilimsel Açıklama',
        metaDescription: 'Su içmenin kilo vermeye bilimsel olarak kanıtlanmış etkileri. Günde ne kadar su içmelisiniz?',
        status: 'PUBLISHED',
        featured: false,
        authorId: admin.id,
        categoryId: saglikCategory.id,
        readingTime: 4,
        viewCount: 98,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 gün önce
      },
    ]

    for (const post of samplePosts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: {},
        create: post,
      })
    }

    console.log('✅ Sample blog posts created')

    // Create sample blog tags
    const blogTags = [
      { name: 'Kilo Verme', slug: 'kilo-verme' },
      { name: 'Protein', slug: 'protein' },
      { name: 'Kalori', slug: 'kalori' },
      { name: 'Egzersiz', slug: 'egzersiz' },
      { name: 'HIIT', slug: 'hiit' },
      { name: 'Kardiyo', slug: 'kardiyo' },
      { name: 'Kuvvet Antrenmanı', slug: 'kuvvet-antrenman' },
      { name: 'Motivasyon', slug: 'motivasyon' },
      { name: 'Başarı Hikayesi', slug: 'basari-hikayesi' },
      { name: 'Sağlıklı Beslenme', slug: 'saglikli-beslenme' },
      { name: 'Tarif', slug: 'tarif' },
      { name: 'Kahvaltı', slug: 'kahvalti' },
      { name: 'Yüksek Protein', slug: 'yuksek-protein' },
      { name: 'Düşük Kalori', slug: 'dusuk-kalori' },
      { name: 'Su İçmek', slug: 'su-icmek' },
      { name: 'Metabolizma', slug: 'metabolizma' },
      { name: 'Sağlık', slug: 'saglik' },
      { name: 'Diyet', slug: 'diyet' },
      { name: 'Fitness', slug: 'fitness' },
      { name: 'Yaşam Tarzı', slug: 'yasam-tarzi' },
      { name: 'İpuçları', slug: 'ipuclari' },
      { name: 'Beslenme', slug: 'beslenme' },
      { name: 'Antrenman', slug: 'antrenman' },
      { name: 'Evde Egzersiz', slug: 'evde-egzersiz' },
      { name: 'Yağ Yakma', slug: 'yag-yakma' },
    ]

    for (const tag of blogTags) {
      await prisma.blogTag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag,
      })
    }

    console.log('✅ Sample blog tags created')
  }

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

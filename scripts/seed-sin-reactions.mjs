import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const reactions = [
  // Tatlı
  { sinType: 'tatli', reactionText: 'Tatlı da haklı… ama sen daha haklısın 🍫' },
  { sinType: 'tatli', reactionText: 'Bir dilimle başladı, bir pasta bitti 🎂' },
  { sinType: 'tatli', reactionText: 'Şeker kanına değil, kalbine dokunmuş belli 💘' },
  { sinType: 'tatli', reactionText: 'Tatlı tatlı günah işlemişsin 😋' },
  { sinType: 'tatli', reactionText: 'Şeker orucu yarın başlar artık 🙈' },
  
  // Fast Food
  { sinType: 'fastfood', reactionText: 'Patates kızartması seni kandırıyor 👀' },
  { sinType: 'fastfood', reactionText: 'Fast food: hızlı gelir, yavaş gider 🍟' },
  { sinType: 'fastfood', reactionText: 'Köfte burger savaşı yine başladı ⚔️' },
  { sinType: 'fastfood', reactionText: 'Drive-thru vicdanını da götürmüş 🚗' },
  { sinType: 'fastfood', reactionText: 'Menü büyük, pişmanlık daha büyük 🍔' },
  
  // Gazlı İçecek
  { sinType: 'gazli', reactionText: 'Köpük değil, motivasyon patlasın 🥂' },
  { sinType: 'gazli', reactionText: 'Bardağın yarısı şeker dolu 😜' },
  { sinType: 'gazli', reactionText: 'Gaz gibi motive ol 💨' },
  { sinType: 'gazli', reactionText: 'Kabarcıklar vicdanını gıdıklıyor 🫧' },
  { sinType: 'gazli', reactionText: 'Zero değil, hero olacaktın 🦸' },
  
  // Alkol
  { sinType: 'alkol', reactionText: 'Su içmeyi unutma dostum 💧' },
  { sinType: 'alkol', reactionText: 'Bir yudum keyif, ama sabah pişmanlık bonusu 😅' },
  { sinType: 'alkol', reactionText: 'Kadeh kaldırmışsın, motivasyon düşmüş 🍷' },
  { sinType: 'alkol', reactionText: 'Şerefe! Ama yarın spor şart 🏃' },
  { sinType: 'alkol', reactionText: 'Alkol alındı, kalori sayacı ağladı 😢' },
  
  // Diğer
  { sinType: 'diger', reactionText: 'Bu kategoriye özel günah icat ettin resmen 😈' },
  { sinType: 'diger', reactionText: 'Karnın tok, vicdanın yumuşak olsun 🍽️' },
  { sinType: 'diger', reactionText: 'Yaratıcı günah işliyorsun 🎨' },
  { sinType: 'diger', reactionText: 'Bu ne biçim kaçamak böyle? 🤔' },
  { sinType: 'diger', reactionText: 'Sınıflandırılamaz ama affedilebilir 😇' },
];

const badges = [
  {
    key: 'glukozsuz_kahraman',
    name: 'Glukozsuz Kahraman 🥇',
    description: '7 gün boyunca tatlı yemeden direndi',
    icon: '🥇',
    sinType: 'tatli',
    requirement: '7 gün tatlı yememek',
    xpReward: 100,
    coinReward: 50,
  },
  {
    key: 'yagsavar',
    name: 'Yağsavar 🥈',
    description: '1 ay boyunca fast food yemedi',
    icon: '🥈',
    sinType: 'fastfood',
    requirement: '30 gün fast food yememek',
    xpReward: 200,
    coinReward: 100,
  },
  {
    key: 'dengeli_dahi',
    name: 'Dengeli Dahi 🥉',
    description: 'Kaçamak sonrası 3 gün telafi yaptı',
    icon: '🥉',
    sinType: null,
    requirement: 'Kaçamak sonrası 3 gün temiz',
    xpReward: 50,
    coinReward: 25,
  },
  {
    key: 'gizli_tatlici',
    name: 'Gizli Tatlıcı 🍩',
    description: 'Aynı gün iki tatlı girdi (mizah rozeti)',
    icon: '🍩',
    sinType: 'tatli',
    requirement: 'Aynı gün 2+ tatlı',
    xpReward: 10,
    coinReward: 5,
  },
  {
    key: 'motivasyon_melegi',
    name: 'Motivasyon Meleği 😇',
    description: '10 gün üst üste günah işlemedi',
    icon: '😇',
    sinType: null,
    requirement: '10 gün temiz',
    xpReward: 150,
    coinReward: 75,
  },
];

async function main() {
  console.log('🌱 Seeding sin reactions and badges...\n');

  // Reactions
  for (const reaction of reactions) {
    await prisma.sinReaction.upsert({
      where: {
        id: `${reaction.sinType}_${reactions.indexOf(reaction)}`,
      },
      create: {
        id: `${reaction.sinType}_${reactions.indexOf(reaction)}`,
        ...reaction,
      },
      update: reaction,
    });
  }
  console.log(`✅ Created ${reactions.length} sin reactions`);

  // Badges
  for (const badge of badges) {
    await prisma.sinBadge.upsert({
      where: { key: badge.key },
      create: badge,
      update: badge,
    });
  }
  console.log(`✅ Created ${badges.length} sin badges`);

  console.log('\n🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

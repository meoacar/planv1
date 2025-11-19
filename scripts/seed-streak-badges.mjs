import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔥 Streak rozetleri ekleniyor...');

  const streakBadges = [
    {
      key: 'streak_3',
      name: '🔥 3 Gün Ateşi',
      description: '3 gün üst üste temiz kaldın! Harika başlangıç!',
      icon: '🔥',
      requirement: '3 gün üst üste günah yapmadan geç',
      xpReward: 50,
      coinReward: 10,
    },
    {
      key: 'streak_7',
      name: '🔥 1 Hafta Şampiyonu',
      description: '1 hafta boyunca hiç günah yapmadın! İnanılmaz disiplin!',
      icon: '🔥',
      requirement: '7 gün üst üste günah yapmadan geç',
      xpReward: 100,
      coinReward: 25,
    },
    {
      key: 'streak_14',
      name: '🔥 2 Hafta Efsanesi',
      description: '2 hafta temiz! Sen bir efsanesin!',
      icon: '🔥',
      requirement: '14 gün üst üste günah yapmadan geç',
      xpReward: 200,
      coinReward: 50,
    },
    {
      key: 'streak_30',
      name: '🔥 1 Ay Ustası',
      description: 'Tam 1 ay! Artık bu bir yaşam tarzı!',
      icon: '🔥',
      requirement: '30 gün üst üste günah yapmadan geç',
      xpReward: 500,
      coinReward: 100,
    },
    {
      key: 'streak_60',
      name: '🔥 2 Ay Titanı',
      description: '2 ay boyunca mükemmel! Seni durduramaz!',
      icon: '🔥',
      requirement: '60 gün üst üste günah yapmadan geç',
      xpReward: 1000,
      coinReward: 200,
    },
    {
      key: 'streak_90',
      name: '🔥 3 Ay Tanrısı',
      description: '3 ay! Sen artık bir tanrısın!',
      icon: '🔥',
      requirement: '90 gün üst üste günah yapmadan geç',
      xpReward: 2000,
      coinReward: 500,
    },
    {
      key: 'streak_180',
      name: '🔥 6 Ay Efsanesi',
      description: 'Yarım yıl! İnanılmaz bir başarı!',
      icon: '🔥',
      requirement: '180 gün üst üste günah yapmadan geç',
      xpReward: 5000,
      coinReward: 1000,
    },
    {
      key: 'streak_365',
      name: '👑 1 Yıl Kralı',
      description: 'TAM 1 YIL! Sen bir kralsın! 👑',
      icon: '👑',
      requirement: '365 gün üst üste günah yapmadan geç',
      xpReward: 10000,
      coinReward: 2500,
    },
  ];

  for (const badge of streakBadges) {
    const existing = await prisma.sinBadge.findFirst({
      where: { key: badge.key },
    });

    if (existing) {
      console.log(`✓ Rozet zaten var: ${badge.name}`);
      continue;
    }

    await prisma.sinBadge.create({
      data: badge,
    });

    console.log(`✓ Eklendi: ${badge.name}`);
  }

  console.log('\n✅ Tüm streak rozetleri eklendi!');
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

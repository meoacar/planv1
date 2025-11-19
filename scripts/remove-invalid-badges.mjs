import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function removeInvalidBadges() {
  try {
    console.log('🔍 Geçersiz rozetler kontrol ediliyor...\n');

    // Yağsavar rozetini bul
    const yagsavarBadge = await prisma.sinBadge.findUnique({
      where: { key: 'yagsavar' },
    });

    if (!yagsavarBadge) {
      console.log('❌ Yağsavar rozeti bulunamadı');
      return;
    }

    // Bu rozeti almış kullanıcıları bul
    const userBadges = await prisma.userSinBadge.findMany({
      where: { badgeId: yagsavarBadge.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    console.log(`📊 ${userBadges.length} kullanıcı Yağsavar rozetine sahip\n`);

    let removedCount = 0;

    for (const userBadge of userBadges) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Kullanıcının hesabı 30 günden yeni mi?
      if (userBadge.user.createdAt > thirtyDaysAgo) {
        console.log(`❌ Geçersiz rozet bulundu:`);
        console.log(`   Kullanıcı: ${userBadge.user.email}`);
        console.log(`   Hesap Tarihi: ${userBadge.user.createdAt.toLocaleDateString('tr-TR')}`);
        console.log(`   Rozet Tarihi: ${userBadge.earnedAt.toLocaleDateString('tr-TR')}`);

        // Rozeti sil
        await prisma.userSinBadge.delete({
          where: { id: userBadge.id },
        });

        // XP ve coin'leri geri al
        await prisma.user.update({
          where: { id: userBadge.user.id },
          data: {
            xp: { decrement: yagsavarBadge.xpReward },
            coins: { decrement: yagsavarBadge.coinReward },
          },
        });

        console.log(`   ✅ Rozet silindi, ${yagsavarBadge.xpReward} XP ve ${yagsavarBadge.coinReward} coin geri alındı\n`);
        removedCount++;
      }
    }

    if (removedCount === 0) {
      console.log('✅ Geçersiz rozet bulunamadı');
    } else {
      console.log(`\n✅ ${removedCount} geçersiz rozet silindi`);
    }
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeInvalidBadges();

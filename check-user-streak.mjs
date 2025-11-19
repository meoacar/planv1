import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserStreak() {
  try {
    const user = await prisma.user.findUnique({
      where: { username: 'adminuser' },
      select: {
        id: true,
        username: true,
        streak: true,
        lastCheckIn: true,
        createdAt: true,
      }
    });

    if (!user) {
      console.log('❌ Kullanıcı bulunamadı');
      return;
    }

    console.log('👤 Kullanıcı Bilgileri:');
    console.log('  Username:', user.username);
    console.log('  Streak:', user.streak);
    console.log('  Son Check-in:', user.lastCheckIn);
    console.log('  Üyelik:', user.createdAt);

    // Food sins kontrolü
    const foodSins = await prisma.foodSin.findMany({
      where: { userId: user.id },
      orderBy: { sinDate: 'desc' },
      take: 10,
      select: {
        id: true,
        sinDate: true,
        sinType: true,
        createdAt: true,
      }
    });

    console.log('\n🍔 Son 10 Günah Kaydı:');
    if (foodSins.length === 0) {
      console.log('  Hiç günah kaydı yok');
    } else {
      foodSins.forEach((sin, i) => {
        console.log(`  ${i + 1}. ${sin.sinDate.toISOString().split('T')[0]} - ${sin.sinType}`);
      });
    }

    // Streak hesaplama
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let checkDate = new Date(today);

    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasSin = await prisma.foodSin.findFirst({
        where: {
          userId: user.id,
          sinDate: {
            gte: new Date(dateStr),
            lt: new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });

      if (hasSin) {
        // Günah var, streak kırıldı
        break;
      } else {
        // Günah yok, streak devam ediyor
        currentStreak++;
      }

      // Bir gün geriye git
      checkDate.setDate(checkDate.getDate() - 1);
    }

    console.log('\n🔥 Hesaplanan Streak:', currentStreak);
    console.log('📊 Veritabanındaki Streak:', user.streak);
    
    if (currentStreak !== user.streak) {
      console.log('\n⚠️  UYUMSUZLUK VAR!');
      console.log('   Hesaplanan:', currentStreak);
      console.log('   Veritabanı:', user.streak);
    } else {
      console.log('\n✅ Streak değerleri uyumlu');
    }

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserStreak();

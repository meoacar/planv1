import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSins() {
  try {
    const user = await prisma.user.findUnique({
      where: { username: 'adminuser' },
      select: { id: true, username: true }
    });

    if (!user) {
      console.log('❌ Kullanıcı bulunamadı');
      return;
    }

    console.log('👤 Kullanıcı:', user.username);
    console.log('📅 Bugün:', new Date().toISOString().split('T')[0]);
    console.log('');

    // Tüm günah kayıtlarını al
    const sins = await prisma.foodSin.findMany({
      where: { userId: user.id },
      orderBy: { sinDate: 'desc' },
      select: {
        id: true,
        sinDate: true,
        sinType: true,
        note: true,
        createdAt: true,
      }
    });

    console.log(`🍔 Toplam ${sins.length} günah kaydı:`);
    sins.forEach((sin, i) => {
      const date = new Date(sin.sinDate);
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = date.toISOString().split('T')[1].split('.')[0];
      console.log(`  ${i + 1}. ${dateStr} ${timeStr} - ${sin.sinType} ${sin.note ? `(${sin.note})` : ''}`);
    });

    // Son 7 günü kontrol et
    console.log('\n📊 Son 7 Gün Analizi:');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      const daySins = sins.filter(sin => {
        const sinDateStr = new Date(sin.sinDate).toISOString().split('T')[0];
        return sinDateStr === dateStr;
      });

      const status = daySins.length > 0 ? '❌ Günah var' : '✅ Temiz';
      console.log(`  ${dateStr}: ${status} ${daySins.length > 0 ? `(${daySins.length} kayıt)` : ''}`);
    }

    // Streak hesapla
    console.log('\n🔥 Streak Hesaplama:');
    let streak = 0;
    let checkDate = new Date(today);

    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasSin = sins.some(sin => {
        const sinDateStr = new Date(sin.sinDate).toISOString().split('T')[0];
        return sinDateStr === dateStr;
      });

      if (hasSin) {
        console.log(`  ${dateStr}: Günah var - Streak durdu`);
        break;
      } else {
        streak++;
        if (i < 7) {
          console.log(`  ${dateStr}: Temiz - Streak: ${streak}`);
        }
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    console.log(`\n✅ Hesaplanan Streak: ${streak} gün`);

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSins();

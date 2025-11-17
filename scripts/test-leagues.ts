import { PrismaClient } from '@prisma/client';
import { addLeaguePoints } from '../src/services/gamification.service';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Testing League System...\n');

  // Test kullanıcısını bul
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (!user) {
    console.error('❌ Test user not found');
    return;
  }

  console.log(`✅ Found user: ${user.username} (${user.email})`);

  // Aktif sezonu kontrol et
  const season = await prisma.season.findFirst({
    where: { isActive: true },
    include: { leagues: { orderBy: { minPoints: 'asc' } } },
  });

  if (!season) {
    console.error('❌ No active season found');
    return;
  }

  console.log(`✅ Active season: ${season.name}`);
  console.log(`   Leagues: ${season.leagues.map((l) => l.name).join(', ')}\n`);

  // Kullanıcının mevcut lig durumunu kontrol et
  let userLeague = await prisma.userLeague.findUnique({
    where: {
      userId_seasonId: {
        userId: user.id,
        seasonId: season.id,
      },
    },
    include: { league: true },
  });

  if (userLeague) {
    console.log(`📊 Current League: ${userLeague.league.name}`);
    console.log(`   Points: ${userLeague.points}\n`);
  } else {
    console.log('📊 User not in any league yet\n');
  }

  // Test: 3000 puan ekle (Altın lige yükselmek için)
  console.log('🎯 Adding 3000 league points...');
  const result = await addLeaguePoints(user.id, 3000);

  if (result) {
    console.log(`✅ Points added successfully!`);
    console.log(`   New League: ${result.league.name}`);
    console.log(`   Total Points: ${result.points}`);
    if (result.promoted) {
      console.log(`   🎉 PROMOTED! Welcome to ${result.league.name}!`);
    }
  }

  console.log('\n✅ Test completed!');
}

main()
  .catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

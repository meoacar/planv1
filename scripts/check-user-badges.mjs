#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      sinBadges: {
        include: {
          badge: true
        }
      }
    }
  });

  console.log('\n👥 Kullanıcı Rozet Durumu:\n');
  
  users.forEach(user => {
    console.log(`${user.name || user.username || 'Anonim'} (${user.id}):`);
    if (user.sinBadges.length === 0) {
      console.log('  ❌ Hiç rozet yok\n');
    } else {
      user.sinBadges.forEach(ub => {
        console.log(`  ✓ ${ub.badge.name} (${ub.badge.key})`);
      });
      console.log('');
    }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

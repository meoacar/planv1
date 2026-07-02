import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedActivityLogs() {
  console.log('📋 Seeding activity logs...');

  // Admin kullanıcısını bul
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@zayiflamaplan.com' }
  });

  if (!admin) {
    console.error('❌ Admin user not found!');
    return;
  }

  const logs = [
    {
      actorId: admin.id,
      action: 'grant_coins',
      entity: 'user',
      entityId: admin.id,
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      metadata: JSON.stringify({
        amount: 100,
        reason: 'Test coin verme'
      }),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 gün önce
    },
    {
      actorId: admin.id,
      action: 'award_badge',
      entity: 'badge',
      entityId: 'badge-1',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      metadata: JSON.stringify({
        badgeName: 'İlk Adım',
        reason: 'Test rozet verme'
      }),
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 gün önce
    },
    {
      actorId: admin.id,
      action: 'approve_recipe',
      entity: 'recipe',
      entityId: 'recipe-1',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      metadata: JSON.stringify({
        recipeTitle: 'Izgara Tavuk Salatası',
        authorUsername: 'testuser'
      }),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 gün önce
    },
    {
      actorId: admin.id,
      action: 'reject_recipe',
      entity: 'recipe',
      entityId: 'recipe-2',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      metadata: JSON.stringify({
        recipeTitle: 'Fast Food Burger',
        authorUsername: 'testuser',
        reason: 'Sağlıksız içerik'
      }),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 gün önce
    },
    {
      actorId: admin.id,
      action: 'approve_plan',
      entity: 'plan',
      entityId: 'plan-1',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      metadata: JSON.stringify({
        planTitle: '30 Günlük Zayıflama Planı',
        authorUsername: 'testuser'
      }),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 gün önce
    },
    {
      actorId: admin.id,
      action: 'ban_user',
      entity: 'user',
      entityId: 'user-spam',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      metadata: JSON.stringify({
        username: 'spammer123',
        reason: 'Spam içerik paylaşımı'
      }),
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 saat önce
    },
    {
      actorId: admin.id,
      action: 'delete_comment',
      entity: 'comment',
      entityId: 'comment-1',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      metadata: JSON.stringify({
        commentText: 'Uygunsuz içerik...',
        reason: 'Küfür ve hakaret içeriyor'
      }),
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 saat önce
    },
    {
      actorId: admin.id,
      action: 'grant_coins',
      entity: 'user',
      entityId: admin.id,
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      metadata: JSON.stringify({
        amount: 500,
        reason: 'Etkinlik ödülü'
      }),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 saat önce
    },
    {
      actorId: admin.id,
      action: 'unban_user',
      entity: 'user',
      entityId: 'user-unbanned',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      metadata: JSON.stringify({
        username: 'reformed_user',
        reason: 'İtiraz kabul edildi'
      }),
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 saat önce
    },
    {
      actorId: admin.id,
      action: 'approve_recipe',
      entity: 'recipe',
      entityId: 'recipe-3',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      metadata: JSON.stringify({
        recipeTitle: 'Protein Shake Tarifi',
        authorUsername: 'healthyuser'
      }),
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 dakika önce
    },
  ];

  for (const log of logs) {
    await prisma.activityLog.create({
      data: log,
    });
    console.log(`✅ Log created: ${log.action}`);
  }

  console.log('🎉 Activity logs seeded successfully!');
}

seedActivityLogs()
  .catch((e) => {
    console.error('❌ Error seeding activity logs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

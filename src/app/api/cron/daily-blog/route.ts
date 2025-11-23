/**
 * Daily Blog Post Cron Job
 * Her gün sabah 09:00'da otomatik blog yazısı paylaşır
 * Vercel Cron: 0 9 * * * (Her gün saat 09:00)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateDailyBlogContent } from '@/lib/ai/blog-generator';
import { sendBlogNotification } from '@/lib/push-service';

export async function GET(req: NextRequest) {
  try {
    // Cron secret kontrolü
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Daily Blog] Starting daily blog post creation...');

    // 1. Sistem kullanıcısını bul (bot hesabı)
    let botUser = await prisma.user.findFirst({
      where: { email: 'bot@zayiflamaplan.com' }
    });

    // Bot yoksa oluştur
    if (!botUser) {
      botUser = await prisma.user.create({
        data: {
          email: 'bot@zayiflamaplan.com',
          username: 'zayiflamaplan_bot',
          name: 'Zayıflama Plan Bot',
          role: 'ADMIN',
          bio: 'Günlük motivasyon ve sağlık içerikleri paylaşıyorum! 🌟',
        }
      });
      console.log('[Daily Blog] Bot user created');
    }

    // 2. Blog kategorisini bul veya oluştur
    let category = await prisma.blogCategory.findFirst({
      where: { slug: 'gunluk-motivasyon' }
    });

    if (!category) {
      category = await prisma.blogCategory.create({
        data: {
          name: 'Günlük Motivasyon',
          slug: 'gunluk-motivasyon',
          description: 'Her gün bir motivasyon ve sağlık ipucu',
          icon: '🌟',
          color: '#10b981',
          order: 1,
        }
      });
      console.log('[Daily Blog] Category created');
    }

    // 3. AI ile içerik üret
    const content = await generateDailyBlogContent();

    // 4. Blog yazısını oluştur
    const blog = await prisma.blogPost.create({
      data: {
        title: content.title,
        slug: content.slug,
        content: content.content,
        excerpt: content.excerpt,
        coverImage: content.coverImage,
        metaTitle: content.title,
        metaDescription: content.excerpt,
        status: 'PUBLISHED',
        featured: false,
        readingTime: Math.ceil(content.content.split(' ').length / 200), // ~200 kelime/dakika
        authorId: botUser.id,
        categoryId: category.id,
        publishedAt: new Date(),
      }
    });

    console.log('[Daily Blog] Blog post created:', blog.id);

    // 5. Aktif kullanıcılara bildirim gönder (son 7 günde aktif olanlar)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUsers = await prisma.user.findMany({
      where: {
        updatedAt: { gte: sevenDaysAgo },
        isBanned: false,
        pushSubscriptions: {
          some: { isActive: true }
        }
      },
      select: { id: true },
      take: 1000, // İlk 1000 aktif kullanıcı
    });

    console.log(`[Daily Blog] Found ${activeUsers.length} active users`);

    // Batch olarak bildirim gönder
    const notificationResults = await Promise.allSettled(
      activeUsers.map(user => 
        sendBlogNotification(user.id, blog.id, blog.title, blog.excerpt || '')
      )
    );

    const successCount = notificationResults.filter(r => r.status === 'fulfilled').length;

    console.log(`[Daily Blog] Sent ${successCount}/${activeUsers.length} notifications`);

    return NextResponse.json({
      success: true,
      blog: {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
      },
      notifications: {
        total: activeUsers.length,
        sent: successCount,
      }
    });

  } catch (error) {
    console.error('[Daily Blog] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

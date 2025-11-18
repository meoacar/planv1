import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Admin kontrolü
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    // Toplam istatistikler
    const [
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalComments,
      pendingComments,
      approvedComments,
      totalViews
    ] = await Promise.all([
      // Toplam blog sayısı
      db.blogPost.count({
        where: { deletedAt: null }
      }),
      
      // Yayınlanmış blog sayısı
      db.blogPost.count({
        where: { 
          status: 'PUBLISHED',
          deletedAt: null 
        }
      }),
      
      // Taslak blog sayısı
      db.blogPost.count({
        where: { 
          status: 'DRAFT',
          deletedAt: null 
        }
      }),
      
      // Toplam yorum sayısı
      db.blogComment.count(),
      
      // Bekleyen yorum sayısı
      db.blogComment.count({
        where: { status: 'PENDING' }
      }),
      
      // Onaylanmış yorum sayısı
      db.blogComment.count({
        where: { status: 'APPROVED' }
      }),
      
      // Toplam görüntülenme sayısı
      db.blogPost.aggregate({
        _sum: { viewCount: true },
        where: { deletedAt: null }
      }).then((result: any) => result._sum.viewCount || 0)
    ]);

    // En çok okunan yazılar (top 10)
    const mostReadPosts = await db.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
            color: true
          }
        }
      },
      orderBy: { viewCount: 'desc' },
      take: 10
    });

    // Kategori dağılımı
    const categoryDistribution = await db.blogCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        icon: true,
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED',
                deletedAt: null
              }
            }
          }
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      }
    });

    // Son 7 günlük yayınlanan blog sayısı
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentPublished = await db.blogPost.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gte: sevenDaysAgo
        },
        deletedAt: null
      }
    });

    // Son 30 günlük yayınlanan blog sayısı
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyPublished = await db.blogPost.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gte: thirtyDaysAgo
        },
        deletedAt: null
      }
    });

    // Ortalama okuma süresi
    const avgReadingTime = await db.blogPost.aggregate({
      _avg: { readingTime: true },
      where: {
        status: 'PUBLISHED',
        deletedAt: null
      }
    });

    // En çok yorum alan yazılar (top 5)
    const mostCommentedPosts = await db.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: {
            comments: {
              where: {
                status: 'APPROVED'
              }
            }
          }
        }
      },
      orderBy: {
        comments: {
          _count: 'desc'
        }
      },
      take: 5
    });

    const stats = {
      overview: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalComments,
        pendingComments,
        approvedComments,
        totalViews,
        avgReadingTime: Math.round(avgReadingTime._avg.readingTime || 0)
      },
      trends: {
        last7Days: recentPublished,
        last30Days: monthlyPublished
      },
      mostReadPosts: mostReadPosts.map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        viewCount: post.viewCount,
        publishedAt: post.publishedAt,
        category: post.category
      })),
      mostCommentedPosts: mostCommentedPosts.map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        commentCount: post._count.comments
      })),
      categoryDistribution: categoryDistribution.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
        icon: cat.icon,
        postCount: cat._count.posts
      }))
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Blog stats error:', error);
    return NextResponse.json(
      { error: 'İstatistikler alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

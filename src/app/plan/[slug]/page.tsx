import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LikeButton, CommentForm, ShareButton, DailyMenuViewer } from './plan-client'
import { incrementViews } from './actions'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Metadata } from 'next'
import { getSetting } from '@/lib/settings'
import AppealButton from '@/components/appeal-button'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  const plan = await db.plan.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  })

  if (!plan) {
    return {
      title: 'Plan Bulunamadı',
    }
  }

  const siteUrl = await getSetting('siteUrl', 'https://zayiflamaplan.com')
  const resultText = plan.authorWeightLoss
    ? `${plan.authorWeightLoss}kg verdi`
    : plan.targetWeightLoss
    ? `Hedef: ${plan.targetWeightLoss}kg`
    : ''

  const description = plan.description.length > 160 
    ? plan.description.substring(0, 157) + '...'
    : plan.description

  return {
    title: plan.title,
    description: `${description} ${resultText ? `| ${resultText}` : ''} | @${plan.author.username}`,
    keywords: plan.tags?.split(',').map(t => t.trim()) || [],
    authors: [{ name: plan.author.name || plan.author.username || 'Anonim' }],
    openGraph: {
      type: 'article',
      locale: 'tr_TR',
      url: `${siteUrl}/plan/${slug}`,
      title: plan.title,
      description: description,
      siteName: 'ZayiflamaPlan',
      publishedTime: plan.createdAt.toISOString(),
      modifiedTime: plan.updatedAt.toISOString(),
      authors: [plan.author.name || plan.author.username || 'Anonim'],
      tags: plan.tags?.split(',').map(t => t.trim()) || [],
      images: [
        {
          url: `${siteUrl}/api/og?title=${encodeURIComponent(plan.title)}&author=${encodeURIComponent(plan.author.username || '')}&result=${encodeURIComponent(resultText)}`,
          width: 1200,
          height: 630,
          alt: plan.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: plan.title,
      description: description,
      creator: `@${plan.author.username}`,
      images: [
        `${siteUrl}/api/og?title=${encodeURIComponent(plan.title)}&author=${encodeURIComponent(plan.author.username || '')}&result=${encodeURIComponent(resultText)}`,
      ],
    },
    alternates: {
      canonical: `/plan/${slug}`,
    },
  }
}

export default async function PlanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()
  const headersList = await headers()

  // Fetch plan with all related data
  const plan = await db.plan.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      days: {
        orderBy: { dayNumber: 'asc' },
      },
      comments: {
        where: session?.user?.id 
          ? {
              OR: [
                { status: 'visible' }, // Everyone can see visible comments
                { 
                  AND: [
                    { authorId: session.user.id }, // User's own comments
                    { status: 'pending' }, // Only pending ones (not hidden/rejected)
                  ]
                },
              ],
            }
          : { status: 'visible' }, // Non-logged in users only see visible comments
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          author: {
            select: {
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
  })

  if (!plan) {
    notFound()
  }

  // Check access permissions
  const isAdmin = session?.user?.role === 'ADMIN'
  const isAuthor = session?.user?.id === plan.authorId
  const isPublished = plan.status === 'published'

  // Only allow access if:
  // 1. Plan is published (everyone can see)
  // 2. User is the author (can see their own plans)
  // 3. User is admin (can see all plans)
  if (!isPublished && !isAuthor && !isAdmin) {
    notFound()
  }

  // Increment views (only for published plans)
  if (isPublished) {
    // Get IP address from headers
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
               headersList.get('x-real-ip') || 
               'unknown'
    
    await incrementViews(plan.id, session?.user?.id, ip)
  }

  // Check if user liked this plan
  let isLiked = false
  if (session?.user?.id) {
    const like = await db.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: session.user.id,
          targetType: 'plan',
          targetId: plan.id,
        },
      },
    })
    isLiked = !!like
  }

  const difficultyLabels = {
    easy: 'Kolay',
    medium: 'Orta',
    hard: 'Zor',
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  }
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/kesfet">← Geri</Link>
        </Button>

        {/* Status Banner for non-published plans */}
        {!isPublished && (
          <div className={`mb-6 rounded-xl border-2 overflow-hidden ${
            plan.status === 'pending' ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30' :
            plan.status === 'draft' ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30' :
            'border-red-300 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30'
          }`}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  plan.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/50' :
                  plan.status === 'draft' ? 'bg-blue-100 dark:bg-blue-900/50' :
                  'bg-red-100 dark:bg-red-900/50'
                }`}>
                  {plan.status === 'pending' && '⏳'}
                  {plan.status === 'draft' && '📝'}
                  {plan.status === 'rejected' && '❌'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold mb-2 ${
                    plan.status === 'pending' ? 'text-amber-900 dark:text-amber-100' :
                    plan.status === 'draft' ? 'text-blue-900 dark:text-blue-100' :
                    'text-red-900 dark:text-red-100'
                  }`}>
                    {plan.status === 'pending' && 'Plan Onay Bekliyor'}
                    {plan.status === 'draft' && 'Taslak Plan'}
                    {plan.status === 'rejected' && 'Plan Reddedildi'}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    plan.status === 'pending' ? 'text-amber-800 dark:text-amber-200' :
                    plan.status === 'draft' ? 'text-blue-800 dark:text-blue-200' :
                    'text-red-800 dark:text-red-200'
                  }`}>
                    {plan.status === 'pending' && 'Planınız inceleme aşamasında. Admin onayından sonra tüm kullanıcılar tarafından görülebilir olacak.'}
                    {plan.status === 'draft' && 'Bu plan henüz yayınlanmadı ve sadece sizin tarafınızdan görülebilir.'}
                    {plan.status === 'rejected' && (
                      <>
                        Planınız admin tarafından reddedildi. Gerekli düzenlemeleri yaparak tekrar gönderebilirsiniz.
                        {plan.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm font-semibold mb-1">Red Sebebi:</p>
                            <p className="text-sm">{plan.rejectionReason}</p>
                          </div>
                        )}
                      </>
                    )}
                  </p>
                  <div className="flex gap-2 mt-4">
                    {isAdmin && (
                      <Button 
                        size="sm" 
                        asChild
                        className={
                          plan.status === 'pending' ? 'bg-amber-600 hover:bg-amber-700 text-white' :
                          plan.status === 'draft' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                          'bg-red-600 hover:bg-red-700 text-white'
                        }
                      >
                        <Link href={`/admin/planlar?highlight=${plan.id}`}>
                          🛡️ Admin Panelinde Görüntüle
                        </Link>
                      </Button>
                    )}
                    {plan.status === 'rejected' && isAuthor && (
                      <AppealButton
                        contentType="plan"
                        contentId={plan.id}
                        isRejected={true}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plan Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {plan.author.image ? (
                <img src={plan.author.image} alt={plan.author.name || ''} className="w-full h-full rounded-full" />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <Link href={`/profil/${plan.author.username}`} className="font-medium hover:underline">
                @{plan.author.username || 'kullanici'}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true, locale: tr })}
              </p>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{plan.title}</h1>

          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <span className={`text-sm px-3 py-1 rounded ${difficultyColors[plan.difficulty]}`}>
              {difficultyLabels[plan.difficulty]}
            </span>
            <span className="text-sm">⏱️ {plan.duration} gün</span>
            {plan.targetWeightLoss && (
              <span className="text-sm">🎯 {plan.targetWeightLoss}kg hedef</span>
            )}
            <span className="text-sm">👁️ {plan.views} görüntülenme</span>
          </div>

          <div className="flex gap-2 mb-6">
            {session?.user ? (
              <LikeButton planId={plan.id} isLiked={isLiked} likesCount={plan.likesCount} />
            ) : (
              <Button asChild variant="outline">
                <Link href="/giris">🤍 Beğen ({plan.likesCount})</Link>
              </Button>
            )}
            <ShareButton title={plan.title} description={plan.description} />
          </div>
        </div>

        {/* Author Story */}
        {plan.authorStory && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Hikayem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="whitespace-pre-wrap">{plan.authorStory}</p>

              {(plan.authorWeightLoss || plan.authorDuration) && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {plan.authorWeightLoss && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Verdiğim Kilo</p>
                      <p className="text-2xl font-bold">{plan.authorWeightLoss}kg</p>
                    </div>
                  )}
                  {plan.authorDuration && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Süre</p>
                      <p className="text-2xl font-bold">{plan.authorDuration} gün</p>
                    </div>
                  )}
                </div>
              )}

              {(plan.beforePhotoUrl || plan.afterPhotoUrl) && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {plan.beforePhotoUrl && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Önce</p>
                      <img src={plan.beforePhotoUrl} alt="Önce" className="w-full rounded-lg" />
                    </div>
                  )}
                  {plan.afterPhotoUrl && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Sonra</p>
                      <img src={plan.afterPhotoUrl} alt="Sonra" className="w-full rounded-lg" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Plan Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Plan Detayları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Açıklama</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{plan.description}</p>
            </div>

            {plan.tags && (
              <div>
                <h3 className="font-semibold mb-2">Etiketler</h3>
                <div className="flex gap-2 flex-wrap">
                  {plan.tags.split(',').map((tag, i) => (
                    <span key={i} className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Menus with Tabs */}
        {plan.days.length > 0 && (
          <DailyMenuViewer days={plan.days} duration={plan.duration} />
        )}

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Yorumlar ({plan.commentsCount})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment Form */}
            {session?.user ? (
              <CommentForm planId={plan.id} />
            ) : (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Yorum yapmak için giriş yapmalısınız
                </p>
                <Button asChild size="sm">
                  <Link href="/giris">Giriş Yap</Link>
                </Button>
              </div>
            )}

            {/* Comments List */}
            {plan.comments.length > 0 ? (
              <div className="space-y-4">
                {plan.comments.map((comment) => (
                  <div key={comment.id} className="border-t pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {comment.author.image ? (
                          <img src={comment.author.image} alt={comment.author.name || ''} className="w-full h-full rounded-full" />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/profil/${comment.author.username}`} className="font-medium text-sm hover:underline">
                            @{comment.author.username || 'kullanici'}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: tr })}
                          </p>
                          {comment.status === 'pending' && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                              Onay bekliyor
                            </span>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
                        {comment.status === 'pending' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Bu yorum admin onayından sonra herkese görünür olacak
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {plan.commentsCount > 10 && (
                  <p className="text-center text-sm text-muted-foreground">
                    ... ve {plan.commentsCount - 10} yorum daha
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Henüz yorum yok</p>
                <p className="text-sm mt-2">İlk yorumu sen yap!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

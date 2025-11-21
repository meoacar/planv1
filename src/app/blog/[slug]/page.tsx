import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/layout/footer'
import { BlogContent } from '@/components/blog/blog-content'
import { BlogTOC } from '@/components/blog/blog-toc'
import { BlogShare } from '@/components/blog/blog-share'
import { BlogRelated } from '@/components/blog/blog-related'
import { BlogComments } from '@/components/blog/blog-comments'
import { BlogCommentForm } from '@/components/blog/blog-comment-form'
import { BlogReadingProgress } from '@/components/blog/blog-reading-progress'
import { InternalLinks, CategoryInternalLinks, PopularInternalLinks } from '@/components/blog/internal-links'
import { RelatedPosts } from '@/components/blog/related-posts'
import { BlogFloatingActions } from '@/components/blog/blog-floating-actions'
import { BlogAuthorCard } from '@/components/blog/blog-author-card'
import { Clock, Eye, Calendar, ArrowLeft, Heart, MessageCircle, Bookmark } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { generateSEOMeta, generateStructuredData } from '@/lib/blog/blog-utils'
import type { BlogPostDetailResponse } from '@/types/blog'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// ISR: Revalidate every 10 minutes
export const revalidate = 600

async function getBlogPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  })

  if (!res.ok) {
    return null
  }

  return res.json() as Promise<BlogPostDetailResponse>
}

async function incrementViewCount(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    await fetch(`${baseUrl}/api/blog/${slug}/view`, {
      method: 'POST',
      cache: 'no-store',
    })
  } catch (error) {
    console.error('Failed to increment view count:', error)
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getBlogPost(slug)

  if (!data || !data.success) {
    return {
      title: 'Blog Yazısı Bulunamadı',
    }
  }

  const post = data.data

  // SEO meta tags'leri utility fonksiyonu ile oluştur
  return generateSEOMeta(post)
}

// Skeleton components for lazy loading
function RelatedPostsSkeleton() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">İlgili Yazılar</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const data = await getBlogPost(slug)

  if (!data || !data.success) {
    notFound()
  }

  const post = data.data

  // Increment view count (fire and forget)
  incrementViewCount(slug)

  // Convert publishedAt to Date if it's a string
  const publishedAtDate = post.publishedAt 
    ? (typeof post.publishedAt === 'string' ? new Date(post.publishedAt) : post.publishedAt)
    : null

  const publishedDate = publishedAtDate
    ? formatDistanceToNow(publishedAtDate, {
        addSuffix: true,
        locale: tr,
      })
    : null

  // Generate JSON-LD structured data
  const jsonLd = generateStructuredData(post)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogReadingProgress />
      <BlogFloatingActions postSlug={post.slug} />
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
        <Navbar />

        {/* Hero Section with Gradient Background */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 dark:from-purple-500/5 dark:via-pink-500/5 dark:to-orange-500/5" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          
          <div className="relative container mx-auto px-4 pt-8 pb-12">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-all hover:gap-3 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Blog'a Dön
            </Link>

            <div className="max-w-4xl mx-auto">
              {/* Category Badge */}
              <Link href={`/blog/category/${post.category.slug}`}>
                <Badge
                  className="mb-6 cursor-pointer hover:scale-105 transition-transform text-sm px-4 py-1.5"
                  style={{
                    backgroundColor: post.category.color || undefined,
                  }}
                >
                  {post.category.icon && (
                    <span className="mr-1.5 text-base">{post.category.icon}</span>
                  )}
                  {post.category.name}
                </Badge>
              </Link>

              {/* Title with Gradient */}
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Info with Icons */}
              <div className="flex flex-wrap items-center gap-6 text-sm mb-8">
                <div className="flex items-center gap-3 group">
                  <Avatar className="w-12 h-12 ring-2 ring-background shadow-lg transition-transform group-hover:scale-110">
                    <AvatarImage src={post.author.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {post.author.name?.[0] || post.author.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/profil/${post.author.username || post.author.id}`}
                      className="font-medium hover:text-primary transition-colors block"
                    >
                      {post.author.name || post.author.username}
                    </Link>
                    {publishedDate && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">{publishedDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator orientation="vertical" className="h-12" />

                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime} dk</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>{post.viewCount.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>

              {/* Cover Image with Enhanced Styling */}
              {post.coverImage && (
                <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={post.coverImage}
                    alt={post.coverImageAlt || post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <article className="lg:col-span-8">
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-8">
                  {post.tags.map((tag) => (
                    <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                      <Badge 
                        variant="outline" 
                        className="hover:bg-accent hover:scale-105 transition-all cursor-pointer"
                      >
                        #{tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Content with Better Typography */}
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg">
                <BlogContent content={post.content} />
              </div>

              {/* Author Card */}
              <div className="my-12">
                <BlogAuthorCard author={post.author} />
              </div>

              <Separator className="my-12" />

              {/* Related Posts - Lazy Loaded */}
              <Suspense fallback={<RelatedPostsSkeleton />}>
                <BlogRelated posts={post.relatedPosts} />
              </Suspense>

              <Separator className="my-12" />

              {/* Comments Section - Lazy Loaded */}
              <section id="comments" className="scroll-mt-20">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">Yorumlar</h2>
                  <Badge variant="secondary" className="text-base px-4 py-1">
                    {post.commentsCount} yorum
                  </Badge>
                </div>

                <div className="space-y-8">
                  <BlogCommentForm postSlug={post.slug} />
                  <Suspense fallback={<CommentsSkeleton />}>
                    <BlogComments
                      postSlug={post.slug}
                      initialCount={post.commentsCount}
                    />
                  </Suspense>
                </div>
              </section>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-4 space-y-6">
                {/* Table of Contents */}
                <Card className="overflow-hidden border-2">
                  <BlogTOC content={post.content} />
                </Card>

                {/* Share Buttons */}
                <Card className="overflow-hidden border-2">
                  <BlogShare title={post.title} slug={post.slug} />
                </Card>

                {/* Kategori İç Linkleri */}
                {post.category && (
                  <CategoryInternalLinks 
                    categorySlug={post.category.slug}
                    currentPostId={post.id}
                  />
                )}

                {/* Popüler İçerikler */}
                <PopularInternalLinks currentPostId={post.id} />

                {/* Engagement Stats */}
                <Card className="p-6 border-2">
                  <h3 className="font-semibold mb-4">İstatistikler</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Görüntülenme
                      </span>
                      <span className="font-semibold">{post.viewCount.toLocaleString('tr-TR')}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Yorum
                      </span>
                      <span className="font-semibold">{post.commentsCount}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Okuma Süresi
                      </span>
                      <span className="font-semibold">{post.readingTime} dk</span>
                    </div>
                  </div>
                </Card>
              </div>
            </aside>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  )
}

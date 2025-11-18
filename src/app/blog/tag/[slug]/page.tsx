import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { BlogList } from '@/components/blog/blog-list'
import { BlogSearch } from '@/components/blog/blog-search'
import { BlogSidebar } from '@/components/blog/blog-sidebar'
import { BlogPagination } from '@/components/blog/blog-pagination'
import { BlogSort } from '@/components/blog/blog-sort'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Hash } from 'lucide-react'
import Link from 'next/link'
import type {
  BlogPostListResponse,
  BlogCategoryListResponse,
  BlogTagListResponse,
  BlogTag,
} from '@/types/blog'

interface TagPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
    search?: string
    sort?: string
  }
}

async function getTag(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/blog/tags`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return null
  }

  const data = (await res.json()) as BlogTagListResponse
  return data.data.find((tag) => tag.slug === slug) || null
}

async function getBlogPosts(
  tagSlug: string,
  searchParams: TagPageProps['searchParams']
) {
  const params = new URLSearchParams()
  params.set('tag', tagSlug)

  if (searchParams.page) params.set('page', searchParams.page)
  if (searchParams.search) params.set('search', searchParams.search)
  if (searchParams.sort) params.set('sort', searchParams.sort)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/blog?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Blog yazıları yüklenemedi')
  }

  return res.json() as Promise<BlogPostListResponse>
}

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/blog/categories`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return { success: true, data: [] } as BlogCategoryListResponse
  }

  return res.json() as Promise<BlogCategoryListResponse>
}

async function getPopularTags() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/blog/tags?limit=10`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return { success: true, data: [] } as BlogTagListResponse
  }

  return res.json() as Promise<BlogTagListResponse>
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const tag = await getTag(params.slug)

  if (!tag) {
    return {
      title: 'Etiket Bulunamadı | Zayıflama Planı',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zayiflamaplan.com'
  const title = `#${tag.name} | Blog | Zayıflama Planı`
  const description = `#${tag.name} etiketine sahip blog yazılarını okuyun.`

  return {
    title,
    description,
    keywords: `${tag.name}, diyet, sağlıklı yaşam, blog`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/blog/tag/${params.slug}`,
      siteName: 'Zayıflama Planı',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@zayiflamaplan',
    },
    alternates: {
      canonical: `${baseUrl}/blog/tag/${params.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function TagPage({
  params,
  searchParams,
}: TagPageProps) {
  const [tag, postsData, categoriesData, tagsData] = await Promise.all([
    getTag(params.slug),
    getBlogPosts(params.slug, searchParams),
    getCategories(),
    getPopularTags(),
  ])

  if (!tag) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Tüm Blog Yazıları
      </Link>

      {/* Tag Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Hash className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">#{tag.name}</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Bu etikete sahip tüm blog yazıları
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-4">
            <BlogSidebar
              categories={categoriesData.data}
              popularTags={tagsData.data}
              selectedTag={params.slug}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 order-1 lg:order-2">
          {/* Search and Sort */}
          <div className="mb-6 space-y-4">
            <BlogSearch />

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {postsData.pagination.total} yazı bulundu
              </div>

              <BlogSort />
            </div>
          </div>

          {/* Active Filters */}
          {searchParams.search && (
            <div className="mb-6 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Filtreler:</span>
              <span className="text-sm bg-accent px-3 py-1 rounded-full">
                Arama: "{searchParams.search}"
              </span>
            </div>
          )}

          {/* Blog List */}
          <Suspense fallback={<BlogListSkeleton />}>
            <BlogList posts={postsData.data} />
          </Suspense>

          {/* Pagination */}
          <BlogPagination
            currentPage={postsData.pagination.page}
            totalPages={postsData.pagination.totalPages}
            hasNextPage={postsData.pagination.hasNextPage}
            hasPrevPage={postsData.pagination.hasPrevPage}
          />
        </main>
      </div>
    </div>
  )
}

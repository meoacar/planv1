import { Metadata } from 'next'
import { Suspense } from 'react'
import { BlogList } from '@/components/blog/blog-list'
import { BlogFeatured } from '@/components/blog/blog-featured'
import { BlogSearch } from '@/components/blog/blog-search'
import { BlogSidebar } from '@/components/blog/blog-sidebar'
import { BlogPagination } from '@/components/blog/blog-pagination'
import { BlogSort } from '@/components/blog/blog-sort'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/layout/footer'
import type {
  BlogPostListResponse,
  BlogCategoryListResponse,
  BlogTagListResponse,
  BlogFeaturedPostsResponse,
} from '@/types/blog'

// ISR: Revalidate every 5 minutes
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog | Zayıflama Planı',
  description:
    'Sağlıklı yaşam, beslenme, egzersiz ve motivasyon konularında uzman yazılarımızı okuyun.',
  keywords: 'diyet, sağlıklı yaşam, beslenme, egzersiz, motivasyon, kilo verme, sağlıklı tarifler',
  openGraph: {
    title: 'Blog | Zayıflama Planı',
    description:
      'Sağlıklı yaşam, beslenme, egzersiz ve motivasyon konularında uzman yazılarımızı okuyun.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://zayiflamaplan.com'}/blog`,
    siteName: 'Zayıflama Planı',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Zayıflama Planı',
    description:
      'Sağlıklı yaşam, beslenme, egzersiz ve motivasyon konularında uzman yazılarımızı okuyun.',
    site: '@zayiflamaplan',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://zayiflamaplan.com'}/blog`,
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

interface BlogPageProps {
  searchParams: {
    page?: string
    category?: string
    tag?: string
    search?: string
    sort?: string
  }
}

async function getBlogPageData(searchParams: BlogPageProps['searchParams']) {
  const params = new URLSearchParams()
  
  if (searchParams.page) params.set('page', searchParams.page)
  if (searchParams.category) params.set('category', searchParams.category)
  if (searchParams.tag) params.set('tag', searchParams.tag)
  if (searchParams.search) params.set('search', searchParams.search)
  if (searchParams.sort) params.set('sort', searchParams.sort)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/blog/page-data?${params.toString()}`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  })

  if (!res.ok) {
    throw new Error('Blog verileri yüklenemedi')
  }

  return res.json()
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

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const pageData = await getBlogPageData(searchParams)
  
  const postsData = {
    data: pageData.posts.data,
    pagination: pageData.posts.pagination,
  }
  
  const categoriesData = { data: pageData.categories }
  const tagsData = { data: pageData.tags }
  const featuredData = { data: pageData.featured }

  const showFeatured = featuredData.data.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📝 Blog</h1>
          <p className="text-muted-foreground">
            Sağlıklı yaşam, beslenme ve motivasyon konularında uzman yazıları
          </p>
        </div>

      {/* Featured Posts */}
      {showFeatured && featuredData.data.length > 0 && (
        <BlogFeatured posts={featuredData.data} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-4">
            <BlogSidebar
              categories={categoriesData.data}
              popularTags={tagsData.data}
              selectedCategory={searchParams.category}
              selectedTag={searchParams.tag}
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
          {(searchParams.category || searchParams.tag || searchParams.search) && (
            <div className="mb-6 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Filtreler:</span>
              {searchParams.category && (
                <span className="text-sm bg-accent px-3 py-1 rounded-full">
                  Kategori: {searchParams.category}
                </span>
              )}
              {searchParams.tag && (
                <span className="text-sm bg-accent px-3 py-1 rounded-full">
                  Etiket: #{searchParams.tag}
                </span>
              )}
              {searchParams.search && (
                <span className="text-sm bg-accent px-3 py-1 rounded-full">
                  Arama: "{searchParams.search}"
                </span>
              )}
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
      
      <Footer />
    </div>
  )
}



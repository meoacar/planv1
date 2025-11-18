import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye } from 'lucide-react'
import type { BlogPostDetail } from '@/types/blog'

interface BlogRelatedProps {
  posts: BlogPostDetail['relatedPosts']
}

export function BlogRelated({ posts }: BlogRelatedProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="mt-12" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" className="text-3xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        ✨ İlgili Yazılar
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
        {posts.map((post) => (
          <Card 
            key={post.id} 
            className="group overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-2 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
            role="listitem"
          >
            <Link 
              href={`/blog/${post.slug}`}
              aria-label={`${post.title} - ${post.category.name} kategorisinde blog yazısı`}
            >
              <div className="relative aspect-video bg-muted overflow-hidden">
                {post.coverImage ? (
                  post.coverImage.startsWith('data:') ? (
                    <img
                      src={post.coverImage}
                      alt={`${post.title} kapak görseli`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <Image
                      src={post.coverImage}
                      alt={`${post.title} kapak görseli`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 group-hover:from-purple-200 group-hover:to-pink-200 dark:group-hover:from-purple-900/30 dark:group-hover:to-pink-900/30 transition-colors">
                    <span className="text-5xl group-hover:scale-110 transition-transform" aria-hidden="true">📝</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 left-3">
                  <Badge
                    className="font-medium shadow-lg group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: post.category.color || undefined,
                    }}
                    aria-label={`Kategori: ${post.category.name}`}
                  >
                    {post.category.name}
                  </Badge>
                </div>
              </div>
            </Link>

            <CardContent className="p-5">
              <Link href={`/blog/${post.slug}`}>
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h3>
              </Link>

              {post.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5" aria-label={`Okuma süresi: ${post.readingTime} dakika`}>
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span className="font-medium">{post.readingTime} dk</span>
                </div>
                <div className="flex items-center gap-1.5" aria-label={`${post.viewCount} görüntülenme`}>
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  <span className="font-medium">{post.viewCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

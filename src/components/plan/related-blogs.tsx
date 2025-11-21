import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Eye, ArrowRight, BookOpen } from 'lucide-react'

interface RelatedBlog {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  readingTime: number
  viewCount: number
  category: {
    name: string
    color: string | null
  }
}

interface RelatedBlogsProps {
  blogs: RelatedBlog[]
  title?: string
}

export function RelatedBlogs({ blogs, title = "📚 İlgili Blog Yazıları" }: RelatedBlogsProps) {
  if (blogs.length === 0) {
    return null
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Bu planla ilgili bilgilendirici içerikler
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="block group"
          >
            <div className="flex gap-3 p-3 rounded-lg border-2 hover:border-primary hover:shadow-md transition-all bg-card">
              {blog.coverImage && (
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                  {blog.coverImage.startsWith('data:') ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                      sizes="80px"
                    />
                  )}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h4>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>

                {blog.excerpt && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {blog.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      backgroundColor: blog.category.color ? `${blog.category.color}20` : undefined,
                      borderColor: blog.category.color || undefined,
                      color: blog.category.color || undefined,
                    }}
                  >
                    {blog.category.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {blog.readingTime} dk
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {blog.viewCount}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <Button asChild variant="outline" className="w-full mt-2" size="sm">
          <Link href="/blog">
            Tüm Blog Yazılarını Gör
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

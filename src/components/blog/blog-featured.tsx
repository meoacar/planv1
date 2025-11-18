"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface FeaturedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: {
    name: string;
    slug: string;
    color?: string;
  };
  author: {
    name: string;
  };
  publishedAt: Date;
  readingTime: number;
}

interface BlogFeaturedProps {
  posts: FeaturedPost[];
}

export function BlogFeatured({ posts }: BlogFeaturedProps) {
  if (posts.length === 0) {
    return null;
  }

  const [mainPost, ...otherPosts] = posts;

  return (
    <section className="mb-12" aria-labelledby="featured-heading">
      <div className="mb-6">
        <h2 id="featured-heading" className="text-2xl font-bold">
          Öne Çıkan Yazılar
        </h2>
        <p className="text-muted-foreground">
          Editörün seçtiği en popüler içerikler
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2" role="list">
        {/* Main Featured Post */}
        <Link 
          href={`/blog/${mainPost.slug}`} 
          className="lg:col-span-2"
          role="listitem"
          aria-label={`Öne çıkan yazı: ${mainPost.title}`}
        >
          <Card className="group overflow-hidden transition-all hover:shadow-xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-video lg:aspect-auto">
                {mainPost.coverImage ? (
                  mainPost.coverImage.startsWith('data:') ? (
                    <img
                      src={mainPost.coverImage}
                      alt={`${mainPost.title} kapak görseli`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={mainPost.coverImage}
                      alt={`${mainPost.title} kapak görseli`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <span className="text-6xl" aria-hidden="true">📝</span>
                  </div>
                )}
                <div className="absolute left-4 top-4">
                  <Badge
                    style={{
                      backgroundColor: mainPost.category.color || "#3b82f6",
                    }}
                    className="text-white"
                    aria-label={`Kategori: ${mainPost.category.name}`}
                  >
                    {mainPost.category.name}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <CardContent className="flex flex-col justify-center p-6 lg:p-8">
                <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-primary lg:text-3xl">
                  {mainPost.title}
                </h3>
                <p className="mb-4 line-clamp-3 text-muted-foreground">
                  {mainPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span aria-label={`Yazar: ${mainPost.author.name}`}>
                    {mainPost.author.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <time dateTime={new Date(mainPost.publishedAt).toISOString()}>
                      {formatDistanceToNow(new Date(mainPost.publishedAt), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-1" aria-label={`Okuma süresi: ${mainPost.readingTime} dakika`}>
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>{mainPost.readingTime} dk</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>

        {/* Other Featured Posts */}
        {otherPosts.map((post) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`}
            role="listitem"
            aria-label={`Öne çıkan yazı: ${post.title}`}
          >
            <Card className="group h-full overflow-hidden transition-all hover:shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
              <div className="relative aspect-video overflow-hidden">
                {post.coverImage ? (
                  post.coverImage.startsWith('data:') ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                <div className="absolute left-4 top-4">
                  <Badge
                    style={{
                      backgroundColor: post.category.color || "#3b82f6",
                    }}
                    className="text-white"
                  >
                    {post.category.name}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 line-clamp-2 text-lg font-bold transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(post.publishedAt), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readingTime} dk</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

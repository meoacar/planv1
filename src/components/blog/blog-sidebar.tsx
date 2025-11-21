"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  _count?: {
    posts: number;
  };
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
}

interface RecentPost {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date;
  readingTime: number;
}

interface BlogSidebarProps {
  categories?: Category[];
  popularTags?: Tag[];
  recentPosts?: RecentPost[];
  currentCategory?: string;
}

export function BlogSidebar({
  categories = [],
  popularTags = [],
  recentPosts = [],
  currentCategory,
}: BlogSidebarProps) {
  return (
    <aside className="space-y-6" aria-label="Blog kenar çubuğu">
      {/* Categories */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg" id="categories-heading">
              Kategoriler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <nav aria-labelledby="categories-heading">
              <ul className="space-y-2" role="list">
                <li>
                  <Link
                    href="/blog"
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      !currentCategory ? "bg-accent font-medium" : ""
                    }`}
                    aria-current={!currentCategory ? "page" : undefined}
                  >
                    <span>Tümü</span>
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/blog/category/${category.slug}`}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        currentCategory === category.slug
                          ? "bg-accent font-medium"
                          : ""
                      }`}
                      aria-current={currentCategory === category.slug ? "page" : undefined}
                      aria-label={`${category.name} kategorisi${category._count ? `, ${category._count.posts} yazı` : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: category.color || "#3b82f6",
                          }}
                          aria-hidden="true"
                        />
                        <span>{category.name}</span>
                      </div>
                      {category._count && (
                        <span className="text-xs text-muted-foreground" aria-label={`${category._count.posts} yazı`}>
                          {category._count.posts}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </CardContent>
        </Card>
      )}

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg" id="tags-heading">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              Popüler Etiketler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <nav aria-labelledby="tags-heading">
              <ul className="flex flex-wrap gap-2" role="list">
                {popularTags.map((tag) => (
                  <li key={tag.id}>
                    <Link 
                      href={`/blog/tag/${tag.slug}`}
                      aria-label={`${tag.name} etiketi${tag._count ? `, ${tag._count.posts} yazı` : ''}`}
                    >
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        {tag.name}
                        {tag._count && (
                          <span className="ml-1 text-xs opacity-70">
                            ({tag._count.posts})
                          </span>
                        )}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </CardContent>
        </Card>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg" id="recent-posts-heading">
              Son Yazılar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <nav aria-labelledby="recent-posts-heading">
              <ul className="space-y-4" role="list">
                {recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                      aria-label={`${post.title} - ${post.readingTime} dakika okuma süresi`}
                    >
                      <h4 className="mb-1 line-clamp-2 text-sm font-medium transition-colors group-hover:text-primary">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        <time dateTime={new Date(post.publishedAt).toISOString()}>
                          {formatDistanceToNow(new Date(post.publishedAt), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </time>
                        <span aria-hidden="true">•</span>
                        <span>{post.readingTime} dk</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </CardContent>
        </Card>
      )}

      {/* SEO İç Linkler - Dinamik */}
      <div className="space-y-4">
        <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              🔥 Popüler İçerikler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              En çok okunan ve beğenilen yazılarımız
            </p>
            <nav>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="text-purple-600 dark:text-purple-400 hover:underline">
                    → Tüm blog yazılarını keşfet
                  </Link>
                </li>
                <li>
                  <Link href="/tarif" className="text-purple-600 dark:text-purple-400 hover:underline">
                    → Sağlıklı tarifler
                  </Link>
                </li>
                <li>
                  <Link href="/kesfet" className="text-purple-600 dark:text-purple-400 hover:underline">
                    → Topluluk içerikleri
                  </Link>
                </li>
              </ul>
            </nav>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}

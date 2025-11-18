import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface BlogCardProps {
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
    image?: string;
  };
  publishedAt: Date;
  readingTime: number;
  viewCount?: number;
}

export function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  category,
  author,
  publishedAt,
  readingTime,
}: BlogCardProps) {
  return (
    <Link 
      href={`/blog/${slug}`}
      aria-label={`${title} - ${category.name} kategorisinde blog yazısı`}
    >
      <Card className="group overflow-hidden transition-all hover:shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`${title} kapak görseli`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-4xl" aria-hidden="true">📝</span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute left-4 top-4">
            <Badge
              style={{
                backgroundColor: category.color || "#3b82f6",
              }}
              className="text-white"
              aria-label={`Kategori: ${category.name}`}
            >
              {category.name}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
            {excerpt}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t px-6 py-4 text-xs text-muted-foreground">
          {/* Author */}
          <div className="flex items-center gap-2" aria-label={`Yazar: ${author.name}`}>
            {author.image ? (
              <Image
                src={author.image}
                alt={`${author.name} profil fotoğrafı`}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <User className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{author.name}</span>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <time dateTime={new Date(publishedAt).toISOString()}>
                {formatDistanceToNow(new Date(publishedAt), {
                  addSuffix: true,
                  locale: tr,
                })}
              </time>
            </div>
            <div className="flex items-center gap-1" aria-label={`Okuma süresi: ${readingTime} dakika`}>
              <Clock className="h-3 w-3" aria-hidden="true" />
              <span>{readingTime} dk</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

"use client";

import { BlogCard } from "./blog-card";
import { BlogCardSkeleton } from "./blog-card-skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BlogPost {
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

interface BlogListProps {
  posts: BlogPost[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function BlogList({
  posts,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isLoading = false,
  error = null,
}: BlogListProps) {
  // Error state
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Blog yazıları yükleniyor">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div 
        className="flex min-h-[400px] flex-col items-center justify-center text-center"
        role="status"
        aria-label="Blog yazısı bulunamadı"
      >
        <div className="mb-4 text-6xl" aria-hidden="true">📝</div>
        <h3 className="mb-2 text-xl font-semibold">Henüz blog yazısı yok</h3>
        <p className="text-muted-foreground">
          Yakında harika içeriklerle burada olacağız!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Blog Grid */}
      <div 
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Blog yazıları"
      >
        {posts.map((post) => (
          <div key={post.id} role="listitem">
            <BlogCard {...post} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav 
          className="flex items-center justify-center gap-2"
          role="navigation"
          aria-label="Blog sayfalama"
        >
          <Button
            variant="outline"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Önceki sayfa"
          >
            Önceki
          </Button>

          <div className="flex items-center gap-1" role="list">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2" aria-hidden="true">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange?.(page)}
                  aria-label={`Sayfa ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Sonraki sayfa"
          >
            Sonraki
          </Button>
        </nav>
      )}
    </div>
  );
}

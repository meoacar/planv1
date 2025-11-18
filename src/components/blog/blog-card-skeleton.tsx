import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Cover Image Skeleton */}
      <Skeleton className="aspect-video w-full" />

      <CardContent className="p-6">
        {/* Title Skeleton */}
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-4 h-6 w-1/2" />

        {/* Excerpt Skeleton */}
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-6 py-4">
        {/* Author Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Meta Info Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardFooter>
    </Card>
  );
}

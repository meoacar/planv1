"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface BlogSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  autoSearch?: boolean;
}

export function BlogSearch({
  placeholder = "Blog yazılarında ara...",
  onSearch,
  autoSearch = false,
}: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search for auto-search mode
  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (autoSearch && onSearch) {
      onSearch(value);
      setIsSearching(false);
    }
  }, 500);

  useEffect(() => {
    if (autoSearch && query) {
      setIsSearching(true);
      debouncedSearch(query);
    }
  }, [query, autoSearch, debouncedSearch]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      if (onSearch) {
        onSearch(query);
      } else {
        // Navigate to search page with query
        const params = new URLSearchParams(searchParams);
        if (query) {
          params.set("q", query);
        } else {
          params.delete("q");
        }
        router.push(`/blog?${params.toString()}`);
      }
    },
    [query, onSearch, router, searchParams]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    } else {
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      router.push(`/blog?${params.toString()}`);
    }
  }, [onSearch, router, searchParams]);

  return (
    <form onSubmit={handleSearch} className="relative" role="search">
      <div className="relative">
        <label htmlFor="blog-search" className="sr-only">
          Blog yazılarında ara
        </label>
        <Search 
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" 
          aria-hidden="true"
        />
        <Input
          id="blog-search"
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-20"
          aria-label="Arama sorgusu"
          aria-describedby={isSearching ? "search-status" : undefined}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {isSearching && (
            <div role="status" id="search-status">
              <Loader2 
                className="h-4 w-4 animate-spin text-muted-foreground" 
                aria-label="Aranıyor"
              />
            </div>
          )}
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 w-7 p-0"
              aria-label="Aramayı temizle"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {!autoSearch && (
            <Button 
              type="submit" 
              size="sm" 
              className="h-7"
              aria-label="Ara"
            >
              Ara
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

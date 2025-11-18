'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

interface BlogFiltersProps {
  categories: Array<{
    id: string
    name: string
    slug: string
    _count: {
      posts: number
    }
  }>
}

export function BlogFilters({ categories }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') || 'all'
  const currentCategory = searchParams.get('categoryId') || 'all'
  const currentSearch = searchParams.get('search') || ''

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'all' || !value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    // Reset to page 1 when filters change
    params.delete('page')
    
    router.push(`/admin/blog?${params.toString()}`)
  }

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (!value) {
      params.delete('search')
    } else {
      params.set('search', value)
    }
    
    // Reset to page 1 when search changes
    params.delete('page')
    
    router.push(`/admin/blog?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Blog ara..."
          defaultValue={currentSearch}
          onChange={(e) => {
            const value = e.target.value
            // Debounce search
            const timeoutId = setTimeout(() => {
              handleSearch(value)
            }, 500)
            return () => clearTimeout(timeoutId)
          }}
          className="pl-9"
        />
      </div>

      <Select value={currentStatus} onValueChange={(value) => updateFilters('status', value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          <SelectItem value="published">Yayında</SelectItem>
          <SelectItem value="draft">Taslak</SelectItem>
          <SelectItem value="archived">Arşiv</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentCategory} onValueChange={(value) => updateFilters('categoryId', value)}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Kategoriler</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name} ({category._count.posts})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

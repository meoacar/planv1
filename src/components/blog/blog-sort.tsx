'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function BlogSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    
    params.delete('page') // Reset to first page
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sıralama" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">En Yeni</SelectItem>
        <SelectItem value="popular">En Popüler</SelectItem>
      </SelectContent>
    </Select>
  )
}

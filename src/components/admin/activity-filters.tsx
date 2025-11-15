"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface ActivityFiltersProps {
  currentType?: string
  currentSearch?: string
}

export function ActivityFilters({ currentType, currentSearch }: ActivityFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch || '')

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('type')
    } else {
      params.set('type', value)
    }
    params.delete('page') // Reset page
    router.push(`/admin/aktiviteler?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    params.delete('page') // Reset page
    router.push(`/admin/aktiviteler?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Ara..." 
          className="pl-10 w-64" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <Select value={currentType || 'all'} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Tip" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tümü</SelectItem>
          <SelectItem value="plan">Planlar</SelectItem>
          <SelectItem value="comment">Yorumlar</SelectItem>
          <SelectItem value="user">Kullanıcılar</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

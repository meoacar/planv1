"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface PlanFiltersProps {
  currentStatus: string
}

export function PlanFilters({ currentStatus }: PlanFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('status')
    } else {
      params.set('status', value)
    }
    router.push(`/admin/planlar?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    router.push(`/admin/planlar?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Plan ara..." 
          className="pl-10 w-64" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Durum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tümü</SelectItem>
          <SelectItem value="pending">Bekleyen</SelectItem>
          <SelectItem value="published">Yayında</SelectItem>
          <SelectItem value="rejected">Reddedilen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface UserFiltersProps {
  currentRole: string
}

export function UserFilters({ currentRole }: UserFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('role')
    } else {
      params.set('role', value)
    }
    router.push(`/admin/kullanicilar?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    router.push(`/admin/kullanicilar?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Kullanıcı ara..." 
          className="pl-10 w-64" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <Select value={currentRole} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tümü</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="USER">Kullanıcı</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

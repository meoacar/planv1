'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

export function RecipeFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '')
  const [maxCalories, setMaxCalories] = useState(searchParams.get('maxCalories') || '')

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (category) params.append('category', category)
    if (difficulty) params.append('difficulty', difficulty)
    if (maxCalories) params.append('maxCalories', maxCalories)

    router.push(`/tarifler?${params.toString()}`)
  }

  const handleClear = () => {
    setSearch('')
    setCategory('')
    setDifficulty('')
    setMaxCalories('')
    router.push('/tarifler')
  }

  return (
    <div className="bg-card rounded-lg p-6 mb-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            placeholder="Tarif ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
          />
        </div>

        {/* Category */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Kahvaltı</SelectItem>
            <SelectItem value="lunch">Öğle Yemeği</SelectItem>
            <SelectItem value="dinner">Akşam Yemeği</SelectItem>
            <SelectItem value="snack">Atıştırmalık</SelectItem>
            <SelectItem value="dessert">Tatlı</SelectItem>
            <SelectItem value="drink">İçecek</SelectItem>
            <SelectItem value="main">Ana Yemek</SelectItem>
            <SelectItem value="side">Yan Yemek</SelectItem>
            <SelectItem value="salad">Salata</SelectItem>
            <SelectItem value="soup">Çorba</SelectItem>
          </SelectContent>
        </Select>

        {/* Difficulty */}
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Zorluk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Kolay</SelectItem>
            <SelectItem value="medium">Orta</SelectItem>
            <SelectItem value="hard">Zor</SelectItem>
          </SelectContent>
        </Select>

        {/* Max Calories */}
        <Input
          type="number"
          placeholder="Max kalori"
          value={maxCalories}
          onChange={(e) => setMaxCalories(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <Button onClick={handleFilter} className="flex-1">
          <Search className="w-4 h-4 mr-2" />
          Filtrele
        </Button>
        <Button onClick={handleClear} variant="outline">
          <X className="w-4 h-4 mr-2" />
          Temizle
        </Button>
      </div>
    </div>
  )
}

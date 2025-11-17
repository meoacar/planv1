'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ConfessionCategory } from '@/types/confession'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface ConfessionFiltersProps {
  selectedCategory?: ConfessionCategory | 'all'
  showPopular?: boolean
  onCategoryChange?: (category: ConfessionCategory | 'all') => void
  onPopularChange?: (popular: boolean) => void
}

const categories = [
  { value: 'all', label: 'Tümü', icon: '📋' },
  { value: 'night_attack', label: 'Gece Saldırıları', icon: '🌙' },
  { value: 'special_occasion', label: 'Özel Gün', icon: '🎉' },
  { value: 'stress_eating', label: 'Stres', icon: '😰' },
  { value: 'social_pressure', label: 'Sosyal Baskı', icon: '👥' },
  { value: 'no_regrets', label: 'Pişman Değilim', icon: '😎' }
] as const

export function ConfessionFilters({
  selectedCategory = 'all',
  showPopular = false,
  onCategoryChange,
  onPopularChange
}: ConfessionFiltersProps) {
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory)
  const [isPopular, setIsPopular] = useState(showPopular)

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value)
    if (onCategoryChange) {
      onCategoryChange(value as ConfessionCategory | 'all')
    }
  }

  const handlePopularToggle = (checked: boolean) => {
    setIsPopular(checked)
    if (onPopularChange) {
      onPopularChange(checked)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Kategori Filtreleri - Tabs */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Kategori</Label>
            <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-2">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-xs">{category.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Popüler Toggle */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <Label htmlFor="popular-toggle" className="cursor-pointer">
                Sadece Popüler İtiraflar
              </Label>
            </div>
            <Switch
              id="popular-toggle"
              checked={isPopular}
              onCheckedChange={handlePopularToggle}
            />
          </div>

          {/* Aktif Filtre Bilgisi */}
          {(activeCategory !== 'all' || isPopular) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-muted-foreground pt-2 border-t"
            >
              <span className="font-medium">Aktif Filtreler:</span>
              {activeCategory !== 'all' && (
                <span className="ml-2">
                  {categories.find((c) => c.value === activeCategory)?.label}
                </span>
              )}
              {isPopular && (
                <span className="ml-2">• Popüler</span>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

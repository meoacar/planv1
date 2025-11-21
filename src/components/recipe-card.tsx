'use client'

import Link from 'next/link'
import Image from 'next/image'
import { RecipeWithAuthor } from '@/types'
import { Clock, Users, Flame, Heart, MessageCircle, Eye } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface RecipeCardProps {
  recipe: RecipeWithAuthor
}

const categoryLabels: Record<string, string> = {
  breakfast: 'Kahvaltı',
  lunch: 'Öğle Yemeği',
  dinner: 'Akşam Yemeği',
  snack: 'Atıştırmalık',
  dessert: 'Tatlı',
  drink: 'İçecek',
  main: 'Ana Yemek',
  side: 'Yan Yemek',
  salad: 'Salata',
  soup: 'Çorba',
}

const difficultyLabels: Record<string, string> = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-700 dark:text-green-400',
  medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  hard: 'bg-red-500/10 text-red-700 dark:text-red-400',
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
  const images = recipe.images ? JSON.parse(recipe.images) : []
  const firstImage = images[0]

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/tarif/${recipe.slug}`}>
        <div className="relative aspect-video bg-muted">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Flame className="w-16 h-16 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge className={difficultyColors[recipe.difficulty]}>
              {difficultyLabels[recipe.difficulty]}
            </Badge>
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              +{images.length - 1} foto
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/tarif/${recipe.slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {recipe.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {recipe.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{totalTime} dk</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} kişilik</span>
          </div>
          {recipe.calories && (
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4" />
              <span>{Math.round(recipe.calories)} kcal</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {categoryLabels[recipe.category]}
          </Badge>
          {recipe.tags && JSON.parse(recipe.tags).slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Link href={`/profil/${recipe.author.username || recipe.author.id}`}>
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar className="w-6 h-6">
              <AvatarImage src={recipe.author.image || undefined} alt={`${recipe.author.name || 'Yazar'} profil fotoğrafı`} />
              <AvatarFallback>{recipe.author.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {recipe.author.name || recipe.author.username}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{recipe._count?.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{recipe._count?.comments || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{recipe.views}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

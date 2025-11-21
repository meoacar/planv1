import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Clock, TrendingUp, ArrowRight } from 'lucide-react'

interface RelatedPlan {
  id: string
  slug: string
  title: string
  description: string
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
  targetWeightLoss: number | null
  authorWeightLoss: number | null
  averageRating: number
  likesCount: number
  author: {
    name: string | null
    username: string | null
  }
}

interface RelatedPlansProps {
  plans: RelatedPlan[]
  title?: string
}

const difficultyLabels = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export function RelatedPlans({ plans, title = "📋 Bu Yazıyla İlgili Planlar" }: RelatedPlansProps) {
  if (plans.length === 0) {
    return null
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Bu içeriği uygulamaya geçirmek için hazır planlar
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {plans.map((plan) => (
          <Link
            key={plan.id}
            href={`/plan/${plan.slug}`}
            className="block group"
          >
            <div className="p-4 rounded-lg border-2 hover:border-primary hover:shadow-md transition-all bg-card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 flex-1">
                  {plan.title}
                </h4>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {plan.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="outline" className={`text-xs ${difficultyColors[plan.difficulty]}`}>
                  {difficultyLabels[plan.difficulty]}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {plan.duration} gün
                </span>
                {(plan.authorWeightLoss || plan.targetWeightLoss) && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {plan.authorWeightLoss || plan.targetWeightLoss}kg
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  @{plan.author.username || 'kullanici'}
                </span>
                {plan.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{plan.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}

        <Button asChild variant="outline" className="w-full mt-2" size="sm">
          <Link href="/kesfet">
            Tüm Planları Keşfet
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

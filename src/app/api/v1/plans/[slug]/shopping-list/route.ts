import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const plan = await db.plan.findUnique({
      where: { slug },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' },
        },
      },
    })

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Extract ingredients from all meals
    const ingredients = new Set<string>()
    
    plan.days.forEach((day) => {
      const meals = [
        day.breakfast,
        day.snack1,
        day.lunch,
        day.snack2,
        day.dinner,
      ]

      meals.forEach((meal) => {
        if (meal) {
          // Simple extraction - split by newlines and common separators
          const lines = meal.split(/\n|,|;/)
          lines.forEach((line) => {
            const cleaned = line.trim()
            if (cleaned && cleaned.length > 2) {
              ingredients.add(cleaned)
            }
          })
        }
      })
    })

    // Group ingredients by category (basic categorization)
    const categorized = {
      'Sebze & Meyve': [] as string[],
      'Et & Protein': [] as string[],
      'Süt Ürünleri': [] as string[],
      'Tahıllar': [] as string[],
      'Diğer': [] as string[],
    }

    const vegKeywords = ['domates', 'salatalık', 'marul', 'havuç', 'biber', 'soğan', 'sarımsak', 'patates', 'kabak', 'patlıcan', 'meyve', 'elma', 'muz', 'portakal', 'çilek']
    const proteinKeywords = ['tavuk', 'et', 'balık', 'yumurta', 'ton', 'hindi', 'köfte']
    const dairyKeywords = ['süt', 'yoğurt', 'peynir', 'ayran', 'kefir']
    const grainKeywords = ['ekmek', 'pirinç', 'makarna', 'bulgur', 'yulaf', 'tahıl']

    Array.from(ingredients).forEach((item) => {
      const lower = item.toLowerCase()
      if (vegKeywords.some(k => lower.includes(k))) {
        categorized['Sebze & Meyve'].push(item)
      } else if (proteinKeywords.some(k => lower.includes(k))) {
        categorized['Et & Protein'].push(item)
      } else if (dairyKeywords.some(k => lower.includes(k))) {
        categorized['Süt Ürünleri'].push(item)
      } else if (grainKeywords.some(k => lower.includes(k))) {
        categorized['Tahıllar'].push(item)
      } else {
        categorized['Diğer'].push(item)
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        planTitle: plan.title,
        duration: plan.duration,
        categories: categorized,
        totalItems: ingredients.size,
      },
    })
  } catch (error) {
    console.error('Shopping list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

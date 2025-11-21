import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// Simple nutrition estimation based on common foods
const nutritionDatabase: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  // Proteins
  'tavuk': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  'yumurta': { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  'balık': { calories: 206, protein: 22, carbs: 0, fat: 12 },
  'ton balığı': { calories: 132, protein: 28, carbs: 0, fat: 1.3 },
  'köfte': { calories: 250, protein: 17, carbs: 8, fat: 17 },
  
  // Dairy
  'süt': { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  'yoğurt': { calories: 59, protein: 3.5, carbs: 4.7, fat: 3.3 },
  'peynir': { calories: 402, protein: 25, carbs: 1.3, fat: 33 },
  'beyaz peynir': { calories: 264, protein: 18, carbs: 4, fat: 21 },
  
  // Grains
  'ekmek': { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  'pirinç': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  'makarna': { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
  'bulgur': { calories: 83, protein: 3, carbs: 19, fat: 0.2 },
  'yulaf': { calories: 389, protein: 17, carbs: 66, fat: 7 },
  
  // Vegetables
  'domates': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  'salatalık': { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },
  'marul': { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
  'havuç': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  'biber': { calories: 31, protein: 1, carbs: 6, fat: 0.3 },
  'patates': { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  
  // Fruits
  'elma': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  'muz': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  'portakal': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
  
  // Others
  'zeytinyağı': { calories: 884, protein: 0, carbs: 0, fat: 100 },
  'fındık': { calories: 628, protein: 15, carbs: 17, fat: 61 },
  'ceviz': { calories: 654, protein: 15, carbs: 14, fat: 65 },
}

function estimateNutrition(text: string): { calories: number; protein: number; carbs: number; fat: number } {
  const result = { calories: 0, protein: 0, carbs: 0, fat: 0 }
  const lower = text.toLowerCase()

  Object.entries(nutritionDatabase).forEach(([food, nutrition]) => {
    if (lower.includes(food)) {
      result.calories += nutrition.calories
      result.protein += nutrition.protein
      result.carbs += nutrition.carbs
      result.fat += nutrition.fat
    }
  })

  // If no match, estimate based on meal type
  if (result.calories === 0) {
    result.calories = 300
    result.protein = 15
    result.carbs = 35
    result.fat = 10
  }

  return result
}

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

    // Calculate nutrition for each day
    const dailyNutrition = plan.days.map((day) => {
      const dayTotal = { calories: 0, protein: 0, carbs: 0, fat: 0 }

      const meals = [
        { name: 'Kahvaltı', content: day.breakfast },
        { name: 'Ara Öğün 1', content: day.snack1 },
        { name: 'Öğle', content: day.lunch },
        { name: 'Ara Öğün 2', content: day.snack2 },
        { name: 'Akşam', content: day.dinner },
      ]

      const mealNutrition = meals.map((meal) => {
        if (!meal.content) return null
        const nutrition = estimateNutrition(meal.content)
        dayTotal.calories += nutrition.calories
        dayTotal.protein += nutrition.protein
        dayTotal.carbs += nutrition.carbs
        dayTotal.fat += nutrition.fat
        return {
          name: meal.name,
          ...nutrition,
        }
      }).filter(Boolean)

      return {
        day: day.dayNumber,
        total: dayTotal,
        meals: mealNutrition,
      }
    })

    // Calculate averages
    const avgCalories = Math.round(
      dailyNutrition.reduce((sum, day) => sum + day.total.calories, 0) / plan.days.length
    )
    const avgProtein = Math.round(
      dailyNutrition.reduce((sum, day) => sum + day.total.protein, 0) / plan.days.length
    )
    const avgCarbs = Math.round(
      dailyNutrition.reduce((sum, day) => sum + day.total.carbs, 0) / plan.days.length
    )
    const avgFat = Math.round(
      dailyNutrition.reduce((sum, day) => sum + day.total.fat, 0) / plan.days.length
    )

    return NextResponse.json({
      success: true,
      data: {
        planTitle: plan.title,
        duration: plan.duration,
        averages: {
          calories: avgCalories,
          protein: avgProtein,
          carbs: avgCarbs,
          fat: avgFat,
        },
        daily: dailyNutrition,
        note: 'Besin değerleri tahminidir. Gerçek değerler porsiyon büyüklüğüne göre değişebilir.',
      },
    })
  } catch (error) {
    console.error('Nutrition calculation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

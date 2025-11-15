import { z } from 'zod'

export const ingredientSchema = z.object({
  name: z.string().min(1, 'Malzeme adı gerekli'),
  amount: z.string().min(1, 'Miktar gerekli'),
  unit: z.string().optional(),
})

export const createRecipeSchema = z.object({
  title: z.string().min(5, 'Başlık en az 5 karakter olmalı').max(100, 'Başlık en fazla 100 karakter olabilir'),
  description: z.string().min(20, 'Açıklama en az 20 karakter olmalı').max(2000, 'Açıklama en fazla 2000 karakter olabilir'),
  ingredients: z.array(ingredientSchema).min(1, 'En az 1 malzeme eklemelisiniz'),
  instructions: z.string().min(50, 'Tarif adımları en az 50 karakter olmalı').max(5000, 'Tarif adımları en fazla 5000 karakter olabilir'),
  prepTime: z.number().int().min(0).max(1440).optional(), // max 24 hours
  cookTime: z.number().int().min(0).max(1440).optional(),
  servings: z.number().int().min(1, 'En az 1 porsiyon olmalı').max(50, 'En fazla 50 porsiyon olabilir'),
  calories: z.number().min(0).max(10000).optional(),
  protein: z.number().min(0).max(1000).optional(),
  carbs: z.number().min(0).max(1000).optional(),
  fat: z.number().min(0).max(1000).optional(),
  fiber: z.number().min(0).max(1000).optional(),
  category: z.enum(['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink', 'main', 'side', 'salad', 'soup']),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).max(10).optional(),
  images: z.array(z.string().url()).max(4, 'En fazla 4 resim ekleyebilirsiniz').optional(),
  videoUrl: z.string().url().optional(),
})

export const updateRecipeSchema = createRecipeSchema.partial()

export const recipeCommentSchema = z.object({
  body: z.string().min(1, 'Yorum boş olamaz').max(1000, 'Yorum en fazla 1000 karakter olabilir'),
})

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>
export type IngredientInput = z.infer<typeof ingredientSchema>
export type RecipeCommentInput = z.infer<typeof recipeCommentSchema>

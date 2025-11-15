import { z } from 'zod'

export const planDaySchema = z.object({
  dayNumber: z.number().int().min(1),
  breakfast: z.string().max(1000).optional(),
  snack1: z.string().max(500).optional(),
  lunch: z.string().max(1000).optional(),
  snack2: z.string().max(500).optional(),
  dinner: z.string().max(1000).optional(),
  notes: z.string().max(500).optional(),
})

export const createPlanSchema = z.object({
  title: z.string().min(5, 'Başlık en az 5 karakter olmalı').max(100, 'Başlık en fazla 100 karakter olabilir'),
  description: z.string().min(20, 'Açıklama en az 20 karakter olmalı').max(2000, 'Açıklama en fazla 2000 karakter olabilir'),
  duration: z.number().int().min(1, 'Süre en az 1 gün olmalı').max(365, 'Süre en fazla 365 gün olabilir'),
  targetWeightLoss: z.number().min(0).max(100).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).max(10).optional(),
  authorStory: z.string().max(2000).optional(),
  authorWeightLoss: z.number().min(0).max(100).optional(),
  authorDuration: z.number().int().min(1).max(365).optional(),
  days: z.array(planDaySchema).min(1, 'En az 1 gün planı olmalı'),
})

export const updatePlanSchema = createPlanSchema.partial()

export const commentSchema = z.object({
  body: z.string().min(1, 'Yorum boş olamaz').max(1000, 'Yorum en fazla 1000 karakter olabilir'),
  targetType: z.enum(['plan', 'photo']),
  targetId: z.string().cuid(),
})

export type CreatePlanInput = z.infer<typeof createPlanSchema>
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>
export type PlanDayInput = z.infer<typeof planDaySchema>
export type CommentInput = z.infer<typeof commentSchema>

import { z } from 'zod'

export const weightLogSchema = z.object({
  weight: z.number().min(30, 'Kilo en az 30kg olmalı').max(300, 'Kilo en fazla 300kg olabilir'),
  date: z.date().optional(),
  note: z.string().max(500).optional(),
})

export const progressPhotoSchema = z.object({
  photoUrl: z.string().url(),
  weight: z.number().min(30).max(300).optional(),
  type: z.enum(['before', 'after', 'progress']),
  caption: z.string().max(500).optional(),
})

export type WeightLogInput = z.infer<typeof weightLogSchema>
export type ProgressPhotoInput = z.infer<typeof progressPhotoSchema>

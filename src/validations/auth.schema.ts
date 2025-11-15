import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  username: z.string()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalı')
    .max(20, 'Kullanıcı adı en fazla 20 karakter olabilir')
    .regex(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir')
    .optional(),
  name: z.string().min(2, 'İsim en az 2 karakter olmalı').optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string().min(1, 'Şifre gerekli'),
})

export const profileSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı').optional(),
  username: z.string()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalı')
    .max(20, 'Kullanıcı adı en fazla 20 karakter olabilir')
    .regex(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir')
    .optional(),
  bio: z.string().max(500, 'Bio en fazla 500 karakter olabilir').optional(),
  currentWeight: z.number().min(30).max(300).optional(),
  targetWeight: z.number().min(30).max(300).optional(),
  height: z.number().min(100).max(250).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProfileInput = z.infer<typeof profileSchema>

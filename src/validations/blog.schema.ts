import { z } from 'zod'

// Blog Post Create Schema
export const createBlogPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Başlık en az 5 karakter olmalı')
    .max(200, 'Başlık en fazla 200 karakter olabilir')
    .trim(),
  slug: z
    .string()
    .min(3, 'Slug en az 3 karakter olmalı')
    .max(200, 'Slug en fazla 200 karakter olabilir')
    .regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir')
    .optional(),
  content: z
    .string()
    .min(100, 'İçerik en az 100 karakter olmalı')
    .trim(),
  excerpt: z
    .string()
    .max(300, 'Özet en fazla 300 karakter olabilir')
    .optional(),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().max(200).optional(),
  metaTitle: z.string().max(100, 'Meta başlık en fazla 100 karakter olabilir').optional(),
  metaDescription: z.string().max(160, 'Meta açıklama en fazla 160 karakter olabilir').optional(),
  categoryId: z.string().min(1, 'Lütfen bir kategori seçin').cuid('Geçerli bir kategori seçiniz'),
  tags: z.array(z.string()).max(10, 'En fazla 10 etiket ekleyebilirsiniz').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  featured: z.boolean().optional(),
  featuredOrder: z.number().int().min(0).max(10).optional(),
})

// Blog Post Update Schema
export const updateBlogPostSchema = createBlogPostSchema.partial().extend({
  id: z.string().cuid(),
})

// Blog Category Schema
export const createBlogCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Kategori adı en az 2 karakter olmalı')
    .max(50, 'Kategori adı en fazla 50 karakter olabilir')
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug en az 2 karakter olmalı')
    .max(50, 'Slug en fazla 50 karakter olabilir')
    .regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir')
    .optional(),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Geçerli bir hex renk kodu giriniz').optional(),
  order: z.number().int().min(0).optional(),
})

export const updateBlogCategorySchema = createBlogCategorySchema.partial().extend({
  id: z.string().cuid(),
})

// Blog Comment Schema
export const blogCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Yorum boş olamaz')
    .max(1000, 'Yorum en fazla 1000 karakter olabilir')
    .trim(),
})

// Blog Comment Moderation Schema
export const moderateBlogCommentSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SPAM']),
})

// Types
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>
export type CreateBlogCategoryInput = z.infer<typeof createBlogCategorySchema>
export type UpdateBlogCategoryInput = z.infer<typeof updateBlogCategorySchema>
export type BlogCommentInput = z.infer<typeof blogCommentSchema>
export type ModerateBlogCommentInput = z.infer<typeof moderateBlogCommentSchema>

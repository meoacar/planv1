'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createPlan(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Giriş yapmalısınız')
  }

  // Basic info
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const duration = parseInt(formData.get('duration') as string)
  const targetWeightLoss = formData.get('targetWeightLoss') as string
  const difficulty = formData.get('difficulty') as string
  const tags = formData.get('tags') as string

  // Author story
  const authorStory = formData.get('authorStory') as string
  const authorWeightLoss = formData.get('authorWeightLoss') as string
  const authorDuration = formData.get('authorDuration') as string

  // Validation
  if (!title || !description || !duration || !difficulty) {
    throw new Error('Zorunlu alanları doldurun')
  }

  if (duration < 1 || duration > 365) {
    throw new Error('Süre 1-365 gün arasında olmalı')
  }

  // Generate unique slug
  let slug = generateSlug(title)
  let slugExists = await db.plan.findUnique({ where: { slug } })
  let counter = 1
  
  while (slugExists) {
    slug = `${generateSlug(title)}-${counter}`
    slugExists = await db.plan.findUnique({ where: { slug } })
    counter++
  }

  // Create plan
  const plan = await db.plan.create({
    data: {
      slug,
      title,
      description,
      authorId: session.user.id,
      duration,
      targetWeightLoss: targetWeightLoss ? parseFloat(targetWeightLoss) : null,
      difficulty: difficulty as any,
      tags: tags || null,
      authorStory: authorStory || null,
      authorWeightLoss: authorWeightLoss ? parseFloat(authorWeightLoss) : null,
      authorDuration: authorDuration ? parseInt(authorDuration) : null,
      status: 'pending', // Admin onayı bekliyor
    },
  })

  // Create days
  const days = []
  for (let i = 1; i <= duration; i++) {
    const breakfast = formData.get(`day${i}-breakfast`) as string
    const snack1 = formData.get(`day${i}-snack1`) as string
    const lunch = formData.get(`day${i}-lunch`) as string
    const snack2 = formData.get(`day${i}-snack2`) as string
    const dinner = formData.get(`day${i}-dinner`) as string
    const notes = formData.get(`day${i}-notes`) as string

    // Only create day if at least one meal is provided
    if (breakfast || snack1 || lunch || snack2 || dinner) {
      days.push({
        planId: plan.id,
        dayNumber: i,
        breakfast: breakfast || null,
        snack1: snack1 || null,
        lunch: lunch || null,
        snack2: snack2 || null,
        dinner: dinner || null,
        notes: notes || null,
      })
    }
  }

  if (days.length > 0) {
    await db.planDay.createMany({ data: days })
  }

  revalidatePath('/planlarim')
  revalidatePath('/kesfet')
  
  redirect('/planlarim')
}

export async function saveDraft(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Giriş yapmalısınız')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const duration = formData.get('duration') as string

  if (!title || !description || !duration) {
    throw new Error('En azından başlık, açıklama ve süre gerekli')
  }

  // Generate unique slug
  let slug = generateSlug(title)
  let slugExists = await db.plan.findUnique({ where: { slug } })
  let counter = 1
  
  while (slugExists) {
    slug = `${generateSlug(title)}-${counter}`
    slugExists = await db.plan.findUnique({ where: { slug } })
    counter++
  }

  const targetWeightLoss = formData.get('targetWeightLoss') as string
  const difficulty = formData.get('difficulty') as string
  const authorStory = formData.get('authorStory') as string
  const authorWeightLoss = formData.get('authorWeightLoss') as string
  const authorDuration = formData.get('authorDuration') as string

  await db.plan.create({
    data: {
      slug,
      title,
      description,
      authorId: session.user.id,
      duration: parseInt(duration),
      targetWeightLoss: targetWeightLoss ? parseFloat(targetWeightLoss) : null,
      difficulty: (difficulty as any) || 'medium',
      authorStory: authorStory || null,
      authorWeightLoss: authorWeightLoss ? parseFloat(authorWeightLoss) : null,
      authorDuration: authorDuration ? parseInt(authorDuration) : null,
      status: 'draft',
    },
  })

  revalidatePath('/planlarim')
  redirect('/planlarim')
}

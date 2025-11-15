'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const username = formData.get('username') as string
  const bio = formData.get('bio') as string
  const image = formData.get('image') as string

  // Validate image URL if provided
  if (image && image.trim()) {
    // Allow base64 images (data:image/...)
    const isBase64 = image.startsWith('data:image/')
    // Allow relative paths (starts with /)
    const isRelativePath = image.startsWith('/')
    // Allow full URLs
    const isValidUrl = !isBase64 && !isRelativePath
    
    if (isValidUrl) {
      try {
        new URL(image)
      } catch {
        throw new Error('Geçersiz resim URL\'si')
      }
    }
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: name || null,
      username: username || null,
      bio: bio || null,
      image: image && image.trim() ? image : null,
    },
  })

  revalidatePath('/ayarlar')
  revalidatePath('/dashboard')
  revalidatePath('/profil/[username]', 'page')
  
  return { success: true }
}

export async function updateWeightInfo(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const height = formData.get('height') as string
  const currentWeight = formData.get('currentWeight') as string
  const targetWeight = formData.get('targetWeight') as string

  await db.user.update({
    where: { id: session.user.id },
    data: {
      height: height ? parseFloat(height) : null,
      currentWeight: currentWeight ? parseFloat(currentWeight) : null,
      targetWeight: targetWeight ? parseFloat(targetWeight) : null,
    },
  })

  revalidatePath('/ayarlar')
  revalidatePath('/dashboard')
  
  return { success: true }
}

export async function deleteAccount() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // Delete user and all related data (cascade)
  await db.user.delete({
    where: { id: session.user.id },
  })

  return { success: true }
}

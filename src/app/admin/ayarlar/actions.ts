'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const settings = await db.setting.findMany()
  
  // Convert to key-value object
  const settingsObj: Record<string, string> = {}
  settings.forEach(setting => {
    settingsObj[setting.key] = setting.value
  })

  return settingsObj
}

export async function updateSetting(key: string, value: string, category: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await db.setting.upsert({
    where: { key },
    update: { value, category },
    create: { key, value, category },
  })

  revalidatePath('/admin/ayarlar')
  return { success: true }
}

export async function updateSettings(settings: Record<string, { value: string; category: string }>) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Update all settings
  await Promise.all(
    Object.entries(settings).map(([key, { value, category }]) =>
      db.setting.upsert({
        where: { key },
        update: { value, category },
        create: { key, value, category },
      })
    )
  )

  // Clear settings cache
  const { clearSettingsCache } = await import('@/lib/settings')
  clearSettingsCache()

  revalidatePath('/admin/ayarlar')
  revalidatePath('/', 'layout')
  return { success: true }
}

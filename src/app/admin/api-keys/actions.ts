'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function getApiKeys() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const apiKeys = await db.apiKey.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return apiKeys
}

export async function createApiKey(data: {
  name: string
  permissions: string[]
  expiresInDays?: number
}) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Generate secure API key
  const key = `sk_${crypto.randomBytes(32).toString('hex')}`

  // Calculate expiration date
  const expiresAt = data.expiresInDays
    ? new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000)
    : null

  const apiKey = await db.apiKey.create({
    data: {
      name: data.name,
      key,
      permissions: JSON.stringify(data.permissions),
      expiresAt,
      createdBy: session.user.id!,
    },
  })

  revalidatePath('/admin/api-keys')
  return { success: true, apiKey }
}

export async function toggleApiKey(apiKeyId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const apiKey = await db.apiKey.findUnique({ where: { id: apiKeyId } })
  if (!apiKey) throw new Error('API key not found')

  await db.apiKey.update({
    where: { id: apiKeyId },
    data: { isActive: !apiKey.isActive },
  })

  revalidatePath('/admin/api-keys')
  return { success: true }
}

export async function deleteApiKey(apiKeyId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await db.apiKey.delete({
    where: { id: apiKeyId },
  })

  revalidatePath('/admin/api-keys')
  return { success: true }
}

export async function verifyApiKey(key: string) {
  const apiKey = await db.apiKey.findUnique({
    where: { key, isActive: true },
  })

  if (!apiKey) {
    return { valid: false, error: 'Invalid API key' }
  }

  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    return { valid: false, error: 'API key expired' }
  }

  // Update last used
  await db.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  })

  return {
    valid: true,
    permissions: JSON.parse(apiKey.permissions),
  }
}

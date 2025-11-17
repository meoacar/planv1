'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addWeightLog(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Giriş yapmalısınız' }
  }

  const weightStr = formData.get('weight') as string
  const dateStr = formData.get('date') as string
  const note = (formData.get('note') as string) || ''

  if (!weightStr || !dateStr) {
    return { error: 'Kilo ve tarih gerekli' }
  }

  const weight = parseFloat(weightStr)

  if (isNaN(weight) || weight < 30 || weight > 300) {
    return { error: 'Geçerli bir kilo girin (30-300 kg)' }
  }

  try {
    // Tarihi düzgün parse et
    const dateObj = new Date(dateStr + 'T00:00:00.000Z')
    
    // Aynı gün için kayıt var mı kontrol et
    const existingLog = await db.weightLog.findFirst({
      where: {
        userId: session.user.id,
        date: dateObj,
      },
    })

    if (existingLog) {
      // Güncelle
      await db.weightLog.update({
        where: { id: existingLog.id },
        data: {
          weight,
          note: note || null,
        },
      })
    } else {
      // Yeni kayıt
      await db.weightLog.create({
        data: {
          userId: session.user.id,
          weight,
          date: dateObj,
          note: note || null,
        },
      })

      // Gamification: Update quest progress for weight logging
      try {
        const { updateQuestProgress } = await import('@/services/gamification.service')
        await updateQuestProgress(session.user.id, 'daily_weigh_in', 1)
        console.log('✅ Quest progress updated: daily_weigh_in')
      } catch (error) {
        console.error('❌ Gamification error:', error)
      }
    }

    // Kullanıcının mevcut kilosunu güncelle
    await db.user.update({
      where: { id: session.user.id },
      data: { currentWeight: weight },
    })

    revalidatePath('/kilo-takibi')
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Weight log error:', error)
    return { error: 'Bir hata oluştu' }
  }
}

export async function deleteWeightLog(logId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Giriş yapmalısınız' }
  }

  try {
    // Kaydın kullanıcıya ait olduğunu kontrol et
    const log = await db.weightLog.findUnique({
      where: { id: logId },
    })

    if (!log || log.userId !== session.user.id) {
      return { error: 'Kayıt bulunamadı' }
    }

    await db.weightLog.delete({
      where: { id: logId },
    })

    revalidatePath('/kilo-takibi')
    
    return { success: true }
  } catch (error) {
    console.error('Delete weight log error:', error)
    return { error: 'Bir hata oluştu' }
  }
}

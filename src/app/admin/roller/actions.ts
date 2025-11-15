'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getRoleStats() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [totalUsers, adminUsers, normalUsers, adminList] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: 'ADMIN' } }),
    db.user.count({ where: { role: 'USER' } }),
    db.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        isBanned: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return {
    totalUsers,
    adminUsers,
    normalUsers,
    adminList,
  }
}

export async function getAllPermissions() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Tüm mevcut izinler
  const allPermissions = [
    // Plan izinleri
    { resource: 'plan', action: 'create', description: 'Plan Oluşturma' },
    { resource: 'plan', action: 'read', description: 'Plan Görüntüleme' },
    { resource: 'plan', action: 'update_own', description: 'Kendi Planını Düzenleme' },
    { resource: 'plan', action: 'update_any', description: 'Tüm Planları Düzenleme' },
    { resource: 'plan', action: 'delete_own', description: 'Kendi Planını Silme' },
    { resource: 'plan', action: 'delete_any', description: 'Tüm Planları Silme' },
    { resource: 'plan', action: 'approve', description: 'Plan Onaylama' },
    { resource: 'plan', action: 'reject', description: 'Plan Reddetme' },
    
    // Yorum izinleri
    { resource: 'comment', action: 'create', description: 'Yorum Yapma' },
    { resource: 'comment', action: 'read', description: 'Yorum Görüntüleme' },
    { resource: 'comment', action: 'update_own', description: 'Kendi Yorumunu Düzenleme' },
    { resource: 'comment', action: 'delete_own', description: 'Kendi Yorumunu Silme' },
    { resource: 'comment', action: 'delete_any', description: 'Tüm Yorumları Silme' },
    { resource: 'comment', action: 'moderate', description: 'Yorum Moderasyonu' },
    
    // Kullanıcı izinleri
    { resource: 'user', action: 'read', description: 'Kullanıcı Görüntüleme' },
    { resource: 'user', action: 'update_own', description: 'Kendi Profilini Düzenleme' },
    { resource: 'user', action: 'update_any', description: 'Tüm Kullanıcıları Düzenleme' },
    { resource: 'user', action: 'delete', description: 'Kullanıcı Silme' },
    { resource: 'user', action: 'ban', description: 'Kullanıcı Yasaklama' },
    { resource: 'user', action: 'change_role', description: 'Rol Değiştirme' },
    
    // Ayar izinleri
    { resource: 'setting', action: 'read', description: 'Ayarları Görüntüleme' },
    { resource: 'setting', action: 'update', description: 'Ayarları Değiştirme' },
    
    // İstatistik izinleri
    { resource: 'stat', action: 'read', description: 'İstatistikleri Görüntüleme' },
    { resource: 'stat', action: 'export', description: 'İstatistik Dışa Aktarma' },
    
    // Log izinleri
    { resource: 'log', action: 'read', description: 'Logları Görüntüleme' },
    { resource: 'log', action: 'delete', description: 'Log Silme' },
    
    // Sistem izinleri
    { resource: 'system', action: 'manage', description: 'Sistem Yönetimi' },
    { resource: 'system', action: 'backup', description: 'Yedekleme' },
  ]

  return allPermissions
}

export async function getRolePermissions(role: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const permissions = await db.rolePermission.findMany({
    where: { role },
    select: {
      resource: true,
      action: true,
      description: true,
    },
  })

  return permissions
}

export async function updateRolePermissions(
  role: string,
  permissions: Array<{ resource: string; action: string; description: string }>
) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Önce mevcut izinleri sil
  await db.rolePermission.deleteMany({
    where: { role },
  })

  // Yeni izinleri ekle
  await db.rolePermission.createMany({
    data: permissions.map(p => ({
      role,
      resource: p.resource,
      action: p.action,
      description: p.description,
    })),
  })

  revalidatePath('/admin/roller')
  return { success: true }
}

export async function initializeDefaultPermissions() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // USER varsayılan izinleri
  const userPermissions = [
    { role: 'USER', resource: 'plan', action: 'create', description: 'Plan Oluşturma' },
    { role: 'USER', resource: 'plan', action: 'read', description: 'Plan Görüntüleme' },
    { role: 'USER', resource: 'plan', action: 'update_own', description: 'Kendi Planını Düzenleme' },
    { role: 'USER', resource: 'plan', action: 'delete_own', description: 'Kendi Planını Silme' },
    { role: 'USER', resource: 'comment', action: 'create', description: 'Yorum Yapma' },
    { role: 'USER', resource: 'comment', action: 'read', description: 'Yorum Görüntüleme' },
    { role: 'USER', resource: 'comment', action: 'update_own', description: 'Kendi Yorumunu Düzenleme' },
    { role: 'USER', resource: 'comment', action: 'delete_own', description: 'Kendi Yorumunu Silme' },
    { role: 'USER', resource: 'user', action: 'read', description: 'Kullanıcı Görüntüleme' },
    { role: 'USER', resource: 'user', action: 'update_own', description: 'Kendi Profilini Düzenleme' },
  ]

  // ADMIN tüm izinler
  const allPermissions = await getAllPermissions()
  const adminPermissions = allPermissions.map(p => ({
    role: 'ADMIN',
    ...p
  }))

  // Mevcut izinleri temizle
  await db.rolePermission.deleteMany({})

  // Yeni izinleri ekle
  await db.rolePermission.createMany({
    data: [...userPermissions, ...adminPermissions],
  })

  revalidatePath('/admin/roller')
  return { success: true }
}

export async function getAllRoles() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Mevcut rolleri al
  const permissions = await db.rolePermission.findMany({
    select: { role: true },
    distinct: ['role'],
  })

  const roles = permissions.map(p => p.role)
  
  // Varsayılan roller her zaman olsun
  const defaultRoles = ['USER', 'ADMIN']
  const allRoles = Array.from(new Set([...defaultRoles, ...roles]))

  return allRoles.sort()
}

export async function createRole(roleName: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Rol adını büyük harfe çevir ve temizle
  const cleanRoleName = roleName.toUpperCase().trim().replace(/\s+/g, '_')

  // Rol zaten var mı kontrol et
  const existing = await db.rolePermission.findFirst({
    where: { role: cleanRoleName },
  })

  if (existing) {
    throw new Error('Bu rol zaten mevcut')
  }

  // Boş rol oluştur (izinler sonra eklenecek)
  await db.rolePermission.create({
    data: {
      role: cleanRoleName,
      resource: 'user',
      action: 'read',
      description: 'Kullanıcı Görüntüleme',
    },
  })

  revalidatePath('/admin/roller')
  return { success: true, role: cleanRoleName }
}

export async function deleteRole(roleName: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Sistem rollerini silmeye izin verme
  if (roleName === 'USER' || roleName === 'ADMIN') {
    throw new Error('Sistem rolleri silinemez')
  }

  // Rolü sil
  await db.rolePermission.deleteMany({
    where: { role: roleName },
  })

  revalidatePath('/admin/roller')
  return { success: true }
}

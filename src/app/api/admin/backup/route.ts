import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { exec } from 'child_process'
import { promisify } from 'util'
import { getSetting } from '@/lib/settings'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Yedekleme ayarlarını al
    const backupPath = await getSetting('backupPath', './backups')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `backup-${timestamp}.sql`
    const fullPath = path.join(process.cwd(), backupPath, filename)

    // Klasör yoksa oluştur
    await fs.mkdir(path.join(process.cwd(), backupPath), { recursive: true })

    // Database bilgilerini al
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not found')
    }

    // MySQL connection string'i parse et
    const match = databaseUrl.match(/mysql:\/\/([^:]+):?([^@]*)@([^:]+):(\d+)\/(.+)/)
    if (!match) {
      throw new Error('Invalid DATABASE_URL format')
    }

    const [, user, password, host, port, database] = match

    // mysqldump komutu
    const command = password
      ? `mysqldump -h ${host} -P ${port} -u ${user} -p${password} ${database} > "${fullPath}"`
      : `mysqldump -h ${host} -P ${port} -u ${user} ${database} > "${fullPath}"`

    // Yedekleme yap
    await execAsync(command)

    // Eski yedekleri temizle
    const retentionDays = parseInt(await getSetting('backupRetention', '7'))
    const files = await fs.readdir(path.join(process.cwd(), backupPath))
    const now = Date.now()

    for (const file of files) {
      if (file.startsWith('backup-') && file.endsWith('.sql')) {
        const filePath = path.join(process.cwd(), backupPath, file)
        const stats = await fs.stat(filePath)
        const age = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24)

        if (age > retentionDays) {
          await fs.unlink(filePath)
        }
      }
    }

    // Son yedekleme tarihini kaydet
    const { db } = await import('@/lib/db')
    await db.setting.upsert({
      where: { key: 'lastBackupDate' },
      update: { value: new Date().toISOString(), category: 'backup' },
      create: { key: 'lastBackupDate', value: new Date().toISOString(), category: 'backup' },
    })

    return NextResponse.json({
      success: true,
      filename,
      path: fullPath,
    })
  } catch (error: any) {
    console.error('Backup error:', error)
    return NextResponse.json(
      { error: error.message || 'Backup failed' },
      { status: 500 }
    )
  }
}

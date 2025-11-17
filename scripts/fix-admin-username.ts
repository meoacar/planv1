import { db } from '../src/lib/db'

async function fixAdminUsername() {
  try {
    const admin = await db.user.findFirst({
      where: { role: 'ADMIN' },
    })

    if (!admin) {
      console.log('❌ Admin kullanıcı bulunamadı')
      return
    }

    console.log('📋 Mevcut admin kullanıcı:')
    console.log('Username:', admin.username)
    console.log('Email:', admin.email)

    if (admin.username === 'admin') {
      const updated = await db.user.update({
        where: { id: admin.id },
        data: { username: 'adminuser' },
      })
      console.log('\n✅ Username değiştirildi: admin -> adminuser')
      console.log('Artık /profil/admin sayfası admin paneli için kullanılabilir')
      console.log('Admin kullanıcı profili: /profil/adminuser')
    } else {
      console.log('\n✅ Username zaten "admin" değil, sorun yok!')
    }

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await db.$disconnect()
  }
}

fixAdminUsername()

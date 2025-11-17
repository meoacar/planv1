import { db } from '../src/lib/db'

async function checkAdmin() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
      },
      take: 10,
    })

    console.log('\n📋 Kullanıcılar:')
    console.log('================')
    users.forEach((user) => {
      console.log(`
ID: ${user.id}
Email: ${user.email}
Username: ${user.username || 'N/A'}
Name: ${user.name || 'N/A'}
Role: ${user.role}
${user.role === 'ADMIN' ? '👑 ADMIN' : '👤 USER'}
---`)
    })

    const adminCount = users.filter(u => u.role === 'ADMIN').length
    console.log(`\n✅ Toplam ${users.length} kullanıcı, ${adminCount} admin\n`)

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await db.$disconnect()
  }
}

checkAdmin()

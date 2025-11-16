import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanFooter() {
  console.log('🧹 Footer duplicate kayıtları temizleniyor...')

  // Tüm footer verilerini sil
  await prisma.footerLink.deleteMany({})
  console.log('✅ Footer linkleri temizlendi')

  await prisma.footerSocial.deleteMany({})
  console.log('✅ Sosyal medya linkleri temizlendi')

  await prisma.footerSetting.deleteMany({})
  console.log('✅ Footer ayarları temizlendi')

  console.log('✨ Temizlik tamamlandı! Şimdi seed-cms.ts çalıştırabilirsiniz.')
}

cleanFooter()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

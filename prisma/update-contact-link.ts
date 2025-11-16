import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateContactLink() {
  await prisma.footerLink.updateMany({
    where: { title: 'İletişim' },
    data: { url: '/iletisim' },
  })
  console.log('✅ İletişim linki güncellendi')
  await prisma.$disconnect()
}

updateContactLink()

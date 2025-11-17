const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Confession tablosunun var olup olmadığını kontrol et
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'confessions'
    `;
    
    console.log('Confessions table exists:', result[0].count > 0);
    
    if (result[0].count > 0) {
      console.log('✅ Confession tablosu mevcut!');
    } else {
      console.log('❌ Confession tablosu bulunamadı!');
    }
  } catch (error) {
    console.error('Hata:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

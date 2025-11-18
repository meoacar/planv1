import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Applying Food Sin Tracker tables...\n');

  const sql = readFileSync('scripts/add-food-sin-tables.sql', 'utf-8');
  
  // Split by semicolon and filter empty statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      console.log('Executing:', statement.substring(0, 50) + '...');
      await prisma.$executeRawUnsafe(statement);
      console.log('✅ Success\n');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  Table already exists, skipping\n');
      } else {
        console.error('❌ Error:', error.message, '\n');
      }
    }
  }

  console.log('✅ Food Sin Tracker tables applied successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

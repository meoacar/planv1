#!/usr/bin/env node

/**
 * Friend System Migration Script
 * Güvenli şekilde arkadaş sistemi tablolarını ekler
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log('👥 Friend System Migration Başlatılıyor...\n');

  // .env dosyasından DATABASE_URL'i oku
  const envPath = join(__dirname, '..', '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  const dbUrlMatch = envContent.match(/DATABASE_URL="(.+)"/);
  
  if (!dbUrlMatch) {
    throw new Error('DATABASE_URL bulunamadı!');
  }

  const dbUrl = dbUrlMatch[1];
  const urlMatch = dbUrl.match(/mysql:\/\/([^:@]+)(?::([^@]+))?@([^:]+):(\d+)\/([^?]+)/);
  
  if (!urlMatch) {
    throw new Error('DATABASE_URL formatı hatalı!');
  }

  const [, user, password, host, port, database] = urlMatch;

  // MySQL bağlantısı
  const connection = await mysql.createConnection({
    host,
    port: parseInt(port),
    user,
    password: password || '',
    database,
    multipleStatements: true
  });

  console.log('✅ Veritabanına bağlanıldı\n');

  try {
    // SQL dosyasını oku
    const sqlPath = join(__dirname, 'add-friend-system-tables.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // SQL'i çalıştır
    console.log('📝 Arkadaş sistemi tabloları oluşturuluyor...');
    await connection.query(sql);
    console.log('✅ Tablolar başarıyla oluşturuldu!\n');

    // Tabloları kontrol et
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME IN ('friend_requests', 'friendships', 'friend_activities', 'friend_settings')
    `, [database]);

    console.log('📊 Oluşturulan tablolar:');
    tables.forEach(table => {
      console.log(`  ✓ ${table.TABLE_NAME}`);
    });

    console.log('\n🎉 Migration başarıyla tamamlandı!');
    console.log('\n📝 Sonraki adımlar:');
    console.log('  1. npx prisma generate');
    console.log('  2. Arkadaş API endpoint\'lerini test et');
    console.log('  3. Frontend bileşenlerini ekle\n');

  } catch (error) {
    console.error('❌ Migration hatası:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch(console.error);

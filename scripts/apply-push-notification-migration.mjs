#!/usr/bin/env node

/**
 * Push Notification Tables Migration Script
 * Güvenli şekilde sadece eksik tabloları ekler
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env dosyasını oku
const envPath = join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const DATABASE_URL = envVars.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL bulunamadı!');
  process.exit(1);
}

// URL'den connection bilgilerini çıkar
let user, password, host, port, database;

// Şifresiz format: mysql://root@localhost:3306/dbname
const urlMatch1 = DATABASE_URL.match(/mysql:\/\/([^@]+)@([^:]+):(\d+)\/([^?]+)/);
// Şifreli format: mysql://user:pass@localhost:3306/dbname
const urlMatch2 = DATABASE_URL.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);

if (urlMatch1) {
  [, user, host, port, database] = urlMatch1;
  password = '';
} else if (urlMatch2) {
  [, user, password, host, port, database] = urlMatch2;
} else {
  console.error('❌ Geçersiz DATABASE_URL formatı!');
  console.error('   Beklenen: mysql://user@host:port/database veya mysql://user:pass@host:port/database');
  process.exit(1);
}

async function main() {
  console.log('🚀 Push Notification Tables Migration Başlıyor...\n');

  let connection;
  try {
    // Veritabanına bağlan
    connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      multipleStatements: true
    });

    console.log('✅ Veritabanına bağlanıldı');

    // Mevcut tabloları kontrol et
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND (TABLE_NAME LIKE 'push_%' OR TABLE_NAME = 'notification_settings')
    `, [database]);
    
    console.log('\n📋 Mevcut Push Notification Tabloları:');
    if (tables.length === 0) {
      console.log('   Hiçbiri yok (yeni eklenecek)');
    } else {
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   ✓ ${tableName}`);
      });
    }

    // SQL script'ini oku
    const sqlPath = join(__dirname, 'add-push-notification-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log('\n🔧 Tablolar oluşturuluyor...');

    // SQL'i çalıştır
    await connection.query(sql);

    console.log('✅ Tablolar başarıyla oluşturuldu!');

    // Kontrol et
    const [newTables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND (TABLE_NAME LIKE 'push_%' OR TABLE_NAME = 'notification_settings')
    `, [database]);

    console.log('\n✅ Oluşturulan Tablolar:');
    newTables.forEach(table => {
      console.log(`   ✓ ${table.TABLE_NAME}`);
    });

    console.log('\n🎉 Migration başarıyla tamamlandı!');
    console.log('\n📝 Sonraki adım:');
    console.log('   npx prisma generate');

  } catch (error) {
    console.error('\n❌ Hata:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();

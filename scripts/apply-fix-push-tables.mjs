#!/usr/bin/env node

import mysql from 'mysql2/promise';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
const urlMatch = DATABASE_URL.match(/mysql:\/\/([^@]+)@([^:]+):(\d+)\/([^?]+)/);
const [, user, host, port, database] = urlMatch;

async function main() {
  console.log('🔧 Push Subscription tablosunu düzeltiyorum...\n');
  
  const connection = await mysql.createConnection({
    host,
    port: parseInt(port),
    user,
    password: '',
    database,
  });

  // userAgent kolonu ekle
  try {
    await connection.query(`
      ALTER TABLE push_subscriptions 
      ADD COLUMN userAgent TEXT NULL AFTER auth
    `);
    console.log('✅ userAgent kolonu eklendi');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  userAgent kolonu zaten var');
    } else {
      throw error;
    }
  }

  // isActive kolonu ekle
  try {
    await connection.query(`
      ALTER TABLE push_subscriptions 
      ADD COLUMN isActive BOOLEAN NOT NULL DEFAULT true AFTER userAgent
    `);
    console.log('✅ isActive kolonu eklendi');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  isActive kolonu zaten var');
    } else {
      throw error;
    }
  }

  // Index ekle
  try {
    await connection.query(`
      CREATE INDEX push_subscriptions_isActive_idx ON push_subscriptions(isActive)
    `);
    console.log('✅ isActive index eklendi');
  } catch (error) {
    if (error.code === 'ER_DUP_KEYNAME') {
      console.log('ℹ️  isActive index zaten var');
    } else {
      throw error;
    }
  }

  console.log('\n🎉 Tablo başarıyla güncellendi!');
  
  // Kontrol et
  const [columns] = await connection.query('SHOW COLUMNS FROM push_subscriptions');
  console.log('\n📋 Güncel kolonlar:');
  columns.forEach(col => {
    console.log(`  ✓ ${col.Field}`);
  });

  await connection.end();
}

main().catch(console.error);

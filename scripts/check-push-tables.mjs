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
  const connection = await mysql.createConnection({
    host,
    port: parseInt(port),
    user,
    password: '',
    database,
  });

  console.log('📋 push_subscriptions tablosu kolonları:\n');
  const [columns] = await connection.query(`
    SHOW COLUMNS FROM push_subscriptions
  `);
  
  columns.forEach(col => {
    console.log(`  ${col.Field} - ${col.Type} - ${col.Null} - ${col.Key}`);
  });

  await connection.end();
}

main();

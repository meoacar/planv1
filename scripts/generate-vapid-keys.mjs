#!/usr/bin/env node

/**
 * VAPID Keys Generator
 * Web Push için gerekli public/private key çiftini oluşturur
 */

import webpush from 'web-push';

console.log('🔑 VAPID Keys Oluşturuluyor...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('✅ VAPID Keys başarıyla oluşturuldu!\n');
console.log('📋 Aşağıdaki değerleri .env dosyanıza ekleyin:\n');
console.log('# Web Push VAPID Keys');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:admin@zayiflamaplan.com`);
console.log('\n⚠️  NOT: Bu key\'leri güvenli bir yerde saklayın!');
console.log('⚠️  Production\'da farklı key\'ler kullanın!\n');

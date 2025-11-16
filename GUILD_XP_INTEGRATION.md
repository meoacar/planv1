# 🎮 Lonca XP Sistemi - Entegrasyon Rehberi

## Genel Bakış

Lonca XP sistemi, kullanıcıların çeşitli aktivitelerden XP kazanmasını ve loncalarına katkıda bulunmasını sağlar.

## XP Değerleri

| Aktivite | XP | Açıklama |
|----------|-----|----------|
| Günlük Tartı | 10 XP | Her gün tartı girişi |
| Quest Tamamlama | 15 XP | Günlük görev tamamlama |
| Yorum | 3 XP | Plan/tarif yorumu |
| Plan Paylaşma | 50 XP | Yeni plan oluşturma |
| Tarif Paylaşma | 50 XP | Yeni tarif ekleme |
| Haftalık Hedef | 100 XP | Haftalık kilo hedefine ulaşma |
| 7 Gün Streak | 50 XP | 7 gün üst üste giriş |
| İlerleme Fotoğrafı | 30 XP | Fotoğraf paylaşma |
| Lonca Sohbet | 5 XP | Mesaj gönderme |
| Üye Desteği | 10 XP | Diğer üyelere yardım |

## Kullanım

### 1. Servis Import

\`\`\`typescript
import { addGuildXP, GuildXPAction } from '@/services/guild-xp.service';
\`\`\`

### 2. XP Ekleme

\`\`\`typescript
// Basit kullanım
const result = await addGuildXP(userId, GuildXPAction.DAILY_WEIGH_IN);

// Multiplier ile (örn: 2x XP eventi)
const result = await addGuildXP(userId, GuildXPAction.QUEST_COMPLETE, 2);

// Sonuç kontrolü
if (result) {
  console.log(\`Üye XP: \${result.memberXP}\`);
  console.log(\`Lonca XP: \${result.guildXP}\`);
  
  if (result.levelUp) {
    // Lonca seviye atladı! 🎉
    toast.success('Loncanız seviye atladı!');
  }
}
\`\`\`

## Entegrasyon Örnekleri

### Tartı Girişi (Weight Log)

\`\`\`typescript
// src/app/api/profile/weight/route.ts
import { addGuildXP, GuildXPAction } from '@/services/guild-xp.service';

export async function POST(req: NextRequest) {
  // ... weight log creation ...
  
  // Add guild XP
  await addGuildXP(session.user.id, GuildXPAction.DAILY_WEIGH_IN);
  
  return successResponse(weightLog);
}
\`\`\`

### Quest Tamamlama

\`\`\`typescript
// src/app/api/v1/quests/[id]/complete/route.ts
import { addGuildXP, GuildXPAction } from '@/services/guild-xp.service';

export async function POST(req: NextRequest) {
  // ... quest completion ...
  
  // Add guild XP
  const result = await addGuildXP(session.user.id, GuildXPAction.QUEST_COMPLETE);
  
  if (result?.levelUp) {
    // Notify about level up
  }
  
  return successResponse(quest);
}
\`\`\`

### Yorum Yapma

\`\`\`typescript
// src/app/api/v1/comments/route.ts
import { addGuildXP, GuildXPAction } from '@/services/guild-xp.service';

export async function POST(req: NextRequest) {
  // ... comment creation ...
  
  // Add guild XP
  await addGuildXP(session.user.id, GuildXPAction.COMMENT);
  
  return successResponse(comment);
}
\`\`\`

### Plan/Tarif Paylaşma

\`\`\`typescript
// src/app/api/v1/plans/route.ts
import { addGuildXP, GuildXPAction } from '@/services/guild-xp.service';

export async function POST(req: NextRequest) {
  // ... plan creation ...
  
  // Add guild XP (only when published)
  if (plan.status === 'published') {
    await addGuildXP(session.user.id, GuildXPAction.PLAN_SHARE);
  }
  
  return successResponse(plan);
}
\`\`\`

## Leaderboard Kullanımı

### Lonca Sıralaması

\`\`\`typescript
import { getGuildLeaderboard } from '@/services/guild-xp.service';

const topGuilds = await getGuildLeaderboard(10);
\`\`\`

### Lonca İçi Sıralama

\`\`\`typescript
import { getGuildMemberLeaderboard } from '@/services/guild-xp.service';

const topMembers = await getGuildMemberLeaderboard(guildId, 10);
\`\`\`

## Seviye Sistemi

- Her 1000 XP = 1 Seviye
- Seviye atlama otomatik
- Tüm üyelere bildirim gönderilir
- Seviye atladıkça lonca prestiji artar

## Özel Eventler

### 2x XP Weekend

\`\`\`typescript
const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
const multiplier = isWeekend ? 2 : 1;

await addGuildXP(userId, action, multiplier);
\`\`\`

### Lonca Boost

\`\`\`typescript
// Lonca lideri boost aktif edebilir
const guildBoost = 1.5; // %50 bonus
await addGuildXP(userId, action, guildBoost);
\`\`\`

## TODO: Gelecek Özellikler

- [ ] Lonca challenge'ları (tüm üyeler birlikte hedef)
- [ ] XP multiplier items (shop'tan alınabilir)
- [ ] Günlük/haftalık XP limitleri
- [ ] Lonca vs Lonca yarışmaları
- [ ] Sezonluk XP reset ve ödüller
- [ ] XP geçmişi ve istatistikler

## Notlar

- XP sadece loncası olan kullanıcılara eklenir
- Kullanıcı loncadan ayrılırsa XP'si sıfırlanır
- Lonca XP'si asla azalmaz (sadece artar)
- Seviye atlama bildirimleri tüm üyelere gider

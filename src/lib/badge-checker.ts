import { db } from "@/lib/db";
import { sendBadgeEarned } from "@/lib/push-service";
import { logBadgeEarned } from "@/lib/friend-activity-logger";

/**
 * Tüm rozet kontrollerini yapar ve kazanılanları verir
 */
export async function checkAndAwardAllBadges(userId: string) {
  const results = await Promise.allSettled([
    checkGlukozsuzKahraman(userId),
    checkYagsavar(userId),
    checkDengeliDahi(userId),
    checkGizliTatlici(userId),
    checkMotivasyonMelegi(userId),
  ]);

  const awarded = results
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r: any) => r.value);

  return awarded;
}

/**
 * 1. Glukozsuz Kahraman 🥇
 * Şart: 7 gün tatlı yememek
 */
async function checkGlukozsuzKahraman(userId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Kullanıcının hesap yaşını kontrol et
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { createdAt: true },
  });

  if (!user) return null;

  // Hesap 7 günden yeni ise rozet verme
  if (user.createdAt > sevenDaysAgo) {
    return null;
  }

  const tatliCount = await db.foodSin.count({
    where: {
      userId,
      sinType: "tatli",
      sinDate: { gte: sevenDaysAgo },
    },
  });

  if (tatliCount === 0) {
    return await awardBadge(userId, "glukozsuz_kahraman");
  }
  return null;
}

/**
 * 2. Yağsavar 🥈
 * Şart: 30 gün fast food yememek
 */
async function checkYagsavar(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Kullanıcının hesap yaşını kontrol et
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { createdAt: true },
  });

  if (!user) return null;

  // Hesap 30 günden yeni ise rozet verme
  if (user.createdAt > thirtyDaysAgo) {
    return null;
  }

  const fastfoodCount = await db.foodSin.count({
    where: {
      userId,
      sinType: "fastfood",
      sinDate: { gte: thirtyDaysAgo },
    },
  });

  if (fastfoodCount === 0) {
    return await awardBadge(userId, "yagsavar");
  }
  return null;
}

/**
 * 3. Dengeli Dahi 🥉
 * Şart: Kaçamak sonrası 3 gün telafi yapmak (3 gün günah yok)
 */
async function checkDengeliDahi(userId: string) {
  // Son 7 günü kontrol et
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const sins = await db.foodSin.findMany({
    where: {
      userId,
      sinDate: { gte: sevenDaysAgo },
    },
    orderBy: { sinDate: "desc" },
  });

  if (sins.length === 0) return null;

  // Son günah tarihinden sonra 3 gün temiz mi?
  const lastSin = sins[0];
  const threeDaysAfterLastSin = new Date(lastSin.sinDate);
  threeDaysAfterLastSin.setDate(threeDaysAfterLastSin.getDate() + 3);

  const now = new Date();
  if (now >= threeDaysAfterLastSin) {
    // Son 3 günde günah var mı?
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const recentSins = await db.foodSin.count({
      where: {
        userId,
        sinDate: { gte: threeDaysAgo },
      },
    });

    if (recentSins === 0 && sins.length > 0) {
      return await awardBadge(userId, "dengeli_dahi");
    }
  }

  return null;
}

/**
 * 4. Gizli Tatlıcı 🍩
 * Şart: Aynı gün iki tatlı girmek (Mizah rozeti)
 */
async function checkGizliTatlici(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTatliCount = await db.foodSin.count({
    where: {
      userId,
      sinType: "tatli",
      sinDate: { gte: today },
    },
  });

  if (todayTatliCount >= 2) {
    return await awardBadge(userId, "gizli_tatlici");
  }
  return null;
}

/**
 * 5. Motivasyon Meleği 😇
 * Şart: 10 gün üst üste günah işlememek
 */
async function checkMotivasyonMelegi(userId: string) {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  // Kullanıcının hesap yaşını kontrol et
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { createdAt: true },
  });

  if (!user) return null;

  // Hesap 10 günden yeni ise rozet verme
  if (user.createdAt > tenDaysAgo) {
    return null;
  }

  const sinCount = await db.foodSin.count({
    where: {
      userId,
      sinDate: { gte: tenDaysAgo },
    },
  });

  if (sinCount === 0) {
    return await awardBadge(userId, "motivasyon_melegi");
  }
  return null;
}

/**
 * Rozet verme fonksiyonu
 */
async function awardBadge(userId: string, badgeKey: string) {
  try {
    const badge = await db.sinBadge.findUnique({
      where: { key: badgeKey },
    });

    if (!badge) {
      console.error(`Badge not found: ${badgeKey}`);
      return null;
    }

    // Zaten kazanılmış mı kontrol et
    const existing = await db.userSinBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },
    });

    if (existing) {
      return null; // Zaten kazanılmış
    }

    // Rozet ver
    const userBadge = await db.userSinBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
    });

    // XP ve coin ver
    await db.user.update({
      where: { id: userId },
      data: {
        xp: { increment: badge.xpReward },
        coins: { increment: badge.coinReward },
      },
    });

    console.log(`✅ Badge awarded: ${badge.name} to user ${userId}`);

    // Push notification gönder (async, hata olsa bile devam et)
    sendBadgeEarned(userId, badge.name, badge.icon).catch((error) => {
      console.error('Push notification error:', error);
    });

    // Arkadaş aktivitesi kaydet
    logBadgeEarned(userId, badge.name, badge.icon).catch((error) => {
      console.error('Log activity error:', error);
    });

    return {
      badge,
      xpReward: badge.xpReward,
      coinReward: badge.coinReward,
    };
  } catch (error) {
    console.error(`Error awarding badge ${badgeKey}:`, error);
    return null;
  }
}

/**
 * Belirli bir rozet türü için kontrol
 */
export async function checkSpecificBadge(userId: string, badgeKey: string) {
  switch (badgeKey) {
    case "glukozsuz_kahraman":
      return await checkGlukozsuzKahraman(userId);
    case "yagsavar":
      return await checkYagsavar(userId);
    case "dengeli_dahi":
      return await checkDengeliDahi(userId);
    case "gizli_tatlici":
      return await checkGizliTatlici(userId);
    case "motivasyon_melegi":
      return await checkMotivasyonMelegi(userId);
    default:
      return null;
  }
}

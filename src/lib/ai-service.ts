import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini AI Service
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

export interface WeeklySinData {
  totalSins: number
  sinsByType: {
    tatli: number
    fastfood: number
    gazli: number
    alkol: number
    diger: number
  }
  cleanDays: number
  longestStreak: number
  badgesEarned: number
  challengesCompleted: number
}

export async function generateWeeklySummary(data: WeeklySinData): Promise<string> {
  if (!genAI) {
    // Fallback: AI yoksa basit bir özet döndür
    return generateFallbackSummary(data)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Sen bir beslenme koçu ve motivasyon uzmanısın. Kullanıcının haftalık "günah" (sağlıksız yemek) verilerini analiz edip, 
mizahi ama motive edici bir özet oluştur. Türkçe yaz ve samimi bir dil kullan.

Haftalık Veriler:
- Toplam Günah: ${data.totalSins}
- Tatlı: ${data.sinsByType.tatli}
- Fast Food: ${data.sinsByType.fastfood}
- Gazlı İçecek: ${data.sinsByType.gazli}
- Alkol: ${data.sinsByType.alkol}
- Diğer: ${data.sinsByType.diger}
- Temiz Günler: ${data.cleanDays}/7
- En Uzun Temiz Seri: ${data.longestStreak} gün
- Kazanılan Rozet: ${data.badgesEarned}
- Tamamlanan Challenge: ${data.challengesCompleted}

Özet şunları içermeli:
1. Haftalık performans değerlendirmesi (2-3 cümle)
2. En çok hangi günah türünde sorun var? (1-2 cümle)
3. Başarılı olduğu noktalar (pozitif vurgu)
4. Gelecek hafta için 2-3 pratik öneri
5. Motivasyonel bir kapanış cümlesi

Ton: Samimi, mizahi ama destekleyici. Emoji kullan ama abartma. Maksimum 200 kelime.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text.trim()
  } catch (error) {
    console.error('AI summary generation error:', error)
    return generateFallbackSummary(data)
  }
}

function generateFallbackSummary(data: WeeklySinData): string {
  const totalSins = data.totalSins
  const cleanDays = data.cleanDays
  
  // En çok yapılan günah türünü bul
  const sinTypes = [
    { type: 'tatlı', count: data.sinsByType.tatli, emoji: '🍰' },
    { type: 'fast food', count: data.sinsByType.fastfood, emoji: '🍔' },
    { type: 'gazlı içecek', count: data.sinsByType.gazli, emoji: '🥤' },
    { type: 'alkol', count: data.sinsByType.alkol, emoji: '🍺' },
    { type: 'diğer', count: data.sinsByType.diger, emoji: '🍕' },
  ]
  
  const topSin = sinTypes.reduce((max, sin) => sin.count > max.count ? sin : max)

  let summary = `## 📊 Haftalık Özet\n\n`

  if (totalSins === 0) {
    summary += `🎉 **Mükemmel!** Bu hafta hiç kaçamak yapmadın! Sen bir efsanesin! 💪\n\n`
    summary += `${cleanDays} gün boyunca disiplinli kaldın. Bu başarıyı sürdür!\n\n`
  } else if (totalSins <= 3) {
    summary += `👏 **Harika bir hafta!** Sadece ${totalSins} kaçamak yaptın. Bu çok iyi bir performans!\n\n`
    summary += `${cleanDays} temiz gün yakaladın. Dengeli bir yaklaşım sergiliyorsun.\n\n`
  } else if (totalSins <= 7) {
    summary += `😊 **Fena değil!** ${totalSins} kaçamak yaptın. Ortalama bir hafta geçirdin.\n\n`
    summary += `${topSin.emoji} En çok ${topSin.type} konusunda zorlandın (${topSin.count} kez). Gelecek hafta buna dikkat et!\n\n`
  } else {
    summary += `🤔 **Zorlu bir hafta!** ${totalSins} kaçamak biraz fazla oldu. Ama pes etme!\n\n`
    summary += `${topSin.emoji} ${topSin.type} konusunda özellikle zorlandın (${topSin.count} kez). Alternatifler bulmaya çalış.\n\n`
  }

  // Başarılar
  if (data.badgesEarned > 0) {
    summary += `🏆 Bu hafta ${data.badgesEarned} rozet kazandın! Harika!\n\n`
  }
  
  if (data.challengesCompleted > 0) {
    summary += `🎯 ${data.challengesCompleted} challenge'ı tamamladın! Süpersin!\n\n`
  }

  if (data.longestStreak > 0) {
    summary += `🔥 En uzun temiz seriniz: ${data.longestStreak} gün!\n\n`
  }

  // Öneriler
  summary += `### 💡 Gelecek Hafta İçin Öneriler:\n\n`
  
  if (topSin.count > 2) {
    summary += `- ${topSin.emoji} ${topSin.type} yerine sağlıklı alternatifler dene\n`
  }
  
  if (cleanDays < 4) {
    summary += `- Haftada en az 4 temiz gün hedefle\n`
  }
  
  summary += `- Küçük adımlarla ilerlemeye devam et\n`
  summary += `- Kendine karşı nazik ol, mükemmel olmak zorunda değilsin! 💚\n\n`
  
  summary += `**Unutma:** Her gün yeni bir başlangıç! 🌟`

  return summary
}

export async function generatePersonalizedTip(sinType: string, count: number): Promise<string> {
  if (!genAI) {
    return getDefaultTip(sinType)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Kullanıcı son zamanlarda ${count} kez "${sinType}" türünde sağlıksız yemek yedi.
Bu konuda kısa (1-2 cümle), pratik ve motive edici bir öneri ver. Türkçe yaz.
Emoji kullan ama abartma. Ton: Samimi ve destekleyici.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text.trim()
  } catch (error) {
    console.error('AI tip generation error:', error)
    return getDefaultTip(sinType)
  }
}

function getDefaultTip(sinType: string): string {
  const tips: Record<string, string[]> = {
    tatli: [
      '🍎 Tatlı isteği geldiğinde meyve dene! Doğal şeker daha sağlıklı.',
      '🍫 Bitter çikolata (70%+) daha az şekerli bir alternatif olabilir.',
      '🥤 Bol su iç, bazen susuzluk tatlı isteği gibi hissedilebilir.',
    ],
    fastfood: [
      '🥗 Evde burger yap! Tam tahıllı ekmek ve ızgara et kullan.',
      '🍗 Fast food yerine fırında tavuk ve sebze dene.',
      '🥙 Hazır yemek yerine wrap veya salata tercih et.',
    ],
    gazli: [
      '💧 Soda yerine maden suyu + limon dene!',
      '🍋 Detoks suyu hazırla: Su + limon + nane.',
      '🧃 Taze sıkılmış meyve suyu daha sağlıklı bir seçenek.',
    ],
    alkol: [
      '🍹 Alkolsüz kokteyl dene! Aynı keyif, daha az kalori.',
      '💧 Her alkollü içkiden sonra bir bardak su iç.',
      '🚶 Sosyal aktivitelerde yürüyüş gibi alternatifler dene.',
    ],
    diger: [
      '🥗 Öğünlerini planla, ani kararlar sağlıksız seçimlere yol açar.',
      '🍽️ Küçük porsiyonlar ye, yavaş çiğne.',
      '📝 Yemek günlüğü tut, farkındalık artar.',
    ],
  }

  const tipList = tips[sinType] || tips.diger
  return tipList[Math.floor(Math.random() * tipList.length)]
}

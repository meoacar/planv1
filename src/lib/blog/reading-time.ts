/**
 * Blog içeriğinin okuma süresini hesaplar
 * @param content - Blog içeriği (HTML veya plain text)
 * @returns Tahmini okuma süresi (dakika)
 */
export function calculateReadingTime(content: string): number {
  // Ortalama okuma hızı (kelime/dakika)
  const wordsPerMinute = 200

  // HTML etiketlerini temizle
  const plainText = content.replace(/<[^>]*>/g, '')

  // Kelime sayısını hesapla
  const wordCount = plainText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length

  // Okuma süresini hesapla (en az 1 dakika)
  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  return Math.max(1, readingTime)
}

/**
 * İçerikten özet çıkarır
 * @param content - Blog içeriği
 * @param length - Özet uzunluğu (karakter)
 * @returns Özet metin
 */
export function extractExcerpt(content: string, length: number = 300): string {
  // HTML etiketlerini temizle
  const plainText = content.replace(/<[^>]*>/g, '')

  // Belirtilen uzunlukta kes
  const excerpt = plainText.substring(0, length).trim()

  // Son kelimeyi tamamla
  const lastSpaceIndex = excerpt.lastIndexOf(' ')
  const trimmedExcerpt = lastSpaceIndex > 0 
    ? excerpt.substring(0, lastSpaceIndex) 
    : excerpt

  return trimmedExcerpt + (plainText.length > length ? '...' : '')
}

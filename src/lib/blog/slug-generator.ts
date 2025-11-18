/**
 * Türkçe karakterleri destekleyen slug oluşturucu
 * @param text - Slug'a çevrilecek metin
 * @returns SEO dostu slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Türkçe karakterleri değiştir
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    // Özel karakterleri temizle
    .replace(/[^a-z0-9\s-]/g, '')
    // Boşlukları tire ile değiştir
    .replace(/\s+/g, '-')
    // Birden fazla tireyi tek tireye indir
    .replace(/-+/g, '-')
    // Baş ve sondaki tireleri kaldır
    .replace(/^-+|-+$/g, '')
}

---
inclusion: always
---

# ⚠️ VERİTABANI MİGRATION KURALLARI - ÇOK ÖNEMLİ!

## ASLA YAPMA:
- ❌ Kullanıcıya sormadan `prisma migrate dev` çalıştırma
- ❌ "Do you want to continue? All data will be lost" sorusuna otomatik "yes" deme
- ❌ Veritabanını sıfırlayan hiçbir komutu onaysız çalıştırma

## MUTLAKA YAP:
1. ✅ Migration öncesi KULLANICIYA SOR:
   ```
   "Bu migration veritabanını sıfırlayabilir. Devam etmek istiyor musunuz?"
   "Önce yedek almak ister misiniz?"
   ```

2. ✅ Önce `--create-only` kullan:
   ```bash
   npx prisma migrate dev --create-only --name migration_name
   ```
   Migration dosyasını göster, kullanıcı onaylasın

3. ✅ Alternatif çözümler sun:
   - Schema değişikliği olmadan yapılabilir mi?
   - Sadece kod değişikliği yeterli mi?

4. ✅ Yedek almayı öner:
   ```bash
   mysqldump -u root -p zayiflamaplan > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

## HATIRLA:
- Kullanıcının verileri çok değerli!
- Bir kere silinen veri geri gelmez!
- Migration her zaman risklidir!
- Kullanıcı onayı olmadan ASLA veritabanına dokunma!

## Bu kuralları çiğnersen:
- Kullanıcı haklı olarak kızar
- Güven kaybedersin
- Veriler kaybolur
- Proje zarar görür

**BU KURALLARI HER ZAMAN HATIRLA VE UYGULA!**

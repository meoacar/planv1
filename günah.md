🧠 Yemek Günah Sayacı Modülü

Amaç:
Kullanıcının “kaçamak” davranışlarını suçluluk yerine farkındalıkla izlemesini sağlamak.
Mizah, oyunlaştırma ve istatistikle kullanıcıyı sistemde uzun süre tutmak.

🎯 1. Özellik Özeti
Başlık	Açıklama
Modül Adı	Yemek Günah Sayacı
Amaç	Kullanıcının beslenme farkındalığını artırmak, günlük etkileşimi eğlenceli hale getirmek
Kullanıcı Rolü	Üye girişi yapılmış kullanıcılar
Platform	Web (Laravel), Mobil (Flutter / React Native), API (Supabase / Laravel API)
Ana Felsefe	“Kaçamak yaparsan bile, kendinle dalga geçmeyi unutma.”
💾 2. Veritabanı Şeması

Tablo: food_sins

Alan	Tür	Açıklama
id	bigint	Otomatik ID
user_id	bigint	Kullanıcı kimliği
sin_type	enum('tatli','fastfood','gazli','alkol','diger')	Kaçamak türü
note	text	Kullanıcının isteğe bağlı açıklaması
sin_date	datetime	İşlenme tarihi
emoji	varchar(10)	Görsel ifade (örnek: 🍰)
reaction_text	text	Sistem yanıtı (“Tatlı da haklı...”)
created_at / updated_at	timestamps	Zaman bilgisi
🧭 3. Kullanıcı Akışı
1. Kaçamak Ekleme

Kullanıcı dashboard’da “🍴 Kaçamak Ekle” butonuna tıklar.
Modal pencere açılır:

“Bugün ne günah işledin 😈?”
🍰 Tatlı
🍟 Fast Food
🥤 Gazlı İçecek
🍺 Alkol
🍩 Diğer

Kullanıcı seçer, ardından sistem rastgele bir mizahi tepki üretir (aşağıda örnekler var).
Sonra kayıt veritabanına eklenir.

2. Günlük Görünüm

Kullanıcı “Günah Günlüğüm” sekmesinde şu bilgileri görür:

Günlük kaçamak sayısı

Haftalık toplam

En sık kaçamak yaptığı tür

Takvim görünümünde 🍰 🍟 🥤 emojileri

3. Haftalık Özet

Pazar gecesi otomatik mesaj:

“Bu hafta 3 tatlı, 1 gazlı içecek kaçamağın olmuş 😅
Ama 4 gün sağlıklı beslendin 💪.
Motivasyon Barın: ███████░ 78%”

🎭 4. Mizahi Yanıt Havuzu (AI/Randomizer)

Kategori: Tatlı

“Tatlı da haklı… ama sen daha haklısın 🍫”

“Bir dilimle başladı, bir pasta bitti 🎂”

“Şeker kanına değil, kalbine dokunmuş belli 💘”

Kategori: Fast Food

“Patates kızartması seni kandırıyor 👀”

“Fast food: hızlı gelir, yavaş gider 🍟”

“Köfte burger savaşı yine başladı ⚔️”

Kategori: Gazlı İçecek

“Köpük değil, motivasyon patlasın 🥂”

“Bardağın yarısı şeker dolu 😜”

“Gaz gibi motive ol 💨”

Kategori: Alkol

“Su içmeyi unutma dostum 💧”

“Bir yudum keyif, ama sabah pişmanlık bonusu 😅”

Kategori: Diğer

“Bu kategoriye özel günah icat ettin resmen 😈”

“Karnın tok, vicdanın yumuşak olsun 🍽️”

🏆 5. Rozet Sistemi (Achievement Mantığı)
Rozet Adı	Şart	Açıklama
Glukozsuz Kahraman 🥇	7 gün tatlı yememek	Şeker orucunu başarıyla tamamladı
Yağsavar 🥈	1 ay fast food yememek	Fit kalmak için sabırla direndi
Dengeli Dahi 🥉	Kaçamak sonrası 3 gün telafi yapmak	Denge ustalığı
Gizli Tatlıcı 🍩	Aynı gün iki tatlı girmek	Mizah rozetidir
Motivasyon Meleği 😇	10 gün üst üste günah işlememek	Saf irade, kutsal sabır
🕹️ 6. Challenge & Görev Entegrasyonu

Görev sistemine entegre:

“Bu hafta sadece 2 tatlı hakkın var 🍰🍰”

“3 gün boyunca fast food yoksa +150 XP”

“Kaçamak sonrası telafi yürüyüşünü yap 🏃‍♀️”

Ceza yerine mizah:

“Kaçamak limitini aştın 😅
Ceza: 10 squat at, selfie gönder ya da itiraf et!”

🤖 7. AI Analiz Katmanı (Opsiyonel)

AI haftalık verileri inceler ve kişisel özet üretir:

“Tatlı tüketimin pazartesi ve cuma artıyor. Muhtemelen stres kaynaklı.
Çözüm: Tatlı yerine 2 hurma + kahve dene ☕️.”

Ayrıca eğlenceli öngörüler:

“Bu hızla gidersen 2 haftaya kadar tatlıdan rozet değil şeker hastalığı alırsın 😆”

🎨 8. UI / UX Fikirleri

Ana Sayfa Widget’ı: “Bugün Günah İşledin mi?”
Buton: 🍰 → açılır modal

Takvim Görünümü:
Her güne emoji eklenir (tatlı = 🍰, fast food = 🍟)
Temiz günler: 💚 simgesi

Animasyonlar:
Melek ve Şeytan figürleri konuşuyor (CSS veya Lottie animasyonu).

Melek: “Bu hafta tertemizsin 😇”

Şeytan: “Tatlıyı reddedememişsin… klasik 🤭”

💡 9. Geliştirme Notları

Backend: Laravel veya Supabase (JSON API)

Frontend: Vue/React/Flutter uyumlu

Cron job veya Supabase Edge Function ile haftalık rapor

AI öneri sistemi: OpenAI / Gemini API ile kişisel metin üretimi

Push notification: “Bugün hiç kaçamak yapmadın 🎉 Tebrikler!”

💰 10. Premium Fikirleri

“AI Beslenme Terapisti” → haftalık analiz + öneri raporu

“Günah Günlüğü İstatistik Raporu” → PDF olarak indirilebilir

“Arkadaş Modu” → kaçamaklarını arkadaşınla kıyasla (challenge)

🔥 11. Örnek Bildirim Metinleri

“Tatlı da haklıydı ama senin vicdan da çok tatlı 😆”

“Bugün 0 kaçamakla tertemizsin 💪”

“Patates kızartması seni özlemiş olabilir, ama sen onu değil!”

“Günah Sayacın: 0 — İraden: Sonsuz 🎯”

“Bir dilim pasta, bir parça pişmanlık 😂”
# 🍳 Tarif Sistemi Dokümantasyonu

## Genel Bakış

Tarif sistemi, kullanıcıların sağlıklı yemek tariflerini paylaşabildiği, beğenebildiği ve yorum yapabildiği tam kapsamlı bir özelliktir.

## 📊 Veritabanı Modelleri

### Recipe (Ana Tarif Modeli)
```prisma
- id: String (cuid)
- slug: String (unique)
- title: String
- description: Text
- authorId: String → User
- ingredients: JSON (malzemeler listesi)
- instructions: Text (yapılış adımları)
- prepTime: Int (hazırlık süresi, dakika)
- cookTime: Int (pişirme süresi, dakika)
- servings: Int (porsiyon sayısı)
- calories: Float
- protein, carbs, fat, fiber: Float (besin değerleri)
- category: RecipeCategory (kahvaltı, öğle, akşam, vb.)
- mealType: MealType (opsiyonel)
- difficulty: Difficulty (kolay, orta, zor)
- status: PlanStatus (draft, pending, published, rejected)
- views, likesCount, commentsCount: Int
- isFeatured: Boolean (öne çıkan tarifler)
- imageUrl, videoUrl: String (opsiyonel)
- tags: JSON
- images: JSON (array of image URLs, max 4)
- createdAt, updatedAt, publishedAt: DateTime
```

### RecipeComment
```prisma
- id, recipeId, authorId
- body: Text
- status: CommentStatus (pending, visible, hidden)
- createdAt, updatedAt
```

### RecipeLike
```prisma
- id, recipeId, userId
- createdAt
- Unique constraint: (userId, recipeId)
```

## 🎯 Özellikler

### Kullanıcı Özellikleri
- ✅ Tarif oluşturma (admin onayı gerekir)
- ✅ **Resim yükleme (en fazla 4 resim)**
- ✅ Tarif düzenleme
- ✅ Tarif silme
- ✅ Tarif beğenme/beğenmeme
- ✅ Yorum yapma
- ✅ Filtreleme (kategori, zorluk, kalori, arama)
- ✅ Kendi tariflerini görüntüleme (yayında, bekleyen, taslak, reddedilen)

### Admin Özellikleri
- ✅ Tarif onaylama/reddetme
- ✅ Tarif silme
- ✅ Öne çıkan tarif belirleme
- ✅ Tüm tarifleri görüntüleme ve yönetme

## 📁 Dosya Yapısı

### API Routes
```
src/app/api/v1/recipes/
├── route.ts                    # GET (list), POST (create)
├── [slug]/
│   ├── route.ts               # GET, PATCH, DELETE
│   ├── like/route.ts          # POST (toggle like)
│   └── comments/route.ts      # GET, POST
└── featured/route.ts          # GET (öne çıkan tarifler)
```

### Pages
```
src/app/
├── tarifler/
│   ├── page.tsx               # Tarif listesi
│   └── recipe-filters.tsx     # Filtreleme component'i
├── tarif/[slug]/
│   ├── page.tsx               # Tarif detay sayfası
│   └── recipe-client.tsx      # Client-side interaktif component'ler
├── tarif-ekle/
│   ├── page.tsx               # Tarif ekleme sayfası
│   └── create-recipe-form.tsx # Form component'i
└── tariflerim/
    └── page.tsx               # Kullanıcının tarifleri
```

### Admin Panel
```
src/app/admin/tarifler/
├── page.tsx                   # Tarif yönetim sayfası
└── actions.ts                 # Server actions (approve, reject, delete, toggleFeatured)

src/components/admin/
└── recipe-actions.tsx         # Admin işlem butonları
```

### Services & Validations
```
src/services/recipe.service.ts      # İş mantığı
src/validations/recipe.schema.ts    # Zod validation şemaları
src/components/recipe-card.tsx      # Tarif kartı component'i
```

## 🔌 API Endpoints

### Public Endpoints

#### GET /api/v1/recipes
Tarifleri listele
```typescript
Query params:
- search: string
- category: RecipeCategory
- mealType: MealType
- difficulty: Difficulty
- maxCalories: number
- authorId: string
- page: number (default: 1)
- limit: number (default: 20)

Response:
{
  success: true,
  data: Recipe[],
  meta: {
    page, limit, total, totalPages
  }
}
```

#### GET /api/v1/recipes/[slug]
Tarif detayını getir
```typescript
Response:
{
  success: true,
  data: Recipe (with author, _count)
}
```

#### GET /api/v1/recipes/featured
Öne çıkan tarifleri getir
```typescript
Query params:
- limit: number (default: 6)

Response:
{
  success: true,
  data: Recipe[]
}
```

### Authenticated Endpoints

#### POST /api/v1/recipes
Yeni tarif oluştur
```typescript
Body: CreateRecipeInput
Rate limit: 10 tarif/saat

Response:
{
  success: true,
  data: Recipe
}
```

#### PATCH /api/v1/recipes/[slug]
Tarif güncelle (sadece yazar)
```typescript
Body: UpdateRecipeInput

Response:
{
  success: true,
  data: Recipe
}
```

#### DELETE /api/v1/recipes/[slug]
Tarif sil (sadece yazar)
```typescript
Response:
{
  success: true,
  data: { message: string }
}
```

#### POST /api/v1/recipes/[slug]/like
Tarif beğen/beğenmekten vazgeç
```typescript
Response:
{
  success: true,
  data: { liked: boolean }
}
```

#### GET /api/v1/recipes/[slug]/comments
Tarif yorumlarını getir
```typescript
Query params:
- page: number
- limit: number

Response:
{
  success: true,
  data: RecipeComment[],
  meta: { pagination }
}
```

#### POST /api/v1/recipes/[slug]/comments
Yorum ekle
```typescript
Body: { body: string }

Response:
{
  success: true,
  data: RecipeComment
}
```

## 🎨 UI Components

### RecipeCard
Tarif kartı component'i - liste görünümlerinde kullanılır
```typescript
Props: { recipe: RecipeWithAuthor }
```

Gösterir:
- Tarif görseli
- Başlık ve açıklama
- Kategori ve zorluk badge'leri
- Hazırlık süresi, porsiyon, kalori
- Yazar bilgisi
- Beğeni, yorum, görüntülenme sayıları

### RecipeFilters
Filtreleme component'i
```typescript
Filtreler:
- Arama (text)
- Kategori (select)
- Zorluk (select)
- Max kalori (number)
```

### CreateRecipeForm
Tarif oluşturma formu
```typescript
Alanlar:
- Temel bilgiler (başlık, açıklama, kategori, zorluk)
- Süre ve porsiyon
- Besin değerleri (kalori, protein, karbonhidrat, yağ, lif)
- Malzemeler (dinamik liste)
- Yapılış adımları
- Etiketler
- Görsel URL
```

## 🔐 Yetkilendirme

### Kullanıcı
- Tarif oluşturabilir (admin onayı gerekir)
- Kendi tariflerini düzenleyebilir/silebilir
- Tarifleri beğenebilir
- Yorum yapabilir

### Admin
- Tüm tarifleri görüntüleyebilir
- Tarifleri onaylayabilir/reddedebilir
- Tarifleri silebilir
- Öne çıkan tarif belirleyebilir

## 📝 Validation Kuralları

### CreateRecipeSchema
```typescript
- title: 5-100 karakter
- description: 20-2000 karakter
- ingredients: min 1 malzeme
- instructions: 50-5000 karakter
- servings: 1-50
- prepTime, cookTime: 0-1440 dakika (max 24 saat)
- calories, protein, carbs, fat, fiber: 0-10000
- category: enum (zorunlu)
- difficulty: enum (zorunlu)
- tags: max 10 etiket
```

## 🚀 Kullanım Örnekleri

### Tarif Oluşturma
```typescript
const recipe = await RecipeService.createRecipe(userId, {
  title: "Sağlıklı Yulaf Ezmeli Pancake",
  description: "Protein açısından zengin...",
  category: "breakfast",
  difficulty: "easy",
  servings: 2,
  prepTime: 10,
  cookTime: 15,
  calories: 250,
  protein: 15,
  carbs: 30,
  fat: 8,
  ingredients: [
    { name: "Yulaf ezmesi", amount: "1", unit: "su bardağı" },
    { name: "Yumurta", amount: "2", unit: "adet" }
  ],
  instructions: "1. Yulaf ezmeyi blenderdan geçirin...",
  tags: ["sağlıklı", "protein", "kahvaltı"]
})
```

### Tarif Filtreleme
```typescript
const recipes = await RecipeService.getRecipes({
  category: "breakfast",
  difficulty: "easy",
  maxCalories: 300,
  search: "pancake"
}, page, limit)
```

### Tarif Beğenme
```typescript
const result = await RecipeService.likeRecipe(recipeId, userId)
// { liked: true } veya { liked: false }
```

## 🎯 Öne Çıkan Özellikler

1. **Çoklu Resim Yükleme**: Her tarif için 4'e kadar resim yüklenebilir (JPG, PNG, WebP)
2. **Besin Değerleri**: Her tarif için detaylı besin değerleri
3. **Kategori Sistemi**: 10 farklı kategori (kahvaltı, öğle, akşam, vb.)
4. **Zorluk Seviyeleri**: Kolay, orta, zor
5. **Öne Çıkan Tarifler**: Admin tarafından belirlenen özel tarifler
6. **Rate Limiting**: Saatte 10 tarif oluşturma limiti
7. **Admin Onayı**: Tüm tarifler yayınlanmadan önce onay bekler
8. **Responsive Design**: Mobil uyumlu arayüz
9. **Filtreleme**: Gelişmiş arama ve filtreleme özellikleri
10. **Akıllı Görsel Düzeni**: 1-4 resim için otomatik grid layout

## 📊 İstatistikler

Tarif sistemi şu metrikleri takip eder:
- Görüntülenme sayısı
- Beğeni sayısı
- Yorum sayısı
- Kategori dağılımı
- Zorluk dağılımı
- Ortalama kalori değerleri

## 🔄 Workflow

1. **Kullanıcı tarif oluşturur** → Status: `pending`
2. **Admin tarifi inceler**
   - Onaylarsa → Status: `published`, publishedAt set edilir
   - Reddederse → Status: `rejected`
3. **Yayınlanan tarifler** → Tüm kullanıcılar görebilir
4. **Kullanıcı kendi tarifini düzenler** → Status tekrar `pending` olur

## 🎨 Navbar & Admin Panel Entegrasyonu

- Navbar'a "Tarifler" linki eklendi
- Admin sidebar'a "Tarifler" menüsü eklendi
- Admin panelinde tarif yönetim sayfası oluşturuldu

## ✅ Tamamlanan İşler

- [x] Prisma schema modelleri
- [x] Validation şemaları
- [x] Service katmanı
- [x] API endpoints (CRUD + like + comments)
- [x] Tarif listesi sayfası
- [x] Tarif detay sayfası
- [x] Tarif ekleme sayfası
- [x] Tariflerim sayfası
- [x] Admin tarif yönetimi
- [x] RecipeCard component
- [x] Filtreleme sistemi
- [x] Navbar entegrasyonu
- [x] Admin panel entegrasyonu
- [x] Migration uygulandı

## 🎉 Sonuç

Tarif sistemi artık tamamen çalışır durumda! Kullanıcılar tarif ekleyebilir, beğenebilir, yorum yapabilir. Admin panelinden tüm tarifler yönetilebilir.


## 📸 Resim Yükleme Sistemi

### Özellikler
- **Maksimum 4 resim** yüklenebilir
- **Desteklenen formatlar**: JPG, PNG, WebP
- **Maksimum dosya boyutu**: 5MB per resim
- **Otomatik optimizasyon**: Next.js Image component ile optimize edilir
- **Responsive grid**: Resim sayısına göre otomatik düzen

### Upload API
```typescript
POST /api/upload/recipe
Content-Type: multipart/form-data

Body: { file: File }

Response:
{
  success: true,
  data: { url: string }
}
```

### Görsel Düzenleri
- **1 resim**: Tam genişlik, 16:9 aspect ratio
- **2 resim**: 2 sütun grid, kare
- **3 resim**: 3 sütun grid, kare
- **4 resim**: 2x2 grid, ilk resim 2 sütun genişliğinde (16:9), diğerleri kare

### Kullanım
```typescript
// Form'da resim yükleme
const handleImageUpload = async (files: FileList) => {
  const formData = new FormData()
  formData.append('file', files[0])
  
  const res = await fetch('/api/upload/recipe', {
    method: 'POST',
    body: formData,
  })
  
  const data = await res.json()
  if (data.success) {
    setImages([...images, data.data.url])
  }
}
```

### Güvenlik
- Dosya tipi kontrolü (sadece resim)
- Dosya boyutu kontrolü (max 5MB)
- Authenticated endpoint (giriş gerekli)
- Unique dosya isimleri (timestamp + random)

## 🎨 UI İyileştirmeleri

### Navbar
- "Ekle" dropdown menüsü eklendi
  - Plan Ekle
  - Tarif Ekle
- Kullanıcı menüsüne "Tariflerim" eklendi

### Recipe Card
- İlk resim gösterilir
- Birden fazla resim varsa "+X foto" badge'i
- Hover efektleri
- Responsive tasarım

### Recipe Detail Page
- Akıllı resim grid'i
- Lightbox özelliği (gelecekte eklenebilir)
- Mobil uyumlu görünüm

### Create Recipe Form
- Drag & drop desteği (gelecekte eklenebilir)
- Resim önizleme
- Resim silme butonu
- Upload progress göstergesi
- Maksimum resim sayısı kontrolü

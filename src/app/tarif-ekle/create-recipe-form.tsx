'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Ingredient {
  name: string
  amount: string
  unit: string
}

export function CreateRecipeForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [mealType, setMealType] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [servings, setServings] = useState('4')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [fiber, setFiber] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '' },
  ])
  const [instructions, setInstructions] = useState('')
  const [tags, setTags] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > 4) {
      toast.error('En fazla 4 resim ekleyebilirsiniz')
      return
    }

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload/recipe', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (data.success) {
          return data.data.url
        } else {
          throw new Error(data.error.message)
        }
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setImages([...images, ...uploadedUrls])
      toast.success(`${uploadedUrls.length} resim yüklendi`)
    } catch (error: any) {
      toast.error(error.message || 'Resim yüklenirken hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients]
    updated[index][field] = value
    setIngredients(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate
      if (!title || !description || !category || !difficulty || !instructions) {
        toast.error('Lütfen zorunlu alanları doldurun')
        setLoading(false)
        return
      }

      const validIngredients = ingredients.filter((ing) => ing.name && ing.amount)
      if (validIngredients.length === 0) {
        toast.error('En az 1 malzeme eklemelisiniz')
        setLoading(false)
        return
      }

      const payload = {
        title,
        description,
        category,
        mealType: mealType || undefined,
        difficulty,
        servings: parseInt(servings),
        prepTime: prepTime ? parseInt(prepTime) : undefined,
        cookTime: cookTime ? parseInt(cookTime) : undefined,
        calories: calories ? parseFloat(calories) : undefined,
        protein: protein ? parseFloat(protein) : undefined,
        carbs: carbs ? parseFloat(carbs) : undefined,
        fat: fat ? parseFloat(fat) : undefined,
        fiber: fiber ? parseFloat(fiber) : undefined,
        ingredients: validIngredients,
        instructions,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        images: images.length > 0 ? images : undefined,
      }

      const res = await fetch('/api/v1/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Tarif oluşturuldu! Admin onayından sonra yayınlanacak.')
        router.push(`/tarif/${data.data.slug}`)
      } else {
        toast.error(data.error.message)
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Temel Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Tarif Başlığı *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Sağlıklı Yulaf Ezmeli Pancake"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Açıklama *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tarifiniz hakkında kısa bir açıklama yazın..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Kategori *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Kahvaltı</SelectItem>
                  <SelectItem value="lunch">Öğle Yemeği</SelectItem>
                  <SelectItem value="dinner">Akşam Yemeği</SelectItem>
                  <SelectItem value="snack">Atıştırmalık</SelectItem>
                  <SelectItem value="dessert">Tatlı</SelectItem>
                  <SelectItem value="drink">İçecek</SelectItem>
                  <SelectItem value="main">Ana Yemek</SelectItem>
                  <SelectItem value="side">Yan Yemek</SelectItem>
                  <SelectItem value="salad">Salata</SelectItem>
                  <SelectItem value="soup">Çorba</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mealType">Öğün</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Kahvaltı</SelectItem>
                  <SelectItem value="lunch">Öğle</SelectItem>
                  <SelectItem value="dinner">Akşam</SelectItem>
                  <SelectItem value="snack">Ara Öğün</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Zorluk *</Label>
              <Select value={difficulty} onValueChange={setDifficulty} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Kolay</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="hard">Zor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="servings">Porsiyon *</Label>
              <Input
                id="servings"
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="prepTime">Hazırlık Süresi (dk)</Label>
              <Input
                id="prepTime"
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                min="0"
                placeholder="Örn: 15"
              />
            </div>

            <div>
              <Label htmlFor="cookTime">Pişirme Süresi (dk)</Label>
              <Input
                id="cookTime"
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                min="0"
                placeholder="Örn: 20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Görseller (En fazla 4)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="images">Resim Yükle</Label>
            <Input
              id="images"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageUpload}
              disabled={uploading || images.length >= 4}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground mt-2">
              JPG, PNG veya WebP formatında, maksimum 5MB. {images.length}/4 resim yüklendi.
            </p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Tarif görseli ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nutrition */}
      <Card>
        <CardHeader>
          <CardTitle>Besin Değerleri (Porsiyon Başına)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="calories">Kalori</Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                min="0"
                step="0.1"
                placeholder="kcal"
              />
            </div>

            <div>
              <Label htmlFor="protein">Protein</Label>
              <Input
                id="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                min="0"
                step="0.1"
                placeholder="gram"
              />
            </div>

            <div>
              <Label htmlFor="carbs">Karbonhidrat</Label>
              <Input
                id="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                min="0"
                step="0.1"
                placeholder="gram"
              />
            </div>

            <div>
              <Label htmlFor="fat">Yağ</Label>
              <Input
                id="fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                min="0"
                step="0.1"
                placeholder="gram"
              />
            </div>

            <div>
              <Label htmlFor="fiber">Lif</Label>
              <Input
                id="fiber"
                type="number"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                min="0"
                step="0.1"
                placeholder="gram"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>Malzemeler *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Malzeme adı"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Miktar"
                value={ingredient.amount}
                onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                className="w-24"
              />
              <Input
                placeholder="Birim"
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                className="w-24"
              />
              {ingredients.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addIngredient} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Malzeme Ekle
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Yapılışı *</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Tarif adımlarını detaylı şekilde yazın..."
            rows={10}
            required
          />
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Etiketler</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Virgülle ayırın: sağlıklı, protein, kahvaltı"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Tarifinizi daha kolay bulunabilir hale getirmek için etiketler ekleyin
          </p>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Oluşturuluyor...' : 'Tarif Oluştur'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          İptal
        </Button>
      </div>
    </form>
  )
}

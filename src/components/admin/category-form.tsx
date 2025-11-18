'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, X } from 'lucide-react'
import { toast } from 'sonner'
import slugify from 'slugify'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  order: number
}

interface CategoryFormProps {
  category?: Category | null
  onSuccess: () => void
  onCancel: () => void
}

interface FormData {
  name: string
  slug: string
  description: string
  icon: string
  color: string
  order: number
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    icon: category?.icon || '',
    color: category?.color || '#3b82f6',
    order: category?.order || 0,
  })

  // Auto-generate slug from name
  useEffect(() => {
    if (!category && formData.name && !formData.slug) {
      const generatedSlug = slugify(formData.name, {
        lower: true,
        strict: true,
        locale: 'tr',
      })
      setFormData((prev) => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.name, category, formData.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.slug) {
      toast.error('Lütfen zorunlu alanları doldurun')
      return
    }

    setIsLoading(true)
    try {
      const url = category 
        ? `/api/admin/blog/categories/${category.id}` 
        : '/api/admin/blog/categories'
      const method = category ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Bir hata oluştu')
      }

      toast.success(
        category 
          ? 'Kategori başarıyla güncellendi' 
          : 'Kategori başarıyla oluşturuldu'
      )
      
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Kategori Adı *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Örn: Beslenme"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="beslenme"
            required
          />
          <p className="text-xs text-muted-foreground">
            URL: /blog/category/{formData.slug || 'slug'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Kategori açıklaması (opsiyonel)"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="icon">İkon (Emoji)</Label>
          <div className="flex gap-2">
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="🍎"
              maxLength={2}
              className="w-20 text-center text-2xl"
            />
            <div className="relative flex-1">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {showEmojiPicker ? 'Kapat' : 'Emoji Seç'}
              </Button>
              {showEmojiPicker && (
                <div className="absolute z-50 mt-2 w-full bg-popover border rounded-lg shadow-lg p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-8 gap-1">
                    {['🍎', '🥗', '💪', '🏃', '🧘', '🎯', '📚', '💊', '🥑', '🍊', '🥤', '🍳', '🥦', '🍓', '🥕', '🌽', '🍌', '🥒', '🍅', '🥬', '🫐', '🥝', '🍇', '🍑', '🥥', '🍍', '🥭', '🍈', '🍉', '🍋', '🥙', '🥪', '🌮', '🌯', '🥟', '🍜', '🍲', '🥘', '🍱', '⚡'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, icon: emoji })
                          setShowEmojiPicker(false)
                        }}
                        className="text-2xl hover:bg-accent rounded p-1 transition-colors"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Emoji seç veya manuel gir
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Renk</Label>
          <div className="flex gap-2">
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-20 h-10"
            />
            <Input
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="#3b82f6"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Sıralama</Label>
          <Input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            placeholder="0"
            min="0"
          />
          <p className="text-xs text-muted-foreground">
            Küçük sayı önce görünür
          </p>
        </div>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm font-medium mb-2">Önizleme</p>
        <div className="flex items-center gap-3">
          {formData.icon && (
            <span className="text-2xl">{formData.icon}</span>
          )}
          <div
            className="px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: formData.color }}
          >
            {formData.name || 'Kategori Adı'}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-2" />
          İptal
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Kaydediliyor...' : category ? 'Güncelle' : 'Oluştur'}
        </Button>
      </div>
    </form>
  )
}

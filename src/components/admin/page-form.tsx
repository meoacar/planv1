'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Save, Loader2, Eye, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface PageFormProps {
  page?: {
    id: string
    slug: string
    title: string
    content: string
    metaTitle: string | null
    metaDesc: string | null
    isPublished: boolean
    sortOrder: number
  }
}

export function PageForm({ page }: PageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    slug: page?.slug || '',
    title: page?.title || '',
    content: page?.content || '',
    metaTitle: page?.metaTitle || '',
    metaDesc: page?.metaDesc || '',
    isPublished: page?.isPublished || false,
    sortOrder: page?.sortOrder || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = page
        ? `/api/admin/pages/${page.id}`
        : '/api/admin/pages'
      
      const method = page ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Bir hata oluştu')
      }

      toast.success(page ? 'Sayfa güncellendi' : 'Sayfa oluşturuldu')
      router.push('/admin/sayfalar')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!page) return
    
    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız')
      }

      toast.success('Sayfa silindi')
      router.push('/admin/sayfalar')
      router.refresh()
    } catch (error) {
      toast.error('Silme işlemi başarısız')
    } finally {
      setDeleting(false)
    }
  }

  // Slug otomatik oluştur
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temel Bilgiler</CardTitle>
          <CardDescription>
            Sayfa başlığı ve içeriği
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Sayfa Başlığı *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  title: e.target.value,
                  slug: formData.slug || generateSlug(e.target.value),
                })
              }}
              placeholder="Hakkımızda"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/</span>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: generateSlug(e.target.value) })
                }
                placeholder="hakkimizda"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Sayfa URL'si: /{formData.slug}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">İçerik *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Sayfa içeriği... (HTML desteklenir)"
              rows={15}
              required
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              HTML etiketleri kullanabilirsiniz
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Ayarları</CardTitle>
          <CardDescription>
            Arama motorları için meta bilgileri
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Başlık</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData({ ...formData, metaTitle: e.target.value })
              }
              placeholder="Boş bırakılırsa sayfa başlığı kullanılır"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDesc">Meta Açıklama</Label>
            <Textarea
              id="metaDesc"
              value={formData.metaDesc}
              onChange={(e) =>
                setFormData({ ...formData, metaDesc: e.target.value })
              }
              placeholder="Sayfa açıklaması (150-160 karakter)"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {formData.metaDesc.length} karakter
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yayın Ayarları</CardTitle>
          <CardDescription>
            Sayfa görünürlüğü ve sıralaması
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isPublished">Yayında</Label>
              <p className="text-sm text-muted-foreground">
                Sayfa sitede görünsün mü?
              </p>
            </div>
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPublished: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sıralama</Label>
            <Input
              id="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
              }
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Küçük sayılar önce görünür
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {page && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Sil
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {page && formData.isPublished && (
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Önizle
              </a>
            </Button>
          )}
          
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {page ? 'Güncelle' : 'Oluştur'}
          </Button>
        </div>
      </div>
    </form>
  )
}

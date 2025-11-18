'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlogEditor } from './blog-editor'
import { Save, Eye, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import slugify from 'slugify'

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface BlogFormData {
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string
  coverImageAlt: string
  metaTitle: string
  metaDescription: string
  categoryId: string
  tags: string[]
  status: 'DRAFT' | 'PUBLISHED'
  featured: boolean
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData>
  categories: Category[]
  tags: Tag[]
  isEdit?: boolean
  postId?: string
}

export function BlogForm({ initialData, categories, tags, isEdit, postId }: BlogFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.coverImage || null)

  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    coverImage: initialData?.coverImage || '',
    coverImageAlt: initialData?.coverImageAlt || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    categoryId: initialData?.categoryId || '',
    tags: initialData?.tags || [],
    status: initialData?.status || 'DRAFT',
    featured: initialData?.featured || false,
  })

  // Auto-generate slug from title
  const [manualSlugEdit, setManualSlugEdit] = useState(false)
  
  useEffect(() => {
    if (!isEdit && formData.title && !manualSlugEdit) {
      const generatedSlug = slugify(formData.title, {
        lower: true,
        strict: true,
        locale: 'tr',
      })
      setFormData((prev) => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, isEdit, manualSlugEdit])

  // Auto-save every 2 minutes (DISABLED to prevent connection issues)
  // useEffect(() => {
  //   if (!isEdit || !postId) return

  //   const interval = setInterval(() => {
  //     if (formData.title && formData.content && !isSaving && !isLoading) {
  //       handleAutoSave()
  //     }
  //   }, 120000) // 2 minutes

  //   return () => clearInterval(interval)
  // }, [isEdit, postId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save as draft
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSubmit('DRAFT')
      }
      // Ctrl/Cmd + Shift + P to publish
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault()
        handleSubmit('PUBLISHED')
      }
      // Ctrl/Cmd + Shift + E to toggle preview
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'e') {
        e.preventDefault()
        setShowPreview((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleAutoSave = useCallback(async () => {
    if (isSaving || isLoading) return

    setIsSaving(true)
    try {
      // Convert tag IDs to tag names for API
      const tagNames = formData.tags
        .map(tagId => tags.find(t => t.id === tagId)?.name)
        .filter(Boolean) as string[]

      // Prepare minimal payload for auto-save
      const payload: any = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        categoryId: formData.categoryId,
        status: 'DRAFT',
      }

      if (formData.excerpt) payload.excerpt = formData.excerpt
      if (tagNames.length > 0) payload.tags = tagNames

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 503) {
          console.warn('Database connection issue during auto-save')
          return // Silently fail for auto-save
        }
        throw new Error('Auto-save failed')
      }
      
      toast.success('Otomatik kaydedildi', { duration: 2000 })
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('Auto-save timeout')
      } else {
        console.error('Auto-save error:', error)
      }
      // Don't show error toast for auto-save failures
    } finally {
      setIsSaving(false)
    }
  }, [formData, tags, postId, isSaving, isLoading])

  const handleSubmit = useCallback(async (status: 'DRAFT' | 'PUBLISHED') => {
    // Validation
    if (!formData.title || formData.title.trim().length < 5) {
      toast.error('Başlık en az 5 karakter olmalı')
      return
    }
    
    if (!formData.content || formData.content.trim().length < 100) {
      toast.error('İçerik en az 100 karakter olmalı')
      return
    }
    
    if (!formData.categoryId) {
      toast.error('Lütfen bir kategori seçin')
      return
    }

    setIsLoading(true)
    try {
      const url = isEdit ? `/api/admin/blog/${postId}` : '/api/admin/blog'
      const method = isEdit ? 'PUT' : 'POST'

      // Convert tag IDs to tag names for API
      const tagNames = formData.tags
        .map(tagId => tags.find(t => t.id === tagId)?.name)
        .filter(Boolean) as string[]

      // Prepare payload
      const payload: any = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        categoryId: formData.categoryId,
        status,
      }

      // Add optional fields only if they have values
      if (formData.excerpt) payload.excerpt = formData.excerpt
      if (formData.coverImage) payload.coverImage = formData.coverImage
      if (formData.coverImageAlt) payload.coverImageAlt = formData.coverImageAlt
      if (formData.metaTitle) payload.metaTitle = formData.metaTitle
      if (formData.metaDescription) payload.metaDescription = formData.metaDescription
      if (tagNames.length > 0) payload.tags = tagNames
      if (formData.featured !== undefined) payload.featured = formData.featured

      console.log('📤 Blog gönderiliyor:', {
        url,
        method,
        payload: {
          ...payload,
          content: payload.content.substring(0, 100) + '...' // İçeriği kısalt
        }
      })

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      console.log('📥 Sunucu yanıtı:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (!response.ok) {
        let error: any = {}
        
        try {
          error = await response.json()
        } catch (parseError) {
          console.error('Response parse hatası:', parseError)
          error = { error: 'Sunucu yanıtı okunamadı' }
        }
        
        console.error('Blog kaydetme hatası:', {
          status: response.status,
          statusText: response.statusText,
          error: error
        })
        
        // Database connection error - offer retry
        if (response.status === 503) {
          toast.error('Veritabanı bağlantısı kesildi', {
            description: error.details || 'Lütfen tekrar deneyin',
            action: {
              label: 'Tekrar Dene',
              onClick: () => handleSubmit(status)
            }
          })
          return
        }
        
        // Validation error - show specific field error
        if (response.status === 400) {
          console.error('Validation hatası detayı:', error)
          toast.error(error.error || 'Geçersiz veri', {
            description: error.details || error.field || 'Lütfen formu kontrol edin'
          })
          return
        }
        
        const errorMessage = typeof error.details === 'string' 
          ? error.details 
          : typeof error.error === 'string'
          ? error.error
          : 'Bir hata oluştu'
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      toast.success(
        status === 'PUBLISHED' 
          ? 'Blog yazısı yayınlandı!' 
          : 'Blog yazısı taslak olarak kaydedildi'
      )
      
      router.push('/admin/blog')
      router.refresh()
    } catch (error: any) {
      console.error('Submit error:', error)
      const errorMessage = typeof error === 'string' 
        ? error 
        : error?.message || 'Bir hata oluştu'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [formData, tags, isEdit, postId, isLoading, router])



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isSaving && (
              <span role="status" aria-live="polite">
                Kaydediliyor...
              </span>
            )}
            {!isSaving && (
              <span className="text-xs">
                Kısayollar: Ctrl+S (Kaydet), Ctrl+Shift+P (Yayınla), Ctrl+Shift+E (Önizle)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Blog işlemleri">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            aria-label={showPreview ? 'Düzenleme moduna geç' : 'Önizleme moduna geç'}
            aria-pressed={showPreview}
          >
            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
            {showPreview ? 'Düzenle' : 'Önizle'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSubmit('DRAFT')}
            disabled={isLoading}
            aria-label="Taslak olarak kaydet"
          >
            <Save className="h-4 w-4 mr-2" aria-hidden="true" />
            {isLoading ? 'Kaydediliyor...' : 'Taslak Kaydet'}
          </Button>
          <Button
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={isLoading}
            aria-label="Blog yazısını yayınla"
          >
            {isLoading ? 'Yayınlanıyor...' : 'Yayınla'}
          </Button>
        </div>
      </div>

      {showPreview ? (
        <Card>
          <CardHeader>
            <CardTitle>Önizleme</CardTitle>
          </CardHeader>
          <CardContent>
            {imagePreview && (
              <img
                src={imagePreview}
                alt={formData.coverImageAlt}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <h1 className="text-4xl font-bold mb-4">{formData.title || 'Başlık'}</h1>
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
              dangerouslySetInnerHTML={{ __html: formData.content || '<p>İçerik burada görünecek...</p>' }}
            />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content">İçerik</TabsTrigger>
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Temel Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Blog yazısı başlığı"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => {
                      setManualSlugEdit(true)
                      setFormData({ ...formData, slug: e.target.value })
                    }}
                    placeholder="blog-yazisi-slug"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: /blog/{formData.slug || 'slug'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Özet</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Blog yazısının kısa özeti (maksimum 300 karakter)"
                    maxLength={300}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.excerpt.length}/300 karakter
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kapak Görseli</CardTitle>
                <CardDescription>
                  Görsel URL'i girin (örn: https://example.com/image.jpg)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Görsel URL</Label>
                  <Input
                    id="coverImage"
                    value={formData.coverImage}
                    onChange={(e) => {
                      setFormData({ ...formData, coverImage: e.target.value })
                      setImagePreview(e.target.value)
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ücretsiz resim siteleri: Unsplash, Pexels, Pixabay
                  </p>
                </div>

                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full h-64 object-cover rounded-lg"
                      onError={() => {
                        toast.error('Resim yüklenemedi', {
                          description: 'Lütfen geçerli bir URL girin'
                        })
                      }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="coverImageAlt">Görsel Alt Metni</Label>
                  <Input
                    id="coverImageAlt"
                    value={formData.coverImageAlt}
                    onChange={(e) => setFormData({ ...formData, coverImageAlt: e.target.value })}
                    placeholder="Görsel açıklaması (SEO için önemli)"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>İçerik *</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Kategori ve Etiketler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Etiketler</Label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Button
                        key={tag.id}
                        type="button"
                        variant={formData.tags.includes(tag.id) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes(tag.id)
                              ? prev.tags.filter((t) => t !== tag.id)
                              : [...prev.tags, tag.id],
                          }))
                        }}
                      >
                        {tag.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Ayarları</CardTitle>
                <CardDescription>
                  Arama motorları için optimize edilmiş meta bilgiler
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Başlık</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder={formData.title || 'Blog başlığı kullanılacak'}
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaTitle.length}/100 karakter
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Açıklama</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder={formData.excerpt || 'Blog özeti kullanılacak'}
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaDescription.length}/160 karakter (önerilen)
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Arama Motoru Önizlemesi</p>
                  <div className="space-y-1">
                    <p className="text-blue-600 text-lg">
                      {formData.metaTitle || formData.title || 'Blog Başlığı'}
                    </p>
                    <p className="text-green-700 text-xs">
                      zayiflamaplan.com/blog/{formData.slug || 'slug'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.metaDescription || formData.excerpt || 'Blog açıklaması burada görünecek...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

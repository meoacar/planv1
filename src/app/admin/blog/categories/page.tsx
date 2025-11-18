'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CategoryForm } from '@/components/admin/category-form'
import { CategoryList } from '@/components/admin/category-list'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  order: number
  _count: {
    posts: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/blog/categories')
      if (!response.ok) throw new Error('Kategoriler yüklenemedi')
      
      const data = await response.json()
      setCategories(data.data)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Kategoriler yüklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setShowForm(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Kategori silinemedi')
      }

      toast.success('Kategori başarıyla silindi')
      loadCategories()
    } catch (error: any) {
      toast.error(error.message || 'Kategori silinirken bir hata oluştu')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCategory(null)
    loadCategories()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingCategory(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Kategori Yönetimi</h1>
            <p className="text-muted-foreground mt-1">
              Blog kategorilerini yönet ve düzenle
            </p>
          </div>
        </div>
        {!showForm && (
          <Button onClick={handleCreateCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kategori
          </Button>
        )}
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Oluştur'}
            </CardTitle>
            <CardDescription>
              {editingCategory 
                ? 'Kategori bilgilerini güncelleyin' 
                : 'Yeni bir blog kategorisi oluşturun'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryForm
              category={editingCategory}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Kategoriler</CardTitle>
            <CardDescription>
              Toplam {categories.length} kategori
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Henüz kategori oluşturulmamış
                </p>
                <Button onClick={handleCreateCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Kategoriyi Oluştur
                </Button>
              </div>
            ) : (
              <CategoryList
                categories={categories}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

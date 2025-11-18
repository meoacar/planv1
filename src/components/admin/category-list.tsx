'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, FileText } from 'lucide-react'

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

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (categoryId: string) => void
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Sıra</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Açıklama</TableHead>
            <TableHead className="text-center">Blog Sayısı</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.order}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {category.icon && (
                    <span className="text-xl">{category.icon}</span>
                  )}
                  <div
                    className="px-2 py-1 rounded text-sm font-medium text-white"
                    style={{ backgroundColor: category.color || '#3b82f6' }}
                  >
                    {category.name}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {category.slug}
                </code>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="text-sm text-muted-foreground truncate">
                  {category.description || '-'}
                </p>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary" className="gap-1">
                  <FileText className="h-3 w-3" />
                  {category._count.posts}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(category.id)}
                    disabled={category._count.posts > 0}
                    title={
                      category._count.posts > 0
                        ? 'Bu kategoriye ait blog yazıları var'
                        : 'Kategoriyi sil'
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

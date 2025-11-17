"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Edit, Trash2, Calendar } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { SortableTable } from "@/components/admin/sortable-table"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface SeasonalTheme {
  id: string
  name: string
  category: string
  icon: string
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
}

interface ThemeFormData {
  name: string
  category: string
  icon: string
  startDate: string
  endDate: string
}

const EMOJI_SUGGESTIONS = ["🌙", "🎉", "🎊", "🎄", "🎃", "💝", "🌸", "☀️", "🍂", "❄️"]

export function SeasonalThemeManager() {
  const router = useRouter()
  const [themes, setThemes] = useState<SeasonalTheme[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const [editingTheme, setEditingTheme] = useState<SeasonalTheme | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<ThemeFormData>({
    name: "",
    category: "seasonal",
    icon: "🎊",
    startDate: "",
    endDate: "",
  })

  const fetchThemes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/seasonal-themes")
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Temalar yüklenemedi")
      }

      setThemes(result.data)
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchThemes()
  }, [])

  const resetForm = () => {
    setFormData({
      name: "",
      category: "seasonal",
      icon: "🎊",
      startDate: "",
      endDate: "",
    })
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Lütfen tüm alanları doldurun")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/admin/seasonal-themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Tema oluşturulamadı")
      }

      toast.success("Tema başarıyla oluşturuldu")
      setCreateDialogOpen(false)
      resetForm()
      fetchThemes()
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingTheme || !formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Lütfen tüm alanları doldurun")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`/api/admin/seasonal-themes/${editingTheme.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Tema güncellenemedi")
      }

      toast.success("Tema başarıyla güncellendi")
      setEditDialogOpen(false)
      setEditingTheme(null)
      resetForm()
      fetchThemes()
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/admin/seasonal-themes/${deletingId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Tema silinemedi")
      }

      toast.success("Tema başarıyla silindi")
      setDeleteDialogOpen(false)
      setDeletingId(null)
      fetchThemes()
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/seasonal-themes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || "Durum değiştirilemedi")
      }

      toast.success(currentStatus ? "Tema devre dışı bırakıldı" : "Tema aktif edildi")
      fetchThemes()
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu")
    }
  }

  const openEditDialog = (theme: SeasonalTheme) => {
    setEditingTheme(theme)
    setFormData({
      name: theme.name,
      category: theme.category,
      icon: theme.icon,
      startDate: format(new Date(theme.startDate), "yyyy-MM-dd"),
      endDate: format(new Date(theme.endDate), "yyyy-MM-dd"),
    })
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const columns = [
    {
      key: "icon",
      label: "İkon",
      render: (theme: SeasonalTheme) => (
        <span className="text-2xl">{theme.icon}</span>
      ),
    },
    {
      key: "name",
      label: "Tema Adı",
      sortable: true,
      render: (theme: SeasonalTheme) => (
        <span className="font-medium">{theme.name}</span>
      ),
    },
    {
      key: "category",
      label: "Kategori",
      sortable: true,
      render: (theme: SeasonalTheme) => (
        <Badge variant="outline">{theme.category}</Badge>
      ),
    },
    {
      key: "startDate",
      label: "Başlangıç",
      sortable: true,
      render: (theme: SeasonalTheme) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3" />
          {format(new Date(theme.startDate), "dd MMM yyyy", { locale: tr })}
        </div>
      ),
    },
    {
      key: "endDate",
      label: "Bitiş",
      sortable: true,
      render: (theme: SeasonalTheme) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3" />
          {format(new Date(theme.endDate), "dd MMM yyyy", { locale: tr })}
        </div>
      ),
    },
    {
      key: "isActive",
      label: "Durum",
      sortable: true,
      render: (theme: SeasonalTheme) => (
        <Switch
          checked={theme.isActive}
          onCheckedChange={() => handleToggleActive(theme.id, theme.isActive)}
        />
      ),
    },
    {
      key: "actions",
      label: "İşlemler",
      render: (theme: SeasonalTheme) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => openEditDialog(theme)}
            title="Düzenle"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => openDeleteDialog(theme.id)}
            title="Sil"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sezonluk Temalar</h2>
          <p className="text-sm text-muted-foreground">
            Özel günler için tema yönetimi
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Tema
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium">Toplam Tema</div>
          <div className="text-2xl font-bold text-blue-700">{themes.length}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">Aktif Temalar</div>
          <div className="text-2xl font-bold text-green-700">
            {themes.filter(t => t.isActive).length}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 font-medium">Pasif Temalar</div>
          <div className="text-2xl font-bold text-gray-700">
            {themes.filter(t => !t.isActive).length}
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <SortableTable
          data={themes}
          columns={columns}
          getItemId={(item) => item.id}
        />
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Sezonluk Tema</DialogTitle>
            <DialogDescription>
              Özel günler için yeni bir tema oluşturun
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tema Adı</Label>
              <Input
                id="name"
                placeholder="Örn: Ramazan 2025"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                placeholder="seasonal"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div>
              <Label>İkon</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  placeholder="🎊"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-20 text-center text-2xl"
                />
                <div className="flex flex-wrap gap-1">
                  {EMOJI_SUGGESTIONS.map((emoji) => (
                    <Button
                      key={emoji}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xl"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="startDate">Başlangıç Tarihi</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Bitiş Tarihi</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false)
                resetForm()
              }}
              disabled={submitting}
            >
              İptal
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                "Oluştur"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Temayı Düzenle</DialogTitle>
            <DialogDescription>
              Tema bilgilerini güncelleyin
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Tema Adı</Label>
              <Input
                id="edit-name"
                placeholder="Örn: Ramazan 2025"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Kategori</Label>
              <Input
                id="edit-category"
                placeholder="seasonal"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div>
              <Label>İkon</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  placeholder="🎊"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-20 text-center text-2xl"
                />
                <div className="flex flex-wrap gap-1">
                  {EMOJI_SUGGESTIONS.map((emoji) => (
                    <Button
                      key={emoji}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xl"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-startDate">Başlangıç Tarihi</Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-endDate">Bitiş Tarihi</Label>
              <Input
                id="edit-endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false)
                setEditingTheme(null)
                resetForm()
              }}
              disabled={submitting}
            >
              İptal
            </Button>
            <Button onClick={handleUpdate} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                "Güncelle"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Temayı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu temayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

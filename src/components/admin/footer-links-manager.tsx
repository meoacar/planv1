'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, Save, Trash2, Loader2, GripVertical } from 'lucide-react'
import { toast } from 'sonner'

interface FooterLink {
  id: string
  title: string
  url: string
  column: string
  sortOrder: number
  isActive: boolean
  openInNew: boolean
}

interface FooterLinksManagerProps {
  initialLinks: FooterLink[]
}

export function FooterLinksManager({ initialLinks }: FooterLinksManagerProps) {
  const router = useRouter()
  const [links, setLinks] = useState(initialLinks)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const columns = [
    { value: 'company', label: 'Şirket' },
    { value: 'support', label: 'Destek' },
    { value: 'legal', label: 'Yasal' },
    { value: 'community', label: 'Topluluk' },
  ]

  const addNewLink = () => {
    const newLink: FooterLink = {
      id: `new-${Date.now()}`,
      title: '',
      url: '',
      column: 'company',
      sortOrder: links.length,
      isActive: true,
      openInNew: false,
    }
    setLinks([...links, newLink])
    setEditingId(newLink.id)
  }

  const updateLink = (id: string, field: keyof FooterLink, value: any) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ))
  }

  const deleteLink = async (id: string) => {
    if (!confirm('Bu linki silmek istediğinizden emin misiniz?')) {
      return
    }

    if (id.startsWith('new-')) {
      setLinks(links.filter(link => link.id !== id))
      return
    }

    try {
      const response = await fetch(`/api/admin/footer/links/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error()

      setLinks(links.filter(link => link.id !== id))
      toast.success('Link silindi')
      router.refresh()
    } catch (error) {
      toast.error('Silme işlemi başarısız')
    }
  }

  const saveAll = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/admin/footer/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links }),
      })

      if (!response.ok) throw new Error()

      toast.success('Linkler kaydedildi')
      router.refresh()
      setEditingId(null)
    } catch (error) {
      toast.error('Kaydetme işlemi başarısız')
    } finally {
      setLoading(false)
    }
  }

  // Kolonlara göre grupla
  const linksByColumn = columns.map(col => ({
    ...col,
    links: links.filter(link => link.column === col.value),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Footer Linkleri</h3>
          <p className="text-sm text-muted-foreground">
            Footer'da görünecek linkleri yönetin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={addNewLink} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Link
          </Button>
          <Button onClick={saveAll} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Tümünü Kaydet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {linksByColumn.map(column => (
          <Card key={column.value}>
            <CardHeader>
              <CardTitle className="text-base">{column.label}</CardTitle>
              <CardDescription>
                {column.links.length} link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {column.links.map((link) => (
                <div
                  key={link.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={link.title}
                      onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                      placeholder="Link başlığı"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <Input
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    placeholder="/sayfa-url veya https://..."
                  />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={link.isActive}
                        onCheckedChange={(checked) => 
                          updateLink(link.id, 'isActive', checked)
                        }
                      />
                      <span className="text-muted-foreground">Aktif</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={link.openInNew}
                        onCheckedChange={(checked) => 
                          updateLink(link.id, 'openInNew', checked)
                        }
                      />
                      <span className="text-muted-foreground">Yeni sekmede aç</span>
                    </div>
                  </div>
                </div>
              ))}

              {column.links.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Bu kolonda link yok
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

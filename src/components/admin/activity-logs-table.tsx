'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface ActivityLog {
  id: string
  actorId: string | null
  action: string
  entity: string
  entityId: string | null
  ip: string | null
  userAgent: string | null
  metadata: string | null
  createdAt: string
}

const actionLabels: Record<string, string> = {
  approve_recipe: 'Tarif Onaylandı',
  reject_recipe: 'Tarif Reddedildi',
  approve_plan: 'Plan Onaylandı',
  reject_plan: 'Plan Reddedildi',
  ban_user: 'Kullanıcı Banlandı',
  unban_user: 'Ban Kaldırıldı',
  delete_comment: 'Yorum Silindi',
  grant_coins: 'Coin Verildi',
  award_badge: 'Rozet Verildi',
}

const entityLabels: Record<string, string> = {
  recipe: 'Tarif',
  plan: 'Plan',
  user: 'Kullanıcı',
  comment: 'Yorum',
  badge: 'Rozet',
  quest: 'Görev',
}

export function ActivityLogsTable() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [actionFilter, setActionFilter] = useState('')
  const [entityFilter, setEntityFilter] = useState('')

  const limit = 50

  useEffect(() => {
    fetchLogs()
  }, [page, actionFilter, entityFilter])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (actionFilter) params.append('action', actionFilter)
      if (entityFilter) params.append('entity', entityFilter)

      const response = await fetch(`/api/v1/admin/activity-logs?${params}`)
      const data = await response.json()

      if (data.success) {
        setLogs(data.data)
        setTotal(data.meta.total)
        setTotalPages(data.meta.totalPages)
      }
    } catch (error) {
      console.error('Fetch logs error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionBadgeColor = (action: string) => {
    if (action.includes('approve')) return 'bg-green-500'
    if (action.includes('reject')) return 'bg-red-500'
    if (action.includes('ban')) return 'bg-orange-500'
    if (action.includes('delete')) return 'bg-red-600'
    if (action.includes('grant') || action.includes('award')) return 'bg-blue-500'
    return 'bg-gray-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivite Geçmişi</CardTitle>
        <div className="flex gap-4 mt-4">
          <Select value={actionFilter || 'all'} onValueChange={(v) => setActionFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tüm İşlemler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm İşlemler</SelectItem>
              <SelectItem value="approve_recipe">Tarif Onay</SelectItem>
              <SelectItem value="reject_recipe">Tarif Red</SelectItem>
              <SelectItem value="approve_plan">Plan Onay</SelectItem>
              <SelectItem value="reject_plan">Plan Red</SelectItem>
              <SelectItem value="ban_user">Kullanıcı Ban</SelectItem>
              <SelectItem value="grant_coins">Coin Ver</SelectItem>
            </SelectContent>
          </Select>

          <Select value={entityFilter || 'all'} onValueChange={(v) => setEntityFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tüm Varlıklar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Varlıklar</SelectItem>
              <SelectItem value="recipe">Tarif</SelectItem>
              <SelectItem value="plan">Plan</SelectItem>
              <SelectItem value="user">Kullanıcı</SelectItem>
              <SelectItem value="comment">Yorum</SelectItem>
            </SelectContent>
          </Select>

          {(actionFilter || entityFilter) && (
            <Button
              variant="outline"
              onClick={() => {
                setActionFilter('')
                setEntityFilter('')
              }}
            >
              Filtreleri Temizle
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Yükleniyor...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Henüz aktivite kaydı yok
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {logs.map((log) => {
                let metadata: any = {}
                try {
                  metadata = log.metadata ? JSON.parse(log.metadata) : {}
                } catch (e) {}

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Badge className={getActionBadgeColor(log.action)}>
                      {actionLabels[log.action] || log.action}
                    </Badge>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {entityLabels[log.entity] || log.entity}
                        </span>
                        {metadata.recipeTitle && (
                          <span className="text-sm text-muted-foreground">
                            "{metadata.recipeTitle}"
                          </span>
                        )}
                        {metadata.planTitle && (
                          <span className="text-sm text-muted-foreground">
                            "{metadata.planTitle}"
                          </span>
                        )}
                      </div>

                      {metadata.reason && (
                        <p className="text-sm text-muted-foreground">
                          Sebep: {metadata.reason}
                        </p>
                      )}

                      {metadata.authorUsername && (
                        <p className="text-sm text-muted-foreground">
                          Yazar: @{metadata.authorUsername}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(log.createdAt), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </span>
                        {log.ip && <span>IP: {log.ip}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Toplam {total} kayıt
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Önceki
                </Button>
                <span className="text-sm">
                  Sayfa {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

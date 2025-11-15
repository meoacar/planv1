import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getRecentActivity, getActivityStats } from './actions'
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Search,
  CheckCircle,
  Clock,
  XCircle,
  UserPlus,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { ActivityFilters } from '@/components/admin/activity-filters'

export default async function AdminActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string; page?: string }>
}) {
  const params = await searchParams
  const type = params.type
  const search = params.search
  const page = parseInt(params.page || '1')

  const [{ activities, total, totalPages }, stats] = await Promise.all([
    getRecentActivity({ type, search, page }),
    getActivityStats(),
  ])

  const getActivityIcon = (type: string, action: string) => {
    if (type === 'plan') return <FileText className="h-4 w-4" />
    if (type === 'comment') return <MessageSquare className="h-4 w-4" />
    if (type === 'user') return <UserPlus className="h-4 w-4" />
    return <TrendingUp className="h-4 w-4" />
  }

  const getActivityColor = (action: string, status?: string) => {
    if (action === 'published' || action === 'registered') return 'text-green-600'
    if (action === 'created' || status === 'pending') return 'text-yellow-600'
    if (action === 'rejected') return 'text-red-600'
    return 'text-blue-600'
  }

  const getStatusBadge = (action: string, status?: string) => {
    if (action === 'published') return <Badge variant="success">Yayında</Badge>
    if (action === 'created' && status === 'pending') return <Badge variant="warning">Bekliyor</Badge>
    if (action === 'rejected') return <Badge variant="destructive">Reddedildi</Badge>
    if (action === 'registered') return <Badge variant="default">Yeni Kayıt</Badge>
    return <Badge variant="secondary">{action}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Aktivite Logları</h1>
        <p className="text-muted-foreground">
          Platform üzerindeki tüm aktiviteleri görüntüle
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Bugünkü Planlar</CardDescription>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayPlans}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Toplam: {stats.totalPlans}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Bugünkü Yorumlar</CardDescription>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayComments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Toplam: {stats.totalComments}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Bugünkü Kayıtlar</CardDescription>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Toplam: {stats.totalUsers}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aktiviteler</CardTitle>
              <CardDescription>Toplam {total} aktivite</CardDescription>
            </div>
            <ActivityFilters currentType={type} currentSearch={search} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className={`mt-1 ${getActivityColor(activity.action, 'status' in activity.metadata ? activity.metadata.status : undefined)}`}>
                  {getActivityIcon(activity.type, activity.action)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleString('tr-TR')}
                        </span>
                        {activity.user && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              @{activity.user.username || activity.user.name || activity.user.email?.split('@')[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(activity.action, 'status' in activity.metadata ? activity.metadata.status : undefined)}
                      {activity.type === 'plan' && activity.metadata.slug && (
                        <Link
                          href={`/plan/${activity.metadata.slug}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Görüntüle
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  {activity.type === 'plan' && (
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{activity.metadata.views} görüntülenme</span>
                      <span>{activity.metadata.likes} beğeni</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aktivite bulunamadı</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/aktiviteler?page=${p}${type ? `&type=${type}` : ''}${search ? `&search=${search}` : ''}`}
                  className={`px-3 py-1 rounded ${
                    p === page
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

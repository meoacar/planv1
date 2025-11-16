import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getPlansForModeration } from './actions'
import { PlanActions } from '@/components/admin/plan-actions'
import { PlanFilters } from '@/components/admin/plan-filters'

export default async function AdminPlansPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; search?: string }>
}) {
  const params = await searchParams
  const status = params.status || 'all'
  const page = parseInt(params.page || '1')
  const search = params.search
  
  const { plans, total } = await getPlansForModeration(status, page, search)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Plan Yönetimi</h1>
        <p className="text-muted-foreground">
          Planları incele, onayla veya reddet
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Planlar</CardTitle>
              <CardDescription>Toplam {total} plan</CardDescription>
            </div>
            <PlanFilters currentStatus={status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b">
              <Link 
                href="/admin/planlar?status=all"
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  status === 'all' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Tümü
              </Link>
              <Link 
                href="/admin/planlar?status=pending"
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  status === 'pending' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Bekleyen
                {plans.filter(p => p.status === 'pending').length > 0 && (
                  <Badge variant="warning">
                    {plans.filter(p => p.status === 'pending').length}
                  </Badge>
                )}
              </Link>
              <Link 
                href="/admin/planlar?status=under_review"
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  status === 'under_review' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                İnceleniyor
                {plans.filter(p => p.status === 'under_review').length > 0 && (
                  <Badge variant="default">
                    {plans.filter(p => p.status === 'under_review').length}
                  </Badge>
                )}
              </Link>
              <Link 
                href="/admin/planlar?status=published"
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  status === 'published' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Yayında
              </Link>
              <Link 
                href="/admin/planlar?status=rejected"
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  status === 'rejected' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Reddedilen
              </Link>
            </div>

            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Yazar</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Görüntülenme</TableHead>
                    <TableHead>Beğeni</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{plan.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {plan.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {plan.author.name?.[0] || 'U'}
                          </div>
                          <span className="text-sm">
                            @{plan.author.username || plan.author.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            plan.status === 'published' ? 'success' :
                            plan.status === 'pending' ? 'warning' :
                            plan.status === 'under_review' ? 'default' :
                            'destructive'
                          }
                        >
                          {plan.status === 'published' ? 'Yayında' :
                           plan.status === 'pending' ? 'Bekliyor' :
                           plan.status === 'under_review' ? 'İnceleniyor' :
                           'Reddedildi'}
                        </Badge>
                      </TableCell>
                      <TableCell>{plan.views}</TableCell>
                      <TableCell>{plan.likesCount}</TableCell>
                      <TableCell>
                        {new Date(plan.createdAt).toLocaleDateString('tr-TR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <PlanActions 
                          planId={plan.id} 
                          planSlug={plan.slug} 
                          status={plan.status} 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {plans.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Plan bulunamadı</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

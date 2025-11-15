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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
          <Tabs defaultValue={status} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Tümü</TabsTrigger>
              <TabsTrigger value="pending">
                Bekleyen
                <Badge variant="warning" className="ml-2">
                  {plans.filter(p => p.status === 'pending').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="published">Yayında</TabsTrigger>
              <TabsTrigger value="rejected">Reddedilen</TabsTrigger>
            </TabsList>

            <TabsContent value={status} className="space-y-4">
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
                            'destructive'
                          }
                        >
                          {plan.status === 'published' ? 'Yayında' :
                           plan.status === 'pending' ? 'Bekliyor' :
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

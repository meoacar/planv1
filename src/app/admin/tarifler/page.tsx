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
import { getRecipesForModeration } from './actions'
import { RecipeActions } from '@/components/admin/recipe-actions'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'

export default async function AdminRecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; search?: string }>
}) {
  const params = await searchParams
  const status = params.status || 'pending'
  const page = parseInt(params.page || '1')
  const search = params.search
  
  const { recipes, total } = await getRecipesForModeration(status, page, search)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tarif Yönetimi</h1>
        <p className="text-muted-foreground">
          Tarifleri incele, onayla veya reddet
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tarifler</CardTitle>
              <CardDescription>Toplam {total} tarif</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={status} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Tümü</TabsTrigger>
              <TabsTrigger value="pending">
                Bekleyen
                <Badge variant="secondary" className="ml-2">
                  {recipes.filter(r => r.status === 'pending').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="published">Yayında</TabsTrigger>
              <TabsTrigger value="rejected">Reddedilen</TabsTrigger>
            </TabsList>

            <TabsContent value={status} className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarif</TableHead>
                    <TableHead>Yazar</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Görüntülenme</TableHead>
                    <TableHead>Beğeni</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell>
                          <div>
                            <Link 
                              href={`/tarif/${recipe.slug}`}
                              className="font-medium hover:underline"
                            >
                              {recipe.title}
                            </Link>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {recipe.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {recipe.author.name?.[0] || 'U'}
                            </div>
                            <span className="text-sm">
                              @{recipe.author.username || recipe.author.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {recipe.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              recipe.status === 'published' ? 'default' :
                              recipe.status === 'pending' ? 'secondary' :
                              'destructive'
                            }
                          >
                            {recipe.status === 'published' ? 'Yayında' :
                             recipe.status === 'pending' ? 'Bekliyor' :
                             'Reddedildi'}
                          </Badge>
                        </TableCell>
                        <TableCell>{recipe.views}</TableCell>
                        <TableCell>{recipe.likesCount}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(recipe.createdAt), {
                              addSuffix: true,
                              locale: tr,
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <RecipeActions recipe={recipe} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">Tarif bulunamadı</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

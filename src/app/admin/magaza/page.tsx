import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getMagazaStats() {
  // TODO: Implement real stats from database
  return {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  }
}

export default async function MagazaAdminPage() {
  const stats = await getMagazaStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mağaza Yönetimi</h1>
          <p className="text-muted-foreground">
            Ürünler, siparişler ve kuponları yönetin
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Sipariş</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ürünler</CardTitle>
            <CardDescription>Ürün fiyatları ve stok yönetimi</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/magaza/urunler">
              <Button className="w-full">Ürünleri Yönet</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Siparişler</CardTitle>
            <CardDescription>Müşteri siparişlerini görüntüle</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/magaza/siparisler">
              <Button className="w-full">Siparişleri Görüntüle</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kuponlar</CardTitle>
            <CardDescription>İndirim kuponları oluştur</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/magaza/kuponlar">
              <Button className="w-full">Kuponları Yönet</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

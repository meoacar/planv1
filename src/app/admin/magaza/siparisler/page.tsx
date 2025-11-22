"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  userId: string
  userName: string
  userEmail: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
}

export default function SiparislerPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all')
  const { toast } = useToast()

  useEffect(() => {
    loadOrders()
  }, [filter])

  const loadOrders = async () => {
    try {
      const res = await fetch(`/api/admin/magaza/orders?status=${filter}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Siparişler yüklenemedi",
        variant: "destructive",
      })
    }
  }

  const updateOrderStatus = async (orderId: string, status: 'completed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/admin/magaza/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        toast({
          title: "Başarılı",
          description: "Sipariş durumu güncellendi",
        })
        loadOrders()
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem başarısız",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", label: "Bekliyor" },
      completed: { variant: "default", label: "Tamamlandı" },
      cancelled: { variant: "destructive", label: "İptal" },
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Siparişler</h1>
          <p className="text-muted-foreground">
            Müşteri siparişlerini görüntüleyin ve yönetin
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Tümü
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Bekleyen
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
        >
          Tamamlanan
        </Button>
        <Button
          variant={filter === 'cancelled' ? 'default' : 'outline'}
          onClick={() => setFilter('cancelled')}
        >
          İptal
        </Button>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Sipariş #{order.id.slice(0, 8)}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {order.userName} ({order.userEmail})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(order.status)}
                  <div className="text-2xl font-bold mt-2">₺{order.total.toFixed(2)}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.productName} x{item.quantity}</span>
                    <span>₺{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {order.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Onayla
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    İptal Et
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Sipariş bulunamadı</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

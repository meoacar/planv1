"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShoppingCart, Sparkles, Check, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number | null
  category: string
  image?: string | null
}

interface PremiumShopClientProps {
  products: Product[]
}

export function PremiumShopClient({ products }: PremiumShopClientProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handlePurchase = async (productId: string, paymentMethod: string) => {
    setLoading(productId)
    
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ödeme oluşturulamadı')
      }

      if (data.paymentUrl) {
        // Ödeme sayfasına yönlendir
        window.location.href = data.paymentUrl
      } else {
        toast({
          title: "Hata",
          description: "Ödeme URL'si alınamadı",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
      setShowPaymentModal(false)
    }
  }

  const openPaymentModal = (productId: string) => {
    setSelectedProduct(productId)
    setShowPaymentModal(true)
  }

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Premium Mağaza
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Hedeflerinize daha hızlı ulaşmak için özel hizmetler ve premium üyelikler
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/magaza'}
            className="border-yellow-500/50 hover:bg-yellow-500/10"
          >
            🪙 Coin Mağazası
          </Button>
        </div>

        {/* Products by Category */}
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">💎</span>
              {category}
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryProducts.map((product) => {
                const discount = product.originalPrice 
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0

                return (
                  <Card key={product.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    {discount > 0 && (
                      <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600">
                        %{discount} İndirim
                      </Badge>
                    )}
                    
                    {product.image && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-purple-600">
                          ₺{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            ₺{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {/* Features - can be customized per product */}
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          <span>Anında aktivasyon</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          <span>7/24 destek</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          <span>Para iade garantisi</span>
                        </li>
                      </ul>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={() => openPaymentModal(product.id)}
                        disabled={loading === product.id}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {loading === product.id ? "İşleniyor..." : "Satın Al"}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Henüz premium ürün bulunmuyor</p>
            </div>
          </Card>
        )}
      </div>

      {/* Ödeme Yöntemi Seçim Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ödeme Yöntemi Seçin</DialogTitle>
            <DialogDescription>
              Güvenli ödeme için bir yöntem seçin
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              className="w-full h-16 justify-start gap-4"
              variant="outline"
              onClick={() => selectedProduct && handlePurchase(selectedProduct, 'stripe')}
              disabled={loading !== null}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">Stripe</div>
                <div className="text-xs text-muted-foreground">Kredi/Banka Kartı</div>
              </div>
            </Button>

            <Button
              className="w-full h-16 justify-start gap-4"
              variant="outline"
              onClick={() => selectedProduct && handlePurchase(selectedProduct, 'iyzico')}
              disabled={loading !== null}
            >
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">iyzico</div>
                <div className="text-xs text-muted-foreground">Kredi/Banka Kartı</div>
              </div>
            </Button>

            <Button
              className="w-full h-16 justify-start gap-4"
              variant="outline"
              onClick={() => selectedProduct && handlePurchase(selectedProduct, 'paytr')}
              disabled={loading !== null}
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">PayTR</div>
                <div className="text-xs text-muted-foreground">Kredi/Banka Kartı</div>
              </div>
            </Button>
          </div>
          <div className="text-center text-xs text-muted-foreground mt-4">
            🔒 Tüm ödemeler SSL ile güvence altındadır
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

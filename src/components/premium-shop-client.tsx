"use client"

import { useState, useEffect } from "react"
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

interface PaymentSettings {
  paytrEnabled: boolean
  iyzicoEnabled: boolean
  stripeEnabled: boolean
}

export function PremiumShopClient({ products }: PremiumShopClientProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    paytrEnabled: true,
    iyzicoEnabled: true,
    stripeEnabled: true,
  })

  // Ödeme ayarlarını yükle
  useEffect(() => {
    fetch('/api/payment/settings')
      .then(res => res.json())
      .then(data => setPaymentSettings(data))
      .catch(err => console.error('Failed to load payment settings:', err))
  }, [])

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

      {/* Ödeme Yöntemi Seçim Modal - Modern Design */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-lg border-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-0 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-6 pb-8">
            <div className="absolute inset-0 bg-black/10" />
            <DialogHeader className="relative z-10">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
              </div>
              <DialogTitle className="text-2xl font-bold text-white text-center">
                Ödeme Yöntemi Seçin
              </DialogTitle>
              <DialogDescription className="text-white/90 text-center text-base">
                Güvenli ve hızlı ödeme için bir yöntem seçin
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Payment Methods */}
          <div className="p-6 space-y-3">
            {/* Stripe */}
            {paymentSettings.stripeEnabled && (
              <button
                onClick={() => selectedProduct && handlePurchase(selectedProduct, 'stripe')}
                disabled={loading !== null}
                className="group relative w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                    <CreditCard className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-lg text-gray-900 dark:text-white">Stripe</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Kredi/Banka Kartı • Güvenli Ödeme</div>
                </div>
                <div className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              </button>
            )}

            {/* iyzico */}
            {paymentSettings.iyzicoEnabled && (
              <button
                onClick={() => selectedProduct && handlePurchase(selectedProduct, 'iyzico')}
                disabled={loading !== null}
                className="group relative w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-orange-500/50 transition-shadow">
                    <CreditCard className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    iyzico
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs">
                      Türkiye
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Kredi/Banka Kartı • Taksit İmkanı</div>
                </div>
                <div className="text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              </button>
            )}

            {/* PayTR */}
            {paymentSettings.paytrEnabled && (
              <button
                onClick={() => selectedProduct && handlePurchase(selectedProduct, 'paytr')}
                disabled={loading !== null}
                className="group relative w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-green-500/50 transition-shadow">
                    <CreditCard className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    PayTR
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                      Popüler
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Kredi/Banka Kartı • Hızlı İşlem</div>
                </div>
                <div className="text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              </button>
            )}

            {/* Hiçbir ödeme yöntemi aktif değilse */}
            {!paymentSettings.paytrEnabled && !paymentSettings.iyzicoEnabled && !paymentSettings.stripeEnabled && (
              <div className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400 mb-2">
                  Şu anda hiçbir ödeme yöntemi aktif değil
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  Lütfen daha sonra tekrar deneyin
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                    Güvenli Ödeme Garantisi
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Tüm ödemeler 256-bit SSL şifreleme ile korunmaktadır. Kart bilgileriniz asla saklanmaz.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

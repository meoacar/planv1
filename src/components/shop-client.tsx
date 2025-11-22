'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Coins, Loader2, Package, Search, Star, TrendingUp, Sparkles, Heart, ShoppingBag, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopItem {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  price: number;
  stock: number | null;
  metadata: string | null;
}

interface ShopClientProps {
  items: ShopItem[];
  userCoins: number;
}

const categoryNames: Record<string, string> = {
  cosmetic: 'Kozmetik',
  boost: 'Güçlendirme',
  recovery: 'Kurtarma',
  special: 'Özel',
};

const categoryIcons: Record<string, string> = {
  cosmetic: '💄',
  boost: '⚡',
  recovery: '💊',
  special: '✨',
};

type SortOption = 'price-asc' | 'price-desc' | 'name' | 'popular';

export function ShopClient({ items, userCoins }: ShopClientProps) {
  const router = useRouter();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [coins, setCoins] = useState(userCoins);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shop-favorites');
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch (e) {
          return new Set();
        }
      }
    }
    return new Set();
  });
  const [cart, setCart] = useState<Map<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shop-cart');
      if (saved) {
        try {
          return new Map(JSON.parse(saved));
        } catch (e) {
          return new Map();
        }
      }
    }
    return new Map();
  });

  const categories = ['all', ...new Set(items.map((item) => item.category))];
  
  // Filtreleme ve sıralama
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Arama filtresi
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sıralama
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        break;
      case 'popular':
      default:
        // Varsayılan sıralama (sortOrder)
        break;
    }

    return sorted;
  }, [items, selectedCategory, searchQuery, sortBy]);

  // Öne çıkan ürünler (en pahalı 3 ürün)
  const featuredItems = useMemo(() => {
    return [...items].sort((a, b) => b.price - a.price).slice(0, 3);
  }, [items]);

  // Sepet toplamı
  const cartTotal = useMemo(() => {
    let total = 0;
    cart.forEach((quantity, itemKey) => {
      const item = items.find((i) => i.key === itemKey);
      if (item) total += item.price * quantity;
    });
    return total;
  }, [cart, items]);

  const cartItemCount = useMemo(() => {
    let count = 0;
    cart.forEach((quantity) => (count += quantity));
    return count;
  }, [cart]);

  const toggleFavorite = (itemKey: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemKey)) {
        newFavorites.delete(itemKey);
        toast.info('Favorilerden çıkarıldı');
      } else {
        newFavorites.add(itemKey);
        toast.success('Favorilere eklendi! ⭐');
      }
      // localStorage'a kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('shop-favorites', JSON.stringify(Array.from(newFavorites)));
      }
      return newFavorites;
    });
  };

  const addToCart = (itemKey: string) => {
    const item = items.find((i) => i.key === itemKey);
    if (!item) return;

    setCart((prev) => {
      const newCart = new Map(prev);
      const currentQty = newCart.get(itemKey) || 0;
      
      // Stok kontrolü
      if (item.stock !== null && currentQty >= item.stock) {
        toast.error('Stok yetersiz!');
        return prev;
      }

      newCart.set(itemKey, currentQty + 1);
      toast.success('Sepete eklendi! 🛒');
      
      // localStorage'a kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('shop-cart', JSON.stringify(Array.from(newCart.entries())));
      }
      
      return newCart;
    });
  };

  const removeFromCart = (itemKey: string) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      const currentQty = newCart.get(itemKey) || 0;
      
      if (currentQty <= 1) {
        newCart.delete(itemKey);
      } else {
        newCart.set(itemKey, currentQty - 1);
      }
      
      // localStorage'a kaydet
      if (typeof window !== 'undefined') {
        localStorage.setItem('shop-cart', JSON.stringify(Array.from(newCart.entries())));
      }
      
      return newCart;
    });
  };

  const clearCart = () => {
    setCart(new Map());
    // localStorage'dan temizle
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shop-cart');
    }
    toast.info('Sepet temizlendi');
  };

  const purchaseItem = async (itemKey: string, price: number, quantity: number = 1) => {
    const totalPrice = price * quantity;
    
    if (coins < totalPrice) {
      toast.error('Yetersiz coin!');
      return;
    }

    setPurchasing(itemKey);
    try {
      const res = await fetch('/api/v1/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemKey, quantity }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Failed to purchase');
      }

      const data = await res.json();
      setCoins(coins - totalPrice);
      toast.success(`Satın alma başarılı! 🎉 (${quantity} adet)`);
      
      // Sepetten çıkar
      setCart((prev) => {
        const newCart = new Map(prev);
        newCart.delete(itemKey);
        // localStorage'a kaydet
        if (typeof window !== 'undefined') {
          localStorage.setItem('shop-cart', JSON.stringify(Array.from(newCart.entries())));
        }
        return newCart;
      });
      
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Satın alma başarısız');
    } finally {
      setPurchasing(null);
    }
  };

  const purchaseCart = async () => {
    if (cart.size === 0) {
      toast.error('Sepetiniz boş!');
      return;
    }

    if (coins < cartTotal) {
      toast.error('Yetersiz coin!');
      return;
    }

    setPurchasing('cart');
    
    try {
      // Her ürünü sırayla satın al
      for (const [itemKey, quantity] of cart.entries()) {
        const item = items.find((i) => i.key === itemKey);
        if (!item) continue;

        const res = await fetch('/api/v1/shop/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemKey, quantity }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error?.message || 'Failed to purchase');
        }
      }

      setCoins(coins - cartTotal);
      clearCart();
      toast.success('Tüm ürünler satın alındı! 🎉');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Satın alma başarısız');
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🪙 Coin Mağazası
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">Coinlerini harca, özel ödüller kazan!</p>
            </div>
            
            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-purple-500/50 hover:bg-purple-500/10"
                  onClick={() => router.push('/magaza/premium')}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Premium Mağaza
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto"
                  onClick={() => {
                    if (cart.size > 0) {
                      document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      toast.info('Sepetiniz boş');
                    }
                  }}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Sepetim
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Coin Balance & Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-full">
                    <Coins className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Mevcut Bakiye</div>
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                      {coins.toLocaleString('tr-TR')} 🪙
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="border-yellow-500/50 hover:bg-yellow-500/10 w-full sm:w-auto"
                    onClick={() => router.push('/gorevler')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Coin Kazan</span>
                    <span className="sm:hidden">Kazan</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-500/50 hover:bg-purple-500/10 w-full sm:w-auto"
                    onClick={() => {
                      const favItems = items.filter((item) => favorites.has(item.key));
                      if (favItems.length === 0) {
                        toast.info('Henüz favori ürününüz yok');
                      } else {
                        toast.info(`${favItems.length} favori ürününüz var`);
                      }
                    }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Favoriler ({favorites.size})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Öne Çıkan Ürünler */}
        {featuredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-bold">Öne Çıkan Ürünler</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{item.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.price} 🪙</div>
                        </div>
                        <Badge className="bg-purple-600">Popüler</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Arama ve Filtreler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Arama */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Ürün ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sıralama */}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sırala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popüler</SelectItem>
                    <SelectItem value="price-asc">Fiyat (Düşük-Yüksek)</SelectItem>
                    <SelectItem value="price-desc">Fiyat (Yüksek-Düşük)</SelectItem>
                    <SelectItem value="name">İsim (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
              <TabsTrigger value="all" className="gap-2">
                <span>🎯</span> Tümü
              </TabsTrigger>
              {categories
                .filter((c) => c !== 'all')
                .map((category) => (
                  <TabsTrigger key={category} value={category} className="gap-2">
                    <span>{categoryIcons[category] || '📦'}</span>
                    {categoryNames[category] || category}
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchQuery + sortBy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {filteredAndSortedItems.map((item, index) => {
              const canAfford = coins >= item.price;
              const outOfStock = item.stock !== null && item.stock <= 0;
              const isFavorite = favorites.has(item.key);
              const inCart = cart.has(item.key);
              const cartQty = cart.get(item.key) || 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    className={`h-full transition-all duration-300 ${
                      outOfStock
                        ? 'opacity-50'
                        : 'hover:shadow-xl hover:border-purple-500/50'
                    } ${inCart ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <motion.div
                          className="text-5xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {item.icon}
                        </motion.div>
                        <div className="flex flex-col gap-2">
                          <Badge
                            variant={canAfford ? 'default' : 'secondary'}
                            className={
                              canAfford
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                : ''
                            }
                          >
                            {item.price.toLocaleString('tr-TR')} 🪙
                          </Badge>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFavorite(item.key)}
                            className="p-1"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                isFavorite
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-gray-400'
                              }`}
                            />
                          </motion.button>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{item.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {item.stock !== null && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Stok:</span>
                          <Badge variant={item.stock > 10 ? 'default' : 'destructive'}>
                            {item.stock} adet
                          </Badge>
                        </div>
                      )}

                      {inCart && (
                        <div className="flex items-center justify-between p-2 bg-purple-500/10 rounded-lg">
                          <span className="text-sm font-medium">Sepette:</span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.key)}
                              className="h-6 w-6 p-0"
                            >
                              -
                            </Button>
                            <span className="font-bold">{cartQty}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(item.key)}
                              className="h-6 w-6 p-0"
                              disabled={
                                item.stock !== null && cartQty >= item.stock
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          className="flex-1"
                          variant={inCart ? 'secondary' : 'default'}
                          onClick={() => addToCart(item.key)}
                          disabled={
                            outOfStock ||
                            (item.stock !== null && cartQty >= item.stock)
                          }
                        >
                          {outOfStock ? (
                            'Stokta Yok'
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              {inCart ? 'Sepete Ekle' : 'Sepete At'}
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="sm:w-auto"
                          onClick={() => purchaseItem(item.key, item.price, 1)}
                          disabled={
                            !canAfford || outOfStock || purchasing === item.key
                          }
                        >
                          {purchasing === item.key ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Hemen Al'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredAndSortedItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Ürün Bulunamadı</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? `"${searchQuery}" için sonuç bulunamadı`
                    : 'Bu kategoride ürün yok'}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Aramayı Temizle
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sepet Bölümü */}
        {cart.size > 0 && (
          <motion.div
            id="cart-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold">Sepetim</h2>
              <Badge className="bg-purple-600">{cartItemCount} ürün</Badge>
            </div>

            <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Array.from(cart.entries()).map(([itemKey, quantity]) => {
                    const item = items.find((i) => i.key === itemKey);
                    if (!item) return null;

                    const itemTotal = item.price * quantity;

                    return (
                      <motion.div
                        key={itemKey}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div className="text-2xl sm:text-3xl">{item.icon}</div>
                          <div className="flex-1 sm:flex-none min-w-0">
                            <div className="font-semibold truncate">{item.name}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {item.price.toLocaleString('tr-TR')} 🪙 × {quantity}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto sm:flex-1 gap-2 sm:gap-3">
                          <div className="text-right">
                            <div className="font-bold text-base sm:text-lg">
                              {itemTotal.toLocaleString('tr-TR')} 🪙
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(itemKey)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              -
                            </Button>
                            <span className="font-bold w-6 sm:w-8 text-center text-sm sm:text-base">
                              {quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(itemKey)}
                              disabled={
                                item.stock !== null && quantity >= item.stock
                              }
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setCart((prev) => {
                                const newCart = new Map(prev);
                                newCart.delete(itemKey);
                                // localStorage'a kaydet
                                if (typeof window !== 'undefined') {
                                  localStorage.setItem('shop-cart', JSON.stringify(Array.from(newCart.entries())));
                                }
                                return newCart;
                              });
                              toast.info('Üründen çıkarıldı');
                            }}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                          >
                            ✕
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Toplam Tutar
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                          {cartTotal.toLocaleString('tr-TR')} 🪙
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Kalan Bakiye
                        </div>
                        <div
                          className={`text-xl sm:text-2xl font-bold ${
                            coins >= cartTotal
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {(coins - cartTotal).toLocaleString('tr-TR')} 🪙
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        className="w-full sm:flex-1"
                      >
                        Sepeti Temizle
                      </Button>
                      <Button
                        onClick={purchaseCart}
                        disabled={
                          coins < cartTotal || purchasing === 'cart'
                        }
                        className="w-full sm:flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        size="lg"
                      >
                        {purchasing === 'cart' ? (
                          <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                            <span className="text-sm sm:text-base">İşleniyor...</span>
                          </>
                        ) : coins < cartTotal ? (
                          <span className="text-sm sm:text-base">Yetersiz Coin</span>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            <span className="text-sm sm:text-base">
                              Tümünü Satın Al ({cartTotal.toLocaleString('tr-TR')} 🪙)
                            </span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

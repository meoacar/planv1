'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Coins, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { prisma } from '@/lib/db';

interface ShopItem {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  price: number;
  stock: number | null;
  metadata: any;
}

interface UserData {
  coins: number;
}

const categoryNames: Record<string, string> = {
  cosmetic: 'Kozmetik',
  boost: 'Güçlendirme',
  recovery: 'Kurtarma',
  special: 'Özel',
};

export default function ShopPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callbackUrl=/magaza');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const [itemsRes, userRes] = await Promise.all([
        fetch('/api/v1/shop'),
        fetch('/api/v1/user/me'),
      ]);

      if (!itemsRes.ok || !userRes.ok) throw new Error('Failed to fetch data');

      const itemsData = await itemsRes.json();
      const userData = await userRes.json();

      setItems(itemsData.data);
      setUserData({ coins: userData.data.coins });
    } catch (error) {
      toast.error('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const purchaseItem = async (itemKey: string, price: number) => {
    if (!userData || userData.coins < price) {
      toast.error('Yetersiz coin!');
      return;
    }

    setPurchasing(itemKey);
    try {
      const res = await fetch('/api/v1/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemKey, quantity: 1 }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Failed to purchase');
      }

      toast.success('Satın alma başarılı! 🎉');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Satın alma başarısız');
    } finally {
      setPurchasing(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </>
    );
  }

  const categories = ['all', ...new Set(items.map((item) => item.category))];
  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🛒 Mağaza</h1>
        <p className="text-muted-foreground">
          Coinlerini harca, özel ödüller kazan!
        </p>
      </div>

      {/* Coin Balance */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8 text-yellow-500" />
              <div>
                <div className="text-sm text-muted-foreground">Mevcut Bakiye</div>
                <div className="text-2xl font-bold">{userData?.coins || 0} 🪙</div>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/gorevler')}>
              Coin Kazan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">Tümü</TabsTrigger>
          {categories
            .filter((c) => c !== 'all')
            .map((category) => (
              <TabsTrigger key={category} value={category}>
                {categoryNames[category] || category}
              </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const canAfford = userData && userData.coins >= item.price;
          const outOfStock = item.stock !== null && item.stock <= 0;

          return (
            <Card key={item.id} className={outOfStock ? 'opacity-50' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <Badge variant={canAfford ? 'default' : 'secondary'}>
                    {item.price} 🪙
                  </Badge>
                </div>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {item.stock !== null && (
                  <div className="text-sm text-muted-foreground mb-4">
                    Stok: {item.stock}
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={() => purchaseItem(item.key, item.price)}
                  disabled={!canAfford || outOfStock || purchasing === item.key}
                >
                  {purchasing === item.key ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : outOfStock ? (
                    'Stokta Yok'
                  ) : !canAfford ? (
                    'Yetersiz Coin'
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Satın Al
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Bu kategoride ürün yok</p>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
}

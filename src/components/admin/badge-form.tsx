'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface BadgeFormProps {
  badge?: {
    id: string;
    key: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    rarity: string;
    xpReward: number;
    coinReward: number;
    sortOrder: number;
    isActive: boolean;
  };
}

export function BadgeForm({ badge }: BadgeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    key: badge?.key || '',
    name: badge?.name || '',
    description: badge?.description || '',
    icon: badge?.icon || '',
    category: badge?.category || 'achievement',
    rarity: badge?.rarity || 'common',
    xpReward: badge?.xpReward || 50,
    coinReward: badge?.coinReward || 10,
    sortOrder: badge?.sortOrder || 0,
    isActive: badge?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = badge
        ? `/api/v1/admin/badges/${badge.id}`
        : '/api/v1/admin/badges';
      
      const method = badge ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'İşlem başarısız');
      }

      toast.success(badge ? 'Rozet güncellendi!' : 'Rozet oluşturuldu!');
      router.push('/admin/gamification/badges');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key */}
        <div className="space-y-2">
          <Label htmlFor="key">
            Key <span className="text-destructive">*</span>
          </Label>
          <Input
            id="key"
            value={formData.key}
            onChange={(e) => {
              // Auto-convert to lowercase and replace spaces with underscores
              const value = e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
              setFormData({ ...formData, key: value });
            }}
            placeholder="first_plan"
            required
            pattern="[a-z0-9_]+"
            disabled={!!badge}
          />
          <p className="text-xs text-muted-foreground">
            {badge ? (
              'Key değiştirilemez'
            ) : (
              <>
                Benzersiz anahtar (otomatik: küçük harf, alt çizgi)
                <br />
                <span className="text-primary">Örnek: "İlk Plan" → "ilk_plan"</span>
              </>
            )}
          </p>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            İsim <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              const name = e.target.value;
              setFormData({ ...formData, name });
              
              // Auto-generate key from name if creating new badge and key is empty
              if (!badge && !formData.key) {
                const suggestedKey = name
                  .toLowerCase()
                  .replace(/ş/g, 's')
                  .replace(/ğ/g, 'g')
                  .replace(/ü/g, 'u')
                  .replace(/ö/g, 'o')
                  .replace(/ç/g, 'c')
                  .replace(/ı/g, 'i')
                  .replace(/[^a-z0-9\s]/g, '')
                  .trim()
                  .replace(/\s+/g, '_');
                setFormData(prev => ({ ...prev, key: suggestedKey }));
              }
            }}
            placeholder="İlk Plan"
            required
          />
          <p className="text-xs text-muted-foreground">
            Rozet adı (Türkçe karakterler kullanılabilir)
          </p>
        </div>

        {/* Icon */}
        <div className="space-y-2">
          <Label htmlFor="icon">
            İkon <span className="text-destructive">*</span>
          </Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="🏆"
            required
            maxLength={10}
          />
          <p className="text-xs text-muted-foreground">
            Emoji veya ikon
          </p>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">
            Kategori <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="achievement">Başarı</SelectItem>
              <SelectItem value="milestone">Kilometre Taşı</SelectItem>
              <SelectItem value="social">Sosyal</SelectItem>
              <SelectItem value="special">Özel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rarity */}
        <div className="space-y-2">
          <Label htmlFor="rarity">
            Nadirlik <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.rarity}
            onValueChange={(value) => setFormData({ ...formData, rarity: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nadirlik seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="common">Yaygın</SelectItem>
              <SelectItem value="rare">Nadir</SelectItem>
              <SelectItem value="epic">Epik</SelectItem>
              <SelectItem value="legendary">Efsanevi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* XP Reward */}
        <div className="space-y-2">
          <Label htmlFor="xpReward">XP Ödülü</Label>
          <Input
            id="xpReward"
            type="number"
            min="0"
            value={formData.xpReward}
            onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
          />
        </div>

        {/* Coin Reward */}
        <div className="space-y-2">
          <Label htmlFor="coinReward">Coin Ödülü</Label>
          <Input
            id="coinReward"
            type="number"
            min="0"
            value={formData.coinReward}
            onChange={(e) => setFormData({ ...formData, coinReward: parseInt(e.target.value) })}
          />
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sıralama</Label>
          <Input
            id="sortOrder"
            type="number"
            min="0"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Açıklama <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Bu rozeti nasıl kazanılır?"
          required
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {badge ? 'Güncelle' : 'Oluştur'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/gamification/badges')}
          disabled={loading}
        >
          İptal
        </Button>
      </div>
    </form>
  );
}

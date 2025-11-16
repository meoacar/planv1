'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Loader2, 
  ArrowLeft, 
  Save,
  Users,
  Crown,
  Shield,
  UserMinus,
  Settings,
  Palette,
  Target,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const GUILD_ICONS = ['🏰', '⚔️', '🛡️', '👑', '🔥', '⚡', '🌟', '💎', '🦁', '🐉', '🦅', '🐺', '🎯', '💪', '🏆', '⭐'];
const GUILD_COLORS = [
  { name: 'Kırmızı', value: '#ef4444' },
  { name: 'Turuncu', value: '#f97316' },
  { name: 'Sarı', value: '#eab308' },
  { name: 'Yeşil', value: '#22c55e' },
  { name: 'Mavi', value: '#3b82f6' },
  { name: 'Mor', value: '#a855f7' },
  { name: 'Pembe', value: '#ec4899' },
  { name: 'Gri', value: '#6b7280' },
];

interface Guild {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isPublic: boolean;
  maxMembers: number;
  rules: string | null;
  monthlyGoal: string | null;
  leaderId: string;
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      username: string | null;
      name: string | null;
      image: string | null;
    };
  }>;
}

export default function GuildSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🏰');
  const [selectedColor, setSelectedColor] = useState(GUILD_COLORS[4]);
  const [isPublic, setIsPublic] = useState(true);
  const [maxMembers, setMaxMembers] = useState(50);
  const [rules, setRules] = useState('');
  const [monthlyGoal, setMonthlyGoal] = useState('');

  useEffect(() => {
    fetchGuild();
  }, [params.id]);

  const fetchGuild = async () => {
    try {
      const res = await fetch(`/api/v1/guilds/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch guild');
      const data = await res.json();
      const guildData = data.data;
      
      // Check if user is leader
      if (guildData.leaderId !== session?.user?.id) {
        toast.error('Bu sayfaya erişim yetkiniz yok');
        router.push(`/lonca/${params.id}`);
        return;
      }

      setGuild(guildData);
      setDescription(guildData.description || '');
      setSelectedIcon(guildData.icon || '🏰');
      setSelectedColor(GUILD_COLORS.find(c => c.value === guildData.color) || GUILD_COLORS[4]);
      setIsPublic(guildData.isPublic);
      setMaxMembers(guildData.maxMembers);
      setRules(guildData.rules || '');
      setMonthlyGoal(guildData.monthlyGoal || '');
    } catch (error) {
      toast.error('Lonca yüklenemedi');
      router.push('/lonca');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/guilds/${guild?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          icon: selectedIcon,
          color: selectedColor.value,
          isPublic,
          maxMembers,
          rules,
          monthlyGoal,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Kaydetme başarısız');
      }

      toast.success('Ayarlar kaydedildi! ✅');
      router.push(`/lonca/${params.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleKickMember = async (memberId: string) => {
    if (!confirm('Bu üyeyi loncadan çıkarmak istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/v1/guilds/${guild?.id}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Üye çıkarılamadı');

      toast.success('Üye loncadan çıkarıldı');
      fetchGuild();
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handlePromoteToOfficer = async (memberId: string) => {
    try {
      const res = await fetch(`/api/v1/guilds/${guild?.id}/members/${memberId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'officer' }),
      });

      if (!res.ok) throw new Error('Yetki verilemedi');

      toast.success('Üye officer yapıldı! 🎖️');
      fetchGuild();
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </>
    );
  }

  if (!guild) return null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/lonca/${params.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Loncaya Dön
          </Link>
          <h1 className="text-3xl font-bold mb-2">⚙️ Lonca Ayarları</h1>
          <p className="text-muted-foreground">
            {guild.name} loncasını yönetin
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Temel Ayarlar</CardTitle>
              <CardDescription>Loncanın genel bilgileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Loncanızın amacını ve hedeflerini açıklayın..."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {description.length}/500
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyGoal">Aylık Hedef</Label>
                <Input
                  id="monthlyGoal"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(e.target.value)}
                  placeholder="Örn: Toplam 100 kg vermek"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Lonca Kuralları</Label>
                <Textarea
                  id="rules"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="Üyelerin uyması gereken kuralları belirtin..."
                  rows={4}
                  maxLength={1000}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Görünüm
              </CardTitle>
              <CardDescription>İkon ve renk ayarları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Lonca İkonu</Label>
                <div className="grid grid-cols-8 gap-3">
                  {GUILD_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`text-4xl p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                        selectedIcon === icon
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Renk Teması</Label>
                <div className="grid grid-cols-8 gap-3">
                  {GUILD_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`relative h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                        selectedColor.value === color.value
                          ? 'border-foreground scale-110'
                          : 'border-border'
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      {selectedColor.value === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guild Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Lonca Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxMembers">Maksimum Üye Sayısı</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value) || 50)}
                  min="5"
                  max="100"
                />
                <p className="text-xs text-muted-foreground">
                  Şu an {guild.members.length} üye var
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic" className="text-base">
                    Herkese Açık
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Herkes loncanızı görebilir ve katılabilir
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPublic}
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isPublic ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Member Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Üye Yönetimi
              </CardTitle>
              <CardDescription>
                Üyeleri yönetin ve roller atayın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {guild.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.user.image || undefined} />
                      <AvatarFallback>
                        {(member.user.name || member.user.username || 'A')[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {member.user.name || member.user.username || 'Anonim'}
                      </p>
                      <div className="flex items-center gap-2">
                        {member.role === 'leader' && (
                          <Badge className="bg-yellow-500 text-white">
                            <Crown className="w-3 h-3 mr-1" />
                            Lider
                          </Badge>
                        )}
                        {member.role === 'officer' && (
                          <Badge className="bg-blue-500 text-white">
                            <Shield className="w-3 h-3 mr-1" />
                            Officer
                          </Badge>
                        )}
                        {member.role === 'member' && (
                          <Badge variant="secondary">Üye</Badge>
                        )}
                      </div>
                    </div>
                    {member.role !== 'leader' && (
                      <div className="flex gap-2">
                        {member.role === 'member' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePromoteToOfficer(member.user.id)}
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            Officer Yap
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleKickMember(member.user.id)}
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                Tehlikeli Bölge
              </CardTitle>
              <CardDescription>
                Bu işlemler geri alınamaz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Liderliği Devret</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Loncadan ayrılmak için önce liderliği başka bir üyeye devretmelisiniz.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.info('Bu özellik yakında eklenecek')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Liderliği Devret
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2 text-red-500">Loncayı Sil</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Lonca kalıcı olarak silinecek ve tüm üyeler çıkarılacak.
                </p>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    if (confirm('Loncayı silmek istediğinize EMİN MİSİNİZ? Bu işlem geri alınamaz!')) {
                      toast.info('Bu özellik yakında eklenecek');
                    }
                  }}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Loncayı Sil
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push(`/lonca/${params.id}`)}
            >
              İptal
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

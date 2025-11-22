"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, MessageSquare, Calendar, Lock, ArrowLeft, Plus, Heart, Pin, Loader2,
  TrendingUp, Award, Sparkles, Share2, Bell, BellOff, Settings, Crown,
  Activity, Target, Flame, Star, MessageCircle, ThumbsUp, Eye, BarChart3
} from "lucide-react";

interface GroupDetailClientProps {
  group: any;
  posts: any[];
}

export function GroupDetailClient({ group: initialGroup, posts: initialPosts }: GroupDetailClientProps) {
  const router = useRouter();
  const [group, setGroup] = useState(initialGroup);
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Animasyon için
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleJoinGroup = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/v1/groups/${group.slug}/join`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Gruba katılınamadı");
      }

      // Update local state
      setGroup({
        ...group,
        isMember: true,
        memberRole: "member",
        _count: {
          ...group._count,
          members: group._count.members + 1,
        },
      });

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm("Gruptan ayrılmak istediğinize emin misiniz?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/v1/groups/${group.slug}/join`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Gruptan ayrılınamadı");
      }

      // Update local state
      setGroup({
        ...group,
        isMember: false,
        memberRole: null,
        _count: {
          ...group._count,
          members: group._count.members - 1,
        },
      });

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/gruplar/${group.slug}`;
    const text = `${group.name} grubuna katıl! ${group.description || ''}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: group.name, text, url });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link kopyalandı!');
    }
  };

  const toggleNotifications = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
    // TODO: API call to update notification settings
  };

  // Grup aktivite skoru hesaplama
  const activityScore = Math.min(100, (group._count.posts * 5 + group._count.members * 2));
  
  // Trend hesaplama (son 7 gün)
  const trendPercentage = 15; // TODO: Gerçek veri ile değiştir

  return (
    <div className={`container mx-auto px-4 py-8 max-w-7xl transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Back Button */}
      <Link
        href="/gruplar"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-all hover:gap-3"
      >
        <ArrowLeft className="h-4 w-4" />
        Gruplara Dön
      </Link>

      {/* Hero Header with Cover */}
      <div className="relative mb-8 rounded-3xl overflow-hidden">
        {/* Cover Image / Gradient */}
        <div className="h-48 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Group Info Overlay */}
        <div className="relative -mt-20 px-8 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Group Avatar */}
            <div className="relative group">
              {group.image ? (
                <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-background ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-purple-600 shadow-2xl border-4 border-background flex items-center justify-center text-5xl">
                  👥
                </div>
              )}
              {group.memberRole === "creator" && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2 shadow-lg animate-pulse">
                  <Crown className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            {/* Group Details */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {group.name}
                </h1>
                {!group.isPublic && (
                  <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                    <Lock className="h-3.5 w-3.5" />
                    Özel Grup
                  </Badge>
                )}
                {group.isMember && (
                  <Badge variant="default" className="gap-1.5 px-3 py-1 bg-green-500">
                    <Sparkles className="h-3.5 w-3.5" />
                    Üyesin
                  </Badge>
                )}
              </div>

              {group.description && (
                <p className="text-muted-foreground text-lg max-w-3xl">
                  {group.description}
                </p>
              )}

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{group._count.members}</span>
                  <span className="text-muted-foreground">üye</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold">{group._count.posts}</span>
                  <span className="text-muted-foreground">gönderi</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-semibold">+{trendPercentage}%</span>
                  <span className="text-muted-foreground">bu hafta</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span className="text-muted-foreground">
                    {new Date(group.createdAt).toLocaleDateString("tr-TR", { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg text-sm mb-2">
                  {error}
                </div>
              )}
              
              {group.isMember ? (
                <>
                  <Button size="lg" className="w-full md:w-auto shadow-lg" asChild>
                    <Link href={`/gruplar/${group.slug}/yeni-gonderi`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Gönderi Paylaş
                    </Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleNotifications}
                      className="shadow-sm"
                    >
                      {isNotificationEnabled ? (
                        <Bell className="h-4 w-4" />
                      ) : (
                        <BellOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                      className="shadow-sm"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {group.memberRole === "creator" && (
                      <Button variant="outline" size="icon" className="shadow-sm" asChild>
                        <Link href={`/gruplar/${group.slug}/ayarlar`}>
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {group.memberRole !== "creator" && (
                      <Button
                        variant="outline"
                        onClick={handleLeaveGroup}
                        disabled={loading}
                        className="shadow-sm"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Ayrıl"
                        )}
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    onClick={handleJoinGroup} 
                    disabled={loading}
                    className="w-full md:w-auto shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Katılınıyor...
                      </>
                    ) : (
                      <>
                        <Users className="h-5 w-5 mr-2" />
                        Gruba Katıl
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="w-full md:w-auto shadow-sm"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Paylaş
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Score Card */}
      <Card className="mb-6 border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-semibold">Grup Aktivite Skoru</span>
            </div>
            <Badge variant="outline" className="gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              {activityScore}/100
            </Badge>
          </div>
          <Progress value={activityScore} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {activityScore >= 80 ? "🔥 Çok aktif bir grup!" : 
             activityScore >= 50 ? "💪 İyi gidiyor!" : 
             "📈 Daha fazla etkileşim için gönderi paylaş!"}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content with Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="posts" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Gönderiler</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Hakkında</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">İstatistikler</span>
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="mt-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Gönderiler
                      </CardTitle>
                      <CardDescription>
                        Grup üyelerinin paylaşımları
                      </CardDescription>
                    </div>
                    {group.isMember && (
                      <Button size="sm" asChild>
                        <Link href={`/gruplar/${group.slug}/yeni-gonderi`}>
                          <Plus className="h-4 w-4 mr-2" />
                          Yeni
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {posts.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Henüz gönderi yok</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        İlk gönderiyi sen paylaş ve konuşmayı başlat!
                      </p>
                      {group.isMember && (
                        <Button size="lg" asChild>
                          <Link href={`/gruplar/${group.slug}/yeni-gonderi`}>
                            <Plus className="h-5 w-5 mr-2" />
                            İlk Gönderiyi Paylaş
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {posts.map((post: any, index: number) => (
                        <div 
                          key={post.id} 
                          className={`group border-b pb-6 last:border-b-0 hover:bg-muted/30 -mx-6 px-6 py-4 rounded-lg transition-all ${
                            mounted ? 'animate-in fade-in slide-in-from-bottom-4' : ''
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {post.isPinned && (
                            <Badge variant="secondary" className="mb-3 gap-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                              <Pin className="h-3 w-3" />
                              Sabitlenmiş
                            </Badge>
                          )}
                          
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10 ring-2 ring-background">
                              <AvatarImage src={post.author.image} alt={`${post.author.name || 'Kullanıcı'} profil fotoğrafı`} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                                {post.author.name?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Link 
                                  href={`/profil/${post.author.username || post.author.id}`}
                                  className="font-semibold hover:underline"
                                >
                                  {post.author.name}
                                </Link>
                                <span className="text-muted-foreground text-sm">•</span>
                                <span className="text-muted-foreground text-sm">
                                  {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>

                              {post.title && (
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                  {post.title}
                                </h3>
                              )}
                              
                              <p className="text-muted-foreground mb-4 whitespace-pre-wrap line-clamp-4">
                                {post.body}
                              </p>

                              {/* Post Actions */}
                              <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="gap-2 hover:text-red-500">
                                  <Heart className="h-4 w-4" />
                                  <span>{post.likesCount || 0}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2 hover:text-blue-500">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.commentsCount || 0}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2 hover:text-green-500">
                                  <Eye className="h-4 w-4" />
                                  <span>{post.viewsCount || 0}</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Grup Hakkında
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {group.description && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        📝 Açıklama
                      </h3>
                      <p className="text-muted-foreground">{group.description}</p>
                    </div>
                  )}

                  {group.rules && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-900 rounded-xl">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                        📋 Grup Kuralları
                      </h3>
                      <p className="text-sm whitespace-pre-wrap text-blue-900 dark:text-blue-300">
                        {group.rules}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="text-2xl font-bold text-primary">{group._count.members}</div>
                      <div className="text-sm text-muted-foreground">Toplam Üye</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-500">{group._count.posts}</div>
                      <div className="text-sm text-muted-foreground">Toplam Gönderi</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">Gizlilik</span>
                      <Badge variant={group.isPublic ? "default" : "secondary"}>
                        {group.isPublic ? "Açık Grup" : "Özel Grup"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">Kategori</span>
                      <Badge variant="outline">{group.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">Oluşturulma</span>
                      <span className="text-sm font-medium">
                        {new Date(group.createdAt).toLocaleDateString("tr-TR", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="mt-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Grup İstatistikleri
                  </CardTitle>
                  <CardDescription>
                    Grup performansı ve aktivite metrikleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Activity Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Aktivite Skoru</span>
                      <span className="text-sm text-muted-foreground">{activityScore}/100</span>
                    </div>
                    <Progress value={activityScore} className="h-2" />
                  </div>

                  {/* Growth Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Büyüme</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">+{trendPercentage}%</div>
                      <div className="text-xs text-muted-foreground">Son 7 gün</div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Etkileşim</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round((group._count.posts / Math.max(group._count.members, 1)) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Üye başına</div>
                    </div>
                  </div>

                  {/* Top Contributors */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      En Aktif Üyeler
                    </h3>
                    <div className="space-y-2">
                      {group.members.slice(0, 5).map((member: any, index: number) => (
                        <div key={member.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-bold">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.user.image} />
                            <AvatarFallback>{member.user.name?.[0] || "U"}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium flex-1">{member.user.name}</span>
                          {member.role === "creator" && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Hızlı Bakış
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm">Üyeler</span>
                </div>
                <span className="font-bold text-primary">{group._count.members}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Gönderiler</span>
                </div>
                <span className="font-bold text-blue-500">{group._count.posts}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Aktivite</span>
                </div>
                <span className="font-bold text-orange-500">{activityScore}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Üyeler
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {group._count.members} aktif üye
                  </CardDescription>
                </div>
                {group.memberRole === "creator" && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {group.members.slice(0, 8).map((member: any, index: number) => (
                  <Link
                    key={member.id}
                    href={`/profil/${member.user.username || member.user.id}`}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-all hover:scale-[1.02] ${
                      mounted ? 'animate-in fade-in slide-in-from-left-2' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-background">
                        <AvatarImage src={member.user.image} alt={`${member.user.name || 'Kullanıcı'} profil fotoğrafı`} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-xs">
                          {member.user.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {member.role === "creator" && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                          <Crown className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {member.user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.role === "creator" ? "Kurucu" : 
                         member.role === "moderator" ? "Moderatör" : 
                         "Üye"}
                      </div>
                    </div>
                    {member.role !== "member" && (
                      <Badge variant="outline" className="text-xs">
                        {member.role === "creator" ? (
                          <Crown className="h-3 w-3 text-yellow-500" />
                        ) : (
                          <Star className="h-3 w-3 text-blue-500" />
                        )}
                      </Badge>
                    )}
                  </Link>
                ))}
                {group._count.members > 8 && (
                  <Button variant="outline" className="w-full mt-2" size="sm">
                    Tüm Üyeleri Gör ({group._count.members})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Suggested Groups */}
          <Card className="border-2 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Benzer Gruplar
              </CardTitle>
              <CardDescription className="text-xs">
                İlgini çekebilecek diğer gruplar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-sm text-muted-foreground">
                Yakında...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

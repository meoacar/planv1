'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Users, 
  Crown, 
  TrendingUp, 
  ArrowLeft,
  UserPlus,
  UserMinus,
  Settings,
  Target,
  Calendar,
  Trophy,
  Flame,
  Zap,
  Star,
  Award,
  MessageSquare,
  Share2,
  BarChart3,
  Activity,
  Shield,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Guild {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  category: string | null;
  memberCount: number;
  totalXP: number;
  level: number;
  isPublic: boolean;
  maxMembers: number;
  rules: string | null;
  monthlyGoal: string | null;
  status: string;
  createdAt: string;
  leader: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
  members: Array<{
    id: string;
    role: string;
    xpEarned: number;
    joinedAt: string;
    user: {
      id: string;
      username: string | null;
      name: string | null;
      image: string | null;
      level: number;
    };
  }>;
}

export default function GuildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params.id) {
      fetchGuild();
    }
  }, [params.id]);

  const fetchGuild = async () => {
    try {
      const res = await fetch(`/api/v1/guilds/${params.id}`);
      if (!res.ok) {
        if (res.status === 404) {
          toast.error('Lonca bulunamadı');
          router.push('/lonca');
          return;
        }
        throw new Error('Failed to fetch guild');
      }
      const data = await res.json();
      setGuild(data.data);
    } catch (error) {
      toast.error('Lonca yüklenemedi');
      router.push('/lonca');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!session) {
      router.push('/giris?callbackUrl=/lonca/' + params.id);
      return;
    }

    // If private guild, ask for message
    let message = null;
    if (!guild?.isPublic) {
      message = prompt('Bu özel bir lonca. Neden katılmak istediğinizi kısaca açıklayın:');
      if (message === null) return; // User cancelled
    }

    setJoining(true);
    try {
      const res = await fetch(`/api/v1/guilds/${guild?.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Katılma başarısız');
      }

      const result = await res.json();
      
      if (result.data.type === 'request_created') {
        toast.success('Başvurunuz gönderildi! Lider onayını bekleyin. ⏳');
        router.push('/lonca');
      } else {
        toast.success('Loncaya katıldın! 🎉');
        fetchGuild();
      }
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setJoining(false);
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

  if (!guild) {
    return null;
  }

  const isMember = guild.members.some(m => m.user.id === session?.user?.id);
  const isLeader = guild.leader.id === session?.user?.id;
  const isFull = guild.memberCount >= guild.maxMembers;
  const fillPercentage = (guild.memberCount / guild.maxMembers) * 100;
  const nextLevelXP = guild.level * 1000;
  const currentLevelProgress = (guild.totalXP % 1000) / 10;

  // Top contributors
  const topMembers = [...guild.members]
    .sort((a, b) => b.xpEarned - a.xpEarned)
    .slice(0, 5);

  return (
    <>
      <Navbar />
      
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: guild.color || '#3b82f6' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: guild.color || '#3b82f6' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="min-h-screen">
        {/* Hero Banner */}
        <motion.div 
          className="relative h-64 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-r"
            style={{ 
              background: guild.color 
                ? `linear-gradient(135deg, ${guild.color}dd, ${guild.color}66)` 
                : 'linear-gradient(135deg, #3b82f6dd, #3b82f666)'
            }}
          />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
          
          <div className="container mx-auto px-4 h-full flex items-end pb-8 relative">
            <Link
              href="/lonca"
              className="absolute top-6 left-6 inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Loncalara Dön
            </Link>

            <div className="flex items-end gap-6 w-full">
              <motion.div
                className="relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
              >
                <div className="w-32 h-32 rounded-2xl bg-background border-4 border-background shadow-2xl flex items-center justify-center text-6xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  <span className="relative z-10">{guild.icon || '🏰'}</span>
                </div>
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Lv. {guild.level}
                </motion.div>
              </motion.div>

              <div className="flex-1 pb-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                      {guild.name}
                    </h1>
                    {!guild.isPublic && (
                      <Badge className="bg-purple-500/90 text-white backdrop-blur-sm">
                        🔒 Özel
                      </Badge>
                    )}
                  </div>
                  {guild.category && (
                    <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm border-white/30">
                      {guild.category}
                    </Badge>
                  )}
                </motion.div>
              </div>

              {!isMember && !isFull && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pb-2"
                >
                  <Button 
                    size="lg"
                    onClick={handleJoin}
                    disabled={joining}
                    className="shadow-xl"
                  >
                    {joining ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <UserPlus className="w-5 h-5 mr-2" />
                    )}
                    Katıl
                  </Button>
                </motion.div>
              )}
              {isMember && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pb-2"
                >
                  <Badge className="bg-green-500 text-white text-lg px-4 py-2 shadow-xl">
                    {isLeader ? '👑 Lider' : '✓ Üyesin'}
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 pb-12">
          {/* Spacer */}
          <div className="h-12" />
          
          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { icon: Users, label: 'Üyeler', value: `${guild.memberCount}/${guild.maxMembers}`, color: 'from-blue-500 to-cyan-500' },
              { icon: TrendingUp, label: 'Toplam XP', value: guild.totalXP.toLocaleString(), color: 'from-orange-500 to-red-500' },
              { icon: Trophy, label: 'Seviye', value: guild.level, color: 'from-yellow-500 to-amber-500' },
              { icon: Flame, label: 'Aktif', value: `${guild.members.filter(m => m.xpEarned > 0).length} kişi`, color: 'from-pink-500 to-rose-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <CardContent className="p-6 relative h-full flex items-center">
                    <div className="flex items-center gap-4 w-full">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg flex-shrink-0`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold truncate">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
                    <TabsTrigger value="overview" className="gap-2">
                      <Activity className="w-4 h-4" />
                      <span className="hidden sm:inline">Genel</span>
                    </TabsTrigger>
                    <TabsTrigger value="members" className="gap-2">
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">Üyeler</span>
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="gap-2">
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">İstatistikler</span>
                    </TabsTrigger>
                    <TabsTrigger value="about" className="gap-2 hidden lg:flex">
                      <Shield className="w-4 h-4" />
                      Hakkında
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Description */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-yellow-500" />
                          Lonca Hakkında
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {guild.description || 'Henüz açıklama eklenmemiş'}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Monthly Goal */}
                    {guild.monthlyGoal && (
                      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            Aylık Hedef
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-medium mb-4">{guild.monthlyGoal}</p>
                          
                          {/* Progress based on XP */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">İlerleme</span>
                              <span className="font-medium">
                                {guild.totalXP.toLocaleString()} XP kazanıldı
                              </span>
                            </div>
                            <Progress 
                              value={Math.min((guild.totalXP / (guild.level * 1000)) * 100, 100)} 
                              className="h-3" 
                            />
                            <p className="text-xs text-muted-foreground">
                              Hedef: {(guild.level * 1000).toLocaleString()} XP
                            </p>
                          </div>

                          {/* Member contribution */}
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Aktif Katılım</span>
                              <span className="font-medium">
                                {guild.members.filter(m => m.xpEarned > 0).length} / {guild.memberCount} üye
                              </span>
                            </div>
                            <Progress 
                              value={(guild.members.filter(m => m.xpEarned > 0).length / guild.memberCount) * 100} 
                              className="h-2 mt-2" 
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Top Contributors */}
                    <Card className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border-b">
                        <CardTitle className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                            <Award className="w-5 h-5" />
                          </div>
                          En Aktif Üyeler
                        </CardTitle>
                        <CardDescription>Bu ayki en çok XP kazananlar</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {topMembers.map((member, index) => (
                            <motion.div
                              key={member.id}
                              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors relative"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {/* Rank Badge */}
                              <div className="flex-shrink-0 w-12 text-center">
                                {index < 3 ? (
                                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg' :
                                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md' :
                                    'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md'
                                  }`}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground font-semibold">
                                    #{index + 1}
                                  </div>
                                )}
                              </div>

                              {/* Avatar */}
                              <Avatar className={`w-14 h-14 border-2 ${
                                index === 0 ? 'border-yellow-500 shadow-lg shadow-yellow-500/50' :
                                index === 1 ? 'border-gray-400 shadow-md' :
                                index === 2 ? 'border-amber-600 shadow-md' :
                                'border-border'
                              }`}>
                                <AvatarImage src={member.user.image || undefined} />
                                <AvatarFallback className={index < 3 ? 'bg-gradient-to-br from-primary/20 to-primary/10' : ''}>
                                  {(member.user.name || member.user.username || 'A')[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              {/* User Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold truncate text-base">
                                    {member.user.name || member.user.username || 'Anonim'}
                                  </p>
                                  {member.role === 'leader' && (
                                    <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                  )}
                                  {member.role === 'officer' && (
                                    <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    Lv. {member.user.level}
                                  </Badge>
                                  {index === 0 && (
                                    <Badge className="bg-yellow-500 text-white text-xs">
                                      👑 En İyi
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* XP Display */}
                              <div className="text-right flex-shrink-0">
                                <div className={`font-bold text-xl ${
                                  index === 0 ? 'text-yellow-600 dark:text-yellow-500' :
                                  index === 1 ? 'text-gray-600 dark:text-gray-400' :
                                  index === 2 ? 'text-amber-600 dark:text-amber-500' :
                                  'text-primary'
                                }`}>
                                  {member.xpEarned.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">XP Kazandı</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* View All Button */}
                        {guild.members.length > 5 && (
                          <div className="p-4 border-t bg-muted/20">
                            <Button 
                              variant="ghost" 
                              className="w-full"
                              onClick={() => setActiveTab('members')}
                            >
                              Tüm Üyeleri Gör ({guild.memberCount})
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Members Tab */}
                  <TabsContent value="members" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tüm Üyeler ({guild.memberCount})</CardTitle>
                        <CardDescription>Lonca üyelerinin listesi</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {guild.members.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={member.user.image || undefined} />
                                <AvatarFallback>
                                  {(member.user.name || member.user.username || 'A')[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium truncate">
                                    {member.user.name || member.user.username || 'Anonim'}
                                  </p>
                                  {member.role === 'leader' && (
                                    <Crown className="w-4 h-4 text-yellow-500" />
                                  )}
                                  {member.role === 'officer' && (
                                    <Badge variant="secondary" className="text-xs">Officer</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>Lv. {member.user.level}</span>
                                  <span>•</span>
                                  <span>{member.xpEarned} XP</span>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(member.joinedAt).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Stats Tab */}
                  <TabsContent value="stats" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Lonca İstatistikleri</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Level Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Seviye İlerlemesi</span>
                            <span className="text-sm text-muted-foreground">
                              {guild.totalXP} / {nextLevelXP} XP
                            </span>
                          </div>
                          <Progress value={currentLevelProgress} className="h-3" />
                        </div>

                        {/* Member Growth */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Üye Doluluk</span>
                            <span className="text-sm text-muted-foreground">
                              {guild.memberCount} / {guild.maxMembers}
                            </span>
                          </div>
                          <Progress value={fillPercentage} className="h-3" />
                        </div>

                        <Separator />

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Ortalama Seviye</p>
                            <p className="text-2xl font-bold">
                              {(guild.members.reduce((sum, m) => sum + m.user.level, 0) / guild.members.length).toFixed(1)}
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Toplam Katkı</p>
                            <p className="text-2xl font-bold">
                              {guild.members.reduce((sum, m) => sum + m.xpEarned, 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* About Tab */}
                  <TabsContent value="about" className="space-y-6 mt-6">
                    {guild.rules && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Lonca Kuralları
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                            {guild.rules}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle>Lonca Bilgileri</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Durum</span>
                          <Badge variant={guild.isPublic ? 'default' : 'secondary'}>
                            {guild.isPublic ? '🌍 Herkese Açık' : '🔒 Özel'}
                          </Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Oluşturulma</span>
                          <span className="font-medium">
                            {new Date(guild.createdAt).toLocaleDateString('tr-TR', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Lider</span>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={guild.leader.image || undefined} />
                              <AvatarFallback className="text-xs">
                                {(guild.leader.name || guild.leader.username || 'A')[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {guild.leader.username || guild.leader.name || 'Anonim'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Actions Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isLeader && (
                      <Button 
                        className="w-full" 
                        variant="default"
                        onClick={() => router.push(`/lonca/${params.id}/ayarlar`)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Lonca Ayarları
                      </Button>
                    )}
                    <Button className="w-full" variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Paylaş
                    </Button>
                    <Button className="w-full" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Sohbet
                    </Button>
                    {isMember && !isLeader && (
                      <>
                        <Separator className="my-2" />
                        <Button 
                          className="w-full" 
                          variant="destructive"
                          onClick={async () => {
                            if (!confirm('Loncadan ayrılmak istediğinize emin misiniz? XP\'niz sıfırlanacak.')) return;
                            
                            try {
                              const res = await fetch('/api/v1/guilds/leave', {
                                method: 'POST',
                              });
                              
                              if (!res.ok) {
                                const error = await res.json();
                                throw new Error(error.error?.message || 'Ayrılma başarısız');
                              }
                              
                              toast.success('Loncadan ayrıldınız');
                              router.push('/lonca');
                            } catch (error: any) {
                              toast.error(error.message || 'Bir hata oluştu');
                            }
                          }}
                        >
                          <UserMinus className="w-4 h-4 mr-2" />
                          Loncadan Ayrıl
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Activity Feed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Son Aktiviteler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {guild.members.slice(0, 3).map((member, index) => (
                        <div key={member.id} className="flex items-start gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                          <div>
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {member.user.name || member.user.username}
                              </span>
                              {' '}loncaya katıldı
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(member.joinedAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

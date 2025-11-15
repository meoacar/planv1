import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Lock, MessageSquare, Plus, Search, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Gruplar | ZayiflamaPlan",
  description: "Motivasyon ve destek gruplarına katıl",
};

const categories = [
  { value: "general", label: "Genel", icon: "👥", color: "bg-blue-500", description: "Genel sohbet" },
  { value: "motivation", label: "Motivasyon", icon: "💪", color: "bg-orange-500", description: "İlham ve motivasyon" },
  { value: "recipes", label: "Tarifler", icon: "🍽️", color: "bg-green-500", description: "Sağlıklı tarifler" },
  { value: "exercise", label: "Egzersiz", icon: "🏃", color: "bg-red-500", description: "Spor ve hareket" },
  { value: "support", label: "Destek", icon: "🤝", color: "bg-purple-500", description: "Duygusal destek" },
  { value: "age_based", label: "Yaş Grupları", icon: "👨‍👩‍👧‍👦", color: "bg-pink-500", description: "20'ler, 30'lar..." },
  { value: "goal_based", label: "Hedef Bazlı", icon: "🎯", color: "bg-yellow-500", description: "10kg, 20kg..." },
  { value: "lifestyle", label: "Yaşam Tarzı", icon: "🌱", color: "bg-emerald-500", description: "Vegan, Keto..." },
];

async function getGroups() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/groups?limit=50`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching groups:", error);
    return [];
  }
}

import { Navbar } from "@/components/navbar";

export default async function GroupsPage() {
  const groups = await getGroups();

  // Stats
  const totalMembers = groups.reduce((sum: number, g: any) => sum + g.memberCount, 0);
  const totalPosts = groups.reduce((sum: number, g: any) => sum + g.postCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Topluluk</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Gruplar
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Motivasyon ve destek gruplarına katılarak hedeflerine daha kolay ulaş. Yalnız değilsin! 💪
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{groups.length}</div>
              <div className="text-sm text-muted-foreground">Aktif Grup</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{totalMembers}</div>
              <div className="text-sm text-muted-foreground">Toplam Üye</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{totalPosts}</div>
              <div className="text-sm text-muted-foreground">Paylaşım</div>
            </div>
          </div>

          <Button asChild size="lg" className="shadow-lg">
            <Link href="/gruplar/olustur">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Grup Oluştur
            </Link>
          </Button>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Kategoriler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/gruplar?category=${cat.value}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      {cat.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{cat.label}</h3>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Groups Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Tüm Gruplar
            </h2>
            {/* Search - placeholder for future */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Grup ara..."
                className="pl-10 w-64"
                disabled
              />
            </div>
          </div>

          {groups.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="text-center py-16">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Henüz grup yok</h3>
                <p className="text-muted-foreground mb-6">
                  İlk grubu sen oluştur ve topluluğu büyüt!
                </p>
                <Button asChild>
                  <Link href="/gruplar/olustur">
                    <Plus className="h-4 w-4 mr-2" />
                    İlk Grubu Oluştur
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group: any) => {
                const category = categories.find((c) => c.value === group.category);
                return (
                  <Link key={group.id} href={`/gruplar/${group.slug}`}>
                    <Card className="h-full hover:shadow-xl transition-all hover:scale-105 border-2 hover:border-primary group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          {group.image ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                              <img
                                src={group.image}
                                alt={group.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className={`w-12 h-12 ${category?.color || 'bg-gray-500'} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                              {category?.icon || '👥'}
                            </div>
                          )}
                          {!group.isPublic && (
                            <Badge variant="secondary" className="gap-1">
                              <Lock className="h-3 w-3" />
                              Özel
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                          {group.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 min-h-[40px]">
                          {group.description || "Açıklama yok"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {group.memberCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {group.postCount}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {category?.label}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border-primary/20">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-3">Kendi Topluluğunu Oluştur</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Benzer hedeflere sahip insanları bir araya getir, deneyimlerini paylaş ve birlikte başarıya ulaş!
            </p>
            <Button asChild size="lg" variant="default">
              <Link href="/gruplar/olustur">
                <Plus className="h-4 w-4 mr-2" />
                Hemen Grup Oluştur
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

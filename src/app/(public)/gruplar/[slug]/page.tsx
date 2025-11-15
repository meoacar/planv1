import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, Calendar, Lock, ArrowLeft, Plus, Heart, Pin } from "lucide-react";

interface Props {
  params: { slug: string };
}

async function getGroup(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/groups/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching group:", error);
    return null;
  }
}

async function getGroupPosts(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/groups/${slug}/posts`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const group = await getGroup(params.slug);
  if (!group) {
    return { title: "Grup Bulunamadı" };
  }
  return {
    title: `${group.name} | ZayiflamaPlan`,
    description: group.description || `${group.name} grubuna katıl`,
  };
}

import { Navbar } from "@/components/navbar";

export default async function GroupPage({ params }: Props) {
  const [group, posts] = await Promise.all([
    getGroup(params.slug),
    getGroupPosts(params.slug),
  ]);

  if (!group) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/gruplar"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Gruplara Dön
        </Link>

        {/* Group Header */}
        <Card className="mb-6 border-2">
          <CardHeader>
            <div className="flex items-start gap-6">
              {/* Group Image */}
              {group.image && (
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-3xl">{group.name}</CardTitle>
                  {!group.isPublic && (
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Özel
                    </Badge>
                  )}
                </div>
                {group.description && (
                  <CardDescription className="text-base mt-2">
                    {group.description}
                  </CardDescription>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {group._count.members} üye
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                {group._count.posts} gönderi
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(group.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>

            {group.rules && (
              <Card className="mt-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    📋 Grup Kuralları
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">{group.rules}</p>
                </CardContent>
              </Card>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {group.isMember ? (
                <>
                  <Badge variant="default" className="px-4 py-2 text-sm">
                    ✓ Üyesin
                  </Badge>
                  <Button asChild>
                    <Link href={`/gruplar/${params.slug}/yeni-gonderi`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Gönderi Paylaş
                    </Link>
                  </Button>
                </>
              ) : (
                <Button size="lg">
                  <Users className="h-4 w-4 mr-2" />
                  Gruba Katıl
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Gönderiler
                </CardTitle>
                <CardDescription>
                  Grup üyelerinin paylaşımları
                </CardDescription>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Henüz gönderi yok</h3>
                    <p className="text-muted-foreground mb-4">
                      İlk gönderiyi sen paylaş!
                    </p>
                    {group.isMember && (
                      <Button asChild>
                        <Link href={`/gruplar/${params.slug}/yeni-gonderi`}>
                          <Plus className="h-4 w-4 mr-2" />
                          İlk Gönderiyi Paylaş
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {posts.map((post: any) => (
                      <div key={post.id} className="border-b pb-6 last:border-b-0">
                        {post.isPinned && (
                          <Badge variant="secondary" className="mb-3 gap-1">
                            <Pin className="h-3 w-3" />
                            Sabitlenmiş
                          </Badge>
                        )}
                        
                        {post.title && (
                          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                        )}
                        
                        <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                          {post.body}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={post.author.image} />
                              <AvatarFallback>
                                {post.author.name?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <span className="font-medium">{post.author.name}</span>
                              <span className="text-muted-foreground mx-2">•</span>
                              <span className="text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Heart className="h-4 w-4" />
                            {post.likesCount}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Üyeler
                </CardTitle>
                <CardDescription>
                  {group._count.members} aktif üye
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.members.slice(0, 10).map((member: any) => (
                    <Link
                      key={member.id}
                      href={`/profil/${member.user.username || member.user.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={member.user.image} />
                        <AvatarFallback>
                          {member.user.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {member.user.name}
                        </div>
                        {member.role !== "member" && (
                          <Badge variant="outline" className="text-xs mt-0.5">
                            {member.role}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                  {group._count.members > 10 && (
                    <Button variant="outline" className="w-full" size="sm">
                      Tüm Üyeleri Gör ({group._count.members})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Group Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Grup Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Gizlilik</span>
                  <Badge variant={group.isPublic ? "default" : "secondary"}>
                    {group.isPublic ? "Açık" : "Özel"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Kategori</span>
                  <Badge variant="outline">{group.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Oluşturulma</span>
                  <span>{new Date(group.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

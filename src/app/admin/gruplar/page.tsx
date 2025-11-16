import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Gruplar | Admin Panel",
  description: "Grup yönetimi",
};

async function getGroups() {
  const groups = await db.group.findMany({
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      },
      _count: {
        select: {
          members: true,
          posts: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return groups;
}

async function getStats() {
  const [totalGroups, pendingGroups, publishedGroups, rejectedGroups, totalMembers, totalPosts] = await Promise.all([
    db.group.count(),
    db.group.count({ where: { status: "pending" } }),
    db.group.count({ where: { status: "published" } }),
    db.group.count({ where: { status: "rejected" } }),
    db.groupMember.count(),
    db.groupPost.count(),
  ]);

  return {
    totalGroups,
    pendingGroups,
    publishedGroups,
    rejectedGroups,
    totalMembers,
    totalPosts,
  };
}

const categoryLabels: Record<string, string> = {
  general: "Genel",
  motivation: "Motivasyon",
  recipes: "Tarifler",
  exercise: "Egzersiz",
  support: "Destek",
  age_based: "Yaş Grupları",
  goal_based: "Hedef Bazlı",
  lifestyle: "Yaşam Tarzı",
};

export default async function AdminGroupsPage() {
  const [groups, stats] = await Promise.all([getGroups(), getStats()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gruplar</h1>
          <p className="text-muted-foreground">Sosyal grup yönetimi</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Grup</CardDescription>
            <CardTitle className="text-3xl">{stats.totalGroups}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader className="pb-2">
            <CardDescription>⏳ Bekleyen</CardDescription>
            <CardTitle className="text-3xl">{stats.pendingGroups}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="pb-2">
            <CardDescription>✅ Yayında</CardDescription>
            <CardTitle className="text-3xl">{stats.publishedGroups}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="pb-2">
            <CardDescription>❌ Reddedilen</CardDescription>
            <CardTitle className="text-3xl">{stats.rejectedGroups}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Üye</CardDescription>
            <CardTitle className="text-3xl">{stats.totalMembers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Gönderi</CardDescription>
            <CardTitle className="text-3xl">{stats.totalPosts}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Gruplar</CardTitle>
          <CardDescription>
            Sistemdeki tüm grupları görüntüleyin ve yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groups.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Henüz grup yok
              </div>
            ) : (
              <div className="space-y-3">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          href={`/gruplar/${group.slug}`}
                          className="font-semibold hover:underline"
                          target="_blank"
                        >
                          {group.name}
                        </Link>
                        {group.status === "pending" && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            ⏳ Bekliyor
                          </Badge>
                        )}
                        {group.status === "published" && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            ✅ Yayında
                          </Badge>
                        )}
                        {group.status === "rejected" && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            ❌ Reddedildi
                          </Badge>
                        )}
                        {!group.isPublic && (
                          <Badge variant="secondary">🔒 Özel</Badge>
                        )}
                        <Badge variant="outline">
                          {categoryLabels[group.category]}
                        </Badge>
                      </div>
                      {group.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                          {group.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>👤 {group.creator.name || group.creator.email}</span>
                        <span>•</span>
                        <span>👥 {group._count.members} üye</span>
                        <span>•</span>
                        <span>📝 {group._count.posts} gönderi</span>
                        <span>•</span>
                        <span>{new Date(group.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {group.status === "pending" && (
                        <>
                          <form action={`/api/admin/groups/${group.id}/approve`} method="POST">
                            <Button variant="default" size="sm" type="submit">
                              ✅ Onayla
                            </Button>
                          </form>
                          <Button variant="destructive" size="sm">
                            ❌ Reddet
                          </Button>
                        </>
                      )}
                      {group.status === "published" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/gruplar/${group.slug}`} target="_blank">
                            Görüntüle
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        🗑️
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

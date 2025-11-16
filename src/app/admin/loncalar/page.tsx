'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  leader: {
    id: string;
    name: string | null;
    username: string | null;
    email: string;
  };
  _count: {
    members: number;
  };
}

interface Stats {
  totalGuilds: number;
  pendingGuilds: number;
  publishedGuilds: number;
  rejectedGuilds: number;
  totalMembers: number;
}

export default function AdminGuildsPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Reject dialog
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; guild: Guild | null }>({
    open: false,
    guild: null,
  });
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all guilds
      const guildsRes = await fetch('/api/admin/guilds/all');
      if (!guildsRes.ok) throw new Error('Failed to fetch guilds');
      const guildsData = await guildsRes.json();
      setGuilds(guildsData.data);

      // Calculate stats
      const totalGuilds = guildsData.data.length;
      const pendingGuilds = guildsData.data.filter((g: Guild) => g.status === 'pending').length;
      const publishedGuilds = guildsData.data.filter((g: Guild) => g.status === 'published').length;
      const rejectedGuilds = guildsData.data.filter((g: Guild) => g.status === 'rejected').length;
      const totalMembers = guildsData.data.reduce((sum: number, g: Guild) => sum + g._count.members, 0);

      setStats({
        totalGuilds,
        pendingGuilds,
        publishedGuilds,
        rejectedGuilds,
        totalMembers,
      });
    } catch (error) {
      toast.error('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (guildId: string) => {
    setActionLoading(guildId);
    try {
      const res = await fetch(`/api/admin/guilds/${guildId}/approve`, {
        method: 'POST',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Onaylama başarısız');
      }

      toast.success('Lonca onaylandı! 🎉');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.guild || !rejectReason.trim()) {
      toast.error('Lütfen red nedenini yazın');
      return;
    }

    setActionLoading(rejectDialog.guild.id);
    try {
      const res = await fetch(`/api/admin/guilds/${rejectDialog.guild.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Reddetme başarısız');
      }

      toast.success('Lonca reddedildi');
      setRejectDialog({ open: false, guild: null });
      setRejectReason('');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🏰 Loncalar</h1>
          <p className="text-muted-foreground">Lonca yönetimi ve onay sistemi</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Toplam Lonca</CardDescription>
              <CardTitle className="text-3xl">{stats.totalGuilds}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader className="pb-2">
              <CardDescription>⏳ Bekleyen</CardDescription>
              <CardTitle className="text-3xl">{stats.pendingGuilds}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
            <CardHeader className="pb-2">
              <CardDescription>✅ Yayında</CardDescription>
              <CardTitle className="text-3xl">{stats.publishedGuilds}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/20">
            <CardHeader className="pb-2">
              <CardDescription>❌ Reddedilen</CardDescription>
              <CardTitle className="text-3xl">{stats.rejectedGuilds}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Toplam Üye</CardDescription>
              <CardTitle className="text-3xl">{stats.totalMembers}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Guilds Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Loncalar</CardTitle>
          <CardDescription>
            Sistemdeki tüm loncaları görüntüleyin ve yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {guilds.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Henüz lonca yok
              </div>
            ) : (
              <div className="space-y-3">
                {guilds.map((guild) => (
                  <div
                    key={guild.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{guild.icon}</span>
                        <Link
                          href={`/lonca/${guild.slug}`}
                          className="font-semibold hover:underline"
                          target="_blank"
                        >
                          {guild.name}
                        </Link>
                        {guild.status === "pending" && (
                          <Badge className="bg-yellow-500 text-white">
                            ⏳ Bekliyor
                          </Badge>
                        )}
                        {guild.status === "published" && (
                          <Badge className="bg-green-500 text-white">
                            ✅ Yayında
                          </Badge>
                        )}
                        {guild.status === "rejected" && (
                          <Badge className="bg-red-500 text-white">
                            ❌ Reddedildi
                          </Badge>
                        )}
                        {!guild.isPublic && (
                          <Badge variant="secondary">🔒 Özel</Badge>
                        )}
                        <Badge variant="outline">Level {guild.level}</Badge>
                        {guild.category && (
                          <Badge variant="outline">{guild.category}</Badge>
                        )}
                      </div>
                      {guild.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {guild.description}
                        </p>
                      )}
                      {guild.status === "pending" && (
                        <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                          {guild.color && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Renk:</span>
                              <div 
                                className="w-4 h-4 rounded border" 
                                style={{ backgroundColor: guild.color }}
                              />
                            </div>
                          )}
                          {guild.category && (
                            <div>
                              <span className="text-muted-foreground">Kategori:</span>
                              <span className="ml-1 font-medium">{guild.category}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {guild.rejectionReason && (
                        <p className="text-sm text-red-600 dark:text-red-400 mb-2 bg-red-50 dark:bg-red-950/20 p-2 rounded">
                          ❌ Red Sebebi: {guild.rejectionReason}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>👑 {guild.leader.name || guild.leader.username || guild.leader.email}</span>
                        <span>•</span>
                        <span>👥 {guild._count.members} / {guild.maxMembers}</span>
                        <span>•</span>
                        <span>⭐ {guild.totalXP} XP</span>
                        <span>•</span>
                        <span>{new Date(guild.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {guild.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(guild.id)}
                            disabled={actionLoading === guild.id}
                          >
                            {actionLoading === guild.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              '✅ Onayla'
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setRejectDialog({ open: true, guild })}
                          >
                            ❌ Reddet
                          </Button>
                        </>
                      )}
                      {guild.status === "published" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/lonca/${guild.slug}`} target="_blank">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Görüntüle
                          </Link>
                        </Button>
                      )}
                      {guild.status === "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Tekrar onaya gönder
                            handleApprove(guild.id);
                          }}
                          disabled={actionLoading === guild.id}
                        >
                          {actionLoading === guild.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            '🔄 Tekrar Onayla'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => {
        setRejectDialog({ open, guild: null });
        setRejectReason('');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loncayı Reddet</DialogTitle>
            <DialogDescription>
              "{rejectDialog.guild?.name}" loncasını reddetmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Red Nedeni *</Label>
              <Textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Loncanın neden reddedildiğini açıklayın..."
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                Bu mesaj lonca sahibine gönderilecek
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialog({ open: false, guild: null });
                setRejectReason('');
              }}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || actionLoading === rejectDialog.guild?.id}
            >
              {actionLoading === rejectDialog.guild?.id ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Reddet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

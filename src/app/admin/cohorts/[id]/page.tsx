'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface CohortUser {
  id: string;
  addedAt: string;
  user: {
    id: string;
    email: string;
    username: string | null;
    name: string | null;
    xp: number;
    level: number;
    createdAt: string;
    _count: {
      plans: number;
      recipes: number;
      followers: number;
      following: number;
    };
  };
}

interface RetentionMetric {
  id: string;
  date: string;
  dayNumber: number;
  retained: number;
  total: number;
  rate: number;
}

interface Cohort {
  id: string;
  name: string;
  description: string | null;
  filters: any;
  isActive: boolean;
  createdAt: string;
  users: CohortUser[];
  metrics: RetentionMetric[];
}

export default function CohortDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCohort();
  }, [params.id]);

  const fetchCohort = async () => {
    try {
      const res = await fetch(`/api/admin/cohorts/${params.id}`);
      const data = await res.json();
      setCohort(data.cohort);
    } catch (error) {
      console.error('Error fetching cohort:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!cohort) return;
    try {
      const res = await fetch(`/api/admin/cohorts/${params.id}/export`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cohort-${cohort.name.replace(/\s+/g, '-')}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting cohort:', error);
      alert('Export başarısız oldu');
    }
  };

  const handleRefresh = async () => {
    try {
      const res = await fetch(`/api/admin/cohorts/${params.id}/refresh`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        alert(`Cohort güncellendi: ${data.userCount} kullanıcı`);
        fetchCohort();
      }
    } catch (error) {
      console.error('Error refreshing cohort:', error);
      alert('Güncelleme başarısız oldu');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Cohort bulunamadı</h3>
            <Link href="/admin/cohorts">
              <Button variant="outline">Geri Dön</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/admin/cohorts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{cohort.name}</h1>
            <Badge variant={cohort.isActive ? 'default' : 'secondary'}>
              {cohort.isActive ? 'Aktif' : 'Pasif'}
            </Badge>
          </div>
          {cohort.description && (
            <p className="text-muted-foreground">{cohort.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cohort.users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ortalama XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {cohort.users.length > 0
                ? Math.round(
                    cohort.users.reduce((sum, u) => sum + u.user.xp, 0) / cohort.users.length
                  )
                : 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ortalama Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {cohort.users.length > 0
                ? Math.round(
                    cohort.users.reduce((sum, u) => sum + u.user.level, 0) / cohort.users.length
                  )
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            {JSON.stringify(cohort.filters, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {cohort.metrics.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Retention Metrikleri</CardTitle>
            <CardDescription>Kullanıcı tutunma oranları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cohort.metrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Gün {metric.dayNumber}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({new Date(metric.date).toLocaleDateString('tr-TR')})
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {metric.retained} / {metric.total}
                    </span>
                    <Badge variant={metric.rate >= 0.5 ? 'default' : 'secondary'}>
                      {(metric.rate * 100).toFixed(1)}%
                    </Badge>
                    {metric.rate >= 0.5 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcılar ({cohort.users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Kullanıcı</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-right py-3 px-4">XP</th>
                  <th className="text-right py-3 px-4">Level</th>
                  <th className="text-right py-3 px-4">Planlar</th>
                  <th className="text-right py-3 px-4">Tarifler</th>
                  <th className="text-right py-3 px-4">Takipçi</th>
                </tr>
              </thead>
              <tbody>
                {cohort.users.map(({ user }) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{user.name || user.username || 'İsimsiz'}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{user.email}</td>
                    <td className="py-3 px-4 text-right font-medium">{user.xp}</td>
                    <td className="py-3 px-4 text-right">{user.level}</td>
                    <td className="py-3 px-4 text-right">{user._count.plans}</td>
                    <td className="py-3 px-4 text-right">{user._count.recipes}</td>
                    <td className="py-3 px-4 text-right">{user._count.followers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

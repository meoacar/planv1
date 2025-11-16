'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Download, RefreshCw, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Cohort {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    users: number;
  };
}

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      const res = await fetch('/api/admin/cohorts');
      const data = await res.json();
      setCohorts(data.cohorts || []);
    } catch (error) {
      console.error('Error fetching cohorts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (cohortId: string, cohortName: string) => {
    try {
      const res = await fetch(`/api/admin/cohorts/${cohortId}/export`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cohort-${cohortName.replace(/\s+/g, '-')}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting cohort:', error);
      alert('Export başarısız oldu');
    }
  };

  const handleRefresh = async (cohortId: string) => {
    try {
      const res = await fetch(`/api/admin/cohorts/${cohortId}/refresh`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        alert(`Cohort güncellendi: ${data.userCount} kullanıcı`);
        fetchCohorts();
      }
    } catch (error) {
      console.error('Error refreshing cohort:', error);
      alert('Güncelleme başarısız oldu');
    }
  };

  const handleDelete = async (cohortId: string) => {
    if (!confirm('Bu cohortu silmek istediğinizden emin misiniz?')) return;

    try {
      const res = await fetch(`/api/admin/cohorts/${cohortId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchCohorts();
      }
    } catch (error) {
      console.error('Error deleting cohort:', error);
      alert('Silme başarısız oldu');
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Cohort Builder</h1>
          <p className="text-muted-foreground mt-2">
            Kullanıcı segmentasyonu ve retention analizi
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Cohort
        </Button>
      </div>

      {cohorts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz cohort yok</h3>
            <p className="text-muted-foreground mb-4">
              İlk kullanıcı segmentinizi oluşturun
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Cohort Oluştur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cohorts.map((cohort) => (
            <Card key={cohort.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{cohort.name}</CardTitle>
                    {cohort.description && (
                      <CardDescription className="mt-1">
                        {cohort.description}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant={cohort.isActive ? 'default' : 'secondary'}>
                    {cohort.isActive ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Kullanıcı Sayısı</span>
                    <span className="text-2xl font-bold">{cohort._count.users}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleExport(cohort.id, cohort.name)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRefresh(cohort.id)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(cohort.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <Link href={`/admin/cohorts/${cohort.id}`}>
                    <Button variant="secondary" className="w-full" size="sm">
                      Detayları Gör
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateCohortModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchCohorts();
          }}
        />
      )}
    </div>
  );
}

function CreateCohortModal({
  onClose,
  onSuccess
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [filters, setFilters] = useState({
    xp: { gte: undefined as number | undefined },
    level: { gte: undefined as number | undefined },
    recipesCount: { gte: undefined as number | undefined },
    lastActiveDays: undefined as number | undefined,
    hasGuild: undefined as boolean | undefined
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/cohorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: description || undefined,
          filters: {
            ...(filters.xp.gte && { xp: { gte: filters.xp.gte } }),
            ...(filters.level.gte && { level: { gte: filters.level.gte } }),
            ...(filters.recipesCount.gte && { recipesCount: { gte: filters.recipesCount.gte } }),
            ...(filters.lastActiveDays && { lastActiveDays: filters.lastActiveDays }),
            ...(filters.hasGuild !== undefined && { hasGuild: filters.hasGuild })
          }
        })
      });

      if (res.ok) {
        onSuccess();
      } else {
        alert('Cohort oluşturulamadı');
      }
    } catch (error) {
      console.error('Error creating cohort:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Yeni Cohort Oluştur</CardTitle>
          <CardDescription>
            Kullanıcı segmenti tanımlayın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cohort Adı *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Örn: Aktif Tarif Paylaşanlar"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Açıklama</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
                placeholder="Cohort hakkında kısa açıklama"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Filtreler</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum XP</label>
                  <input
                    type="number"
                    value={filters.xp.gte || ''}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        xp: { gte: e.target.value ? Number(e.target.value) : undefined }
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Örn: 500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Level</label>
                  <input
                    type="number"
                    value={filters.level.gte || ''}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        level: { gte: e.target.value ? Number(e.target.value) : undefined }
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Örn: 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Tarif Sayısı</label>
                  <input
                    type="number"
                    value={filters.recipesCount.gte || ''}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        recipesCount: { gte: e.target.value ? Number(e.target.value) : undefined }
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Örn: 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Son Aktif (Gün)</label>
                  <input
                    type="number"
                    value={filters.lastActiveDays || ''}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        lastActiveDays: e.target.value ? Number(e.target.value) : undefined
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Örn: 30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Lonca Üyeliği</label>
                  <select
                    value={filters.hasGuild === undefined ? '' : filters.hasGuild.toString()}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        hasGuild: e.target.value === '' ? undefined : e.target.value === 'true'
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Tümü</option>
                    <option value="true">Lonca Üyesi</option>
                    <option value="false">Lonca Üyesi Değil</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                İptal
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Oluşturuluyor...' : 'Oluştur'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

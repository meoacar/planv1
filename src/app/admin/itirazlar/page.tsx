"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Search,
  MessageSquare,
  TrendingUp,
  User,
} from "lucide-react";

interface Appeal {
  id: string;
  contentType: string;
  contentId: string;
  reason: string;
  status: string;
  priority: number;
  adminNote?: string;
  resolvedAt?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    image?: string;
    reputationScore: number;
  };
  resolver?: {
    id: string;
    name: string;
    username: string;
  };
  contentDetails?: {
    title?: string;
    description?: string;
    content?: string;
    slug?: string;
  };
}

export default function AppealsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [resolveNote, setResolveNote] = useState("");
  const [resolving, setResolving] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchAppeals();
    fetchStats();
  }, [statusFilter, contentTypeFilter]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/appeals");
      const data = await res.json();
      const allAppeals = data.appeals || [];
      setStats({
        pending: allAppeals.filter((a: Appeal) => a.status === "pending").length,
        underReview: allAppeals.filter((a: Appeal) => a.status === "under_review").length,
        approved: allAppeals.filter((a: Appeal) => a.status === "approved").length,
        rejected: allAppeals.filter((a: Appeal) => a.status === "rejected").length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (contentTypeFilter) params.append("contentType", contentTypeFilter);

      const res = await fetch(`/api/appeals?${params.toString()}`);
      const data = await res.json();
      setAppeals(data.appeals || []);
    } catch (error) {
      console.error("Error fetching appeals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetUnderReview = async (appealId: string) => {
    try {
      setResolving(true);
      const res = await fetch(`/api/appeals/${appealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "under_review",
        }),
      });

      if (!res.ok) throw new Error("Failed to update appeal");

      setSelectedAppeal(null);
      setStatusFilter("under_review");
      fetchAppeals();
      fetchStats();
    } catch (error) {
      console.error("Error updating appeal:", error);
      alert("İtiraz güncellenirken bir hata oluştu");
    } finally {
      setResolving(false);
    }
  };

  const handleResolve = async (appealId: string, status: "approved" | "rejected") => {
    if (!confirm(`Bu itirazı ${status === "approved" ? "onaylamak" : "reddetmek"} istediğinize emin misiniz?`)) {
      return;
    }

    try {
      setResolving(true);
      const res = await fetch(`/api/appeals/${appealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminNote: resolveNote || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to resolve appeal");

      setSelectedAppeal(null);
      setResolveNote("");
      fetchAppeals();
      fetchStats();
    } catch (error) {
      console.error("Error resolving appeal:", error);
      alert("İtiraz çözümlenirken bir hata oluştu");
    } finally {
      setResolving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      under_review: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      under_review: <Eye className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
    };
    const labels = {
      pending: "Beklemede",
      under_review: "İnceleniyor",
      approved: "Onaylandı",
      rejected: "Reddedildi",
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getContentTypeLabel = (type: string) => {
    const labels = {
      plan: "Plan",
      recipe: "Tarif",
      comment: "Yorum",
      recipe_comment: "Tarif Yorumu",
      group_post: "Grup Gönderisi",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 75) return "text-red-600 font-bold";
    if (priority >= 50) return "text-orange-600 font-semibold";
    if (priority >= 25) return "text-yellow-600";
    return "text-gray-600";
  };

  const getContentUrl = (contentType: string, contentId: string, slug?: string) => {
    switch (contentType) {
      case "plan":
        return `/plan/${slug || contentId}`;
      case "recipe":
        return `/tarif/${slug || contentId}`;
      case "comment":
        return `/plan?commentId=${contentId}`;
      case "recipe_comment":
        return `/tarif?commentId=${contentId}`;
      case "group_post":
        return `/gruplar?postId=${contentId}`;
      default:
        return "#";
    }
  };

  const filteredAppeals = appeals.filter((appeal) =>
    searchTerm
      ? appeal.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appeal.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appeal.user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );



  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">İtiraz Yönetimi</h1>
          <p className="text-muted-foreground mt-1">
            Kullanıcıların reddedilen içeriklerine yaptığı itirazları inceleyin ve çözümleyin
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium mb-1">Beklemede</p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-1">İnceleniyor</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.underReview}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">Onaylandı</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 dark:text-red-400 font-medium mb-1">Reddedildi</p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Durum
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tümü</option>
              <option value="pending">Beklemede</option>
              <option value="under_review">İnceleniyor</option>
              <option value="approved">Onaylandı</option>
              <option value="rejected">Reddedildi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İçerik Tipi
            </label>
            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tümü</option>
              <option value="plan">Plan</option>
              <option value="recipe">Tarif</option>
              <option value="comment">Yorum</option>
              <option value="recipe_comment">Tarif Yorumu</option>
              <option value="group_post">Grup Gönderisi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Ara
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kullanıcı veya sebep ara..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Appeals List */}
      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        {filteredAppeals.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">İtiraz bulunamadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öncelik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İçerik Tipi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sebep
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppeals.map((appeal) => (
                  <tr key={appeal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-lg font-bold ${getPriorityColor(appeal.priority)}`}>
                        {appeal.priority}
                      </span>
                      <div className="text-xs text-gray-500">
                        Rep: {appeal.user.reputationScore}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {appeal.user.image ? (
                          <img
                            src={appeal.user.image}
                            alt={appeal.user.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appeal.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{appeal.user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          {getContentTypeLabel(appeal.contentType)}
                        </span>
                        {appeal.contentDetails && (
                          <div className="mt-1 text-xs text-gray-600 max-w-xs">
                            {appeal.contentDetails.title && (
                              <p className="font-medium truncate">{appeal.contentDetails.title}</p>
                            )}
                            {appeal.contentDetails.content && (
                              <p className="truncate">{appeal.contentDetails.content}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {appeal.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appeal.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(appeal.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedAppeal(appeal)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        İncele
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appeal Detail Modal */}
      {selectedAppeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">İtiraz Detayı</h2>
                <button
                  onClick={() => setSelectedAppeal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Kullanıcı</label>
                  <div className="flex items-center mt-1">
                    {selectedAppeal.user.image && (
                      <img
                        src={selectedAppeal.user.image}
                        alt={selectedAppeal.user.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <div className="font-medium">{selectedAppeal.user.name}</div>
                      <div className="text-sm text-gray-500">
                        @{selectedAppeal.user.username}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Güvenilirlik: {selectedAppeal.user.reputationScore} 
                        <span className="ml-1">
                          {selectedAppeal.user.reputationScore >= 50 ? '⭐ Yüksek' : 
                           selectedAppeal.user.reputationScore >= 25 ? '👍 Orta' : '🆕 Yeni'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">İçerik</label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded">
                      {getContentTypeLabel(selectedAppeal.contentType)}
                    </span>
                    <a
                      href={getContentUrl(selectedAppeal.contentType, selectedAppeal.contentId, selectedAppeal.contentDetails?.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                    >
                      İçeriği Görüntüle →
                    </a>
                  </div>
                  {selectedAppeal.contentDetails && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      {selectedAppeal.contentDetails.title && (
                        <p className="font-medium text-gray-900 mb-1">
                          {selectedAppeal.contentDetails.title}
                        </p>
                      )}
                      {selectedAppeal.contentDetails.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {selectedAppeal.contentDetails.description}
                        </p>
                      )}
                      {selectedAppeal.contentDetails.content && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {selectedAppeal.contentDetails.content}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    ID: {selectedAppeal.contentId}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Öncelik</label>
                  <div className="mt-1">
                    <span className={`text-2xl font-bold ${getPriorityColor(selectedAppeal.priority)}`}>
                      {selectedAppeal.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">İtiraz Sebebi</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedAppeal.reason}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Durum</label>
                  <div className="mt-1">{getStatusBadge(selectedAppeal.status)}</div>
                </div>

                {selectedAppeal.status === "pending" || selectedAppeal.status === "under_review" ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Admin Notu (Opsiyonel)
                      </label>
                      <textarea
                        value={resolveNote}
                        onChange={(e) => setResolveNote(e.target.value)}
                        placeholder="Karar için açıklama ekleyin..."
                        rows={3}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      {selectedAppeal.status === "pending" && (
                        <button
                          onClick={() => handleSetUnderReview(selectedAppeal.id)}
                          disabled={resolving}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                        >
                          <Eye className="w-5 h-5 inline mr-2" />
                          İncelemeye Al
                        </button>
                      )}
                      <button
                        onClick={() => handleResolve(selectedAppeal.id, "approved")}
                        disabled={resolving}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                      >
                        <CheckCircle className="w-5 h-5 inline mr-2" />
                        Onayla
                      </button>
                      <button
                        onClick={() => handleResolve(selectedAppeal.id, "rejected")}
                        disabled={resolving}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                      >
                        <XCircle className="w-5 h-5 inline mr-2" />
                        Reddet
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {selectedAppeal.adminNote && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Admin Notu</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-900">{selectedAppeal.adminNote}</p>
                        </div>
                      </div>
                    )}
                    {selectedAppeal.resolver && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Çözümleyen</label>
                        <div className="mt-1">
                          <p className="text-gray-900">
                            {selectedAppeal.resolver.name} (@{selectedAppeal.resolver.username})
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(selectedAppeal.resolvedAt!).toLocaleString("tr-TR")}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

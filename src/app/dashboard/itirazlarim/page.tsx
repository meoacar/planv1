"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  MessageSquare,
  ArrowLeft,
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
  resolver?: {
    name: string;
    username: string;
  };
  contentDetails?: {
    title?: string;
    content?: string;
    slug?: string;
  };
}

export default function MyAppealsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchAppeals();
    }
  }, [session]);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/appeals");
      const data = await res.json();
      setAppeals(data.appeals || []);
    } catch (error) {
      console.error("Error fetching appeals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appealId: string) => {
    if (!confirm("Bu itirazı iptal etmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      setDeleting(true);
      const res = await fetch(`/api/appeals/${appealId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete appeal");

      setSelectedAppeal(null);
      fetchAppeals();
    } catch (error) {
      console.error("Error deleting appeal:", error);
      alert("İtiraz iptal edilirken bir hata oluştu");
    } finally {
      setDeleting(false);
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
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
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

  const stats = {
    pending: appeals.filter((a) => a.status === "pending").length,
    underReview: appeals.filter((a) => a.status === "under_review").length,
    approved: appeals.filter((a) => a.status === "approved").length,
    rejected: appeals.filter((a) => a.status === "rejected").length,
  };

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
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard'a Dön
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            İtirazlarım
          </h1>
          <p className="text-muted-foreground text-lg">
            Reddedilen içeriklerinize yaptığınız itirazları buradan takip edebilirsiniz
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-700 font-medium mb-1">Beklemede</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-700 font-medium mb-1">İnceleniyor</p>
                <p className="text-3xl font-bold text-blue-900">{stats.underReview}</p>
              </div>
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-700 font-medium mb-1">Onaylandı</p>
                <p className="text-3xl font-bold text-green-900">{stats.approved}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-700 font-medium mb-1">Reddedildi</p>
                <p className="text-3xl font-bold text-red-900">{stats.rejected}</p>
              </div>
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {appeals.length === 0 ? (
          <div className="bg-card rounded-xl shadow-lg border p-16 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Henüz itirazınız yok</h3>
            <p className="text-muted-foreground">Reddedilen içeriklerinize itiraz ettiğinizde burada görünecektir</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appeals.map((appeal) => (
              <div key={appeal.id} className="bg-card rounded-xl shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded">
                        {getContentTypeLabel(appeal.contentType)}
                      </span>
                      {getStatusBadge(appeal.status)}
                    </div>
                    {appeal.contentDetails && (
                      <p className="text-sm text-gray-900 mb-2">
                        {appeal.contentDetails.title || appeal.contentDetails.content}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {new Date(appeal.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedAppeal(appeal)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Detay
                  </button>
                </div>

                <p className="text-sm text-gray-700 line-clamp-2">{appeal.reason}</p>

                {appeal.status === "pending" && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleDelete(appeal.id)}
                      disabled={deleting}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      İptal Et
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedAppeal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">İtiraz Detayı</h2>
                <button onClick={() => setSelectedAppeal(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">İçerik</label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded">
                      {getContentTypeLabel(selectedAppeal.contentType)}
                    </span>
                    {selectedAppeal.contentDetails?.slug && (
                      <a
                        href={`/${selectedAppeal.contentType === 'plan' ? 'plan' : 'tarif'}/${selectedAppeal.contentDetails.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        Görüntüle →
                      </a>
                    )}
                  </div>
                  {selectedAppeal.contentDetails && (
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedAppeal.contentDetails.title || selectedAppeal.contentDetails.content}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Durum</label>
                  <div className="mt-1">{getStatusBadge(selectedAppeal.status)}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">İtiraz Sebebi</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{selectedAppeal.reason}</p>
                  </div>
                </div>

                {selectedAppeal.adminNote && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Admin Yanıtı</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">{selectedAppeal.adminNote}</p>
                    </div>
                  </div>
                )}

                {selectedAppeal.status === "pending" && (
                  <button
                    onClick={() => handleDelete(selectedAppeal.id)}
                    disabled={deleting}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    İtirazı İptal Et
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

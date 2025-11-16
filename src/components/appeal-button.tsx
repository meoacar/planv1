"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle, MessageSquare, X } from "lucide-react";

interface AppealButtonProps {
  contentType: "plan" | "recipe" | "comment" | "recipe_comment" | "group_post";
  contentId: string;
  isRejected: boolean;
  onAppealCreated?: () => void;
}

export default function AppealButton({
  contentType,
  contentId,
  isRejected,
  onAppealCreated,
}: AppealButtonProps) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!session?.user || !isRejected) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (reason.length < 20) {
      setError("İtiraz sebebi en az 20 karakter olmalıdır");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/appeals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          contentId,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create appeal");
      }

      setShowModal(false);
      setReason("");
      onAppealCreated?.();
      alert("İtirazınız başarıyla gönderildi! Yetkililer en kısa sürede inceleyecektir.");
    } catch (err: any) {
      setError(err.message || "İtiraz gönderilirken bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const getContentTypeLabel = () => {
    const labels = {
      plan: "plan",
      recipe: "tarif",
      comment: "yorum",
      recipe_comment: "tarif yorumu",
      group_post: "grup gönderisi",
    };
    return labels[contentType];
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
      >
        <MessageSquare className="w-5 h-5" />
        İtiraz Et
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">İtiraz Et</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">İtiraz Hakkında</p>
                    <p>
                      Reddedilen {getContentTypeLabel()} içeriğinizin neden yayınlanması
                      gerektiğini detaylı bir şekilde açıklayın. İtirazınız yetkililer
                      tarafından incelenecek ve size bildirim gönderilecektir.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İtiraz Sebebi *
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="İçeriğinizin neden reddedilmemesi gerektiğini detaylı bir şekilde açıklayın..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    minLength={20}
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">
                      En az 20 karakter gerekli
                    </p>
                    <p
                      className={`text-sm ${
                        reason.length > 1000
                          ? "text-red-600"
                          : reason.length >= 20
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {reason.length} / 1000
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || reason.length < 20}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {submitting ? "Gönderiliyor..." : "İtiraz Gönder"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

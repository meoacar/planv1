"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const SIN_TYPES = [
  { value: "tatli", label: "Tatlı", emoji: "🍰" },
  { value: "fastfood", label: "Fast Food", emoji: "🍟" },
  { value: "gazli", label: "Gazlı İçecek", emoji: "🥤" },
  { value: "alkol", label: "Alkol", emoji: "🍺" },
  { value: "diger", label: "Diğer", emoji: "🍩" },
] as const;

export function SinModal({ open, onOpenChange, onSuccess }: SinModalProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType) {
      toast.error("Lütfen bir kaçamak türü seçin");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/v1/food-sins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sinType: selectedType,
          note: note.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Bir hata oluştu");
      }

      const data = await response.json();
      
      // Mizahi yanıtı göster
      toast.success(data.reactionText || "Kaçamak kaydedildi! 😈", {
        duration: 5000,
      });

      // Modal'ı kapat ve formu sıfırla
      setSelectedType(null);
      setNote("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Bugün ne günah işledin? 😈
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Günah Türü Seçimi */}
          <div className="grid grid-cols-2 gap-3">
            {SIN_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                  ${
                    selectedType === type.value
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
                disabled={loading}
              >
                <span className="text-4xl">{type.emoji}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Not Alanı */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Not (Opsiyonel)
            </label>
            <Textarea
              placeholder="Örn: Doğum günü pastası, dayanamadım..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              disabled={loading}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {note.length}/500
            </p>
          </div>

          {/* Butonlar */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedType || loading}
              className="flex-1"
            >
              {loading ? "Kaydediliyor..." : "Kaydet 😈"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

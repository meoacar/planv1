"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface FoodSin {
  id: number;
  sinType: string;
  emoji: string;
  note: string | null;
  reactionText: string;
  sinDate: string;
  createdAt: string;
}

const SIN_TYPE_LABELS: Record<string, string> = {
  tatli: "Tatlı",
  fastfood: "Fast Food",
  gazli: "Gazlı İçecek",
  alkol: "Alkol",
  diger: "Diğer",
};

export function SinHistory() {
  const [sins, setSins] = useState<FoodSin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  const fetchSins = async () => {
    try {
      const url = filter
        ? `/api/v1/food-sins?sinType=${filter}&limit=50`
        : "/api/v1/food-sins?limit=50";
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Veriler yüklenemedi");
      
      const data = await response.json();
      setSins(data.sins || []);
    } catch (error) {
      toast.error("Günah geçmişi yüklenemedi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSins();
  }, [filter]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Günah Günlüğüm 📖</span>
          <span className="text-sm font-normal text-muted-foreground">
            {sins.length} kayıt
          </span>
        </CardTitle>

        {/* Filtreler */}
        <div className="flex gap-2 flex-wrap pt-2">
          <Button
            size="sm"
            variant={filter === null ? "default" : "outline"}
            onClick={() => setFilter(null)}
          >
            Tümü
          </Button>
          {Object.entries(SIN_TYPE_LABELS).map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={filter === value ? "default" : "outline"}
              onClick={() => setFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {sins.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-6xl mb-4">😇</p>
            <p className="text-muted-foreground">
              {filter
                ? "Bu kategoride henüz kaçamak yok"
                : "Henüz hiç kaçamak yapmamışsın!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sins.map((sin) => (
              <div
                key={sin.id}
                className="flex gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                {/* Emoji */}
                <div className="text-4xl flex-shrink-0">{sin.emoji}</div>

                {/* İçerik */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-foreground">
                      {SIN_TYPE_LABELS[sin.sinType] || sin.sinType}
                    </h4>
                    <time className="text-xs text-muted-foreground flex-shrink-0">
                      {format(new Date(sin.sinDate), "d MMM yyyy, HH:mm", {
                        locale: tr,
                      })}
                    </time>
                  </div>

                  {/* Mizahi Yanıt */}
                  <p className="text-sm text-muted-foreground italic mt-1">
                    "{sin.reactionText}"
                  </p>

                  {/* Kullanıcı Notu */}
                  {sin.note && (
                    <p className="text-sm text-foreground mt-2 bg-muted/50 p-2 rounded">
                      💭 {sin.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

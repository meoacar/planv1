"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FoodSin {
  id: number;
  sinType: string;
  emoji: string;
  sinDate: string;
}

const SIN_TYPE_COLORS: Record<string, string> = {
  tatli: "bg-pink-100 dark:bg-pink-900/30 border-pink-300",
  fastfood: "bg-orange-100 dark:bg-orange-900/30 border-orange-300",
  gazli: "bg-blue-100 dark:bg-blue-900/30 border-blue-300",
  alkol: "bg-purple-100 dark:bg-purple-900/30 border-purple-300",
  diger: "bg-gray-100 dark:bg-gray-900/30 border-gray-300",
};

export function SinCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sins, setSins] = useState<FoodSin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSins = async () => {
    setLoading(true);
    try {
      // Son 60 günü çek (2 aylık veri)
      const response = await fetch("/api/v1/food-sins?limit=200");
      if (!response.ok) throw new Error("Veriler yüklenemedi");

      const data = await response.json();
      setSins(data.sins || []);
    } catch (error) {
      toast.error("Takvim verileri yüklenemedi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSins();
  }, []);

  // Takvim günlerini hesapla
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: tr });
  const calendarEnd = endOfWeek(monthEnd, { locale: tr });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Günlük günahları grupla
  const sinsByDate = sins.reduce((acc, sin) => {
    const date = format(new Date(sin.sinDate), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(sin);
    return acc;
  }, {} as Record<string, FoodSin[]>);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">Yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            📅 Günah Takvimi
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrevMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleToday}
              className="h-8 px-3"
            >
              Bugün
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {format(currentDate, "MMMM yyyy", { locale: tr })}
        </p>
      </CardHeader>

      <CardContent>
        {/* Haftanın Günleri */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Takvim Günleri */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const daySins = sinsByDate[dateKey] || [];
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={dateKey}
                className={`
                  relative min-h-[80px] p-2 rounded-lg border-2 transition-all
                  ${isToday ? "border-primary bg-primary/5" : "border-gray-200 dark:border-gray-700"}
                  ${!isCurrentMonth ? "opacity-40" : ""}
                  ${daySins.length > 0 ? "hover:shadow-md cursor-pointer" : ""}
                `}
              >
                {/* Gün Numarası */}
                <div
                  className={`
                    text-xs font-semibold mb-1
                    ${isToday ? "text-primary" : "text-gray-700 dark:text-gray-300"}
                  `}
                >
                  {format(day, "d")}
                </div>

                {/* Günah Emoji'leri */}
                {daySins.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {daySins.slice(0, 4).map((sin, idx) => (
                      <span
                        key={sin.id}
                        className={`
                          text-lg leading-none
                          ${idx >= 3 ? "opacity-50" : ""}
                        `}
                        title={sin.sinType}
                      >
                        {sin.emoji}
                      </span>
                    ))}
                    {daySins.length > 4 && (
                      <span className="text-xs text-gray-500 font-semibold">
                        +{daySins.length - 4}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-2xl opacity-20">💚</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Açıklama */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-500 mb-3 font-medium">Açıklama:</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍰</span>
              <span className="text-gray-600 dark:text-gray-400">Tatlı</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🍟</span>
              <span className="text-gray-600 dark:text-gray-400">Fast Food</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🥤</span>
              <span className="text-gray-600 dark:text-gray-400">Gazlı İçecek</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🍺</span>
              <span className="text-gray-600 dark:text-gray-400">Alkol</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💚</span>
              <span className="text-gray-600 dark:text-gray-400">Temiz Gün</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

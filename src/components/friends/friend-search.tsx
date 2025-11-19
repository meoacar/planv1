'use client';

/**
 * Friend Search Component
 * Kullanıcı arama ve arkadaş isteği gönderme
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Search, UserPlus, Check } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  level: number;
  streak: number;
  isFriend: boolean;
  hasPendingRequest: boolean;
}

export function FriendSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sending, setSending] = useState<string | null>(null);

  // Otomatik arama (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchUsers();
      } else {
        setResults([]);
      }
    }, 500); // 500ms bekle

    return () => clearTimeout(timer);
  }, [query]);

  const searchUsers = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/v1/users/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.users);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Arama başarısız');
    } finally {
      setIsSearching(false);
    }
  };

  const sendRequest = async (userId: string) => {
    setSending(userId);
    try {
      const response = await fetch('/api/v1/friends/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.autoAccepted) {
          toast.success('Artık arkadaşsınız! 🎉');
        } else {
          toast.success('Arkadaş isteği gönderildi!');
        }
        // Sonucu güncelle
        setResults(
          results.map((r) =>
            r.id === userId
              ? { ...r, hasPendingRequest: true, isFriend: data.autoAccepted }
              : r
          )
        );
      } else {
        const error = await response.json();
        toast.error(error.error || 'İstek gönderilemedi');
      }
    } catch (error) {
      console.error('Send request error:', error);
      toast.error('İstek gönderilemedi');
    } finally {
      setSending(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchUsers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
          <Search className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Arkadaş Ara 🔍
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Yeni arkadaşlar bul, birlikte motive olun ve hedeflerinize ulaşın! 💪
        </p>
      </div>

      {/* Arama */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Kullanıcı adı veya isim ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={searchUsers}
          disabled={isSearching || !query.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSearching ? 'Aranıyor...' : 'Ara'}
        </button>
      </div>

      {/* Sonuçlar */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">
            {results.length} sonuç bulundu
          </h3>
          <div className="grid gap-3">
            {results.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || user.username || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {(user.name || user.username || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {user.level}
                    </div>
                  </div>

                  {/* Bilgiler */}
                  <div>
                    <h4 className="font-semibold">
                      {user.name || user.username}
                    </h4>
                    {user.username && user.name && (
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      🔥 {user.streak} gün streak
                    </p>
                  </div>
                </div>

                {/* Aksiyon */}
                <div>
                  {user.isFriend ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <Check className="h-4 w-4" />
                      Arkadaş
                    </div>
                  ) : user.hasPendingRequest ? (
                    <div className="text-sm text-muted-foreground">
                      İstek gönderildi
                    </div>
                  ) : (
                    <button
                      onClick={() => sendRequest(user.id)}
                      disabled={sending === user.id}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1"
                    >
                      <UserPlus className="h-4 w-4" />
                      Ekle
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Arama yapılmadı */}
      {!isSearching && query && results.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/30">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Kullanıcı bulunamadı</p>
          <p className="text-sm text-muted-foreground">Farklı bir arama terimi deneyin</p>
        </div>
      )}

      {/* İlk durum - Arama yapılmamış */}
      {!query && results.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3">Yeni Arkadaşlar Keşfet!</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Kullanıcı adı veya isim yazarak arama yapın.<br />
            Arkadaş ekleyerek birlikte ilerleme kaydedin! 🚀
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border">
              <span>💬</span>
              <span>Mesajlaşma</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border">
              <span>📊</span>
              <span>İlerleme Takibi</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border">
              <span>🏆</span>
              <span>Motivasyon</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

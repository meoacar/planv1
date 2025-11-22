'use client';

/**
 * Friend List Component
 * Arkadaş listesini gösterir
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Users, Search, Trash2, TrendingUp, Award, Flame } from 'lucide-react';
import Link from 'next/link';

interface Friend {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  level: number;
  xp: number;
  streak: number;
  coins: number;
  sinBadges: any[];
}

export function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    loadFriends();
    loadRequests();
  }, []);

  const loadFriends = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/friends');
      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends);
      }
    } catch (error) {
      console.error('Load friends error:', error);
      toast.error('Arkadaşlar yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      const response = await fetch('/api/v1/friends/requests?type=received');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Load requests error:', error);
    }
  };

  const handleRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(`/api/v1/friends/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        toast.success(action === 'accept' ? 'Arkadaş eklendi! 🎉' : 'İstek reddedildi');
        loadRequests();
        if (action === 'accept') {
          loadFriends();
        }
      }
    } catch (error) {
      console.error('Handle request error:', error);
      toast.error('İşlem başarısız');
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!confirm('Bu arkadaşlığı sonlandırmak istediğinize emin misiniz?')) {
      return;
    }

    setRemoving(friendId);
    try {
      const response = await fetch(`/api/v1/friends?friendId=${friendId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Arkadaşlık sonlandırıldı');
        setFriends(friends.filter((f) => f.id !== friendId));
      } else {
        throw new Error('Remove failed');
      }
    } catch (error) {
      console.error('Remove friend error:', error);
      toast.error('Arkadaşlık sonlandırılamadı');
    } finally {
      setRemoving(null);
    }
  };

  const filteredFriends = friends.filter(
    (f) =>
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.username?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Başlık ve Arkadaş Ekle Butonu */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold">Arkadaşlar</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {friends.length} arkadaş • {requests.length} istek
          </p>
        </div>
        <a
          href="/friends/search"
          className="px-3 py-2 sm:px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
        >
          <span className="hidden sm:inline">+ Arkadaş Ekle</span>
          <span className="sm:hidden">+ Ekle</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('friends')}
          className={`px-3 py-2 sm:px-4 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
            activeTab === 'friends'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Arkadaşlarım ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3 py-2 sm:px-4 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
            activeTab === 'requests'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          İstekler ({requests.length})
          {requests.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* Arkadaşlar Tab */}
      {activeTab === 'friends' && (
        <>
          {/* Arama */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Arkadaşlarında ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Arkadaş Listesi */}
      {filteredFriends.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            {search ? 'Arkadaş bulunamadı' : 'Henüz arkadaşın yok'}
          </h3>
          <p className="text-muted-foreground">
            {search
              ? 'Farklı bir arama deneyin'
              : 'Arkadaş ekleyerek başlayın!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {friend.image ? (
                      <img
                        src={friend.image}
                        alt={friend.name || friend.username || 'User'}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                        {(friend.name || friend.username || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                      {friend.level}
                    </div>
                  </div>

                  {/* Bilgiler */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profil/${friend.username || friend.id}`}
                      className="font-semibold text-sm sm:text-lg hover:text-primary transition-colors block truncate"
                    >
                      {friend.name || friend.username}
                    </Link>
                    {friend.username && friend.name && (
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        @{friend.username}
                      </p>
                    )}

                    {/* İstatistikler */}
                    <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm flex-wrap">
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                        <span className="font-medium">{friend.streak}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                        <span className="font-medium">
                          {friend.sinBadges.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        <span className="font-medium">{friend.xp} XP</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aksiyonlar */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/friends/compare?friendId=${friend.id}`}
                    className="px-2 py-1 sm:px-3 bg-primary text-primary-foreground rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Karşılaştır</span>
                    <span className="sm:hidden">Karş.</span>
                  </Link>
                  <button
                    onClick={() => removeFriend(friend.id)}
                    disabled={removing === friend.id}
                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Arkadaşlığı sonlandır"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

          {/* Toplam */}
          {filteredFriends.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Toplam {filteredFriends.length} arkadaş
            </div>
          )}
        </>
      )}

      {/* İstekler Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/50">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Arkadaş isteği yok</h3>
              <p className="text-muted-foreground">
                Yeni istekler burada görünecek
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {requests.map((request: any) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {request.sender.image ? (
                        <img
                          src={request.sender.image}
                          alt={request.sender.name || request.sender.username || 'User'}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                          {(request.sender.name || request.sender.username || 'U')[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Bilgiler */}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/profil/${request.sender.username || request.sender.id}`}
                        className="font-semibold text-sm sm:text-base hover:text-primary transition-colors block truncate"
                      >
                        {request.sender.name || request.sender.username}
                      </Link>
                      {request.message && (
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {request.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleRequest(request.id, 'accept')}
                      className="flex-1 sm:flex-none px-3 py-1.5 sm:py-1 bg-green-100 text-green-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      Kabul Et
                    </button>
                    <button
                      onClick={() => handleRequest(request.id, 'reject')}
                      className="flex-1 sm:flex-none px-3 py-1.5 sm:py-1 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Reddet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

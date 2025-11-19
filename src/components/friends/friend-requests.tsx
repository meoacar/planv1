'use client';

/**
 * Friend Requests Component
 * Arkadaş isteklerini gösterir ve yönetir
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { UserPlus, Check, X, Clock } from 'lucide-react';

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  message: string | null;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    level: number;
    streak: number;
  };
  receiver: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    level: number;
    streak: number;
  };
}

export function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch('/api/v1/friends/requests?type=received'),
        fetch('/api/v1/friends/requests?type=sent'),
      ]);

      if (receivedRes.ok && sentRes.ok) {
        const receivedData = await receivedRes.json();
        const sentData = await sentRes.json();
        setRequests(receivedData.requests);
        setSentRequests(sentData.requests);
      }
    } catch (error) {
      console.error('Load requests error:', error);
      toast.error('İstekler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptRequest = async (requestId: string) => {
    setProcessing(requestId);
    try {
      const response = await fetch(`/api/v1/friends/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      });

      if (response.ok) {
        toast.success('Arkadaş isteği kabul edildi! 🎉');
        setRequests(requests.filter((r) => r.id !== requestId));
      } else {
        throw new Error('Accept failed');
      }
    } catch (error) {
      console.error('Accept request error:', error);
      toast.error('İstek kabul edilemedi');
    } finally {
      setProcessing(null);
    }
  };

  const rejectRequest = async (requestId: string) => {
    setProcessing(requestId);
    try {
      const response = await fetch(`/api/v1/friends/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (response.ok) {
        toast.success('İstek reddedildi');
        setRequests(requests.filter((r) => r.id !== requestId));
      } else {
        throw new Error('Reject failed');
      }
    } catch (error) {
      console.error('Reject request error:', error);
      toast.error('İstek reddedilemedi');
    } finally {
      setProcessing(null);
    }
  };

  const cancelRequest = async (requestId: string) => {
    setProcessing(requestId);
    try {
      const response = await fetch(`/api/v1/friends/requests/${requestId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('İstek iptal edildi');
        setSentRequests(sentRequests.filter((r) => r.id !== requestId));
      } else {
        throw new Error('Cancel failed');
      }
    } catch (error) {
      console.error('Cancel request error:', error);
      toast.error('İstek iptal edilemedi');
    } finally {
      setProcessing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Yükleniyor...</p>
      </div>
    );
  }

  const displayRequests = activeTab === 'received' ? requests : sentRequests;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'received'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Gelen İstekler ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'sent'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Gönderilen İstekler ({sentRequests.length})
        </button>
      </div>

      {/* İstekler */}
      {displayRequests.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            {activeTab === 'received'
              ? 'Gelen istek yok'
              : 'Gönderilen istek yok'}
          </h3>
          <p className="text-muted-foreground">
            {activeTab === 'received'
              ? 'Henüz arkadaş isteği almadınız'
              : 'Henüz arkadaş isteği göndermediniz'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayRequests.map((request) => {
            const user =
              activeTab === 'received' ? request.sender : request.receiver;

            return (
              <div
                key={request.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="relative">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || user.username || 'User'}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {(user.name || user.username || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {user.level}
                      </div>
                    </div>

                    {/* Bilgiler */}
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {user.name || user.username}
                      </h3>
                      {user.username && user.name && (
                        <p className="text-sm text-muted-foreground">
                          @{user.username}
                        </p>
                      )}
                      {request.message && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          "{request.message}"
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex items-center gap-2">
                    {activeTab === 'received' ? (
                      <>
                        <button
                          onClick={() => acceptRequest(request.id)}
                          disabled={processing === request.id}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <Check className="h-4 w-4" />
                          Kabul Et
                        </button>
                        <button
                          onClick={() => rejectRequest(request.id)}
                          disabled={processing === request.id}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <X className="h-4 w-4" />
                          Reddet
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => cancelRequest(request.id)}
                        disabled={processing === request.id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        İptal Et
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

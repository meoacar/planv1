'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Trash2, Edit2, Calendar, Weight } from 'lucide-react';
import PhotoUploadDialog from './photo-upload-dialog';
import PhotoEditDialog from './edit-dialog';
import Image from 'next/image';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Photo {
  id: string;
  photoUrl: string;
  weight: number | null;
  type: 'before' | 'after' | 'progress';
  caption: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}

interface PhotoGalleryProps {
  userId: string;
}

export default function PhotoGallery({ userId }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'before' | 'after' | 'progress'>('all');

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/progress-photos?userId=${userId}`);
      const data = await response.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error('Load photos error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/v1/progress-photos/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPhotos(photos.filter((p) => p.id !== photoId));
      }
    } catch (error) {
      console.error('Delete photo error:', error);
    }
  };

  const filteredPhotos = activeTab === 'all' 
    ? photos 
    : photos.filter(p => p.type === activeTab);

  const typeLabels = {
    before: 'Başlangıç',
    after: 'Sonuç',
    progress: 'İlerleme',
  };

  return (
    <div className="space-y-6">
      {/* Mobil için düzenlenmiş header */}
      <div className="space-y-4">
        {/* Yükle butonu - mobilde tam genişlik */}
        <Button 
          onClick={() => setUploadOpen(true)} 
          className="w-full sm:w-auto sm:ml-auto sm:flex"
          size="lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          Fotoğraf Yükle
        </Button>

        {/* Tabs - mobilde scroll */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
            <TabsList className="inline-flex w-auto min-w-full sm:w-full">
              <TabsTrigger value="all" className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4">
                Tümü ({photos.length})
              </TabsTrigger>
              <TabsTrigger value="before" className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4">
                Başlangıç ({photos.filter(p => p.type === 'before').length})
              </TabsTrigger>
              <TabsTrigger value="progress" className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4">
                İlerleme ({photos.filter(p => p.type === 'progress').length})
              </TabsTrigger>
              <TabsTrigger value="after" className="whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4">
                Sonuç ({photos.filter(p => p.type === 'after').length})
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-80 sm:h-96 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredPhotos.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">Henüz fotoğraf yok</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            İlerlemenizi takip etmek için fotoğraf yükleyin
          </p>
          <Button onClick={() => setUploadOpen(true)} size="lg" className="w-full sm:w-auto">
            <Upload className="w-4 h-4 mr-2" />
            İlk Fotoğrafı Yükle
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group">
              <div className="relative aspect-[3/4] bg-muted">
                <Image
                  src={photo.photoUrl}
                  alt={photo.caption || 'İlerleme fotoğrafı'}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Mobilde her zaman görünür butonlar */}
                <div className="absolute top-2 right-2 flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditPhoto(photo)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(photo.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-md">
                    {typeLabels[photo.type]}
                  </span>
                </div>
              </div>
              <div className="p-3 sm:p-4 space-y-2">
                {photo.caption && (
                  <p className="text-sm line-clamp-2">{photo.caption}</p>
                )}
                <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground flex-wrap">
                  {photo.weight && (
                    <div className="flex items-center gap-1">
                      <Weight className="w-3 h-3" />
                      <span>{photo.weight} kg</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(photo.createdAt), 'dd MMM yyyy', { locale: tr })}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PhotoUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={() => {
          loadPhotos();
          setUploadOpen(false);
        }}
      />

      {editPhoto && (
        <PhotoEditDialog
          photo={editPhoto}
          open={!!editPhoto}
          onOpenChange={(open: boolean) => !open && setEditPhoto(null)}
          onSuccess={() => {
            loadPhotos();
            setEditPhoto(null);
          }}
        />
      )}
    </div>
  );
}

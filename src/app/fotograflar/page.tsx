import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import PhotoGallery from './photo-gallery';

export const metadata: Metadata = {
  title: 'İlerleme Fotoğraflarım',
  description: 'Kilo verme yolculuğunuzdaki ilerleme fotoğraflarınızı görüntüleyin',
};

export default async function FotograflarPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/giris');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">İlerleme Fotoğraflarım</h1>
          <p className="text-muted-foreground">
            Kilo verme yolculuğunuzdaki değişimi fotoğraflarla takip edin
          </p>
        </div>

        <PhotoGallery userId={session.user.id} />
      </main>
    </div>
  );
}

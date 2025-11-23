import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { uploadFile } from '@/lib/upload';

// GET - Kullanıcının fotoğraflarını listele
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;
    const type = searchParams.get('type') as 'before' | 'after' | 'progress' | null;
    const limit = parseInt(searchParams.get('limit') || '50');

    const photos = await db.progressPhoto.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Get photos error:', error);
    return NextResponse.json(
      { error: 'Fotoğraflar yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Yeni fotoğraf yükle
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Premium limit kontrolü
    const { checkPhotoLimit } = await import('@/lib/premium-features');
    const limitCheck = await checkPhotoLimit(session.user.id);
    
    if (!limitCheck.allowed) {
      return NextResponse.json({ 
        error: limitCheck.message,
        isPremiumRequired: true,
        remaining: limitCheck.remaining
      }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const weight = formData.get('weight') as string;
    const type = formData.get('type') as 'before' | 'after' | 'progress';
    const caption = formData.get('caption') as string;

    if (!file) {
      return NextResponse.json({ error: 'Dosya gerekli' }, { status: 400 });
    }

    // Dosyayı yükle
    const uploadResult = await uploadFile(file, 'progress-photos');
    if (!uploadResult.success) {
      return NextResponse.json({ error: uploadResult.error }, { status: 400 });
    }

    // Veritabanına kaydet
    const photo = await db.progressPhoto.create({
      data: {
        userId: session.user.id,
        photoUrl: uploadResult.url!,
        weight: weight ? parseFloat(weight) : null,
        type: type || 'progress',
        caption: caption || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    console.error('Upload photo error:', error);
    return NextResponse.json(
      { error: 'Fotoğraf yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

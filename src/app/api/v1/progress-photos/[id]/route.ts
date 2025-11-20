import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { unlink } from 'fs/promises';
import { join } from 'path';

// DELETE - Fotoğrafı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const photo = await db.progressPhoto.findUnique({
      where: { id: id },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Fotoğraf bulunamadı' }, { status: 404 });
    }

    // Sadece kendi fotoğrafını silebilir
    if (photo.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Dosyayı sil
    try {
      const filePath = join(process.cwd(), 'public', photo.photoUrl);
      await unlink(filePath);
    } catch (error) {
      console.error('File delete error:', error);
    }

    // Veritabanından sil
    await db.progressPhoto.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json(
      { error: 'Fotoğraf silinirken hata oluştu' },
      { status: 500 }
    );
  }
}

// PATCH - Fotoğraf bilgilerini güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const photo = await db.progressPhoto.findUnique({
      where: { id: id },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Fotoğraf bulunamadı' }, { status: 404 });
    }

    if (photo.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { weight, caption, type } = body;

    const updatedPhoto = await db.progressPhoto.update({
      where: { id: id },
      data: {
        ...(weight !== undefined && { weight: parseFloat(weight) }),
        ...(caption !== undefined && { caption }),
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
    });

    return NextResponse.json({ photo: updatedPhoto });
  } catch (error) {
    console.error('Update photo error:', error);
    return NextResponse.json(
      { error: 'Fotoğraf güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

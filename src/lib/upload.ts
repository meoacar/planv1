import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadFile(
  file: File,
  folder: 'progress-photos' | 'plans' | 'avatars' | 'recipes' = 'progress-photos'
): Promise<UploadResult> {
  try {
    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'Dosya boyutu 5MB\'dan büyük olamaz' };
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Sadece JPG, PNG ve WebP formatları desteklenir' };
    }

    // Dosya adını oluştur
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const ext = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomStr}.${ext}`;

    // Upload klasörünü oluştur
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Dosyayı kaydet
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // URL'i döndür
    const url = `/uploads/${folder}/${fileName}`;
    return { success: true, url };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Dosya yüklenirken bir hata oluştu' };
  }
}

export function getFileUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder-avatar.png';
  if (path.startsWith('http')) return path;
  return path;
}

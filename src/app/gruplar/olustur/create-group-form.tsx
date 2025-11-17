"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Category {
  value: string;
  label: string;
  icon: string;
  description: string;
}

interface CreateGroupFormProps {
  categories: Category[];
}

export function CreateGroupForm({ categories }: CreateGroupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "general",
    isPublic: true,
    maxMembers: "",
    rules: "",
    image: "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Resim boyutu 5MB'dan küçük olmalı");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Sadece resim dosyaları yüklenebilir");
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";

      if (imageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("folder", "groups");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Resim yüklenemedi");
        }

        imageUrl = uploadData.url;
        setUploadingImage(false);
      }

      const payload: any = {
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category,
        isPublic: formData.isPublic,
        rules: formData.rules || undefined,
        image: imageUrl || undefined,
      };

      if (formData.maxMembers) {
        payload.maxMembers = parseInt(formData.maxMembers);
      }

      const res = await fetch("/api/v1/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Grup oluşturulamadı");
      }

      alert(data.message || "Grubunuz oluşturuldu ve admin onayı bekliyor.");
      router.push("/gruplar");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/gruplar"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Gruplara Dön
        </Link>
        <h1 className="text-3xl font-bold">Yeni Grup Oluştur</h1>
        <p className="text-muted-foreground mt-2">
          Kendi topluluğunu oluştur ve insanları bir araya getir
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grup Bilgileri</CardTitle>
          <CardDescription>
            Grubun hakkında temel bilgileri gir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="image">Grup Resmi (Opsiyonel)</Label>
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                    <span className="text-4xl">📷</span>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading || uploadingImage}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG veya WebP. Maksimum 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Grup Adı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="örn: 30'lu Anneler Zayıflama Grubu"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                minLength={3}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                En az 3, en fazla 100 karakter
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                placeholder="Grubun amacını ve hedefini kısaca açıkla..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                Maksimum 500 karakter
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Kategori <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <div>
                          <div className="font-medium">{cat.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {cat.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rules">Grup Kuralları</Label>
              <Textarea
                id="rules"
                placeholder="Grubun kurallarını belirt (opsiyonel)..."
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                Maksimum 1000 karakter
              </p>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="isPublic">Açık Grup</Label>
                <p className="text-sm text-muted-foreground">
                  Herkes grubu görebilir ve katılabilir
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublic: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMembers">Maksimum Üye Sayısı (Opsiyonel)</Label>
              <Input
                id="maxMembers"
                type="number"
                placeholder="Sınırsız"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                min={2}
                max={1000}
              />
              <p className="text-xs text-muted-foreground">
                Boş bırakırsan sınırsız üye katılabilir
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading || uploadingImage || !formData.name}
                className="flex-1"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Resim Yükleniyor...
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  "Grubu Oluştur"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            💡 İpuçları
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Açık ve net bir grup adı seç</li>
            <li>• Grubun amacını açıklamada belirt</li>
            <li>• Kuralları net bir şekilde yaz</li>
            <li>• Doğru kategoriyi seçmeye özen göster</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

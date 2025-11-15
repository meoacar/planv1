import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Giriş yapmalısınız" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "progress-photos";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Dosya bulunamadı" },
        { status: 400 }
      );
    }

    // Allowed folders
    const allowedFolders = ["progress-photos", "plans", "avatars", "recipes", "groups"];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz klasör" },
        { status: 400 }
      );
    }

    const result = await uploadFile(file, folder as any);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Dosya yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

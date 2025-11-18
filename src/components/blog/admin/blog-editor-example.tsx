"use client";

/**
 * Blog Editor Usage Example
 * 
 * This file demonstrates how to use the BlogEditor component
 * in your admin pages.
 */

import { useState } from "react";
import { BlogEditor } from "./blog-editor";
import { uploadBlogImage } from "@/lib/blog/image-upload";

export function BlogEditorExample() {
  const [content, setContent] = useState("");

  const handleImageUpload = async (file: File): Promise<string> => {
    // Upload image to your server
    const url = await uploadBlogImage(file);
    return url;
  };

  const handleSave = () => {
    console.log("Saving content:", content);
    // Save to database via API
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Blog Yazısı Oluştur</h1>
      
      <BlogEditor
        content={content}
        onChange={setContent}
        placeholder="Blog içeriğinizi buraya yazın..."
        onImageUpload={handleImageUpload}
      />

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Kaydet
        </button>
      </div>

      {/* Preview */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Önizleme</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

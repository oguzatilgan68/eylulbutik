"use client";

import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Category } from "@/generated/prisma";
import Image from "next/image";
import Swal from "sweetalert2";
import { supabase } from "../../lib/supabase/supabaseClient";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: any) => Promise<void>;
}

export const CategoryForm = ({ initialData, onSubmit }: CategoryFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [parentId, setParentId] = useState(initialData?.parentId || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    setImageFile(null);
    setImageUrl("");
    setProgress(0);
  };

  // ☁️ Supabase upload (abort destekli)
  const uploadImage = async (
    file: File,
    abortSignal?: AbortSignal
  ): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error } = await supabase.storage
        .from("categories")
        .upload(filePath, file);

      if (error) {
        console.error("Supabase upload error:", error);
        Swal.fire({
          icon: "error",
          title: "Yükleme hatası",
          text: "Görsel yüklenemedi.",
          confirmButtonColor: "#dc2626",
        });
        return null;
      }

      const { data } = supabase.storage
        .from("categories")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err: any) {
      if (err.name === "AbortError") {
        Swal.fire({
          icon: "info",
          title: "Yükleme iptal edildi",
          toast: true,
          timer: 2000,
          position: "top-end",
          showConfirmButton: false,
        });
        return null;
      }
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Görsel yüklenemedi",
        text: "Bir hata oluştu.",
        confirmButtonColor: "#dc2626",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;

    setUploading(true);
    setProgress(0);

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const url = await uploadImage(imageFile);
        if (!url) {
          setUploading(false);
          return;
        }
        finalImageUrl = url;
      }

      await onSubmit({
        name,
        slug,
        parentId: parentId || null,
        imageUrl: finalImageUrl || null,
      });

      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Kategori başarıyla kaydedildi.",
        confirmButtonColor: "#16a34a",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Kategori kaydedilirken bir hata oluştu.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow"
    >
      {/* Kategori Adı */}
      <div>
        <label className="block mb-1 font-medium">Kategori Adı</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block mb-1 font-medium">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100"
          required
        />
      </div>

      {/* Üst Kategori */}
      <div>
        <label className="block mb-1 font-medium">Üst Kategori</label>
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">Ana Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Görsel Yükleme */}
      <div>
        <label className="block mb-1 font-medium">Kategori Görseli</label>
        {imageUrl && (
          <div className="relative w-40 h-40 mb-2">
            {imageUrl.startsWith("blob:") ? (
              <img
                src={imageUrl}
                alt="Kategori"
                className="w-full h-full object-cover rounded-lg border"
              />
            ) : (
              <Image
                src={imageUrl}
                alt="Kategori"
                width={160}
                height={160}
                unoptimized
                className="w-full h-full object-cover rounded-lg border"
              />
            )}
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {/* Yükleme Barı */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded h-2 mb-2">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Butonlar */}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={uploading}
          className={`px-4 py-2 rounded text-white ${
            uploading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Yükleniyor..." : "Kaydet"}
        </button>

        {uploading && (
          <button
            type="button"
            onClick={cancelUpload}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            İptal Et
          </button>
        )}
      </div>
    </form>
  );
};

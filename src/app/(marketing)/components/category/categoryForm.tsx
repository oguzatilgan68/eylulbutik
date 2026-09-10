"use client";

import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Category } from "@/generated/prisma";
import Image from "next/image";
import Swal from "sweetalert2";
import { supabase } from "../../lib/supabase/supabaseClient";
import { FiFolder, FiLink, FiLayers, FiUploadCloud, FiTrash2, FiSave, FiX } from "react-icons/fi";

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

  // ☁️ Supabase upload
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
        confirmButtonColor: "#db2777",
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

  const inputClass =
    "w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
    >
      {/* Kategori Adı */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider items-center gap-1.5">
          <FiFolder size={14} className="text-pink-600" /> Kategori Adı
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn: Kadın Giyim"
          className={inputClass}
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <FiLink size={14} className="text-pink-600" /> Slug (URL)
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Örn: kadin-giyim"
          className={inputClass}
          required
        />
      </div>

      {/* Üst Kategori */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider items-center gap-1.5">
          <FiLayers size={14} className="text-pink-600" /> Üst Kategori
        </label>
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className={inputClass}
        >
          <option value="">Ana Kategori (Yok)</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Görsel Yükleme Alanı */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Kategori Görseli
        </label>
        {imageUrl ? (
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm group">
            {imageUrl.startsWith("blob:") ? (
              <img
                src={imageUrl}
                alt="Kategori"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={imageUrl}
                alt="Kategori"
                width={160}
                height={160}
                unoptimized
                className="w-full h-full object-cover"
              />
            )}
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-rose-600 text-white rounded-xl w-7 h-7 flex items-center justify-center shadow-md hover:bg-rose-700 transition cursor-pointer"
            >
              <FiX size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 transition-colors group cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="categoryImage"
            />
            <label
              htmlFor="categoryImage"
              className="flex flex-col items-center cursor-pointer space-y-2"
            >
              <div className="p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                <FiUploadCloud size={22} />
              </div>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                Görsel seçmek için tıklayın
              </span>
              <span className="text-[11px] text-gray-400">PNG, JPG, WEBP</span>
            </label>
          </div>
        )}
      </div>

      {/* Yükleme Barı */}
      {uploading && (
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-pink-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Butonlar */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="submit"
          disabled={uploading}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiSave size={16} /> {uploading ? "Yükleniyor..." : "Kaydet"}
        </button>

        {uploading && (
          <button
            type="button"
            onClick={cancelUpload}
            className="px-5 py-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium text-sm rounded-2xl hover:bg-rose-100 border border-rose-200/60 transition cursor-pointer"
          >
            İptal Et
          </button>
        )}
      </div>
    </form>
  );
};
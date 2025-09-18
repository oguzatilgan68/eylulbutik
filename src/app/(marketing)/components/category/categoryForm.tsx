"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/app/(marketing)/lib/db";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../lib/supabase/supabaseClient";
import { Category } from "@/generated/prisma";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: any) => void;
}

export const CategoryForm = ({ initialData, onSubmit }: CategoryFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [parentId, setParentId] = useState(initialData?.parentId || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file)); // önizleme
  };

  const removeImage = () => {
    setImageFile(null);
    setImageUrl("");
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error } = await supabase.storage
        .from("categories")
        .upload(filePath, file);

      if (error) {
        console.error("Supabase upload error:", error);
        alert("Görsel yüklenemedi");
        return null;
      }

      const { data } = supabase.storage
        .from("categories")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error(err);
      alert("Görsel yüklenemedi");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let finalImageUrl = imageUrl;

    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (!url) {
        setUploading(false);
        return; // yükleme başarısızsa submit'i durdur
      }
      finalImageUrl = url;
    }

    onSubmit({
      name,
      slug,
      parentId: parentId || null,
      imageUrl: finalImageUrl || null,
    });

    setUploading(false);
  };

  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Kategori Adı</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Üst Kategori</label>
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="">Ana Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Kategori Görseli</label>
        {imageUrl && (
          <div className="relative w-40 h-40 mb-2">
            <img
              src={imageUrl}
              alt="Kategori"
              className="w-full h-full object-cover rounded"
            />
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

      <button
        type="submit"
        disabled={uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {uploading ? "Yükleniyor..." : "Kaydet"}
      </button>
    </form>
  );
};

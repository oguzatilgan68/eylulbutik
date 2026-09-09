"use client";

import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./types/types";

interface Props {
  uploadImage?: (file: File) => Promise<string | null>;
}

export default function StepImages({ uploadImage }: Props) {
  const { watch, setValue } = useFormContext<ProductFormData>();

  const images = watch("images") || [];

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const uploaded: { url: string; alt?: string }[] = [];

    for (const file of files) {
      const url = uploadImage
        ? await uploadImage(file)
        : URL.createObjectURL(file);
      if (url) uploaded.push({ url, alt: file.name });
    }

    setValue("images", [...images, ...uploaded]);
  };

  const handleRemove = (idx: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== idx)
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
          Ürün Görselleri
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Ürününüzü en iyi yansıtan fotoğrafları yükleyin (Birden fazla seçebilirsiniz).
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm"
          >
            <img
              src={img.url}
              alt={img.alt || `Image ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md transition-colors"
              aria-label="Görseli sil"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Dosya Seçme / Yükleme Kutusu */}
        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl cursor-pointer bg-gray-50/50 dark:bg-gray-800/50 hover:bg-pink-50/40 dark:hover:bg-gray-800 hover:border-pink-500 transition-all group">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-pink-600 group-hover:scale-110 transition-all mb-1">
            +
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-pink-600">
            Görsel Ekle
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleAddImage}
          />
        </label>
      </div>
    </div>
  );
}
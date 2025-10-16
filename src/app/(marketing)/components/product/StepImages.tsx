"use client";

import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./types/types";

interface Props {
  uploadImage?: (file: File) => Promise<string | null>;
}

export default function StepImages({ uploadImage }: Props) {
  const { watch, setValue } = useFormContext<ProductFormData>();

  // 👇 images undefined ise boş array olarak başlat
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
    <div className="p-4 border rounded dark:bg-gray-900">
      <label className="block text-sm font-medium mb-2">Ürün Görselleri</label>
      <div className="flex flex-wrap gap-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-24 h-24">
            <img
              src={img.url}
              alt={img.alt || `Image ${idx + 1}`}
              className="w-full h-full object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
        <label className="w-24 h-24 flex items-center justify-center border rounded cursor-pointer bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
          +
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleAddImage}
          />
        </label>
      </div>
    </div>
  );
}

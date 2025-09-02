import Image from "next/image";
import { useState } from "react";

interface ProductImageUploaderProps {
  images: { url: string }[];
  onChange: (images: { url: string }[]) => void;
  onUpload?: (file: File) => Promise<string>; // dosya upload edip url döndüren fonksiyon
}

export function ProductImageUploader({
  images,
  onChange,
  onUpload,
}: ProductImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>(
    images.map((img) => img.url)
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: { url: string }[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (onUpload) {
        // Eğer Supabase veya Cloudinary gibi upload fonksiyonu verilmişse
        const uploadedUrl = await onUpload(file);
        newImages.push({ url: uploadedUrl });
        newPreviews.push(uploadedUrl);
      } else {
        // Sadece geçici önizleme (upload yoksa)
        const previewUrl = URL.createObjectURL(file);
        newImages.push({ url: previewUrl });
        newPreviews.push(previewUrl);
      }
    }

    onChange([...images, ...newImages]);
    setPreviews([...previews, ...newPreviews]);
  };

  const handleRemove = (idx: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(idx, 1);
    newPreviews.splice(idx, 1);
    onChange(newImages);
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="sr-only">Görsel Yükle</span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </label>

      {/* Önizleme */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {previews.map((src, idx) => (
          <div key={idx} className="relative group">
            <Image
              src={src}
              alt={`Ürün görseli ${idx + 1}`}
              className="w-full h-32 object-cover rounded-lg border"
              width={1280}
              height={720}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 group-hover:opacity-100"
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

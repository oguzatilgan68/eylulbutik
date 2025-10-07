"use client";

import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./types/types";

interface Props {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
}

export default function StepBasicInfo({ categories, brands }: Props) {
  const { register } = useFormContext<ProductFormData>();
  const inputClass =
    "w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all";

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Ürün Adı */}
      <div>
        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
          Ürün Adı
        </label>
        <input
          {...register("name", { required: "Ürün adı zorunlu" })}
          placeholder="Ürün adını girin"
          className={inputClass}
        />
      </div>

      {/* Fiyat */}
      <div>
        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
          Fiyat (₺)
        </label>
        <input
          type="number"
          step="0.01"
          {...register("price", { required: "Fiyat zorunlu" })}
          placeholder="Fiyat girin"
          className={inputClass}
        />
      </div>

      {/* Açıklama */}
      <div>
        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
          Açıklama
        </label>
        <textarea
          {...register("description")}
          placeholder="Ürün hakkında kısa bir açıklama yazın"
          rows={4}
          className={inputClass}
        />
      </div>

      {/* Kategori & Marka */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
            Kategori
          </label>
          <select
            {...register("categoryId")}
            className={inputClass}
            defaultValue=""
          >
            <option value="">- Kategori Seç -</option>
            {categories.length > 0 ? (
              categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))
            ) : (
              <option disabled>Kategori bulunamadı</option>
            )}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
            Marka
          </label>
          <select
            {...register("brandId")}
            className={inputClass}
            defaultValue=""
          >
            <option value="">- Marka Seç -</option>
            {brands.length > 0 ? (
              brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))
            ) : (
              <option disabled>Marka bulunamadı</option>
            )}
          </select>
        </div>
      </div>
    </div>
  );
}

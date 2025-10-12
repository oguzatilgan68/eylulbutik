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
    <div className="space-y-5">
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

      {/* Grid: Yayın, Kategori, Marka */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Yayın Durumu */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Yayın Durumu
          </label>
          <select
            {...register("status")}
            className={`${inputClass} focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
            defaultValue="PUBLISHED"
          >
            <option value="DRAFT">Taslak</option>
            <option value="PUBLISHED">Yayında</option>
            <option value="ARCHIVED">Arşiv</option>
          </select>
        </div>

        {/* Stok Durumu */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Stok Durumu
          </label>
          <div className="flex items-center space-x-3 rounded-md border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-800">
            <input
              type="checkbox"
              id="inStock"
              {...register("inStock")}
              className="w-5 h-5 text-pink-600 bg-gray-100 border-gray-300 rounded cursor-pointer focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="inStock"
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
            >
              Stokta var
            </label>
          </div>
        </div>

        {/* Kategori */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Kategori
          </label>
          <select
            {...register("categoryId")}
            className={`${inputClass} focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
            defaultValue=""
          >
            <option value="">- Kategori Seç -</option>
            {categories?.length ? (
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

        {/* Marka */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Marka
          </label>
          <select
            {...register("brandId")}
            className={`${inputClass} focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
            defaultValue=""
          >
            <option value="">- Marka Seç -</option>
            {brands?.length ? (
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

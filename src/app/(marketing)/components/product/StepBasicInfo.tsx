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
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Ürün Adı */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Ürün Adı *
          </label>
          <input
            {...register("name", { required: "Ürün adı zorunlu" })}
            placeholder="Örn: Oversize Kışlık Mont"
            className={inputClass}
          />
        </div>

        {/* Fiyat */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Fiyat (₺) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: "Fiyat zorunlu" })}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* SEO Başlığı */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            SEO Başlığı
          </label>
          <input
            {...register("seoTitle")}
            placeholder="Örn: Şık Kışlık Kadın Mont Modelleri"
            className={inputClass}
          />
        </div>

        {/* SEO Anahtar Kelimeler */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            SEO Anahtar Kelimeler
          </label>
          <input
            {...register("seoKeywords")}
            placeholder="mont, kışlık, kadın giyim"
            className={inputClass}
          />
        </div>
      </div>

      <hr className="border-gray-100 dark:border-gray-800 my-2" />

      {/* Grid: Yayın, Kategori, Marka & Switch alanları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Yayın Durumu */}
        <div className="flex flex-col">
          <label className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Yayın Durumu
          </label>
          <select
            {...register("status")}
            className={inputClass}
            defaultValue="PUBLISHED"
          >
            <option value="DRAFT">Taslak</option>
            <option value="PUBLISHED">Yayında</option>
            <option value="ARCHIVED">Arşiv</option>
          </select>
        </div>

        {/* Kategori */}
        <div className="flex flex-col">
          <label className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Kategori *
          </label>
          <select
            {...register("categoryId")}
            className={inputClass}
            defaultValue=""
          >
            <option value="">- Kategori Seç -</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Marka */}
        <div className="flex flex-col">
          <label className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Marka
          </label>
          <select
            {...register("brandId")}
            className={inputClass}
            defaultValue=""
          >
            <option value="">- Marka Seç -</option>
            {brands?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Checkbox Alanları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        <label className="flex items-center space-x-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3.5 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:border-pink-500 transition-all">
          <input
            type="checkbox"
            id="inStock"
            {...register("inStock")}
            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Stokta Var
          </span>
        </label>

        <label className="flex items-center space-x-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3.5 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:border-pink-500 transition-all">
          <input
            type="checkbox"
            id="changeable"
            {...register("changeable")}
            defaultChecked={true}
            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Ürün Değiştirilebilir (İade/Değişim uygun)
          </span>
        </label>
      </div>
    </div>
  );
}
"use client";

import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./types/types";

interface Props {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
}

export default function StepBasicInfo({ categories, brands }: Props) {
  const { register } = useFormContext<ProductFormData>();

  return (
    <div className="space-y-4">
      <input
        {...register("name", { required: "Ürün adı zorunlu" })}
        placeholder="Ürün Adı"
        className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
      />
      <textarea
        {...register("description")}
        placeholder="Açıklama"
        rows={4}
        className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
      />
      <div className="grid grid-cols-2 gap-2">
        <select
          {...register("categoryId")}
          className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          {...register("brandId")}
          className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="">- Marka -</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

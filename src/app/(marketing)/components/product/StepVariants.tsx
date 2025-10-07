"use client";

import { useFormContext } from "react-hook-form";
import { AttributeType, ProductFormData } from "./types/types";

interface Props {
  attributeTypes: AttributeType[];
  uploadImage: (file: File) => Promise<string | null>; // görsel upload fonksiyonu
}

export default function StepVariants({ attributeTypes, uploadImage }: Props) {
  const { watch, setValue } = useFormContext<ProductFormData>();
  const variants = watch("variants") || [];

  const handleAddVariant = () => {
    setValue("variants", [
      ...variants,
      { sku: "", price: "", stockQty: "0", attributeValueIds: [], images: [] },
    ]);
  };

  const handleRemoveVariant = (idx: number) => {
    setValue(
      "variants",
      variants.filter((_, i) => i !== idx)
    );
  };

  const updateVariant = (idx: number, data: Partial<(typeof variants)[0]>) => {
    const arr = [...variants];
    arr[idx] = { ...arr[idx], ...data };
    setValue("variants", arr);
  };

  return (
    <div className="p-4 border rounded dark:bg-gray-900 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Varyantlar</h3>
        <button
          type="button"
          onClick={handleAddVariant}
          className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-800"
        >
          Varyant Ekle
        </button>
      </div>

      {variants.map((v: any, idx: number) => (
        <div
          key={idx}
          className="p-3 border rounded dark:bg-gray-800 space-y-3"
        >
          <div className="flex justify-between items-center">
            <div className="font-medium">Varyant {idx + 1}</div>
            <button
              type="button"
              onClick={() => handleRemoveVariant(idx)}
              className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-900"
            >
              Sil
            </button>
          </div>

          {/* SKU / Fiyat / Stok */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              placeholder="SKU"
              value={v.sku}
              onChange={(e) => updateVariant(idx, { sku: e.target.value })}
              className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-full"
            />
            <input
              placeholder="Fiyat"
              value={v.price}
              onChange={(e) => updateVariant(idx, { price: e.target.value })}
              className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-full"
            />
            <input
              placeholder="Stok"
              value={v.stockQty}
              onChange={(e) => updateVariant(idx, { stockQty: e.target.value })}
              className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-full"
            />
          </div>

          {/* Attribute Seçimleri */}
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Özellikler</label>
            <div className="flex flex-wrap gap-2">
              {attributeTypes.map((at, ai) => (
                <select
                  key={at.id}
                  value={v.attributeValueIds[ai] || ""}
                  onChange={(e) => {
                    const arr = [...(v.attributeValueIds || [])];
                    arr[ai] = e.target.value;
                    updateVariant(idx, { attributeValueIds: arr });
                  }}
                  className="p-2 rounded border dark:bg-gray-800 dark:text-white"
                >
                  <option value="">-{at.name}-</option>
                  {at.values.map((val) => (
                    <option key={val.id} value={val.id}>
                      {val.value}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          {/* Görseller */}
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Görseller</label>
            <div className="flex flex-wrap gap-2">
              {(v.images || []).map((img: any, i: number) => (
                <div key={i} className="relative w-20 h-20">
                  <img
                    src={img.url}
                    alt={img.alt || ""}
                    className="w-full h-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = (v.images || []).filter((img: any, j: number) => j !== i);
                      updateVariant(idx, { images: arr });
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}

              <label className="w-20 h-20 flex items-center justify-center border rounded cursor-pointer bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                +
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    if (!e.target.files) return;
                    const uploaded: { url: string; alt?: string }[] = [];
                    for (const file of Array.from(e.target.files)) {
                      const url = await uploadImage(file);
                      if (url) uploaded.push({ url, alt: file.name });
                    }
                    updateVariant(idx, {
                      images: [...(v.images || []), ...uploaded],
                    });
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

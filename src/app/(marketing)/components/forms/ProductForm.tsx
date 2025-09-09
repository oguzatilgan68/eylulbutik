"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../lib/supabase/supabaseClient";

export type AttributeType = {
  id: string;
  name: string;
  values: { id: string; value: string }[];
};

export type VariantInput = {
  id?: string;
  sku: string;
  price: string;
  stockQty: string;
  attributeValueIds: string[]; // ordered list of selected attribute value ids
  images: { url: string; alt?: string }[];
};

export type ProductFormData = {
  name: string;
  price: string;
  description: string;
  categoryId: string;
  brandId?: string;
  images: { url: string; alt?: string }[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  inStock: boolean;
  variants: VariantInput[];
  seoTitle?: string;
  seoDesc?: string;
};

type Props = {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  attributeTypes: AttributeType[];
  initialData: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void> | void; // server action
};

export default function ProductForm({
  categories,
  brands,
  attributeTypes,
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<ProductFormData>(initialData);

  const update = (patch: Partial<ProductFormData>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  // Images handling (simple: user pastes a URL)
  const addImage = () =>
    update({ images: [...form.images, { url: "", alt: "" }] });
  const updateImage = (idx: number, img: { url: string; alt?: string }) => {
    const arr = [...form.images];
    arr[idx] = img;
    update({ images: arr });
  };
  const removeImage = (idx: number) =>
    update({ images: form.images.filter((_, i) => i !== idx) });

  // Variants
  const addVariant = () =>
    update({
      variants: [
        ...form.variants,
        {
          sku: "",
          price: "",
          stockQty: "0",
          attributeValueIds: [],
          images: [],
        },
      ],
    });
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `products/${fileName}`; // bucket 'products'
    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, file);
    if (error) {
      console.error("Supabase upload error:", error);
      alert("Görsel yüklenemedi");
      return null;
    }
    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  };
  const updateVariant = (idx: number, patch: Partial<VariantInput>) => {
    const arr = [...form.variants];
    arr[idx] = { ...arr[idx], ...patch };
    update({ variants: arr });
  };
  const removeVariant = (idx: number) =>
    update({ variants: form.variants.filter((_, i) => i !== idx) });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium">Ürün Adı</label>
          <input
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            className="w-full p-2 rounded border dark:bg-gray-800"
          />

          <label className="block text-sm font-medium mt-4">Açıklama</label>
          <textarea
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            rows={6}
            className="w-full p-2 rounded border dark:bg-gray-800"
          />

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div>
              <label className="block text-sm">Kategori</label>
              <select
                value={form.categoryId}
                onChange={(e) => update({ categoryId: e.target.value })}
                className="w-full p-2 rounded border dark:bg-gray-800"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Marka (opsiyonel)</label>
              <select
                value={form.brandId}
                onChange={(e) => update({ brandId: e.target.value })}
                className="w-full p-2 rounded border dark:bg-gray-800"
              >
                <option value="">-</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <div>
              <label className="block text-sm">Fiyat</label>
              <input
                value={form.price}
                onChange={(e) => update({ price: e.target.value })}
                className="p-2 rounded border dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm">Stokta mı?</label>
              <select
                value={form.inStock ? "yes" : "no"}
                onChange={(e) => update({ inStock: e.target.value === "yes" })}
                className="p-2 rounded border dark:bg-gray-800"
              >
                <option value="yes">Evet</option>
                <option value="no">Hayır</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Durum</label>
              <select
                value={form.status}
                onChange={(e) => update({ status: e.target.value as any })}
                className="p-2 rounded border dark:bg-gray-800"
              >
                <option value="DRAFT">Taslak</option>
                <option value="PUBLISHED">Yayınlandı</option>
                <option value="ARCHIVED">Arşiv</option>
              </select>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="p-4 border rounded dark:bg-gray-900">
            <label className="block text-sm font-medium">SEO Başlık</label>
            <input
              value={form.seoTitle}
              onChange={(e) => update({ seoTitle: e.target.value })}
              className="w-full p-2 rounded border dark:bg-gray-800"
            />
            <label className="block text-sm font-medium mt-2">
              SEO Açıklama
            </label>
            <input
              value={form.seoDesc}
              onChange={(e) => update({ seoDesc: e.target.value })}
              className="w-full p-2 rounded border dark:bg-gray-800"
            />
          </div>
          {/* Ürün Görselleri */}
          <div className="p-4 border rounded dark:bg-gray-900">
            <label className="block text-sm font-medium">Ürün Görselleri</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24">
                  <img
                    src={img.url}
                    alt={img.alt || `Image ${idx + 1}`}
                    className="w-full h-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
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
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    if (!e.target.files) return;
                    const uploaded: { url: string; alt?: string }[] = [];
                    for (const file of Array.from(e.target.files)) {
                      const url = await uploadImage(file); // uploadImage fonksiyonunu kendi upload mantığına göre tanımla
                      if (url) uploaded.push({ url, alt: file.name });
                    }
                    update({ images: [...form.images, ...uploaded] });
                  }}
                />
              </label>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {!attributeTypes || attributeTypes.length === 0 ? (
              <div className="text-sm text-red-500">
                Ürün varyantları için önce <b>attribute tipi</b> eklemelisiniz.
              </div>
            ) : (
              attributeTypes.map((at) => (
                <div key={at.id} className="text-sm">
                  <div className="font-medium">{at.name}</div>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {at.values.map((v) => (
                      <div
                        key={v.id}
                        className="px-2 py-1 border rounded text-xs"
                      >
                        {v.value}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Variants */}
      <div className="border rounded p-4 dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Varyantlar</h3>
          <button
            type="button"
            onClick={addVariant}
            className="px-3 py-1 rounded bg-green-600 text-white cursor-pointer hover:bg-green-800"
          >
            Varyant Ekle
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {form.variants.map((v, vi) => (
            <div
              key={vi}
              className="p-3 border rounded bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">Varyant {vi + 1}</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => removeVariant(vi)}
                    className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-900 cursor-pointer"
                  >
                    Sil
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-3">
                <input
                  placeholder="SKU"
                  value={v.sku}
                  onChange={(e) => updateVariant(vi, { sku: e.target.value })}
                  className="p-2 rounded border dark:bg-gray-800"
                />
                <input
                  placeholder="Fiyat"
                  value={v.price}
                  onChange={(e) => updateVariant(vi, { price: e.target.value })}
                  className="p-2 rounded border dark:bg-gray-800"
                />
                <input
                  placeholder="Stok"
                  value={v.stockQty}
                  onChange={(e) =>
                    updateVariant(vi, { stockQty: e.target.value })
                  }
                  className="p-2 rounded border dark:bg-gray-800"
                />

                <div>
                  <label className="block text-xs">Attribute Değerleri</label>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {attributeTypes.map((at, ai) => (
                      <select
                        key={at.id}
                        value={v.attributeValueIds[ai] || ""}
                        onChange={(e) => {
                          const arr = [...v.attributeValueIds];
                          arr[ai] = e.target.value;
                          updateVariant(vi, { attributeValueIds: arr });
                        }}
                        className="p-2 rounded border dark:bg-gray-800"
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
              </div>

              <div className="mt-3">
                {form.variants.map((v, vi) => (
                  <div
                    key={vi}
                    className="p-3 border rounded bg-white dark:bg-gray-800 mt-2"
                  >
                    <div className="text-sm font-medium mb-1">
                      Varyant {vi + 1} Görselleri
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {v.images.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20">
                          <img
                            src={img.url}
                            alt={
                              img.alt || `Variant ${vi + 1} Image ${idx + 1}`
                            }
                            className="w-full h-full object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const arr = v.images.filter((_, i) => i !== idx);
                              updateVariant(vi, { images: arr });
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
                            const uploaded: { url: string; alt?: string }[] =
                              [];
                            for (const file of Array.from(e.target.files)) {
                              const url = await uploadImage(file);
                              if (url) uploaded.push({ url, alt: file.name });
                            }
                            updateVariant(vi, {
                              images: [...v.images, ...uploaded],
                            });
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-900 cursor-pointer"
        >
          Kaydet
        </button>
      </div>
    </form>
  );
}

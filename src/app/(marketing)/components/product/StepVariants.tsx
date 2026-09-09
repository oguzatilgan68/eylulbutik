"use client";

import { useFormContext } from "react-hook-form";
import { AttributeType, ProductFormData } from "./types/types";

interface Props {
  attributeTypes: AttributeType[];
  uploadImage: (file: File) => Promise<string | null>;
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

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Ürün Varyantları
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Farklı beden, renk veya özellik kombinasyonlarını ekleyin.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddVariant}
          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-all flex items-center gap-1.5"
        >
          <span>+</span> Varyant Ekle
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/40">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Henüz varyant eklenmedi. Yukarıdaki butona basarak ilk varyantı oluşturun.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {variants.map((v: any, idx: number) => (
            <div
              key={idx}
              className="p-4 sm:p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 space-y-4 shadow-sm"
            >
              {/* Üst Kısım: Varyant Numarası & Sil Butonu */}
              <div className="flex justify-between items-center border-b border-gray-200/60 dark:border-gray-700/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                  Varyant #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-colors"
                >
                  Kaldır
                </button>
              </div>

              {/* SKU / Fiyat / Stok Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">SKU (Stok Kodu)</label>
                  <input
                    placeholder="Örn: MNT-001-KRM"
                    value={v.sku}
                    onChange={(e) => updateVariant(idx, { sku: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fiyat (₺)</label>
                  <input
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    value={v.price}
                    onChange={(e) => updateVariant(idx, { price: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Stok Miktarı</label>
                  <input
                    placeholder="0"
                    type="number"
                    value={v.stockQty}
                    onChange={(e) => updateVariant(idx, { stockQty: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Attribute Seçimleri */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Özellik Seçimleri</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {attributeTypes.map((at, ai) => (
                    <select
                      key={at.id}
                      value={v.attributeValueIds[ai] || ""}
                      onChange={(e) => {
                        const arr = [...(v.attributeValueIds || [])];
                        arr[ai] = e.target.value;
                        updateVariant(idx, { attributeValueIds: arr });
                      }}
                      className={inputClass}
                    >
                      <option value="">{at.name} Seç</option>
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
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Varyant Görselleri</label>
                <div className="flex flex-wrap gap-2.5">
                  {(v.images || []).map((img: any, i: number) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                      <img
                        src={img.url}
                        alt={img.alt || ""}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const arr = (v.images || []).filter((_: any, j: number) => j !== i);
                          updateVariant(idx, { images: arr });
                        }}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <label className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-white dark:bg-gray-800 hover:border-pink-500 text-gray-400 hover:text-pink-600 transition-all">
                    <span className="text-lg leading-none">+</span>
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
      )}
    </div>
  );
}
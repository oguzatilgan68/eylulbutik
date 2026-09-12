"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AttributeType, ProductFormData } from "./types/types";
import { FiLayers, FiRefreshCw, FiTrash2, FiPlus } from "react-icons/fi";

interface Props {
  attributeTypes: AttributeType[];
  uploadImage: (file: File) => Promise<string | null>;
}

export default function StepVariants({ attributeTypes, uploadImage }: Props) {
  const { watch, setValue } = useFormContext<ProductFormData>();
  const variants = watch("variants") || [];
  const basePrice = watch("price") || "";
  const baseSku = watch("sku") || "";

  // Hangi özellik türünden hangi değerler seçildi? Örn: { "renk_id": ["beyaz_id", "siyah_id"] }
  const [selectedValuesMap, setSelectedValuesMap] = useState<Record<string, string[]>>({});

  const generateRandomSuffix = () => 
    Math.random().toString(36).substring(2, 6).toUpperCase();

  // Seçenek seçimini yönet
  const handleToggleValue = (typeId: string, valId: string) => {
    const current = selectedValuesMap[typeId] || [];
    if (current.includes(valId)) {
      setSelectedValuesMap({
        ...selectedValuesMap,
        [typeId]: current.filter((id) => id !== valId),
      });
    } else {
      setSelectedValuesMap({
        ...selectedValuesMap,
        [typeId]: [...current, valId],
      });
    }
  };

  // 🚀 Matris Kombinasyon Üretici (Cartesian Product)
  const generateMatrixVariants = () => {
    const activeTypes = attributeTypes.filter(
      (at) => selectedValuesMap[at.id] && selectedValuesMap[at.id].length > 0
    );

    if (activeTypes.length === 0) {
      alert("Lütfen en az bir özellik ve değer seçin.");
      return;
    }

    // Kombinasyonları recursive (özyinelemeli) olarak türetelim
    const cartesian = (arr: any[][]): any[][] =>
      arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())), [[]]);

    const valueArrays = activeTypes.map((at) => 
      selectedValuesMap[at.id].map((valId) => ({
        typeId: at.id,
        valId,
        valObj: at.values.find((v) => v.id === valId),
      }))
    );

    const combinations = cartesian(valueArrays);

    // Üretilen kombinasyonları variant formatına çevir
    const newVariants = combinations.map((combo) => {
      const attributeValueIds = combo.map((c: any) => c.valId);
      const nameParts = combo.map((c: any) => c.valObj?.value.replace(/\s+/g, "").toUpperCase()).filter(Boolean);
      
      const suffix = generateRandomSuffix();
      const sku = [baseSku, ...nameParts, suffix].filter(Boolean).join("-");

      return {
        sku,
        price: basePrice,
        stockQty: "10",
        attributeValueIds,
        images: [],
        uniqueSuffix: suffix,
      };
    });

    setValue("variants", newVariants);
  };

  const handleAddVariantManual = () => {
    const newSuffix = generateRandomSuffix();
    const initialSku = baseSku ? `${baseSku}-${newSuffix}` : newSuffix;

    setValue("variants", [
      ...variants,
      {
        sku: initialSku,
        price: basePrice,
        stockQty: "0",
        attributeValueIds: [],
        images: [],
        uniqueSuffix: newSuffix,
      },
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
      {/* Üst Bilgi ve Matris Seçim Alanı */}
      <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-4">
        <div className="flex items-center gap-2">
          <FiLayers className="text-pink-600" size={20} />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Varyant Kombinasyon Üreticisi (Matris)
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Aşağıdan ürünün sahip olabileceği özellikleri ve seçenekleri işaretleyin. Sistem tüm olası kombinasyonları otomatik olarak hesaplayacaktır.
        </p>

        {/* Özellik Grupları ve Seçenekleri */}
        <div className="space-y-3 pt-2">
          {attributeTypes.map((at) => (
            <div key={at.id} className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                {at.name}
              </span>
              <div className="flex flex-wrap gap-2">
                {at.values.map((val) => {
                  const isSelected = (selectedValuesMap[at.id] || []).includes(val.id);
                  return (
                    <button
                      key={val.id}
                      type="button"
                      onClick={() => handleToggleValue(at.id, val.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-pink-500"
                      }`}
                    >
                      {val.value} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={generateMatrixVariants}
            className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FiRefreshCw size={14} /> Kombinasyonları Otomatik Üret
          </button>
        </div>
      </div>

      {/* Üretilen Varyant Listesi / Tablosu */}
      <div className="flex justify-between items-center pt-2">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          Oluşan Varyantlar ({variants.length})
        </h3>
        <button
          type="button"
          onClick={handleAddVariantManual}
          className="px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
        >
          <FiPlus size={14} /> Manuel Satır Ekle
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/40">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Henüz varyant oluşturulmadı. Yukarıdan özellikleri seçip "Kombinasyonları Otomatik Üret" butonuna basın.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {variants.map((v: any, idx: number) => (
            <div
              key={idx}
              className="p-4 sm:p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-center border-b border-gray-200/60 dark:border-gray-700/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                  Varyant Kombinasyonu #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <FiTrash2 size={12} /> Kaldır
                </button>
              </div>

              {/* SKU / Fiyat / Stok Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">SKU (Stok Kodu)</label>
                  <input
                    value={v.sku}
                    onChange={(e) => updateVariant(idx, { sku: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fiyat (₺)</label>
                  <input
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
                    type="number"
                    value={v.stockQty}
                    onChange={(e) => updateVariant(idx, { stockQty: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Görseller */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Varyanta Özel Görseller</label>
                <div className="flex flex-wrap gap-2.5">
                  {(v.images || []).map((img: any, i: number) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const arr = (v.images || []).filter((_: any, j: number) => j !== i);
                          updateVariant(idx, { images: arr });
                        }}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow cursor-pointer"
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
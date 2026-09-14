"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FiLayers, FiRefreshCw, FiTrash2, FiPlus, FiImage, FiCheck } from "react-icons/fi";

interface AttributeValue {
  id: string;
  value: string;
}

interface AttributeType {
  id: string;
  name: string;
  values: AttributeValue[];
}

interface Props {
  attributeTypes: AttributeType[];
  uploadImage: (file: File) => Promise<string | null>;
}

export default function StepVariants({ attributeTypes, uploadImage }: Props) {
  const { watch, setValue } = useFormContext<any>();
  const variants = watch("variants") || [];
  const basePrice = watch("price") || "";
  const baseSku = watch("sku") || "";
  
  // Ürünün 1. adımda yüklediği ana görselleri form state'inden alıyoruz
  const mainProductImages = watch("images") || []; // [{ url: string, alt?: string }]

  const [selectedValuesMap, setSelectedValuesMap] = useState<Record<string, string[]>>({});
  
  // Hangi varyant için görsel seçme modalı açık? (Index tutuyoruz)
  const [activeImageModalIdx, setActiveImageModalIdx] = useState<number | null>(null);

  const generateRandomSuffix = () => Math.random().toString(36).substring(2, 6).toUpperCase();

  const handleToggleValue = (typeId: string, valId: string) => {
    const current = selectedValuesMap[typeId] || [];
    if (current.includes(valId)) {
      setSelectedValuesMap({ ...selectedValuesMap, [typeId]: current.filter((id) => id !== valId) });
    } else {
      setSelectedValuesMap({ ...selectedValuesMap, [typeId]: [...current, valId] });
    }
  };

// 🚀 Profesyonel Matris Kombinasyon Üretici (Eskileri silmeden koruyan yapı)
  const generateMatrixVariants = () => {
    const activeTypes = attributeTypes.filter(
      (at) => selectedValuesMap[at.id] && selectedValuesMap[at.id].length > 0
    );

    if (activeTypes.length === 0) {
      alert("Lütfen varyant üretmek için en az bir özellik ve değer seçin.");
      return;
    }

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

    // Mevcut varyantları kopyalayarak başlayalım (Eskiler silinmesin!)
    const currentVariants = [...variants];

    combinations.forEach((combo) => {
      const attributeValueIds = combo.map((c: any) => c.valId);
      
      // Bu kombinasyona sahip bir varyant zaten listede var mı kontrol edelim
      const existingVariantIndex = currentVariants.findIndex((v: any) => {
        const vIds = v.attributeValueIds || [];
        if (vIds.length !== attributeValueIds.length) return false;
        return attributeValueIds.every((id: string) => vIds.includes(id));
      });

      // Eğer bu kombinasyon daha önceden yoksa yeni ekleyelim
      if (existingVariantIndex === -1) {
        const nameParts = combo.map((c: any) => c.valObj?.value.replace(/\s+/g, "").toUpperCase()).filter(Boolean);
        const suffix = generateRandomSuffix();
        const sku = [baseSku, ...nameParts, suffix].filter(Boolean).join("-");

        currentVariants.push({
          sku,
          price: basePrice,
          stockQty: "10",
          attributeValueIds,
          images: [],
        });
      }
      // Eğer zaten varsa, eski fiyatını/stokunu bozmamak için dokunmuyoruz.
    });

    setValue("variants", currentVariants);
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
      },
    ]);
  };

  const handleRemoveVariant = (idx: number) => {
    setValue("variants", variants.filter((_: any, i: number) => i !== idx));
  };

  const updateVariant = (idx: number, data: any) => {
    const arr = [...variants];
    arr[idx] = { ...arr[idx], ...data };
    setValue("variants", arr);
  };

  // Varyanta mevcut ana görsellerden ekleme
  const handleToggleImageToVariant = (variantIdx: number, imgUrl: string) => {
    const currentImages = variants[variantIdx].images || [];
    const exists = currentImages.some((img: any) => img.url === imgUrl);

    let updatedImages;
    if (exists) {
      updatedImages = currentImages.filter((img: any) => img.url !== imgUrl);
    } else {
      updatedImages = [...currentImages, { url: imgUrl, alt: "" }];
    }

    updateVariant(variantIdx, { images: updatedImages });
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="space-y-6">
      {/* Matris Seçim Alanı */}
      <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-4">
        <div className="flex items-center gap-2">
          <FiLayers className="text-pink-600" size={20} />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Varyant Kombinasyon Üreticisi
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Bu ürün için geçerli olan seçenekleri işaretleyin. Sistem tüm kombinasyonları otomatik oluştursun.
        </p>

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

      {/* Oluşan Varyant Listesi */}
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
                  Varyant #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <FiTrash2 size={12} /> Kaldır
                </button>
              </div>

              {/* Temel Bilgiler Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">SKU (Stok Kodu)</label>
                  <input
                    value={v.sku || ""}
                    onChange={(e) => updateVariant(idx, { sku: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fiyat (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={v.price || ""}
                    onChange={(e) => updateVariant(idx, { price: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Stok Miktarı</label>
                  <input
                    type="number"
                    value={v.stockQty || ""}
                    onChange={(e) => updateVariant(idx, { stockQty: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* 📸 VARYANT GÖRSEL YÖNETİMİ (Havuzdan Seç veya Yeni Yükle) */}
              <div className="pt-2 border-t border-gray-200/40 dark:border-gray-700/40 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <FiImage size={14} className="text-pink-600" /> Varyant Görselleri ({v.images?.length || 0})
                  </label>
                </div>

                {/* Seçilmiş Görseller Listesi */}
                <div className="flex flex-wrap gap-2.5">
                  {(v.images || []).map((img: any, imgIdx: number) => (
                    <div key={imgIdx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm group">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = v.images.filter((_: any, i: number) => i !== imgIdx);
                          updateVariant(idx, { images: updated });
                        }}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-90 hover:opacity-100 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Havuzdan Görsel Seç Butonu */}
                  {mainProductImages.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setActiveImageModalIdx(idx === activeImageModalIdx ? null : idx)}
                      className="px-3.5 h-16 flex flex-col items-center justify-center border-2 border-dashed border-pink-300 dark:border-pink-800/60 rounded-xl cursor-pointer bg-pink-50/50 dark:bg-pink-950/20 hover:bg-pink-100/50 text-pink-600 dark:text-pink-400 text-xs font-medium transition-all"
                    >
                      <FiImage size={16} className="mb-1" /> Havuzdan Seç
                    </button>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic self-center">
                      Önce ürünün genel görsellerini yükleyin.
                    </p>
                  )}

                  {/* Sıfırdan Bilgisayardan Yükleme Butonu */}
                  <label className="px-3.5 h-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-white dark:bg-gray-800 hover:border-pink-500 text-gray-500 hover:text-pink-600 text-xs font-medium transition-all">
                    <FiPlus size={16} className="mb-1" /> Yeni Yükle
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

                {/* 🌟 ANA GÖRSEL HAVUZU SEÇİM PANELİ (Açılır Kutu) */}
                {activeImageModalIdx === idx && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-pink-200 dark:border-pink-900/50 shadow-md space-y-3 mt-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        Ürün Görsel Havuzundan Seç (Renk/Açı Eşleştir)
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveImageModalIdx(null)}
                        className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        Kapat ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {mainProductImages.map((mainImg: any, mIdx: number) => {
                        const isSelected = (v.images || []).some((vi: any) => vi.url === mainImg.url);
                        return (
                          <div
                            key={mIdx}
                            onClick={() => handleToggleImageToVariant(idx, mainImg.url)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                              isSelected
                                ? "border-pink-600 ring-2 ring-pink-500/30 scale-95"
                                : "border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img src={mainImg.url} alt="" className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-pink-600/20 flex items-center justify-center text-white">
                                <FiCheck size={16} className="drop-shadow" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
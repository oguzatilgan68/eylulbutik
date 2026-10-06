"use client";

import React from "react";

interface ProductAttributesProps {
  attributeTypes: Record<string, string[]>;
  selectedAttributes: Record<string, string>;
  setSelectedAttributes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  variants?: any[];
}

export default function ProductAttributes({
  attributeTypes,
  selectedAttributes,
  setSelectedAttributes,
  variants = [],
}: ProductAttributesProps) {
  if (!attributeTypes || Object.keys(attributeTypes).length === 0) return null;

  // Bu değer seçildiğinde veritabanında bu niteliği barındıran geçerli bir varyant var mı kontrol edelim
  const isValueValidForSelection = (currentKey: string, val: string) => {
    if (!variants || variants.length === 0) return true;

    // Mevcut seçimi bu yeni değerle simüle edelim
    const testState = { ...selectedAttributes, [currentKey]: val };

    // Veritabanındaki variants listesinde bu kombinasyonu (veya kısmi eşleşmeyi) sağlayan var mı?
    return variants.some((v) => {
      // v.attributes içinde [{key: 'Beden', value: 'L'}, {key: 'Renk', value: 'Beyaz'}] şeklinde tutuluyor
      if (!v.attributes) return false;

      const matches = Object.entries(testState).every(([k, vVal]) => {
        if (!vVal) return true; // Henüz seçilmemiş diğer alanları es geç
        return v.attributes.some((attr: any) => attr.key === k && attr.value === vVal);
      });

      const hasStock = Number(v.stockQty ?? v.stock ?? 1) > 0;
      return matches && hasStock;
    });
  };

  return (
    <div className="space-y-5">
      {Object.entries(attributeTypes).map(([key, values]) => (
        <div key={key} className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-gray-400 uppercase tracking-wider">{key}</span>
            <span className="text-pink-600 dark:text-pink-400 font-bold">
              {selectedAttributes[key] || "Seçiniz"}
            </span>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            {(values as string[]).map((val) => {
              const isSelected = selectedAttributes[key] === val;
              const isValid = isValueValidForSelection(key, val);

              return (
                <button
                  type="button"
                  key={val}
                  disabled={!isValid && variants.length > 0}
                  onClick={() => {
                    setSelectedAttributes((prev) => ({
                      ...prev,
                      [key]: val,
                    }));
                  }}
                  className={`px-5 py-2.5 rounded-2xl border text-sm font-semibold transition-all duration-200 ${
                    !isValid && variants.length > 0
                      ? "opacity-30 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 text-gray-400 line-through"
                      : isSelected
                      ? "bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-500/20 ring-2 ring-pink-500/20 cursor-pointer"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-pink-300 cursor-pointer"
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
"use client";

import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./types/types";
import { useEffect, useState } from "react";

interface Model {
  id: string;
  name: string;
  height?: number;
  weight?: number;
  chest?: number;
  waist?: number;
  hip?: number;
}

export default function StepModelInfo() {
  const { watch, setValue, register } = useFormContext<ProductFormData>();
  const [models, setModels] = useState<Model[]>([]);
  const currentModelId = watch("modelInfoId");

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("/api/admin/model-info");
        if (res.ok) {
          const data = await res.json();
          setModels(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchModels();
  }, []);

  const handleSelect = (model: Model) => {
    setValue("modelInfoId", model.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Manken Bilgileri
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Ürün çekimlerinde kullanılan mankeni ve üzerindeki bedeni seçin.
        </p>
      </div>

      {models.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <p className="text-sm text-gray-400">Kayıtlı manken bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {models.map((m) => {
            const isSelected = currentModelId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelect(m)}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? "border-pink-600 bg-pink-50/60 dark:bg-pink-950/30 shadow-md ring-2 ring-pink-500/20"
                    : "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {m.name}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>Boy: <strong className="text-gray-700 dark:text-gray-200">{m.height ?? "-"}</strong></span>
                  <span>Kilo: <strong className="text-gray-700 dark:text-gray-200">{m.weight ?? "-"}</strong></span>
                  <span>Göğüs: <strong className="text-gray-700 dark:text-gray-200">{m.chest ?? "-"}</strong></span>
                  <span>Bel: <strong className="text-gray-700 dark:text-gray-200">{m.waist ?? "-"}</strong></span>
                  <span>Kalça: <strong className="text-gray-700 dark:text-gray-200">{m.hip ?? "-"}</strong></span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Mankenin Giydiği Beden */}
      <div className="max-w-md pt-2">
        <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          Mankenin Üzerindeki Beden
        </label>
        <input
          type="text"
          {...register("modelSize")}
          placeholder="Örn: S, M, L, 36, 38..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm"
        />
      </div>
    </div>
  );
}
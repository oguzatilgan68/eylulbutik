"use client";

import { useState } from "react";
import { FiPlus, FiTrash2, FiCheck } from "react-icons/fi";

export default function AttributeForm({
  initialData,
  disabled = false,
  onSubmit,
}: {
  initialData?: { name: string; values: string[]; disabled?: boolean };
  onSubmit: (data: { name: string; values: string[] }) => void;
  disabled?: boolean;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [values, setValues] = useState(initialData?.values || [""]);

  const handleChange = (i: number, val: string) => {
    const newVals = [...values];
    newVals[i] = val;
    setValues(newVals);
  };

  const addValue = () => setValues([...values, ""]);
  const removeValue = (i: number) =>
    setValues(values.filter((_, idx) => idx !== i));

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, values: values.filter((v) => v.trim() !== "") });
      }}
      className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5 max-w-xl mx-auto"
    >
      <div>
        <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          Varyasyon Tipi Adı *
        </label>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn: Beden, Renk"
          disabled={disabled}
          required
        />
      </div>

      <div className="space-y-3">
        <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          Seçenek Değerleri
        </label>
        {values.map((v, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className={inputClass}
              value={v}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder="Örn: S, M, L veya Kırmızı"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => removeValue(i)}
              disabled={disabled}
              className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 transition-colors"
              title="Değeri Sil"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addValue}
          disabled={disabled}
          className="mt-1 inline-flex items-center gap-1 px-3.5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 text-xs font-semibold transition"
        >
          <FiPlus size={14} /> Yeni Değer Ekle
        </button>
      </div>

      {!disabled && (
        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium text-sm shadow-md shadow-pink-500/20 transition-all"
          >
            <FiCheck size={16} /> Kaydet
          </button>
        </div>
      )}
    </form>
  );
}
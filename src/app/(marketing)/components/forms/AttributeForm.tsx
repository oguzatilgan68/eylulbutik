"use client";

import { useState } from "react";

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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, values: values.filter((v) => v.trim() !== "") });
      }}
      className="space-y-4"
    >
      <div>
        <label className="block font-medium">Ad</label>
        <input
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Değerler</label>
        {values.map((v, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input
              className="border p-2 flex-1"
              value={v}
              onChange={(e) => handleChange(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeValue(i)}
              className="px-2 bg-red-500 text-white rounded"
            >
              Sil
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addValue}
          className="mt-2 px-3 py-1 bg-gray-700 text-white rounded"
        >
          + Değer Ekle
        </button>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Kaydet
      </button>
    </form>
  );
}

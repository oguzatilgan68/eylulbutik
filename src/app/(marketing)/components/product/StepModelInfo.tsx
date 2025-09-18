"use client";

import { useFormContext } from "react-hook-form";
import { ProductFormData } from "../product/types/types";
import { useEffect, useState } from "react";
import axios from "axios";

interface Model {
  id: string;
  name: string;
  height?: number;
  weight?: number;
  chest?: number;
  waist?: number;
  hip?: number;
}

interface StepModelInfoProps {
  onSelectModel: (id: string) => void;
}

export default function StepModelInfo() {
  const { watch, setValue, register } = useFormContext<ProductFormData>();
  const [models, setModels] = useState<Model[]>([]);
  const currentModelId = watch("modelInfoId");

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await axios.get("/api/admin/model-info");
        setModels(res.data);
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
    <div>
      <h2 className="mb-2 font-semibold text-lg">Manken Seçimi</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {models.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => handleSelect(m)}
            className={`p-2 border rounded text-left ${
              currentModelId === m.id
                ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            <p className="font-medium">{m.name}</p>
            <p>Boy: {m.height ?? "-"}</p>
            <p>Kilo: {m.weight ?? "-"}</p>
            <p>Göğüs: {m.chest ?? "-"}</p>
            <p>Bel: {m.waist ?? "-"}</p>
            <p>Kalça: {m.hip ?? "-"}</p>
          </button>
        ))}
      </div>

      {/* 🔹 Deneme bedeni inputu */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Mankenin Giydiği Beden
        </label>
        <input
          type="text"
          {...register("modelSize")}
          placeholder="Örn: S, M, L, 36, 38..."
          className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>
    </div>
  );
}

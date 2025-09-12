"use client";

import { useFormContext } from "react-hook-form";
import { ProductFormData } from "../product/types/types";

export default function StepModelInfo() {
  const { register } = useFormContext<ProductFormData>();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium">Boy (cm)</label>
        <input
          type="number"
          {...register("modelInfo.height", { valueAsNumber: true })}
          className="mt-1 w-full rounded border px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Kilo (kg)</label>
        <input
          type="number"
          {...register("modelInfo.weight", { valueAsNumber: true })}
          className="mt-1 w-full rounded border px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Göğüs (cm)</label>
        <input
          type="number"
          {...register("modelInfo.chest", { valueAsNumber: true })}
          className="mt-1 w-full rounded border px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Bel (cm)</label>
        <input
          type="number"
          {...register("modelInfo.waist", { valueAsNumber: true })}
          className="mt-1 w-full rounded border px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Kalça (cm)</label>
        <input
          type="number"
          {...register("modelInfo.hip", { valueAsNumber: true })}
          className="mt-1 w-full rounded border px-2 py-1"
        />
      </div>
    </div>
  );
}

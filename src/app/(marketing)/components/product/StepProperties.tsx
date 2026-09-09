"use client";

import { useFormContext } from "react-hook-form";
import { ProductFormData, PropertyType, PropertyValue } from "./types/types";

interface Props {
  propertyTypes: PropertyType[];
}

export default function StepProperties({ propertyTypes }: Props) {
  const { watch, setValue } = useFormContext<ProductFormData>();
  const properties = watch("properties") || [];

  const handleChange = (propertyTypeId: string, propertyValueId: string) => {
    const newProps = properties.filter(
      (p) => p.propertyTypeId !== propertyTypeId
    );
    if (propertyValueId) {
      const valueObj = propertyTypes
        .find((pt) => pt.id === propertyTypeId)
        ?.values.find((v) => v.id === propertyValueId);
      newProps.push({
        propertyTypeId,
        propertyValueId,
        value: valueObj?.value || "",
      });
    }
    setValue("properties", newProps);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Ürün Özellikleri (Materyal, Kumaş vb.)
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Ürünün teknik ve yapısal özelliklerini bu alandan seçebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {propertyTypes.map((pt) => {
          const current =
            properties.find((p: any) => p.propertyTypeId === pt.id)
              ?.propertyValueId || "";

          return (
            <div key={pt.id} className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                {pt.name}
              </label>
              <select
                value={current}
                onChange={(e) => handleChange(pt.id, e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm"
              >
                <option value="">-- Seçiniz --</option>
                {pt.values.map((v: PropertyValue) => (
                  <option key={v.id} value={v.id}>
                    {v.value}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
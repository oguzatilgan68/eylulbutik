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
      }); // artık propertyValueId kaydediyoruz
    }
    setValue("properties", newProps);
  };

  return (
    <div className="p-4 border rounded dark:bg-gray-900 space-y-4">
      {propertyTypes.map((pt) => {
        const current =
          properties.find((p: any) => p.propertyTypeId === pt.id)
            ?.propertyValueId || "";

        return (
          <div key={pt.id} className="flex flex-col">
            <label className="text-sm font-medium mb-1">{pt.name}</label>
            <select
              value={current}
              onChange={(e) => handleChange(pt.id, e.target.value)}
              className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
  );
}

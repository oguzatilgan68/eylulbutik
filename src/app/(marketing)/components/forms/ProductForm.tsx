"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  AttributeType,
  ProductFormData,
  PropertyType,
} from "../product/types/types";
import StepImages from "../product/StepImages";
import StepProperties from "../product/StepProperties";
import StepVariants from "../product/StepVariants";
import StepBasicInfo from "../product/StepBasicInfo";
import StepModelInfo from "../product/StepModelInfo";

interface Props {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  attributeTypes: AttributeType[];
  propertyTypes: PropertyType[];
  initialData: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>; // Upload fonksiyonu
}

export default function StepProductForm({
  categories,
  brands,
  attributeTypes,
  propertyTypes,
  initialData,
  onSubmit,
  uploadImage,
}: Props) {
  const methods = useForm<ProductFormData>({ defaultValues: initialData });
  const [step, setStep] = useState(0);

  const steps = [
    "Temel Bilgiler",
    "Görseller",
    "Özellikler",
    "Varyantlar",
    "Model Bilgileri",
  ];
  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const goToStep = (index: number) => setStep(index);

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step Indicator */}
        <div className="flex justify-between mb-4 gap-2">
          {steps.map((label, idx) => (
            <div
              key={idx}
              onClick={() => goToStep(idx)}
              className={`
                cursor-pointer
                text-sm font-medium px-3 py-1 rounded text-center flex-1
                transition-colors duration-200
                ${
                  step === idx
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }
              `}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Step Components */}
        <div className="min-h-[300px]">
          {step === 0 && (
            <StepBasicInfo categories={categories} brands={brands} />
          )}
          {step === 1 && <StepImages uploadImage={uploadImage} />}
          {step === 2 && <StepProperties propertyTypes={propertyTypes} />}
          {step === 3 && (
            <StepVariants
              attributeTypes={attributeTypes}
              uploadImage={uploadImage}
            />
          )}
          {step === 4 && (
            <StepModelInfo
              key={step}
              onSelectModel={(id) => {
                methods.setValue("modelSelection.modelInfoId", id);
              }}
            />
          )}
        </div>

        {/* Step Buttons */}
        <div className="flex justify-between mt-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400"
            >
              Geri
            </button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-900"
            >
              İleri
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-800"
            >
              Kaydet
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

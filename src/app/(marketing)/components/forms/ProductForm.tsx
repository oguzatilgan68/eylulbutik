"use client";

import { useState } from "react";
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
import Swal from "sweetalert2";

interface Props {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  attributeTypes: AttributeType[];
  propertyTypes: PropertyType[];
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
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
  const [loading, setLoading] = useState(false);

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
    try {
      setLoading(true);
      await onSubmit(data);
      Swal.fire({
        icon: "success",
        title: "Ürün başarıyla kaydedildi!",
        toast: true,
        timer: 1500,
        showConfirmButton: false,
        position: "top-end",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Kayıt sırasında bir hata oluştu!",
        toast: true,
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
        
        {/* Başlık / Adım İndikatörü */}
        <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {steps[step]} <span className="text-sm font-normal text-gray-400 ml-2">({step + 1} / {steps.length})</span>
            </h2>
          </div>

          {/* Stepper Çubuğu */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {steps.map((label, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToStep(idx)}
                className={`text-xs sm:text-sm font-medium px-3 py-2.5 rounded-xl text-center transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  step === idx
                    ? "bg-pink-600 text-white shadow-md shadow-pink-500/20 scale-[1.02]"
                    : step > idx
                    ? "bg-pink-50 dark:bg-gray-800 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-gray-700"
                    : "bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Bileşenleri İçerik Alanı */}
        <div className="min-h-[350px] transition-all">
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
          {step === 4 && <StepModelInfo />}
        </div>

        {/* Alt Navigasyon Butonları */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
          {step > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50"
            >
              ← Geri
            </button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-pink-600 text-white hover:bg-pink-700 shadow-md shadow-pink-500/20 transition-all font-medium text-sm disabled:opacity-50 ml-auto"
            >
              İleri →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all font-medium text-sm disabled:opacity-50 ml-auto flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                "Ürünü Kaydet ✓"
              )}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
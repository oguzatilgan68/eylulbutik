"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addressSchema } from "@/app/(marketing)/lib/validations/address";
import { useUser } from "../../context/userContext";
import { FiCheck, FiMapPin } from "react-icons/fi";

type AddressFormValues = z.infer<typeof addressSchema>;

type AddressFormProps = {
  defaultValues?: AddressFormValues;
  onSuccess?: () => void;
};

type City = {
  value: number;
  text: string;
  districts: { value: number; text: string }[];
};

export default function AddressForm({
  defaultValues,
  onSuccess,
}: AddressFormProps) {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<{ value: number; text: string }[]>(
    []
  );

  const selectedCity = watch("city");

  // JSON'dan illeri yükle
  useEffect(() => {
    fetch("/data/cities.json")
      .then((res) => res.json())
      .then((data: City[]) => setCities(data))
      .catch(console.error);
  }, []);

  // Şehir seçildiğinde ilçeleri ayarla
  useEffect(() => {
    if (selectedCity) {
      const cityObj = cities.find((c) => c.value.toString() === selectedCity);
      if (cityObj) {
        setDistricts(cityObj.districts);
        if (defaultValues?.district) {
          const dist = cityObj.districts.find(
            (d) => d.text === defaultValues.district
          );
          setValue("district", dist ? dist.value.toString() : "");
        } else {
          setValue("district", "");
        }
      } else {
        setDistricts([]);
        setValue("district", "");
      }
    } else {
      setDistricts([]);
      setValue("district", "");
    }
  }, [selectedCity, cities, setValue, defaultValues]);

  // Default city varsa set et
  useEffect(() => {
    if (defaultValues?.city && cities.length > 0) {
      const cityObj = cities.find((c) => c.text === defaultValues.city);
      if (cityObj) {
        setValue("city", cityObj.value.toString());
      }
    }
    if (defaultValues?.neighbourhood) {
      setValue("neighbourhood", defaultValues.neighbourhood);
    }
  }, [defaultValues, cities, setValue]);

  const onSubmit = async (data: AddressFormValues) => {
    if (!user) return alert("Giriş yapmalısınız");

    const cityObj = cities.find((c) => c.value.toString() === data.city);
    const districtObj = districts.find(
      (d) => d.value.toString() === data.district
    );

    try {
      const res = await fetch(
        defaultValues ? `/api/address/${defaultValues.id}` : "/api/address",
        {
          method: defaultValues ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            userId: user.id,
            city: cityObj?.text || "",
            district: districtObj?.text || "",
          }),
        }
      );

      if (!res.ok) throw new Error("İşlem başarısız");

      alert(defaultValues ? "Adres güncellendi ✅" : "Adres eklendi ✅");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Hata oluştu ❌");
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";
  const selectClass = inputClass;
  const textareaClass = `${inputClass} min-h-[100px] resize-y`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto space-y-4 p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
    >
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiMapPin className="text-pink-600" /> {defaultValues ? "Adresi Düzenle" : "Yeni Adres Ekle"}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Teslimat bilgilerini eksiksiz olarak doldurun.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          Adres Başlığı *
        </label>
        <input
          {...register("title")}
          placeholder="Örn: Evim, Ofis"
          className={inputClass}
        />
        {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Ad Soyad *
          </label>
          <input
            {...register("fullName")}
            placeholder="Adınız Soyadınız"
            className={inputClass}
          />
          {errors.fullName && <p className="text-rose-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Telefon Numarası *
          </label>
          <input
            {...register("phone")}
            placeholder="5XXXXXXXXX"
            className={inputClass}
          />
          {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* İl Seçimi */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            İl *
          </label>
          <select {...register("city")} className={selectClass}>
            <option value="">İl Seçiniz</option>
            {cities.map((c) => (
              <option key={c.value} value={c.value}>
                {c.text}
              </option>
            ))}
          </select>
          {errors.city && <p className="text-rose-500 text-xs mt-1">{errors.city.message}</p>}
        </div>

        {/* İlçe Seçimi */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            İlçe *
          </label>
          <select {...register("district")} className={selectClass} disabled={districts.length === 0}>
            <option value="">İlçe Seçiniz</option>
            {districts.map((d) => (
              <option key={d.value} value={d.value}>
                {d.text}
              </option>
            ))}
          </select>
          {errors.district && <p className="text-rose-500 text-xs mt-1">{errors.district.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mahalle Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Mahalle *
          </label>
          <input
            {...register("neighbourhood")}
            placeholder="Mahalle adı"
            className={inputClass}
          />
          {errors.neighbourhood && <p className="text-rose-500 text-xs mt-1">{errors.neighbourhood.message}</p>}
        </div>

        {/* Posta Kodu */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Posta Kodu
          </label>
          <input
            {...register("zip")}
            placeholder="Posta Kodu (Opsiyonel)"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          Açık Adres Detayı *
        </label>
        <textarea
          {...register("address1")}
          placeholder="Cadde, Sokak, Bina No, Daire No"
          className={textareaClass}
        />
        {errors.address1 && <p className="text-rose-500 text-xs mt-1">{errors.address1.message}</p>}
      </div>

      <div className="pt-2">
        <label className="flex items-center space-x-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3.5 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:border-pink-500 transition-all">
          <input
            type="checkbox"
            {...register("isDefault")}
            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Varsayılan teslimat adresi olarak ayarla
          </span>
        </label>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <FiCheck size={16} />
          {isSubmitting
            ? "Kaydediliyor..."
            : defaultValues
            ? "Adresi Güncelle"
            : "Adresi Kaydet"}
        </button>
      </div>
    </form>
  );
}
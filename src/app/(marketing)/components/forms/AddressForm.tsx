"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getCities,
  getDistrictsByCityCode,
  getNeighbourhoodsByCityCodeAndDistrict,
} from "turkey-neighbourhoods";
import { z } from "zod";
import { addressSchema } from "@/app/(marketing)/lib/validations/address";
import { useUser } from "../../context/userContext";

type AddressFormValues = z.infer<typeof addressSchema>;

type AddressFormProps = {
  defaultValues?: AddressFormValues;
  onSuccess?: () => void;
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

  const [cities, setCities] = useState<{ code: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [neighbourhoods, setNeighbourhoods] = useState<string[]>([]);

  const selectedCity = watch("city");
  const selectedDistrict = watch("district");

  useEffect(() => {
    setCities(getCities());
  }, []);

  useEffect(() => {
    if (selectedCity) {
      setDistricts(getDistrictsByCityCode(selectedCity));
      setValue("district", "");
      setValue("neighbourhood", "");
      setNeighbourhoods([]);
    }
  }, [selectedCity, setValue]);

  useEffect(() => {
    if (selectedCity && selectedDistrict) {
      setNeighbourhoods(
        getNeighbourhoodsByCityCodeAndDistrict(selectedCity, selectedDistrict)
      );
      setValue("neighbourhood", "");
    }
  }, [selectedDistrict, selectedCity, setValue]);

  const onSubmit = async (data: AddressFormValues) => {
    if (!user) return alert("Giriş yapmalısınız");

    try {
      const res = await fetch(
        defaultValues ? `/api/address?id=${defaultValues.id}` : "/api/address",
        {
          method: defaultValues ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, userId: user.id }),
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

  // Ortak class isimleri
  const baseInput =
    "w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-pink-500";
  const inputClass = `${baseInput} border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100`;
  const selectClass = inputClass;
  const textareaClass = `${inputClass} min-h-[80px]`;
  const buttonClass =
    "w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition disabled:opacity-50";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {defaultValues ? "Adres Düzenle" : "Adres Ekle"}
      </h2>

      <input
        {...register("title")}
        placeholder="Adres Başlığı (Ev, İş...)"
        className={inputClass}
      />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <input
        {...register("fullName")}
        placeholder="Ad Soyad"
        className={inputClass}
      />
      {errors.fullName && (
        <p className="text-red-500">{errors.fullName.message}</p>
      )}

      <input
        {...register("phone")}
        placeholder="Telefon"
        className={inputClass}
      />
      {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
      {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

      {/* İl Seçimi */}
      <select {...register("city")} className={selectClass}>
        <option value="">İl Seçiniz</option>
        {cities.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
      {errors.city && <p className="text-red-500">{errors.city.message}</p>}

      {/* İlçe Seçimi */}
      {districts.length > 0 && (
        <select {...register("district")} className={selectClass}>
          <option value="">İlçe Seçiniz</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      )}
      {errors.district && (
        <p className="text-red-500">{errors.district.message}</p>
      )}

      {/* Mahalle Seçimi */}
      {neighbourhoods.length > 0 && (
        <select {...register("neighbourhood")} className={selectClass}>
          <option value="">Mahalle Seçiniz</option>
          {neighbourhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      )}
      {errors.neighbourhood && (
        <p className="text-red-500">{errors.neighbourhood.message}</p>
      )}

      <textarea
        {...register("address1")}
        placeholder="Adres Detayı (Cadde, Sokak, No, Daire)"
        className={textareaClass}
      />
      {errors.address1 && (
        <p className="text-red-500">{errors.address1.message}</p>
      )}

      <input
        {...register("zip")}
        placeholder="Posta Kodu (Opsiyonel)"
        className={inputClass}
      />

      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <input type="checkbox" {...register("isDefault")} />
        Varsayılan adres olarak ayarla
      </label>

      <button type="submit" disabled={isSubmitting} className={buttonClass}>
        {isSubmitting
          ? "Kaydediliyor..."
          : defaultValues
          ? "Güncelle"
          : "Kaydet"}
      </button>
    </form>
  );
}

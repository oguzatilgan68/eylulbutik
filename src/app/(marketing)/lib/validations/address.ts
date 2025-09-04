import { z } from "zod";

export const addressSchema = z.object({
  title: z.string().min(2, "Başlık en az 2 karakter olmalı"),
  fullName: z.string().min(3, "Ad Soyad en az 3 karakter olmalı"),
  phone: z
    .string()
    .min(10, "Geçerli bir telefon girin")
    .max(10, "Geçerli bir telefon girin"),
  city: z.string().nonempty("Şehir seçiniz"),
  district: z.string().nonempty("İlçe seçiniz"),
  neighbourhood: z.string().nonempty("Mahalle seçiniz"),
  address1: z.string().min(5, "Adres en az 5 karakter olmalı"),
  zip: z.string().optional(),
  isDefault: z.boolean().optional(),
});

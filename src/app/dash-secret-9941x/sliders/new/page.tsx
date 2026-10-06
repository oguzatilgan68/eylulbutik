"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { supabase } from "@/app/(marketing)/lib/supabase/supabaseClient";
import { ProductMultiSelect } from "@/app/(marketing)/components/admin/ProductMultiSelect";
import { FiArrowLeft, FiCheck, FiUploadCloud } from "react-icons/fi";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
};

type SliderFormData = {
  title?: string;
  subtitle?: string;
  link?: string;
  type: "PROMOTION" | "PRODUCT" | "CATEGORY";
  productIds?: string[];
  order?: number;
  isActive?: boolean;
  imageUrl?: string;
};

export default function NewSliderPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<SliderFormData>({
    defaultValues: { type: "PROMOTION", isActive: true, productIds: [] },
  });

  const selectedType = watch("type");
  const selectedProducts = watch("productIds");

  // Ürünleri yükle
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const params = new URLSearchParams();
        params.set("limit", "100");
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error("Ürünler alınamadı");
        const data = await res.json();
        setProducts(data.products || data);
      } catch {
        toast.error("Ürünler yüklenirken hata oluştu ❌");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Görsel yükleme
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `sliders/${fileName}`;
      const { error } = await supabase.storage
        .from("sliders")
        .upload(filePath, file);
      if (error) throw error;
      const { data } = supabase.storage.from("sliders").getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      setFilePath(filePath);
      toast.success("Görsel yüklendi ✅");
    } catch {
      toast.error("Görsel yüklenirken hata oluştu ❌");
    } finally {
      setUploading(false);
    }
  };

  // Görsel silme
  const handleDeleteImage = async () => {
    if (!filePath) return;
    const { error } = await supabase.storage.from("sliders").remove([filePath]);
    if (error) {
      toast.error("Görsel silinirken hata oluştu ❌");
    } else {
      setImageUrl(null);
      setFilePath(null);
      toast.success("Görsel silindi 🗑️");
    }
  };

  // Slider kaydetme
  const onSubmit = async (data: SliderFormData) => {
    if (!imageUrl) {
      toast.error("Lütfen bir görsel yükleyin");
      return;
    }

    try {
      const response = await fetch("/api/admin/sliders", {
        method: "POST",
        body: JSON.stringify({ ...data, imageUrl }),
      });

      if (!response.ok) throw new Error("Sunucu hatası");
      toast.success("Slider başarıyla eklendi 🎉");
      router.push("/admin/sliders");
    } catch {
      toast.error("Slider eklenirken hata oluştu ❌");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Üst Başlık & Geri Dön */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <Link
          href="/admin/sliders"
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
        >
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Yeni Slider Ekle
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Anasayfada gösterilecek kampanya veya ürün görselini tanımlayın.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5"
      >
        {/* Görsel yükleme */}
        <div>
          <Label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Slider Görseli *
          </Label>
          {imageUrl ? (
            <div className="relative mt-2">
              <Image
                src={imageUrl}
                alt="Slider image"
                width={600}
                height={300}
                className="rounded-xl border dark:border-gray-700 object-cover w-full h-48 shadow-sm"
              />
              <Button
                type="button"
                onClick={handleDeleteImage}
                variant="destructive"
                className="absolute top-2 right-2 text-xs rounded-xl"
              >
                Görseli Sil
              </Button>
            </div>
          ) : (
            <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 rounded-2xl bg-gray-50/50 dark:bg-gray-800/40 hover:border-pink-500 transition-all group">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
                id="sliderImage"
              />
              <Label
                htmlFor="sliderImage"
                className="cursor-pointer flex flex-col items-center gap-2 text-sm text-gray-600 dark:text-gray-300 group-hover:text-pink-600 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-pink-600">
                  <FiUploadCloud size={20} />
                </div>
                <span>{uploading ? "Yükleniyor..." : "Görsel yüklemek için tıklayın"}</span>
              </Label>
            </div>
          )}
        </div>

        <div>
          <Label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Başlık
          </Label>
          <Input
            {...register("title")}
            placeholder="Kampanya başlığı"
            className="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div>
          <Label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Alt Başlık
          </Label>
          <Input
            {...register("subtitle")}
            placeholder="Kısa açıklama"
            className="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div>
          <Label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Bağlantı (URL)
          </Label>
          <Input
            {...register("link")}
            placeholder="/urunler"
            className="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div>
          <Label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Slider Tipi
          </Label>
          <Select
            defaultValue="PROMOTION"
            onValueChange={(value) => setValue("type", value as any)}
          >
            <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <SelectValue placeholder="Tip seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PROMOTION">Tanıtım</SelectItem>
              <SelectItem value="PRODUCT">Ürün</SelectItem>
              <SelectItem value="CATEGORY">Kategori</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Çoklu ürün seçimi */}
        {selectedType === "PRODUCT" && (
          <div>
            <Label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Ürünleri Seç
            </Label>
            <ProductMultiSelect
              products={products}
              value={selectedProducts || []}
              onChange={(newValue) => setValue("productIds", newValue)}
            />
          </div>
        )}

        <div>
          <Label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Sıralama
          </Label>
          <Input
            type="number"
            {...register("order", { valueAsNumber: true })}
            placeholder="0"
            className="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer"
          >
            <FiCheck size={16} /> Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
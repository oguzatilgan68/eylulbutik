"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { supabase } from "@/app/(marketing)/lib/supabase/supabaseClient";
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
import { ProductMultiSelect } from "@/app/(marketing)/components/admin/ProductMultiSelect";
import { FiSliders, FiArrowLeft, FiUploadCloud, FiTrash2, FiSave, FiLink, FiType, FiLayers, FiList } from "react-icons/fi";

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

export default function EditSliderPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<SliderFormData>({
      defaultValues: { type: "PROMOTION", isActive: true, productIds: [] },
    });

  const selectedType = watch("type");
  const selectedProducts = watch("productIds");

  // 🎯 Slider verisini getir
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const res = await fetch(`/api/admin/sliders/${params.id}`);
        if (!res.ok) throw new Error("Slider alınamadı");
        const data = await res.json();

        reset({
          title: data.title,
          subtitle: data.subtitle,
          link: data.link,
          type: data.type,
          productIds: data.products?.map((p: any) => p.id) || [],
          order: data.order,
          isActive: data.isActive,
          imageUrl: data.imageUrl,
        });

        setImageUrl(data.imageUrl);
        setLoading(false);
      } catch {
        toast.error("Slider bilgisi yüklenemedi ❌");
      }
    };
    fetchSlider();
  }, [params.id, reset]);

  // 🛒 Ürünleri getir
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch(`/api/products?limit=100`);
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

  // 📤 Görsel yükleme
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

  // 🗑 Görsel silme
  const handleDeleteImage = async () => {
    if (!filePath && !imageUrl) return;
    try {
      if (filePath) {
        await supabase.storage.from("sliders").remove([filePath]);
      }
      setImageUrl(null);
      setFilePath(null);
      toast.success("Görsel silindi 🗑️");
    } catch {
      toast.error("Görsel silinirken hata oluştu ❌");
    }
  };

  // 💾 Güncelleme
  const onSubmit = async (data: SliderFormData) => {
    if (!imageUrl) {
      toast.error("Lütfen bir görsel yükleyin");
      return;
    }

    try {
      const response = await fetch(`/api/admin/sliders/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...data, imageUrl }),
      });

      if (!response.ok) throw new Error("Sunucu hatası");
      toast.success("Slider başarıyla güncellendi 🎉");
      router.push("/admin/sliders");
    } catch {
      toast.error("Slider güncellenirken hata oluştu ❌");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400 text-sm">
        <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mr-2" />
        <span>Slider yükleniyor...</span>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Üst Geri Dön Navigasyonu */}
      <div className="mb-6">
        <Link
          href="/admin/sliders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
        >
          <FiArrowLeft size={14} /> Slider Listesine Dön
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
        
        {/* Başlık ve İkon */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="p-3 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-2xl shadow-inner">
            <FiSliders size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Slider Düzenle
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Ana sayfa slider alanını, görsellerini ve yönlendirmelerini güncelleyin.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Görsel Alanı */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Slider Görseli
            </Label>
            {imageUrl ? (
              <div className="relative mt-2 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 group">
                <Image
                  src={imageUrl}
                  alt="Slider image"
                  width={800}
                  height={400}
                  className="object-cover w-full h-56 sm:h-64 transition-transform duration-500 group-hover:scale-102"
                />
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-medium shadow-md hover:bg-rose-700 transition cursor-pointer"
                >
                  <FiTrash2 size={14} /> Görseli Sil
                </button>
              </div>
            ) : (
              <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/40 transition-colors group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                  id="sliderImage"
                />
                <label
                  htmlFor="sliderImage"
                  className="flex flex-col items-center cursor-pointer space-y-2"
                >
                  <div className="p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                    <FiUploadCloud size={24} />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {uploading ? "Yükleniyor..." : "Görsel yüklemek için tıklayın"}
                  </span>
                  <span className="text-xs text-gray-400">PNG, JPG, WEBP (Önerilen: 1920x800px)</span>
                </label>
              </div>
            )}
          </div>

          {/* Grid Alanı: Başlık ve Alt Başlık */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <FiType size={14} className="text-pink-600" /> Başlık
              </Label>
              <Input {...register("title")} placeholder="Örn: Yeni Sezon İndirimi" className="rounded-2xl dark:bg-gray-800 py-3" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <FiLayers size={14} className="text-pink-600" /> Alt Başlık
              </Label>
              <Input {...register("subtitle")} placeholder="Örn: %50'ye varan fırsatlar" className="rounded-2xl dark:bg-gray-800 py-3" />
            </div>
          </div>

          {/* Grid Alanı: Bağlantı ve Sıralama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <FiLink size={14} className="text-pink-600" /> Bağlantı (URL)
              </Label>
              <Input {...register("link")} placeholder="Örn: /products/yeni-sezon" className="rounded-2xl dark:bg-gray-800 py-3" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <FiList size={14} className="text-pink-600" /> Sıralama
              </Label>
              <Input
                type="number"
                {...register("order", { valueAsNumber: true })}
                placeholder="0"
                className="rounded-2xl dark:bg-gray-800 py-3"
              />
            </div>
          </div>

          {/* Slider Tipi */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Slider Tipi
            </Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue("type", value as any)}
            >
              <SelectTrigger className="rounded-2xl dark:bg-gray-800 py-3">
                <SelectValue placeholder="Tip seçin" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="PROMOTION">Tanıtım</SelectItem>
                <SelectItem value="PRODUCT">Ürün</SelectItem>
                <SelectItem value="CATEGORY">Kategori</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Çoklu Ürün Seçimi */}
          {selectedType === "PRODUCT" && (
            <div className="space-y-1.5 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-2">
                Slider'da Gösterilecek Ürünler
              </Label>
              <ProductMultiSelect
                products={products}
                value={selectedProducts || []}
                onChange={(newValue) => setValue("productIds", newValue)}
              />
            </div>
          )}

          {/* Kaydet Butonu */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <Button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer"
            >
              <FiSave size={16} /> Değişiklikleri Kaydet
            </Button>
          </div>

        </form>
      </div>
    </main>
  );
}
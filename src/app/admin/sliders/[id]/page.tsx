"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
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
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-300">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-900 shadow-md rounded-2xl mt-8">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Slider Düzenle
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Görsel */}
        <div>
          <Label className="dark:text-gray-200">Slider Görseli</Label>
          {imageUrl ? (
            <div className="relative mt-3">
              <Image
                src={imageUrl}
                alt="Slider image"
                width={600}
                height={300}
                className="rounded-xl border dark:border-gray-700 object-cover w-full h-48"
              />
              <Button
                type="button"
                onClick={handleDeleteImage}
                variant="destructive"
                className="absolute top-2 right-2 text-xs"
              >
                Görseli Sil
              </Button>
            </div>
          ) : (
            <div className="mt-3 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 rounded-xl">
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
                className="cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:underline"
              >
                {uploading ? "Yükleniyor..." : "Görsel yükle"}
              </Label>
            </div>
          )}
        </div>

        {/* Başlıklar */}
        <div>
          <Label className="dark:text-gray-200">Başlık</Label>
          <Input {...register("title")} className="dark:bg-gray-800" />
        </div>

        <div>
          <Label className="dark:text-gray-200">Alt Başlık</Label>
          <Input {...register("subtitle")} className="dark:bg-gray-800" />
        </div>

        <div>
          <Label className="dark:text-gray-200">Bağlantı (URL)</Label>
          <Input {...register("link")} className="dark:bg-gray-800" />
        </div>

        {/* Tip */}
        <div>
          <Label className="dark:text-gray-200">Slider Tipi</Label>
          <Select
            value={selectedType}
            onValueChange={(value) => setValue("type", value as any)}
          >
            <SelectTrigger className="dark:bg-gray-800">
              <SelectValue />
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
            <Label className="dark:text-gray-200">Ürünleri Seç</Label>
            <ProductMultiSelect
              products={products}
              value={selectedProducts || []}
              onChange={(newValue) => setValue("productIds", newValue)}
            />
          </div>
        )}

        <div>
          <Label className="dark:text-gray-200">Sıralama</Label>
          <Input
            type="number"
            {...register("order", { valueAsNumber: true })}
            className="dark:bg-gray-800"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="mt-4">
            Güncelle
          </Button>
        </div>
      </form>
    </div>
  );
}

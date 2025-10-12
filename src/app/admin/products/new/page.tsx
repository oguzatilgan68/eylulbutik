"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/app/(marketing)/lib/supabase/supabaseClient";
import ProductForm from "@/app/(marketing)/components/forms/ProductForm";
import { ProductFormData } from "@/app/(marketing)/components/product/types/types";

export default function NewProductPageClient({
  categories,
  brands,
  attributeTypes,
  propertyTypes,
}: any) {
  const router = useRouter();

  const initialData: ProductFormData = {
    name: "",
    price: "",
    sku: "",
    description: "",
    categoryId:
      Array.isArray(categories) && categories.length > 0
        ? categories[0].id
        : "",
    brandId: Array.isArray(brands) && brands.length > 0 ? brands[0].id : "",
    images: [],
    status: "PUBLISHED",
    inStock: true,
    variants: [],
  };

  // 🔹 Görsel yükleme fonksiyonu
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `products/${fileName}`;
    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, file);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Yükleme Hatası",
        text: "Görsel yüklenemedi. Lütfen tekrar deneyin.",
      });
      return null;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  };

  // 🔹 API'ye istek atma
  const handleSubmit = async (data: ProductFormData) => {
    try {
      const res = await fetch("/api/admin/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Ürün başarıyla eklendi.",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/admin/products");
      } else {
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: result.error || "Ürün kaydedilirken bir hata oluştu.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Sunucu Hatası",
        text: "Bir hata meydana geldi. Lütfen tekrar deneyin.",
      });
    }
  };

  return (
    <ProductForm
      categories={categories}
      brands={brands}
      attributeTypes={attributeTypes}
      propertyTypes={propertyTypes}
      uploadImage={uploadImage}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
}

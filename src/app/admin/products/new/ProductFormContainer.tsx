"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/app/(marketing)/lib/supabase/supabaseClient";
import ProductForm from "@/app/(marketing)/components/forms/ProductForm";
import { ProductFormData } from "@/app/(marketing)/components/product/types/types";

interface Props {
  categories: any[];
  brands: any[];
  attributeTypes: any[];
  propertyTypes: any[];
  initialData: ProductFormData;
}

export default function ProductFormContainer({
  categories,
  brands,
  attributeTypes,
  propertyTypes,
  initialData,
}: Props) {
  const router = useRouter();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        console.error("API Error:", result);
        throw new Error(result.error || "Ürün oluşturulamadı");
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Ürün kaydı hatası:", error);
      alert("Ürün oluşturulurken hata oluştu.");
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, file);
    if (error) {
      console.error("Supabase upload error:", error);
      alert("Görsel yüklenemedi");
      return null;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <ProductForm
      categories={categories}
      brands={brands}
      attributeTypes={attributeTypes}
      propertyTypes={propertyTypes}
      initialData={initialData}
      onSubmit={handleSubmit}
      uploadImage={uploadImage}
    />
  );
}

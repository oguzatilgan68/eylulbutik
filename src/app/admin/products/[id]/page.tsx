"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/app/(marketing)/lib/supabase/supabaseClient";
import ProductForm from "@/app/(marketing)/components/forms/ProductForm";
import {
  ProductFormData,
  PropertyType,
} from "@/app/(marketing)/components/product/types/types";
import { AttributeType, Brand, Category } from "@/generated/prisma";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [initialData, setInitialData] = useState<ProductFormData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [attributeTypes, setAttributeTypes] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);

  // 🔹 Veri yükleme
  useEffect(() => {
    async function loadData() {
      const [productRes, categoryRes, brandRes, attrRes, propRes] =
        await Promise.all([
          fetch(`/api/admin/products/${params.id}`),
          fetch(`/api/categories`),
          fetch(`/api/brands`),
          fetch(`/api/attribute-types`),
          fetch(`/api/property-types`),
        ]);

      const [product, categories, brands, attributeTypes, rawPropertyValues] =
        await Promise.all([
          productRes.json(),
          categoryRes.json(),
          brandRes.json(),
          attrRes.json(),
          propRes.json(),
        ]);

      // property types grupla
      const propertyMap: Record<string, PropertyType> = {};
      rawPropertyValues.forEach((pv: any) => {
        if (!propertyMap[pv.propertyType.id]) {
          propertyMap[pv.propertyType.id] = {
            id: pv.propertyType.id,
            name: pv.propertyType.name,
            values: [],
          };
        }
        propertyMap[pv.propertyType.id].values.push({
          id: pv.id,
          value: pv.value,
        });
      });

      setPropertyTypes(Object.values(propertyMap));
      setCategories(categories);
      setBrands(brands);
      // Ensure attributeTypes includes 'values' property
      setAttributeTypes(
        attributeTypes.map((attr: any) => ({
          id: attr.id,
          name: attr.name,
        }))
      );
      setInitialData(product);
    }

    loadData();
  }, [params.id]);

  // 🔹 Ürün güncelleme
  const handleSubmit = async (data: ProductFormData) => {
    try {
      const res = await fetch(`/api/admin/product/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Ürün başarıyla güncellendi!",
          showConfirmButton: false,
          timer: 1800,
        });
        router.push("/admin/products");
      } else {
        const err = await res.json();
        Swal.fire({
          icon: "error",
          title: "Bir hata oluştu",
          text: err.error || "Ürün güncellenemedi. Lütfen tekrar deneyin.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Sunucu hatası",
        text: "Güncelleme işlemi sırasında bir hata oluştu.",
      });
    }
  };

  // 🔹 Supabase upload
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
        title: "Görsel yüklenemedi",
        text: error.message,
      });
      return null;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  };

  if (!initialData) return <div className="p-6">Yükleniyor...</div>;

  return (
    <ProductForm
      categories={categories}
      attributeTypes={attributeTypes}
      brands={brands}
      uploadImage={uploadImage}
      propertyTypes={propertyTypes}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
}

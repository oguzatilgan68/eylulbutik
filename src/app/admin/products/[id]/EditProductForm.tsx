"use client";

import { useState } from "react";
import ProductForm from "@/app/(marketing)/components/forms/ProductForm";
import Swal from "sweetalert2";
import { uploadImage } from "@/app/(marketing)/lib/supabase/upload";

type EditProductFormProps = {
  initialData: any;
  categories: any;
  brands: any;
  attributeTypes: any;
  propertyTypes: any;
};

export default function EditProductForm({
  initialData,
  categories,
  brands,
  attributeTypes,
  propertyTypes,
}: EditProductFormProps) {
  const [product, setProduct] = useState(initialData);

  const handleUpdate = async (data: any) => {
    try {
      const res = await fetch(`/api/admin/products/${initialData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Güncelleme başarısız");

      Swal.fire({
        icon: "success",
        title: "Güncellendi!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Hata", text: err.message });
    }
  };

  return (
    <ProductForm
      categories={categories}
      brands={brands}
      attributeTypes={attributeTypes}
      propertyTypes={propertyTypes}
      initialData={product}
      onSubmit={handleUpdate}
      uploadImage={uploadImage}
    />
  );
}

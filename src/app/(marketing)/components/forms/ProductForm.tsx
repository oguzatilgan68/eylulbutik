"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/TextArea";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().optional(),
  price: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  brandId: z.string().optional(),
  images: z
    .array(
      z.object({
        file: z.any(),
        url: z.string().optional(),
        alt: z.string().optional(),
      })
    )
    .optional(),
  variants: z
    .array(
      z.object({
        attributes: z.record(z.string(), z.string()), // {COLOR: "Kırmızı", SIZE: "M"}
        price: z.string(),
        stockQty: z.number(),
        images: z.array(
          z.object({
            file: z.any(),
            url: z.string().optional(),
            alt: z.string().optional(),
          })
        ),
      })
    )
    .optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: { id: string; name: string }[];
  brands?: { id: string; name: string }[];
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  brands,
  initialData,
  onSubmit,
}) => {
  const [images, setImages] = useState(initialData?.images || []);
  const [variants, setVariants] = useState(initialData?.variants || []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  const handleAddImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setImages([...images, { file, url, alt: "" }]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { attributes: {}, price: "", stockQty: 0, images: [] },
    ]);
  };

  const handleVariantChange = (
    index: number,
    field: keyof (typeof variants)[0],
    value: any
  ) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleVariantImage = (variantIndex: number, file: File) => {
    const url = URL.createObjectURL(file);
    const updated = [...variants];
    updated[variantIndex].images.push({ file, url, alt: "" });
    setVariants(updated);
  };

  const handleRemoveVariantImage = (variantIndex: number, imgIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].images.splice(imgIndex, 1);
    setVariants(updated);
  };

  const submitHandler = (data: ProductFormData) => {
    onSubmit({ ...data, images, variants });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* Ürün Adı */}
      <div>
        <label className="block mb-1 font-medium">Ürün Adı</label>
        <Input
          {...register("name")}
          className="dark:bg-gray-700 dark:text-white"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Kategori */}
      <div>
        <label className="block mb-1 font-medium">Kategori</label>
        <select
          {...register("categoryId")}
          className="dark:bg-gray-700 dark:text-white"
        >
          <option value="">Seçiniz</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Marka */}
      {brands && (
        <div>
          <label className="block mb-1 font-medium">Marka</label>
          <select
            {...register("brandId")}
            className="dark:bg-gray-700 dark:text-white"
          >
            <option value="">Seçiniz</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Fiyat */}
      <div>
        <label className="block mb-1 font-medium">Fiyat</label>
        <Input
          type="number"
          step="0.01"
          {...register("price")}
          className="dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Açıklama */}
      <div>
        <label className="block mb-1 font-medium">Açıklama</label>
        <Textarea
          {...register("description")}
          className="dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Genel Görseller */}
      <div>
        <label className="block mb-1 font-medium">Görseller</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (!e.target.files) return;
            Array.from(e.target.files).forEach((file) => handleAddImage(file));
          }}
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img src={img.url} className="w-32 h-32 object-cover rounded" />
              <Button
                type="button"
                className="absolute top-0 right-0 bg-red-600 text-white"
                onClick={() => handleRemoveImage(idx)}
              >
                X
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Varyasyonlar */}
      <div>
        <label className="block mb-1 font-medium">Varyasyonlar</label>
        {variants.map((v, idx) => (
          <div key={idx} className="border p-4 mb-2 rounded space-y-2">
            <Input
              placeholder="Renk"
              value={v.attributes.COLOR || ""}
              onChange={(e) =>
                handleVariantChange(idx, "attributes", {
                  ...v.attributes,
                  COLOR: e.target.value,
                })
              }
            />
            <Input
              placeholder="Beden"
              value={v.attributes.SIZE || ""}
              onChange={(e) =>
                handleVariantChange(idx, "attributes", {
                  ...v.attributes,
                  SIZE: e.target.value,
                })
              }
            />
            <Input
              placeholder="Fiyat"
              type="number"
              value={v.price}
              onChange={(e) =>
                handleVariantChange(idx, "price", e.target.value)
              }
            />
            <Input
              placeholder="Stok"
              type="number"
              value={v.stockQty}
              onChange={(e) =>
                handleVariantChange(idx, "stockQty", parseInt(e.target.value))
              }
            />

            {/* Varyasyon görselleri */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (!e.target.files) return;
                Array.from(e.target.files).forEach((file) =>
                  handleVariantImage(idx, file)
                );
              }}
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {v.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img.url}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <Button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white"
                    onClick={() => handleRemoveVariantImage(idx, i)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button type="button" onClick={handleAddVariant}>
          Varyasyon Ekle
        </Button>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {initialData ? "Güncelle" : "Oluştur"}
      </Button>
    </form>
  );
};

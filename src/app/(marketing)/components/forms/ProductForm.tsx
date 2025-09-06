"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { VariantAttributes } from "./VariantAttributes";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../lib/supabase/supabaseClient";

const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().optional(),
  price: z.number(),
  description: z.string().optional(),
  categoryId: z.string(),
  brandId: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  inStock: z.boolean().default(true),
  images: z
    .array(z.object({ url: z.string().url(), alt: z.string().optional() }))
    .optional(),
  variants: z
    .array(
      z.object({
        sku: z.string().optional(),
        price: z.number().min(0).optional(),
        stockQty: z.number().optional(),
        attributes: z
          .array(
            z.object({
              key: z.string().min(1, "Özellik anahtarı boş olamaz"),
              value: z.string().min(1, "Özellik değeri boş olamaz"),
            })
          )
          .optional(),

        images: z
          .array(
            z.object({ url: z.string().url(), alt: z.string().optional() })
          )
          .optional(),
      })
    )
    .optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  initialData: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
}

export function ProductForm({
  categories,
  brands,
  initialData,
  onSubmit,
}: ProductFormProps) {
  const form = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData.name || "",
      sku: initialData.sku || "",
      price: initialData.price || 0,
      description: initialData.description || "",
      categoryId: initialData.categoryId || (categories[0]?.id ?? ""),
      brandId: initialData.brandId || "",
      images: initialData.images || [],
      variants: initialData.variants || [],
      status: initialData.status ?? "DRAFT",
      inStock: initialData.inStock ?? true,
      seoTitle: initialData.seoTitle || "",
      seoDesc: initialData.seoDesc || "",
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const {
    fields: imageFields,
    append: addImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });

  const {
    fields: variantFields,
    append: addVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `products/${fileName}`; // bucket 'products'
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ürün Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input placeholder="Ürün Adı" {...register("name")} />
          <Input placeholder="Stok Kodu" {...register("sku")} />
          <Input
            placeholder="Fiyat"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <Textarea placeholder="Açıklama" {...register("description")} />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          {/* Kategori */}
          <Select
            onValueChange={(val) => form.setValue("categoryId", val)}
            defaultValue={initialData.categoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori seç" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
            {errors.categoryId && (
              <p className="text-red-500">{errors.categoryId.message}</p>
            )}
          </Select>

          {/* Marka */}
          <Select
            onValueChange={(val: string) => form.setValue("brandId", val)}
            defaultValue={initialData.brandId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Marka seç" />
              {errors.brandId && (
                <p className="text-red-500">{errors.brandId.message}</p>
              )}
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Görseller */}
      <Card>
        <CardHeader>
          <CardTitle>Ürün Görselleri</CardTitle>
          {errors.images && (
            <p className="text-red-500">{errors.images.message}</p>
          )}
        </CardHeader>
        <CardContent>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={async (e) => {
              if (!e.target.files) return;
              const files = Array.from(e.target.files);
              for (const file of files) {
                const url = await uploadImage(file);
                if (url) addImage({ url, alt: file.name });
              }
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {imageFields.map((field, idx) => (
              <div key={field.id} className="relative group">
                <Image
                  src={field.url}
                  alt={`Görsel ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                  width={1280}
                  height={720}
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 group-hover:opacity-100"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Status */}
      <Select
        onValueChange={(val) =>
          form.setValue("status", val as "DRAFT" | "PUBLISHED")
        }
        defaultValue={initialData.status || "DRAFT"}
      >
        <SelectTrigger>
          <SelectValue placeholder="Durum seç" />
          {errors.status && (
            <p className="text-red-500">{errors.status.message}</p>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="DRAFT">Taslak</SelectItem>
          <SelectItem value="PUBLISHED">Yayında</SelectItem>
        </SelectContent>
      </Select>

      {/* In Stock */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="inStock"
          {...register("inStock")}
          defaultChecked={initialData.inStock}
        />
        <label htmlFor="inStock">Stokta Var</label>
      </div>

      {/* Varyantlar */}
      <Card>
        <CardHeader>
          <CardTitle>Ürün Varyantları</CardTitle>
          {errors.variants && (
            <p className="text-red-500">{errors.variants.message}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {variantFields.map((field, idx) => (
            <div key={field.id} className="border p-3 rounded-lg space-y-3">
              <Input
                placeholder="Varyant SKU"
                {...register(`variants.${idx}.sku` as const)}
              />
              <Input
                placeholder="Varyant Fiyat"
                type="number"
                step="0.01"
                className="dark:bg-neutral-900 dark:text-white"
                {...register(`variants.${idx}.price`, {
                  valueAsNumber: true,
                })}
              />
              {errors.variants?.[idx]?.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.variants[idx]?.price?.message}
                </p>
              )}
              <Input
                placeholder="Stok Adedi"
                type="number"
                {...register(`variants.${idx}.stockQty` as const, {
                  valueAsNumber: true,
                })}
              />

              {/* Özellikler */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Özellikler</label>
                <VariantAttributes control={control} variantIndex={idx} />
              </div>

              {/* Varyant Görselleri */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Varyant Görselleri
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (e) => {
                    if (!e.target.files) return;
                    const files = Array.from(e.target.files);

                    const current =
                      form.getValues(`variants.${idx}.images`) || [];
                    const uploadedImages: { url: string; alt?: string }[] = [];

                    for (const file of files) {
                      const url = await uploadImage(file);
                      if (url) uploadedImages.push({ url, alt: file.name });
                    }

                    form.setValue(`variants.${idx}.images`, [
                      ...current,
                      ...uploadedImages,
                    ]);
                  }}
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                  {(form.watch(`variants.${idx}.images`) || []).map(
                    (img, i) => (
                      <div key={i} className="relative group">
                        <Image
                          src={img.url}
                          alt={`Varyant Görsel ${i + 1}`}
                          className="w-full h-24 object-cover rounded border"
                          width={200}
                          height={200}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const imgs = [
                              ...(form.getValues(`variants.${idx}.images`) ||
                                []),
                            ];
                            imgs.splice(i, 1);
                            form.setValue(`variants.${idx}.images`, imgs);
                          }}
                          className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 py-0.5 rounded"
                        >
                          Sil
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="destructive"
                onClick={() => removeVariant(idx)}
              >
                Varyantı Sil
              </Button>
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              addVariant({
                sku: "",
                price: undefined,
                stockQty: undefined,
                attributes: [],
                images: [], // 👈 boş array olarak başlat
              })
            }
          >
            + Varyant Ekle
          </Button>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Bilgileri</CardTitle>
          {errors.seoDesc && (
            <p className="text-red-500">{errors.seoDesc.message}</p>
          )}
          {errors.seoTitle && (
            <p className="text-red-500">{errors.seoTitle.message}</p>
          )}
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input placeholder="SEO Başlığı" {...register("seoTitle")} />
          <Textarea placeholder="SEO Açıklaması" {...register("seoDesc")} />
        </CardContent>
      </Card>

      <Button type="submit" className="w-full cursor-pointer">
        Kaydet
      </Button>
    </form>
  );
}

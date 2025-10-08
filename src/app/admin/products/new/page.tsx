import { db } from "@/app/(marketing)/lib/db";
import { redirect } from "next/navigation";

import slugify from "slugify";
import { Decimal } from "@prisma/client/runtime/library";
import {
  ProductFormData,
  PropertyType,
} from "@/app/(marketing)/components/product/types/types";
import { supabase } from "@/app/(marketing)/lib/supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { DynamicComponents } from "@/app/utils/dynamic-import";
import ProductForm from "@/app/(marketing)/components/forms/ProductForm";

async function generateUniqueSlug(name: string) {
  const baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await db.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    select: { id: true, name: true },
  });
  const brands = await db.brand.findMany({ select: { id: true, name: true } });
  const attributeTypes = await db.attributeType.findMany({
    include: { values: true },
  });
  const initialData: ProductFormData = {
    name: "",
    price: "",
    sku: "",
    description: "",
    categoryId: categories[0]?.id || "",
    brandId: brands[0]?.id || "",
    images: [],
    status: "DRAFT",
    inStock: true,
    variants: [],
  };

  const handleSubmit = async (data: ProductFormData) => {
    "use server";
    const slug = await generateUniqueSlug(data.name);

    // 1. Product kaydı
    const product = await db.product.create({
      data: {
        name: data.name,
        slug,
        price: data.price ? new Decimal(data.price) : new Decimal(0),
        description: data.description || undefined,
        category: { connect: { id: data.categoryId } },
        brand: data.brandId ? { connect: { id: data.brandId } } : undefined,
        status: data.status,
        inStock: data.inStock,
      },
    });

    // 2. Product images
    if (data.images && data.images.length > 0) {
      await Promise.all(
        data.images.map((img, idx) =>
          db.productImage.create({
            data: {
              productId: product.id,
              url: img.url,
              alt: img.alt || "",
              order: idx,
            },
          })
        )
      );
    }

    // 3. Product variants
    if (data.variants && data.variants.length > 0) {
      await Promise.all(
        data.variants.map(async (v) => {
          // Varyant kaydı
          const variant = await db.productVariant.create({
            data: {
              productId: product.id,
              sku: v.sku || undefined,
              price: v.price ? new Decimal(v.price) : undefined,
              stockQty: v.stockQty ? parseInt(v.stockQty) : 0,
            },
          });

          // Varyant görselleri
          if (v.images && v.images.length > 0) {
            await Promise.all(
              v.images.map((img, idx) =>
                db.variantImage.create({
                  data: {
                    variantId: variant.id,
                    url: img.url,
                    alt: img.alt || "",
                    order: idx,
                  },
                })
              )
            );
          }

          // Varyant attribute bağlantıları (ProductVariantAttribute)
          if (v.attributeValueIds && v.attributeValueIds.length > 0) {
            await db.productVariantAttribute.createMany({
              data: v.attributeValueIds.map((attrId: string) => ({
                variantId: variant.id,
                attributeValueId: attrId,
              })),
            });
          }
        })
      );
    }
    redirect("/admin/products");
  };
  // DB'den gelen raw data
  const rawPropertyValues = await db.propertyValue.findMany({
    select: {
      id: true,
      value: true,
      propertyType: { select: { id: true, name: true } },
    },
  });

  // Tipi PropertyType[] haline getir
  const propertyTypes: PropertyType[] = Object.values(
    rawPropertyValues.reduce(
      (acc, pv) => {
        if (!acc[pv.propertyType.id]) {
          acc[pv.propertyType.id] = {
            id: pv.propertyType.id,
            name: pv.propertyType.name,
            values: [],
          };
        }
        acc[pv.propertyType.id].values.push({
          id: pv.id,
          value: pv.value,
        });
        return acc;
      },
      {} as Record<string, PropertyType>
    )
  );

  const uploadImage = async (file: File) => {
    "use server";
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

import { db } from "@/app/(marketing)/lib/db";
import { redirect } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/library";
import { v4 as uuidv4 } from "uuid";
import {
  ProductFormData,
  PropertyType,
} from "@/app/(marketing)/components/product/types/types";
import { supabase } from "@/app/(marketing)/lib/supabase/supabaseClient";
import { DynamicComponents } from "@/app/utils/dynamic-import";
const { ProductForm } = DynamicComponents;

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const product = await db.product.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      category: true,
      brand: true,
      properties: { include: { propertyType: true, propertyValue: true } },
      modelInfo: true,
      variants: {
        include: {
          images: true,
          attributes: { include: { value: { include: { type: true } } } },
        },
      },
    },
  });

  if (!product) return <p>Ürün bulunamadı</p>;

  // 🔹 initialData
  const initialData: ProductFormData = {
    name: product.name,
    price: product.price?.toString() || "",
    sku: product.slug,
    description: product.description || "",
    categoryId: product.categoryId,
    brandId: product.brandId || "",
    status: product.status === "ARCHIVED" ? "DRAFT" : product.status,
    inStock: product.inStock,
    images: product.images.map((img) => ({
      url: img.url,
      alt: img.alt || "",
    })),
    properties: product.properties.map((p) => ({
      propertyTypeId: p.propertyTypeId,
      propertyValueId: p.propertyValueId,
      value: p.propertyValue.value,
    })),
    variants: product.variants.map((v) => ({
      sku: v.sku || "",
      price: v.price?.toString() || "",
      stockQty: v.stockQty?.toString() || "",
      attributeValueIds: v.attributes?.map((a) => a.attributeValueId) || [],
      images: v.images.map((img) => ({
        url: img.url,
        alt: img.alt || "",
      })),
    })),
    modelInfoId: product.modelInfoId || undefined,
    modelSize: product.modelSize || "",
  };

  // 🔹 Dropdown verileri
  const [categories, brands, attributeTypes, rawPropertyValues] =
    await Promise.all([
      db.category.findMany({ select: { id: true, name: true } }),
      db.brand.findMany({ select: { id: true, name: true } }),
      db.attributeType.findMany({ include: { values: true } }),
      db.propertyValue.findMany({ include: { propertyType: true } }),
    ]);

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

  // 🔹 Update handler
  const handleUpdate = async (data: ProductFormData) => {
    "use server";
    try {
      await db.$transaction(async (tx) => {
        // 1. Product update
        await tx.product.update({
          where: { id: product.id },
          data: {
            name: data.name,
            slug: data.sku,
            price: new Decimal(data.price || 0),
            description: data.description,
            category: { connect: { id: data.categoryId } },
            brand: data.brandId ? { connect: { id: data.brandId } } : undefined,
            status: data.status,
            inStock: data.inStock,
          },
        });

        // 2. Images reset
        await tx.productImage.deleteMany({ where: { productId: product.id } });
        if (data.images?.length) {
          await tx.productImage.createMany({
            data: data.images.map((img, idx) => ({
              productId: product.id,
              url: img.url,
              alt: img.alt || "",
              order: idx,
            })),
          });
        }

        // 3. Properties reset
        await tx.productProperty.deleteMany({
          where: { productId: product.id },
        });
        if (data.properties?.length) {
          await tx.productProperty.createMany({
            data: data.properties.map((p) => ({
              productId: product.id,
              propertyTypeId: p.propertyTypeId,
              propertyValueId: p.propertyValueId,
            })),
          });
        }

        // 4. Variants reset
        await tx.productVariantAttribute.deleteMany({
          where: { variant: { productId: product.id } },
        });
        await tx.variantImage.deleteMany({
          where: { variant: { productId: product.id } },
        });
        await tx.productVariant.deleteMany({
          where: { productId: product.id },
        });

        // 5. Variants recreate
        if (data.variants?.length) {
          for (const v of data.variants) {
            const variant = await tx.productVariant.create({
              data: {
                productId: product.id,
                sku: v.sku || undefined,
                price: v.price ? new Decimal(v.price) : undefined,
                stockQty: v.stockQty ? parseInt(v.stockQty) : 0,
              },
            });

            if (v.images?.length) {
              await tx.variantImage.createMany({
                data: v.images.map((img, idx) => ({
                  variantId: variant.id,
                  url: img.url,
                  alt: img.alt || "",
                  order: idx,
                })),
              });
            }

            if (v.attributeValueIds?.length) {
              await tx.productVariantAttribute.createMany({
                data: v.attributeValueIds.map((attrId) => ({
                  variantId: variant.id,
                  attributeValueId: attrId,
                })),
              });
            }
          }
        }

        // 6. ModelInfo ilişkilendirme
        if (data.modelInfoId) {
          await tx.product.update({
            where: { id: product.id },
            data: {
              modelInfoId: data.modelInfoId,
              modelSize: data.modelSize,
            },
          });
        }
      });
    } catch (error) {
      console.error("Ürün güncelleme hatası:", error);
      throw new Error(
        "Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
    redirect("/admin/products");
  };

  // 🔹 Supabase upload
  const uploadImage = async (file: File) => {
    "use server";
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(filePath, file);
      if (error) throw error;
      const { data } = supabase.storage.from("products").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.error("Supabase upload error:", err);
      throw new Error("Görsel yüklenemedi. Lütfen tekrar deneyin.");
    }
  };

  return (
    <ProductForm
      categories={categories}
      attributeTypes={attributeTypes}
      brands={brands}
      uploadImage={uploadImage}
      propertyTypes={propertyTypes}
      initialData={initialData}
      onSubmit={handleUpdate}
    />
  );
}

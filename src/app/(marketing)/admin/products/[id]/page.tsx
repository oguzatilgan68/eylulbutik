import {
  ProductForm,
  ProductFormData,
} from "@/app/(marketing)/components/forms/ProductForm";
import { db } from "@/app/(marketing)/lib/db";
import { redirect } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/library";

const EditProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const product = await db.product.findUnique({
    where: { id: (await params).id },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { include: { images: { orderBy: { order: "asc" } } } },
    },
  });

  if (!product) return <p>Ürün bulunamadı</p>;

  const initialData: ProductFormData = {
    name: product.name,
    price: product.price?.toString() || "",
    sku: product.slug,
    description: product.description || "",
    categoryId: product.categoryId,
    brandId: product.brandId || "",
    status: product.status === "ARCHIVED" ? "DRAFT" : product.status,
    inStock: product.inStock,
    images: product.images.map((img) => ({ url: img.url, alt: img.alt || "" })),
    variants: product.variants.map((v) => ({
      sku: v.sku || "",
      price: v.price?.toString() || "",
      stockQty: v.stockQty?.toString() || "",
      attributes:
        v.attributes?.map((a: any) => ({
          key: a.key,
          value: a.value,
        })) || [], // 👈 array olarak bırak
      images: v.images.map((img) => ({ url: img.url, alt: img.alt || "" })),
    })),

    seoTitle: product.seoTitle || "",
    seoDesc: product.seoDesc || "",
  };
  const categories = await db.category.findMany({
    select: { id: true, name: true },
  });
  const brands = await db.brand.findMany({ select: { id: true, name: true } });
  const handleUpdate = async (data: ProductFormData) => {
    "use server";
    await db.product.update({
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
        seoTitle: data.seoTitle || undefined,
        seoDesc: data.seoDesc || undefined,
      },
    });
    // 2. Eski görselleri sil
    await db.productImage.deleteMany({ where: { productId: product.id } });
    // 3. Yeni görselleri ekle
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

    // 4. Varyantlar: önce eski varyant görsellerini sil
    await db.variantImage.deleteMany({
      where: { variant: { productId: product.id } },
    });

    // 5. Sonra varyantları sil
    await db.productVariant.deleteMany({ where: { productId: product.id } });

    // 6. Yeni varyantları ekle
    if (data.variants && data.variants.length > 0) {
      await Promise.all(
        data.variants.map(async (v) => {
          const variant = await db.productVariant.create({
            data: {
              productId: product.id,
              sku: v.sku || undefined,
              price: v.price ? new Decimal(v.price) : undefined,
              stockQty: v.stockQty ? parseInt(v.stockQty) : 0,
              attributes: v.attributes || [],
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
        })
      );
    }

    redirect("/admin/products");
  };

  return (
    <ProductForm
      categories={categories}
      brands={brands}
      initialData={initialData}
      onSubmit={handleUpdate}
    />
  );
};

export default EditProductPage;

import ProductForm, {
  ProductFormData,
} from "@/app/(marketing)/components/forms/ProductForm";
import { db } from "@/app/(marketing)/lib/db";
import { redirect } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/library";

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: {
        include: {
          images: { orderBy: { order: "asc" } },
          attributes: true,
        },
      },
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
      attributeValueIds: v.attributes?.map((a: any) => a.valueId) || [], // burada valueId kullandım, sen DB'deki id alanını ver
      images: v.images.map((img) => ({ url: img.url, alt: img.alt || "" })),
    })),

    seoTitle: product.seoTitle || "",
    seoDesc: product.seoDesc || "",
  };

  const categories = await db.category.findMany({
    select: { id: true, name: true },
  });
  const brands = await db.brand.findMany({ select: { id: true, name: true } });
  const attributeTypes = await db.attributeType.findMany({
    include: { values: true },
  });
  const handleUpdate = async (data: ProductFormData) => {
    "use server";

    // 1️⃣ Product update
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

    // 2️⃣ Eski product images sil → yeniden ekle
    await db.productImage.deleteMany({ where: { productId: product.id } });
    if (data.images?.length > 0) {
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

    // 3️⃣ Variant ve ilişkilerini sil (paralel)
    await Promise.all([
      db.productVariantAttribute.deleteMany({
        where: { variant: { productId: product.id } },
      }),
      db.variantImage.deleteMany({
        where: { variant: { productId: product.id } },
      }),
      db.productVariant.deleteMany({
        where: { productId: product.id },
      }),
    ]);

    // 4️⃣ Yeni variantları ekle
    if (data.variants?.length > 0) {
      await Promise.all(
        data.variants.map(async (v) => {
          const variant = await db.productVariant.create({
            data: {
              productId: product.id,
              sku: v.sku || undefined,
              price: v.price ? new Decimal(v.price) : undefined,
              stockQty: v.stockQty ? parseInt(v.stockQty) : 0,
            },
          });

          // Görseller ve attribute bağlantılarını paralel yap
          await Promise.all([
            v.images?.length
              ? Promise.all(
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
                )
              : null,
            v.attributeValueIds?.length
              ? db.productVariantAttribute.createMany({
                  data: v.attributeValueIds.map((attrId: string) => ({
                    variantId: variant.id,
                    attributeValueId: attrId,
                  })),
                })
              : null,
          ]);
        })
      );
    }

    redirect("/admin/products");
  };

  return (
    <ProductForm
      categories={categories}
      attributeTypes={attributeTypes}
      brands={brands}
      initialData={initialData}
      onSubmit={handleUpdate}
    />
  );
}

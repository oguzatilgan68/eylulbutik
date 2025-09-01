import {
  ProductForm,
  ProductFormData,
} from "@/app/(marketing)/components/forms/ProductForm";
import { db } from "@/app/(marketing)/lib/db";
import { redirect } from "next/navigation";

const EditProductPage = async ({ params }: { params: { id: string } }) => {
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!product) return <p>Ürün bulunamadı</p>;

  const initialData: ProductFormData = {
    name: product.name,
    slug: product.slug,
    sku: product.sku || "",
    price: product.price.toString(),
    description: product.description || "",
    categoryId: product.categoryId,
    brandId: product.brandId || "",
    images: product.images.map((img) => ({ url: img.url, alt: img.alt || "" })),
  };

  const categories = await db.category.findMany({
    select: { id: true, name: true },
  });
  const brands = await db.brand.findMany({ select: { id: true, name: true } });

  const handleUpdate = async (data: ProductFormData) => {
    "use server";

    // 1. Ürünü güncelle (images relation hariç)
    await db.product.update({
      where: { id: product.id },
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku || undefined,
        price: new Prisma.Decimal(data.price),
        description: data.description,
        category: { connect: { id: data.categoryId } },
        brand: data.brandId ? { connect: { id: data.brandId } } : undefined,
      },
    });

    // 2. Önce eski görselleri sil
    await db.image.deleteMany({ where: { productId: product.id } });

    // 3. Yeni görselleri ekle
    if (data.images && data.images.length > 0) {
      await Promise.all(
        data.images.map((img, idx) =>
          db.image.create({
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

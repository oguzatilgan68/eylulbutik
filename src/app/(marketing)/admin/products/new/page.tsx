import { db } from "@/app/(marketing)/lib/db";
import { redirect } from "next/navigation";
import {
  ProductForm,
  ProductFormData,
} from "@/app/(marketing)/components/forms/ProductForm";
import { Prisma } from "@/generated/prisma";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    select: { id: true, name: true },
  });
  const brands = await db.brand.findMany({ select: { id: true, name: true } });

  const initialData: ProductFormData = {
    name: "",
    slug: "",
    sku: "",
    price: "",
    description: "",
    categoryId: categories[0]?.id || "",
    brandId: brands[0]?.id || "",
    images: [],
  };

  const handleSubmit = async (data: ProductFormData) => {
    "use server";

    const product = await db.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku || undefined,
        price: new Prisma.Decimal(data.price.replace(",", ".")),
        description: data.description || undefined,
        category: { connect: { id: data.categoryId } },
        brand: data.brandId ? { connect: { id: data.brandId } } : undefined,
        status: "DRAFT",
      },
    });

    if (data.images && data.images.length > 0) {
      await Promise.all(
        data.images.map((img, idx) =>
          db.image.create({
            data: {
              productId: product.id,
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
      onSubmit={handleSubmit}
    />
  );
}

import { db } from "@/app/(marketing)/lib/db";
import { redirect } from "next/navigation";
import {
  ProductForm,
  ProductFormData,
} from "@/app/(marketing)/components/forms/ProductForm";
import slugify from "slugify";
import { Prisma } from "@/generated/prisma";
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

  const initialData: ProductFormData = {
    name: "",
    price: "",
    description: "",
    categoryId: categories[0]?.id || "",
    brandId: brands[0]?.id || "",
    images: [], // Ürün görselleri
    status: "DRAFT", // Varsayılan ürün durumu
    inStock: true, // Varsayılan stok durumu
    variants: [], // Başlangıçta varyant yok
    seoTitle: "",
    seoDesc: "",
  };

  const handleSubmit = async (data: ProductFormData) => {
    "use server";
    const slug = await generateUniqueSlug(data.name);
    const product = await db.product.create({
      data: {
        name: data.name,
        slug: slug,
        price: new Prisma.Decimal((data.price ?? "0").replace(",", ".")),
        description: data.description || undefined,
        category: { connect: { id: data.categoryId } },
        brand: data.brandId ? { connect: { id: data.brandId } } : undefined,
        status: "DRAFT",
      },
    });

    if (data.images && data.images.length > 0) {
      await Promise.all(
        data.images.map((img, idx) =>
          db.productImage.create({
            data: {
              productId: product.id,
              url: img.url, // Ensure img.url exists in your ProductFormData.images
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

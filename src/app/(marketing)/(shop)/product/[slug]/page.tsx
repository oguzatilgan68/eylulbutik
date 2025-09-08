// app/(marketing)/product/[slug]/page.tsx
import { db } from "@/app/(marketing)/lib/db";
import ProductClient from "./ProductClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { images: true, category: true, brand: true, variants: true },
  });
  if (!product)
    return (
      <p className="text-gray-700 dark:text-gray-300 p-8">Ürün bulunamadı.</p>
    );

  // ✅ Decimal → number/string dönüştür
  const safeProduct = {
    ...product,
    price: product.price ? Number(product.price) : 0,
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price ? Number(v.price) : 0,
    })),
  };

  return <ProductClient product={safeProduct} />;
}

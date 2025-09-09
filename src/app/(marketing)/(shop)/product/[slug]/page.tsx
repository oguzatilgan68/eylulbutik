import { db } from "@/app/(marketing)/lib/db";
import ProductClient from "./ProductClient";

interface Attribute {
  id: string;
  key: string;
  value: string;
}

interface Variant {
  id: string;
  price: number;
  stockQty: number;
  images: { id: string; url: string; alt: string | null; order: number }[];
  attributes: Attribute[];
}

interface SafeProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  inStock: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  images: { id: string; url: string; alt: string | null; order: number }[];
  category: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  } | null;
  brand: { id: string; name: string } | null;
  variants: Variant[];
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      images: true,
      category: true,
      brand: true,
      variants: {
        include: {
          images: true,
          attributes: {
            include: {
              value: {
                include: { type: true }, // attributeType.name => key
              },
            },
          },
        },
      },
    },
  });

  if (!product)
    return (
      <p className="text-gray-700 dark:text-gray-300 p-8">Ürün bulunamadı.</p>
    );

  // Decimal → number dönüşümü ve attributes key/value mapping
  const safeProduct: SafeProduct = {
    ...product,
    price: product.price ? Number(product.price) : 0,
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price ? Number(v.price) : 0,
      attributes: v.attributes.map((a: any) => ({
        id: a.id,
        key: a.value.type.name,
        value: a.value.value,
      })),
    })),
  };

  return <ProductClient product={safeProduct} />;
}

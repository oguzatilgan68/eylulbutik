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

interface Property {
  id: string;
  key: string;
  value: string;
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
  properties: Property[];
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products/${slug}`,
    {
      cache: "no-store", // Her zaman güncel veri gelsin
    }
  );

  if (!res.ok) {
    return (
      <p className="text-gray-700 dark:text-gray-300 p-8">Ürün bulunamadı.</p>
    );
  }

  const product: SafeProduct = await res.json();

  return <ProductClient product={product} />;
}

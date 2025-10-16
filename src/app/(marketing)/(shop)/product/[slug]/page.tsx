import ProductClient from "./ProductClient";
import { db } from "@/app/(marketing)/lib/db";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// 🧠 Dinamik Metadata
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await db.product.findUnique({
      where: { slug },
      select: {
        name: true,
        seoTitle: true,
        seoKeywords: true,
        images: { select: { url: true } },
      },
    });

    if (!product) {
      return {
        title: "Ürün Bulunamadı",
        description: "Aradığınız ürün mevcut değil.",
      };
    }

    return {
      title: product.seoTitle || product.name,
      description: Array.isArray(product.seoKeywords)
        ? product.seoKeywords.join(", ")
        : product.seoKeywords || `${product.name} ürününü hemen inceleyin.`,
      openGraph: {
        title: product.seoTitle || product.name,
        description: Array.isArray(product.seoKeywords)
          ? product.seoKeywords.join(", ")
          : product.seoKeywords || "",
        images: product.images?.[0]?.url
          ? [{ url: product.images[0].url }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: product.seoTitle || product.name,
        description: Array.isArray(product.seoKeywords)
          ? product.seoKeywords.join(", ")
          : product.seoKeywords || "",
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch (err) {
    console.error("generateMetadata error:", err);
    return {
      title: "Ürün",
      description: "Ürün bilgileri yüklenemedi.",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <p className="text-gray-700 dark:text-gray-300 p-8">Ürün bulunamadı.</p>
    );
  }

  const product = await res.json();
  return <ProductClient product={product} />;
}

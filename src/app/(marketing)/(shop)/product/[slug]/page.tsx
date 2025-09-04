import { db } from "@/app/(marketing)/lib/db";
import Image from "next/image";
import Reviews from "@/app/(marketing)/components/product/Reviews";
import WishlistButton from "@/app/(marketing)/components/product/WishlistButton";
import { toPriceString } from "@/app/(marketing)/lib/money";
import AddToCartButton from "@/app/(marketing)/components/product/AddToCartButton";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { images: true, category: true, brand: true },
  });

  if (!product)
    return (
      <p className="text-gray-700 dark:text-gray-300 p-8">Ürün bulunamadı.</p>
    );

  const img0 = product.images?.[0]?.url;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Ürün Görselleri */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          {img0 ? (
            <Image
              src={img0}
              alt={product.name}
              width={600}
              height={600}
              priority
              className="rounded-2xl object-cover w-full h-[400px] lg:h-[500px]"
            />
          ) : (
            <div className="bg-gray-200 dark:bg-gray-800 w-full h-[400px] flex items-center justify-center rounded-2xl text-gray-600 dark:text-gray-300">
              Görsel Yok
            </div>
          )}

          {/* Küçük thumbnail görseller */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-auto">
              {product.images.map((img, i) => (
                <Image
                  key={i}
                  src={img.url}
                  alt={`${product.name} ${i + 1}`}
                  width={100}
                  height={100}
                  className="w-20 h-20 object-cover rounded-xl cursor-pointer hover:ring-2 hover:ring-pink-500 transition-all"
                />
              ))}
            </div>
          )}
        </div>

        {/* Ürün Bilgileri */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold dark:text-white">
              {product.name}
            </h1>
            <WishlistButton productId={product.id} />
          </div>

          {product.brand && (
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Marka: {product.brand.name}
            </p>
          )}
          {product.category && (
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Kategori: {product.category.name}
            </p>
          )}

          <p className="text-gray-800 dark:text-gray-100 text-xl">
            ₺{toPriceString(product.price)}
          </p>

          {product.description && (
            <p className="text-gray-700 dark:text-gray-300">
              {product.description}
            </p>
          )}

          <AddToCartButton productId={product.id} />
        </div>
      </div>

      {/* Ürün Detayları + Yorumlar */}
      <div className="mt-12 grid gap-10">
        <section>
          <h2 className="text-2xl font-semibold dark:text-white mb-4">
            Ürün Detayları
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {product.description ||
              "Bu ürün için detaylı bilgi bulunmamaktadır."}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold dark:text-white mb-4">
            Yorumlar
          </h2>
          <Reviews productId={product.id} />
        </section>
      </div>
    </div>
  );
}

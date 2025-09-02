import { Button } from "@/app/(marketing)/components/ui/button";
import { db } from "@/app/(marketing)/lib/db";
import Image from "next/image";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: { slug: (await params).slug },
    include: { images: true, category: true, brand: true },
  });

  if (!product) return <p>Ürün bulunamadı.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Ürün Görselleri */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              width={600}
              height={600}
              priority
              className="rounded-lg object-cover w-full h-[400px] lg:h-[500px]"
            />
          ) : (
            <div className="bg-gray-200 dark:bg-gray-700 w-full h-[400px] flex items-center justify-center rounded-lg">
              Görsel Yok
            </div>
          )}

          {/* Küçük thumbnail görseller */}
          <div className="flex gap-2 mt-2">
            {product.images.map((img, i) => (
              <Image
                key={i}
                src={img.url}
                alt={`${product.name} ${i + 1}`}
                width={100}
                height={100}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-pink-500 transition-all"
              />
            ))}
          </div>
        </div>

        {/* Ürün Bilgileri */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold dark:text-white">{product.name}</h1>
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
          <p className="text-gray-700 dark:text-gray-300 mt-1">
            ₺
            {typeof product.price === "object" && "toString" in product.price
              ? product.price.toString()
              : String(product.price)}
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            {product.description}
          </p>

          {/* Sepete ekle butonu */}
          <Button className="mt-4 w-full lg:w-1/2 bg-pink-500 hover:bg-pink-600 text-white">
            Sepete Ekle
          </Button>
        </div>
      </div>

      {/* Responsive ekstra bilgi veya açıklama */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold dark:text-white mb-4">
          Ürün Detayları
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {/* Buraya uzun ürün açıklaması veya teknik bilgiler gelebilir */}
          {product.description || "Bu ürün için detaylı bilgi bulunmamaktadır."}
        </p>
      </div>
    </div>
  );
}

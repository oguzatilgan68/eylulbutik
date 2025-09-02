import { ProductCard } from "./components/ui/product/ProductCard";
import { db } from "./lib/db";

export default async function HomePage() {
  const products = await db.product.findMany({
    where: { status: "PUBLISHED" },
    take: 12,
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">
        Popüler Ürünler
      </h1>
      {products.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">Henüz ürün yok.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price.toString(),
                images: product.images.map((img) => ({ url: img.url })),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

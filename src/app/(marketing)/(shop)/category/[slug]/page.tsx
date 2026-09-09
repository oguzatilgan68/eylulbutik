import { ProductList } from "@/app/(marketing)/components/ui/product/ProductList";
import { db } from "@/app/(marketing)/lib/db";
import { FiGrid } from "react-icons/fi";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const products = await db.product.findMany({
    where: { category: { slug } },
    include: {
      properties: {
        include: {
          propertyType: true,
          propertyValue: true,
        },
      },
      category: {
        select: { name: true },
      },
    },
  });

  const catName = products[0]?.category.name || "Koleksiyon";
  
  // attributeTypes objesini oluştur
  const attributeTypes: { [key: string]: string[] } = {};

  products.forEach((product) => {
    product.properties.forEach((prop) => {
      const key = prop.propertyType.name;
      const value = prop.propertyValue.value;

      if (!attributeTypes[key]) {
        attributeTypes[key] = [];
      }
      if (!attributeTypes[key].includes(value)) {
        attributeTypes[key].push(value);
      }
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Kategori Başlık Kartı */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400 block mb-1">
            Eylül Butik Koleksiyonu
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {catName}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
          <FiGrid size={14} className="text-pink-600" /> {products.length} Ürün Listeleniyor
        </div>
      </div>

      <ProductList categorySlug={slug} attributeTypes={attributeTypes} />
    </div>
  );
}
import { ProductList } from "@/app/(marketing)/components/ui/product/ProductList";
import { db } from "@/app/(marketing)/lib/db";

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
          propertyType: true, // key
          propertyValue: true, // value
        },
      },
      category: {
        select: { name: true },
      },
    },
  });
  const catName = products[0]?.category.name || "";
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">{catName}</h1>
      <ProductList categorySlug={slug} attributeTypes={attributeTypes} />
    </div>
  );
}

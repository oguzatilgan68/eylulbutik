import { ProductList } from "@/app/(marketing)/components/ui/product/ProductList";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        {slug.replace("-", " ")}
      </h1>
      <ProductList categorySlug={slug} />
    </div>
  );
}

import { fetchInitialData } from "@/app/utils/fetchInitialData";
import EditProductForm from "./EditProductForm";
export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { categories, brands, attributeTypes, propertyTypes, product } =
    await fetchInitialData(baseUrl, params.id);
  if (!product) return <p>Ürün bulunamadı</p>;
  const initialData: any = {
    id: product.id,
    name: product.name,
    price: product.price?.toString() || "",
    sku: product.sku,
    description: product.description || "",
    categoryId: product.categoryId,
    brandId: product.brandId || "",
    status: product.status === "ARCHIVED" ? "DRAFT" : product.status,
    inStock: product.inStock,
    images: product.images.map((img: { url: string; alt: string }) => ({
      url: img.url,
      alt: img.alt || "",
    })),
    properties: product.properties.map(
      (p: {
        propertyTypeId: string;
        propertyValueId: string;
        propertyValue: any;
      }) => ({
        propertyTypeId: p.propertyTypeId,
        propertyValueId: p.propertyValueId,
        value: p.propertyValue.value,
      })
    ),
    variants: product.variants.map((v: any) => ({
      sku: v.sku || "",
      price: v.price?.toString() || "",
      stockQty: v.stockQty?.toString() || "",
      attributeValueIds:
        v.attributes?.map(
          (a: { attributeValueId: string }) => a.attributeValueId
        ) || [],
      images: v.images.map((img: { url: string; alt: string }) => ({
        url: img.url,
        alt: img.alt || "",
      })),
    })),
    modelInfoId: product.modelInfoId || undefined,
    modelSize: product.modelSize || "",
  };

  return (
    <EditProductForm
      initialData={initialData}
      categories={categories}
      brands={brands}
      attributeTypes={attributeTypes}
      propertyTypes={propertyTypes}
    />
  );
}

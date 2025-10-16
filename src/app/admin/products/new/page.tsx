import { fetchInitialData } from "@/app/utils/fetchInitialData";
import ProductFormContainer from "./ProductFormContainer";

export default async function NewProductPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { categories, brands, attributeTypes, propertyTypes } =
    await fetchInitialData(baseUrl);

  return (
    <ProductFormContainer
      categories={categories}
      brands={brands}
      attributeTypes={attributeTypes}
      propertyTypes={propertyTypes}
    />
  );
}

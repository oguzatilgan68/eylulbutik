import { fetchInitialData } from "@/app/utils/fetchInitialData";
import ProductFormContainer from "./ProductFormContainer";
import { cookies } from "next/headers";

export default async function NewProductPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // SSR cookie string
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  // 2. parametre productId yok → undefined
  const { categories, brands, attributeTypes, propertyTypes } =
    await fetchInitialData(baseUrl, undefined, cookieHeader);

  return (
    <ProductFormContainer
      categories={categories}
      brands={brands}
      attributeTypes={attributeTypes}
      propertyTypes={propertyTypes}
    />
  );
}

// utils/fetchInitialData.ts
export interface Category {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface AttributeValue {
  id: string;
  value: string;
}

export interface AttributeType {
  id: string;
  name: string;
  values: AttributeValue[];
}

export interface PropertyType {
  id: string;
  name: string;
  values: { id: string; value: string }[];
}

export async function fetchInitialData(baseUrl: string, productId?: string) {
  // Promise.all ile 3 fetch aynı anda
  const [categoriesRes, brandsRes, attrTypesRes, propertyTypesRes, productRes] =
    await Promise.all([
      fetch(`${baseUrl}/api/categories`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/brands`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/attribute-types`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/admin/global-properties`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/admin/products/${productId}`, {
        cache: "no-store",
      }),
    ]);
  if (!categoriesRes.ok) throw new Error("Kategori verisi alınamadı");
  if (!brandsRes.ok) throw new Error("Marka verisi alınamadı");
  if (!attrTypesRes.ok) throw new Error("Attribute tipi verisi alınamadı");
  if (!propertyTypesRes.ok) throw new Error("Özellik tipi verisi alınamadı");
  if (!productRes.ok) throw new Error("Ürün verisi alınamadı");

  const [categories, brands, attributeTypes, propertyTypes, product] =
    await Promise.all([
      categoriesRes.json(),
      brandsRes.json(),
      attrTypesRes.json(),
      propertyTypesRes.json(),
      productRes.json(),
    ]);

  return {
    categories,
    brands,
    attributeTypes,
    propertyTypes,
    product,
  } as {
    categories: Category[];
    brands: Brand[];
    attributeTypes: AttributeType[];
    propertyTypes: PropertyType[];
    product: any;
  };
}

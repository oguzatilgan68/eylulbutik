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
  // Fetch dizisini oluştur
  const fetchPromises = [
    fetch(`${baseUrl}/api/categories`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/brands`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/attribute-types`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/admin/global-properties`, { cache: "no-store" }),
  ];

  // productId varsa product fetch ekle
  if (productId) {
    fetchPromises.push(
      fetch(`${baseUrl}/api/admin/products/${productId}`, { cache: "no-store" })
    );
  }

  const [categoriesRes, brandsRes, attrTypesRes, propertyTypesRes, productRes] =
    await Promise.all(fetchPromises);

  if (!categoriesRes.ok) throw new Error("Kategori verisi alınamadı");
  if (!brandsRes.ok) throw new Error("Marka verisi alınamadı");
  if (!attrTypesRes.ok) throw new Error("Attribute tipi verisi alınamadı");
  if (!propertyTypesRes.ok) throw new Error("Özellik tipi verisi alınamadı");
  if (productId && !productRes.ok) throw new Error("Ürün verisi alınamadı");

  const categories = await categoriesRes.json();
  const brands = await brandsRes.json();
  const attributeTypes = await attrTypesRes.json();
  const propertyTypes = await propertyTypesRes.json();
  const product = productId ? await productRes.json() : undefined;

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
    product?: any;
  };
}


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

async function safeFetch(
  url: string,
  label: string,
  revalidate = 60,
  cookieHeader?: string 
) {
  try {
    const isClient = typeof window !== "undefined";

    const fetchOptions: RequestInit = {
      // ⚠️ cache: "no-store" buradan kaldırıldı, revalidate çalışabilsin diye:
      next: { revalidate },
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      ...(isClient ? { credentials: "include" } : {}),
    };

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      const text = await res.text().catch(() => "<non-text response>");
      console.error(`❌ [${label}] Fetch hatası (${res.status}):`, text);
      throw new Error(`${label} verisi alınamadı (${res.status})`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error(`🔥 [${label}] Hata:`, err?.message ?? err);
    throw err;
  }
}

/**
 * fetchInitialData
 * @param baseUrl - ör. process.env.NEXT_PUBLIC_BASE_URL
 * @param productId - opsiyonel ürün id
 * @param cookieHeader - (SSR) gelen request'ten oluşturulmuş cookie string (örn: "a=1; b=2")
 */
export async function fetchInitialData(
  baseUrl: string,
  productId?: string,
  cookieHeader?: string
) {
  const fetchPromises: Promise<any>[] = [
    safeFetch(`${baseUrl}/api/categories`, "Kategori", 300, cookieHeader),
    safeFetch(`${baseUrl}/api/brands`, "Marka", 300, cookieHeader),
    safeFetch(
      `${baseUrl}/api/attribute-types`,
      "Attribute Tipi",
      120,
      cookieHeader
    ),
    safeFetch(
      `${baseUrl}/api/admin/global-properties`,
      "Özellik Tipi",
      120,
      cookieHeader
    ),
  ];

  if (productId) {
    fetchPromises.push(
      safeFetch(
        `${baseUrl}/api/admin/products/${productId}`,
        "Ürün",
        0,
        cookieHeader
      )
    );
  }

  const [categories, brands, attributeTypes, propertyTypes, product] =
    await Promise.all(fetchPromises);

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

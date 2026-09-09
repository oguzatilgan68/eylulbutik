// utils/fetchInitialData.ts
import { db } from "@/app/(marketing)/lib/db"; // Kendi Prisma import yoluna göre düzenle

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

<<<<<<< HEAD
// safeFetch: hem client hem server için çalışır
async function safeFetch(
  url: string,
  label: string,
  revalidate = 60,
  cookieHeader?: string // SSR'da gelen cookie string'i buraya verilecek
) {
  try {
    const isClient = typeof window !== "undefined";

    const fetchOptions: RequestInit = {
      next: { revalidate },
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        // SSR tarafında cookie varsa burada iletilir:
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      // Client'ta credentials: 'include' ile tarayıcı cookie'leri gönderilir
      ...(isClient ? { credentials: "include" } : {}),
    };

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      const text = await res.text().catch(() => "<non-text response>");
      console.error(`❌ [${label}] Fetch hatası (${res.status}):`, text);
      throw new Error(`${label} verisi alınamadı (${res.status})`);
    }

    const data = await res.json();
    console.log(`✅ [${label}] Verisi başarıyla alındı`);
    return data;
  } catch (err: any) {
    console.error(`🔥 [${label}] Hata:`, err?.message ?? err);
    throw err; // çağırana hata fırlat (üst katmanda yakalanır)
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
=======
export async function fetchInitialData(baseUrl?: string, productId?: string) {
  try {
    // Doğrudan veritabanından (Prisma ile) paralel olarak verileri çekiyoruz.
    // Hiçbir HTTP fetch veya URL hatası ile uğraşmazsın, şimşek gibi hızı olur!
    const [categories, brands, attributeTypes, propertyTypes, product] = await Promise.all([
      db.category.findMany(),
      db.brand.findMany(),
      db.attributeType.findMany({ include: { values: true } }),
      db.attributeType.findMany({ include: { values: true } }), 
      productId ? db.product.findUnique({ where: { id: productId } }) : Promise.resolve(null),
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
      product?: any;
    };
  } catch (error) {
    console.error("fetchInitialData error:", error);
    throw new Error("Başlangıç verileri yüklenirken bir hata oluştu.");
  }
}
>>>>>>> 7ef8c4f (yeniden)

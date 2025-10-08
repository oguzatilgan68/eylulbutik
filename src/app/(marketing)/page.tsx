import { Category } from "@/generated/prisma";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  // Üst kategorileri çekiyoruz
  const cookieStore = await cookies(); // tüm cookie'leri al
  let categories: Category[];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/categories`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookieStore.toString(), // cookie'leri API'ye gönder
        },
      }
    );

    if (!res.ok) {
      throw new Error("Kategoriler yüklenemedi");
    }

    categories = await res.json();
  } catch (err) {
    console.error("OrdersPage fetch hatası:", err);
    return (
      <p className="p-4 text-red-500">Siparişler yüklenirken hata oluştu.</p>
    );
  }

  return (
    <div className="py-8">
      {categories.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300 text-center">
          Henüz kategori yok.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {category.imageUrl ? (
                <div className="relative w-full h-64 md:h-80 lg:h-[400px] xl:h-[500px]">
                  <Image
                    src={category.imageUrl}
                    alt={`${category.name} kategorisi`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-64 md:h-80 lg:h-[400px] xl:h-[500px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-300">
                    Resim yok
                  </span>
                </div>
              )}
              {/* Kategori ismi overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3">
                <span className="text-white text-lg md:text-xl lg:text-2xl font-semibold">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

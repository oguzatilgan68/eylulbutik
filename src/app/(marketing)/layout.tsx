import { cookies } from "next/headers";
import { Footer } from "./components/ui/Footer";
import { MarketingNavbar } from "./components/ui/MarketingNavbar";
import { redirect } from "next/navigation";
import { getGenericData } from "./lib/getGenericData";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  
  let categories = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    if (res.status === 401) {
      redirect("/login");
    }

    if (res.ok) {
      const text = await res.text();
      // Yanıt boş değilse JSON'a çevir, boşsa boş dizi ata
      categories = text ? JSON.parse(text) : [];
    }
  } catch (error) {
    console.error("Kategoriler çekilirken hata oluştu:", error);
  }

  const genericData = await getGenericData();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <MarketingNavbar categories={categories} />
      <main className="flex-1 container mx-auto p-2">{children}</main>
      <Footer />
    </div>
  );
}
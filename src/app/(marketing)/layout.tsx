import { cookies } from "next/headers";
import { Footer } from "./components/ui/Footer";
import { MarketingNavbar } from "./components/ui/MarketingNavbar";
import { UserProvider } from "./context/userContext";
import { redirect } from "next/navigation";
import { GenericDataProvider } from "./context/GenericDataContext";
import { getGenericData } from "./lib/getGenericData";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); // tüm cookie'leri al
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  const genericData = await getGenericData();

  if (res.status === 401) {
    redirect("/login");
  }
  const categories = await res.json();
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <UserProvider>
        <MarketingNavbar categories={categories} />
        <GenericDataProvider value={genericData}>
          <main className="flex-1 container mx-auto p-2">{children}</main>
          <Footer />
        </GenericDataProvider>
      </UserProvider>
    </div>
  );
}

import { Footer } from "./components/ui/Footer";
import { MarketingNavbar } from "./components/ui/MarketingNavbar";
import { db } from "./lib/db";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const categories = await db.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <MarketingNavbar categories={categories} />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}

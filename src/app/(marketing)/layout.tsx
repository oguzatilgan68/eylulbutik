import { MarketingNavbar } from "./components/ui/MarketingNavbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

import { Metadata } from "next";
import { Footer } from "./(marketing)/components/ui/Footer";
import { MarketingNavbar } from "./(marketing)/components/ui/MarketingNavbar";
import ThemeProviders from "./(marketing)/components/ui/ThemeProvider";
import "./globals.css";
const metaData: Metadata = {
  title: "Eylül Butik - Online Alışverişin Keyfi",
  description:
    "Eylül Butik ile modanın ve alışverişin keyfini çıkarın. En yeni trendler, kaliteli ürünler ve uygun fiyatlarla dolu geniş ürün yelpazemizle tanışın. Hemen alışverişe başlayın!",
  keywords:
    "alışveriş, butik, moda, kıyafet, ayakkabı, aksesuar, online alışveriş, trendy ürünler",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <ThemeProviders>
          <MarketingNavbar />
          <div className="flex flex-col min-h-screen">
            <main className="grow">{children}</main>
            <Footer />
          </div>
        </ThemeProviders>
      </body>
    </html>
  );
}

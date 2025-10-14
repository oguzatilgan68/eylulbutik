import { Metadata } from "next";
import ThemeProviders from "./(marketing)/components/ui/ThemeProvider";
import "./globals.css";
import { UserProvider } from "./(marketing)/context/userContext";

export const metadata: Metadata = {
  title: "EylülButik | Kadın, Erkek ve Çocuk Giyim Modası",
  description:
    "EylülButik; kadın, erkek ve çocuk giyim koleksiyonları ile en yeni moda trendlerini sunar. Pantolon, gömlek, büstiyer ve daha fazlası ile tarzınızı yansıtın.",
  icons: {
    icon: "/favicon.png",
  },
  keywords: [
    "EylülButik",
    "kadın giyim",
    "erkek giyim",
    "çocuk giyim",
    "moda",
    "yeni moda",
    "pantolon",
    "gömlek",
    "büstiyer",
    "etek",
    "ceket",
    "tunik",
    "bluz",
    "sweatshirt",
    "t-shirt",
    "çocuk pantolon",
    "çocuk gömlek",
    "erkek pantolon",
    "erkek gömlek",
    "stil",
    "trend",
    "alışveriş",
    "online alışveriş",
    "butik giyim",
  ],
  authors: [{ name: "Eylül Butik", url: "https://eylulbutik.vercel.app" }],
  creator: "Eylül Butik",
  openGraph: {
    title: "EylülButik | Kadın, Erkek ve Çocuk Giyim",
    description:
      "EylülButik; pantolon, gömlek, büstiyer ve daha fazlası ile kadın, erkek ve çocuk giyimde en yeni trendleri sunar.",
    url: "https://eylulbutik.vercel.app",
    siteName: "EylülButik",
    images: [
      {
        url: "/og-image.jpg", // paylaşım görseli
        width: 1200,
        height: 630,
        alt: "EylülButik Moda Koleksiyonu",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EylülButik | Kadın, Erkek ve Çocuk Giyim",
    description:
      "EylülButik ile en yeni moda trendlerini keşfedin. Pantolon, gömlek, büstiyer ve daha fazlası sizi bekliyor.",
    images: ["/og-image.jpg"],
  },
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
          <UserProvider>{children}</UserProvider>
        </ThemeProviders>
      </body>
    </html>
  );
}

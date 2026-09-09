import { Category } from "@/generated/prisma";
import HomePageClient from "./components/ui/HomePageClient";
import { Suspense } from "react";
import Loading from "./loading";
import { db } from "@/app/(marketing)/lib/db"; // Veya projenizdeki db dosyasının doğru yolu

export default async function HomePage() {
  let categories: Category[] = [];

  try {
    // HTTP fetch yerine doğrudan veritabanından çekiyoruz
    categories = await db.category.findMany();
  } catch (err) {
    console.error("Anasayfa veritabanı hatası:", err);
    categories = [];
  }

  return (
    <Suspense fallback={<Loading />}>
      <HomePageClient categories={categories} />
    </Suspense>
  );
}
import { cookies } from "next/headers";
import { Category } from "@/generated/prisma";
import HomePageClient from "./components/ui/HomePageClient";
import { Suspense } from "react";
import Loading from "./loading";
import { apiFetch } from "./lib/error-fetcher";

export default async function HomePage() {
  const cookieStore = await cookies();
  let categories: Category[] = [];

  try {
    categories = await apiFetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/categories`,
      {
        cache: "no-store",
        headers: { Cookie: cookieStore.toString() },
      }
    );
  } catch (err) {
    console.error("Anasayfa fetch hatası:", err);
    categories = [];
  }

  return (
    <Suspense fallback={<Loading />}>
      <HomePageClient categories={categories} />
    </Suspense>
  );
}

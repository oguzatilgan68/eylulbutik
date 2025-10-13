import { cookies } from "next/headers";
import { Category } from "@/generated/prisma";
import HomePageClient from "./components/ui/HomePageClient";
import { Suspense } from "react";
import Loading from "./loading";

export default async function HomePage() {
  const cookieStore = await cookies();
  let categories: Category[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/categories`,
      {
        cache: "no-store",
        headers: { Cookie: cookieStore.toString() },
      }
    );

    if (!res.ok) throw new Error("Kategoriler yüklenemedi");

    categories = await res.json();
  } catch (err) {
    console.error("HomePage fetch hatası:", err);
  }

  return (
    <Suspense fallback={<Loading />}>
      <HomePageClient categories={categories} />
    </Suspense>
  );
}

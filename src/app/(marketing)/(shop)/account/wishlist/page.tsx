import { redirect } from "next/navigation";
import WishlistGrid from "./WishlistGrid";
import { cookies } from "next/headers";

export default async function WishlistPage() {
  const cookieStore = await cookies(); // tüm cookie'leri al
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/wishlist`, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (res.status === 401) {
    redirect("/login");
  }

  const data = await res.json();

  if (!data.products || data.products.length === 0) {
    return <p>Favori ürününüz yok.</p>;
  }

  return <WishlistGrid products={data.products} userId={data.userId} />;
}

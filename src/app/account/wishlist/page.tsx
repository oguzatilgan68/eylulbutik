import { redirect } from "next/navigation";
import WishlistGrid from "./WishlistGrid";
import { cookies } from "next/headers";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";

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
  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "Favori Ürünleri", href: "/account/wishlist" },
  ];
  const data = await res.json();
  return (
    <>
      <Breadcrumb items={breadcrumbs} />
      {!data.products ||
        (data.products.length === 0 && <p>Favori ürününüz yok.</p>)}
      <WishlistGrid products={data.products} userId={data.userId} />
    </>
  );
}

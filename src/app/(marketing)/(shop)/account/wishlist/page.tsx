import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";
import { serializeProduct } from "@/app/(marketing)/lib/serializers";
import WishlistGrid from "./WishlistGrid";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
  const userId = await getAuthUserId();

  if (!userId) {
    redirect("/login");
  }

  const wishlist = await db.wishlist.findFirst({
    where: { userId },
    include: { products: { include: { images: true, brand: true } } },
  });

  if (!wishlist || wishlist.products.length === 0)
    return <p>Favori ürününüz yok.</p>;

  const products = wishlist.products.map(serializeProduct);

  return <WishlistGrid products={products} userId={userId} />;
}

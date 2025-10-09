import { cookies } from "next/headers";
import OrdersListClient from "./orderClient";
import { Order } from "@/generated/prisma";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";

export default async function OrdersPage() {
  const cookieStore = await cookies(); // tüm cookie'leri al
  let orders: Order[];
  const breadcrumbs = [
    { label: "Hesabım", href: "/hesabım" },
    { label: "Siparişlerim", href: "/orders" },
  ];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders`, {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(), // cookie'leri API'ye gönder
      },
    });

    if (!res.ok) {
      throw new Error("Siparişler yüklenemedi");
    }

    orders = await res.json();
  } catch (err) {
    console.error("OrdersPage fetch hatası:", err);
    return (
      <p className="p-4 text-red-500">Siparişler yüklenirken hata oluştu.</p>
    );
  }

  return (
    <>
      <Breadcrumb items={breadcrumbs} />
      <OrdersListClient orders={orders} />
    </>
  );
}

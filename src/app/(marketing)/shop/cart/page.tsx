import React from "react";
import { prisma } from "../../../lib/db";
import Link from "next/link";

export default async function CartPage() {
  const cart = await prisma.cart.findFirst({
    where: { userId: "CURRENT_USER_ID" }, // Auth ile değiştirilecek
    include: {
      items: {
        include: { product: { include: { images: true } }, variant: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) return <p>Sepetiniz boş.</p>;

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.unitPrice.toNumber() * item.qty,
    0
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sepetiniz</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <img
              src={item.product.images[0]?.url}
              alt={item.product.name}
              className="w-16 h-16 rounded"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.product.name}</p>
              {item.variant && (
                <p className="text-gray-500">
                  {JSON.stringify(item.variant.attributes)}
                </p>
              )}
              <p>Adet: {item.qty}</p>
            </div>
            <p>{(item.unitPrice.toNumber() * item.qty).toFixed(2)} TL</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Toplam:</span>
        <span>{subtotal.toFixed(2)} TL</span>
      </div>
      <Link
        href="/shop/checkout"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Ödeme Yap
      </Link>
    </div>
  );
}

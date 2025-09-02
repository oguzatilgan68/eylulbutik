import React from "react";
import { prisma } from "../../../lib/db";
import { useState } from "react";

export default async function CheckoutPage() {
  const cart = await prisma.cart.findFirst({
    where: { userId: "CURRENT_USER_ID" }, // Auth ile değiştirilecek
    include: {
      items: { include: { product: true, variant: true } },
    },
  });

  if (!cart || cart.items.length === 0) return <p>Sepetiniz boş.</p>;

  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    // Stripe/Ödeme API entegrasyonu
    setLoading(false);
  };

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.unitPrice.toNumber() * item.qty,
    0
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Ödeme</h1>

      <div className="space-y-4 border p-4 rounded">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.product.name} x {item.qty}
            </span>
            <span>{(item.unitPrice.toNumber() * item.qty).toFixed(2)} TL</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Toplam:</span>
          <span>{subtotal.toFixed(2)} TL</span>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleCheckout}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {loading ? "Yükleniyor..." : "Ödeme Yap"}
      </button>
    </div>
  );
}

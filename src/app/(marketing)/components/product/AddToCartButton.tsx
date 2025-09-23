"use client";

import { useState } from "react";
import { Button } from "@/app/(marketing)/components/ui/button";

type Props = {
  productId: string;
  variantId?: string;
  disabled?: boolean; // burayı ekle
};

export default function AddToCartButton({
  productId,
  variantId,
  disabled = false,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function add() {
    setLoading(true);
    try {
      const r = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, qty: 1 }),
      });
      if (r.status === 401) {
        alert("Lütfen giriş yapın.");
        return;
      }
      const j = await r.json();
      if (!j?.ok) throw new Error("Sepete eklenemedi");
      // İsteğe bağlı: toast gösterin
    } catch (e) {
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={add}
      disabled={loading || disabled}
      className="mt-4 w-full lg:w-1/2 bg-red-500 hover:bg-red-600 text-white rounded-xl cursor-pointer"
    >
      {loading ? "Ekleniyor..." : "Sepete Ekle"}
    </Button>
  );
}

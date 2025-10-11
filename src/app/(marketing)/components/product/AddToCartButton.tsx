"use client";

import { useState } from "react";
import { Button } from "@/app/(marketing)/components/ui/button";
import Swal from "sweetalert2";

type Props = {
  productId: string;
  variantId?: string;
  disabled?: boolean;
};

export default function AddToCartButton({
  productId,
  variantId,
  disabled = false,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function add() {
    if (loading) return; // çift tıklamayı önle
    setLoading(true);

    try {
      const r = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, qty: 1 }),
      });

      if (r.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Lütfen giriş yapın.",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      const j = await r.json();
      if (!j?.ok) throw new Error("Sepete eklenemedi");

      Swal.fire({
        icon: "success",
        title: "Sepete eklendi",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Bir hata oluştu",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={add}
      disabled={loading || disabled}
      className={`mt-4 w-full lg:w-1/2 bg-red-500 hover:bg-red-600 text-white rounded-xl ${
        loading || disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      {loading ? "Ekleniyor..." : "Sepete Ekle"}
    </Button>
  );
}

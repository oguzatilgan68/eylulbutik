"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/(marketing)/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = { productId: string };

export default function WishlistButton({ productId }: Props) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/wishlist/status?productId=${productId}`, {
          cache: "no-store",
        });
        const j = await r.json();
        if (!cancelled) setInWishlist(Boolean(j?.inWishlist));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function toggle() {
    setLoading(true);
    try {
      const r = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (r.status === 401) {
        router.push("/login");
      }
      const j = await r.json();
      setInWishlist(Boolean(j?.inWishlist));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 rounded-xl border dark:border-gray-700 cursor-pointer ${
        inWishlist
          ? "bg-pink-500 text-white hover:bg-pink-600"
          : "bg-white dark:bg-gray-900 dark:text-gray-200"
      }`}
      aria-pressed={inWishlist}
      aria-label={inWishlist ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
      {inWishlist ? "Favoride" : "Favoriye Ekle"}
    </Button>
  );
}

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
      onClick={toggle}
      disabled={loading}
      aria-pressed={inWishlist}
      aria-label={inWishlist ? "Favorilerden çıkar" : "Favorilere ekle"}
      className={`flex items-center gap-2 rounded-xl border transition-colors duration-200
              ${
                inWishlist
                  ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                  : "bg-white hover:bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
              }
              ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <Heart
        className={`h-5 w-5 transition-all duration-200 drop-shadow-sm ${
          inWishlist
            ? "fill-current stroke-white dark:stroke-gray-200"
            : "text-transparent stroke-gray-600 dark:stroke-gray-300"
        }`}
        strokeWidth={2}
      />
    </Button>
  );
}

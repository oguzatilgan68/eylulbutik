"use client";
import Link from "next/link";
import Image from "next/image";

export default function ReturnItemList({ items }: { items: any[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i.id}>
          {i.orderItem.product && (
            <Link
              href={`/product/${i.orderItem.product.slug}`}
              target="_blank"
              className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-md transition"
            >
              <Image
                src={i.orderItem.product.images?.[0]?.url || "/placeholder.png"}
                alt={i.orderItem.product.name}
                width={50}
                height={50}
                className="w-12 h-12 object-cover rounded border dark:border-slate-700"
              />
              <div className="flex-1">
                <div className="font-medium">{i.orderItem.product.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    x {i.qty}
                  </span>
                  {i.reason && (
                    <span className="text-xs bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 px-2 py-0.5 rounded-full">
                      {i.reason === "PRODUCT_DEFECT"
                        ? "Kusurlu Ürün"
                        : i.reason === "WRONG_ITEM_SENT"
                          ? "Yanlış Ürün Gönderildi"
                          : i.reason === "SHIPPING_DELAY"
                            ? "Kargo Gecikti"
                            : i.reason === "OTHER"
                              ? "Diğer"
                              : "Müşteri Talebi"}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

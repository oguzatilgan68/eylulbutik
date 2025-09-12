import React from "react";
import Link from "next/link";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";

export default async function ReturnsPage() {
  const userId = await getAuthUserId();
  const returns = await db.returnRequest.findMany({
    where: { userId },
    include: { items: { include: { orderItem: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">İade Taleplerim</h1>
      <Link className="btn" href="/account/returns/new">
        Yeni iade oluştur
      </Link>
      <ul className="mt-4 space-y-4">
        {returns.map((r) => (
          <li key={r.id} className="p-4 border rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Talep: {r.id}</div>
                <div className="text-sm text-gray-600">Durum: {r.status}</div>
                <div className="text-sm">Sipariş: {r.orderId}</div>
              </div>
              <Link href={`/account/returns/${r.id}`} className="underline">
                Detay
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

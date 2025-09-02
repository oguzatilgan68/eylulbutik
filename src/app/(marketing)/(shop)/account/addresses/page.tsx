import React from "react";
import Link from "next/link";
import { db } from "@/app/(marketing)/lib/db";

export default async function AddressesPage() {
  const addresses = await db.address.findMany({
    where: { userId: "CURRENT_USER_ID" }, // Auth ile değiştirilecek
  });

  return (
    <div className="space-y-4">
      <Link
        href="/account/addresses/new"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Yeni Adres Ekle
      </Link>

      {addresses.length === 0 ? (
        <p>Henüz kayıtlı adresiniz yok.</p>
      ) : (
        addresses.map((address) => (
          <div
            key={address.id}
            className="border rounded p-4 bg-gray-50 dark:bg-gray-900"
          >
            <p className="font-semibold">{address.title}</p>
            <p>
              {address.fullName} - {address.phone}
            </p>
            <p>
              {address.address1}{" "}
              {address.address2 ? `, ${address.address2}` : ""}
            </p>
            <p>
              {address.district}, {address.city}, {address.zip}
            </p>
            <div className="mt-2 flex gap-2">
              <Link
                href={`/account/addresses/${address.id}`}
                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Düzenle
              </Link>
              <button className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                Sil
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

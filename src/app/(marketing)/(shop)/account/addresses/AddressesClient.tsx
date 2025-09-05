"use client";
import React, { useState } from "react";
import Link from "next/link";

type Address = {
  id: string;
  title?: string;
  fullName?: string;
  phone?: string;
  address1?: string;
  district?: string;
  city?: string;
  zip?: string;
};

export default function AddressesClient({
  addresses: initialAddresses,
}: {
  addresses: Address[];
}) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses || []);

  const deleteAddress = async (id: string) => {
    if (!confirm("Bu adresi silmek istediğine emin misin?")) return;

    try {
      const res = await fetch(`/api/address/${id}`, { method: "DELETE" });

      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        alert("Adres silindi ✅");
      } else {
        const data = await res.json().catch(() => null);
        alert(
          "Adres silinemedi ❌" + (data?.message ? `: ${data.message}` : "")
        );
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu!");
    }
  };

  if (!addresses.length) return <p>Henüz kayıtlı adresiniz yok.</p>;

  return (
    <>
      {addresses.map((address) => (
        <div
          key={address.id}
          className="border rounded p-4 bg-gray-50 dark:bg-gray-900"
        >
          <p className="font-semibold">{address.title}</p>
          <p>
            {address.fullName} - {address.phone}
          </p>
          <p>{address.address1}</p>
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
            <button
              onClick={() => deleteAddress(address.id)}
              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sil
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

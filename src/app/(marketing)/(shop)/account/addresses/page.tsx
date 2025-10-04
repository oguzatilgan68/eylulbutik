"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AddressesClient from "./AddressesClient";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/address");
        if (!res.ok) throw new Error("Adresler yüklenemedi");
        const data = await res.json();
        setAddresses(data.addresses);
      } catch (err: any) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  if (loading) return <p className="p-4">Yükleniyor...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <Link
        href="/account/addresses/new"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Yeni Adres Ekle
      </Link>

      <AddressesClient addresses={addresses} />
    </div>
  );
}

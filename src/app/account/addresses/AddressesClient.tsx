"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiHome } from "react-icons/fi";

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
    if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/address/${id}`, { method: "DELETE" });

      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      } else {
        const data = await res.json().catch(() => null);
        alert("Adres silinemedi ❌" + (data?.message ? `: ${data.message}` : ""));
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu!");
    }
  };

  if (!addresses.length) {
    return (
      <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
          <FiMapPin size={22} />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">Kayıtlı Adresiniz Yok</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Hızlı ve güvenli sipariş verebilmek için hemen yeni bir teslimat adresi ekleyin.
        </p>
        <div className="pt-2">
          <Link
            href="/account/addresses/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-xs shadow-md shadow-pink-500/20 transition-all"
          >
            <FiPlus size={16} /> Yeni Adres Ekle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Yeni Ekle */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiMapPin className="text-pink-600" /> Adreslerim
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Teslimat adreslerinizi yönetin ve güncelleyin.
          </p>
        </div>
        <Link
          href="/account/addresses/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-all"
        >
          <FiPlus size={16} /> Yeni Adres
        </Link>
      </div>

      {/* Adres Kartları Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between space-y-4 transition-all hover:border-pink-500/40"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                  <FiHome className="text-pink-600" /> {address.title || "Ev / İş Adresi"}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                  {address.city}
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 pt-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {address.fullName} <span className="text-gray-400 font-normal">({address.phone})</span>
                </p>
                <p className="leading-relaxed">{address.address1}</p>
                <p className="text-xs text-gray-500">
                  {address.district} / {address.city} {address.zip ? `- PK: ${address.zip}` : ""}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 justify-end">
              <Link
                href={`/account/addresses/${address.id}`}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold transition-colors"
              >
                <FiEdit2 size={13} /> Düzenle
              </Link>
              <button
                type="button"
                onClick={() => deleteAddress(address.id)}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold transition-colors cursor-pointer"
              >
                <FiTrash2 size={13} /> Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
}
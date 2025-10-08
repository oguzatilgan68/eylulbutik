"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

export default function BrandList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const url = useEffect(() => {
    fetch(`/api/brands`)
      .then((res) => res.json())
      .then(setBrands);
  }, []);

  const deleteBrand = async (id: string) => {
    if (!confirm("Brand silinecek. Devam edilsin mi?")) return;
    await fetch(`/api/brands/${id}`, { method: "DELETE" });
    setBrands(brands.filter((b) => b.id !== id));
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Markalar</h1>
        <Link
          href="brands/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Marka Ekle
        </Link>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
              Logo
            </th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
              Marka İsmi
            </th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr
              key={brand.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                {brand.name}
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 space-x-2">
                <Link
                  href={`/admin/brands/${brand.id}`}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Düzenle
                </Link>
                <button
                  onClick={() => deleteBrand(brand.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

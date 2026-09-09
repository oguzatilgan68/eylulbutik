"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiTag } from "react-icons/fi";

interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

export default function BrandList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/brands`)
      .then((res) => res.json())
      .then((data) => {
        setBrands(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const deleteBrand = async (id: string) => {
    if (!confirm("Bu markayı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silme başarısız");
      setBrands(brands.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Marka silinemedi.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Yeni Marka Ekle Butonu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Marka Yönetimi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Sitede yer alan tüm markaları buradan listeleyebilir ve yönetebilirsiniz.
          </p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium shadow-md shadow-pink-500/20 transition-all"
        >
          <FiPlus size={18} /> Marka Ekle
        </Link>
      </div>

      {/* Tablo Alanı */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3.5">Logo</th>
                <th className="px-6 py-3.5">Marka İsmi</th>
                <th className="px-6 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                      <span>Markalar yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : brands?.length > 0 ? (
                brands.map((brand) => (
                  <tr
                    key={brand.id}
                    className="hover:bg-pink-50/30 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-11 h-11 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-700">
                          <FiTag size={18} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {brand.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/brands/${brand.id}`}
                          className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-semibold flex items-center gap-1.5"
                        >
                          <FiEdit2 size={13} /> Düzenle
                        </Link>
                        <button
                          onClick={() => deleteBrand(brand.id)}
                          className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors text-xs font-semibold flex items-center gap-1.5"
                        >
                          <FiTrash2 size={13} /> Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Henüz marka eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiLayers, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

interface AttributeValue {
  id: string;
  value: string;
}

interface AttributeType {
  id: string;
  name: string;
  values: AttributeValue[];
}

export default function AttributeTypesPage() {
  const [types, setTypes] = useState<AttributeType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTypes = async () => {
    try {
      const res = await fetch("/api/admin/attribute-types");
      const data = await res.json();
      if (res.ok) setTypes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu varyasyon grubunu silmek istediğinize emin misiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#db2777",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Evet, Sil",
      cancelButtonText: "Vazgeç",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/attribute-types/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silme başarısız");

      setTypes(types.filter((t) => t.id !== id));
      Swal.fire({ icon: "success", title: "Silindi!", timer: 1200, showConfirmButton: false });
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Hata!", text: err.message, confirmButtonColor: "#ef4444" });
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Yükleniyor...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiLayers className="text-pink-600" /> Varyasyon Tipleri (Renk, Beden vb.)
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Ürünlerinizde otomatik kombinasyon üretilmesini sağlayacak özellikleri ve değerlerini yönetin.
          </p>
        </div>
        <Link href="/admin/attribute-types/new">
          <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-4 text-xs font-semibold shadow-md shadow-pink-500/20 cursor-pointer">
            <FiPlus size={16} className="mr-1.5" /> Yeni Varyasyon Tipi Ekle
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map((t) => (
          <div key={t.id} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h2 className="font-bold text-base text-gray-900 dark:text-white mb-2">{t.name}</h2>
              <div className="flex flex-wrap gap-1.5">
                {t.values.map((v) => (
                  <span key={v.id} className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-100 dark:border-gray-700">
                    {v.value}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 justify-end">
              <Link href={`/admin/attribute-types/${t.id}/edit`}>
                <Button size="sm" variant="ghost" className="h-8 px-3 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 cursor-pointer">
                  <FiEdit2 size={13} className="mr-1" /> Düzenle
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id)} className="h-8 px-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 cursor-pointer">
                <FiTrash2 size={13} className="mr-1" /> Sil
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
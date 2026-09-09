import DeleteButton from "@/app/(marketing)/components/attribute-types/DeleteButton";
import Link from "next/link";
import { Key } from "react";
import { FiPlus, FiEdit2, FiLayers } from "react-icons/fi";

export default async function AttributeTypesPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/attribute-types`,
    {
      cache: "no-store",
    }
  );
  const types = await res.json();

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Yeni Ekle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiLayers className="text-pink-600" /> Varyasyon Tipleri (Beden, Renk vb.)
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Ürün varyantlarında kullanılan özellik gruplarını buradan yönetebilirsiniz.
          </p>
        </div>
        <Link
          href="/admin/attribute-types/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium shadow-md shadow-pink-500/20 transition-all"
        >
          <FiPlus size={18} /> Yeni Ekle
        </Link>
      </div>

      {/* Liste Alanı */}
      {types && types.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map(
            (t: { id: Key | null | undefined; name: string; values: any[] }) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-pink-500/50 transition-all"
              >
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                    {t.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.values && t.values.length > 0 ? (
                      t.values.map((v) => (
                        <span
                          key={v.id || v.value}
                          className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700"
                        >
                          {v.value}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">Değer eklenmemiş</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 justify-end">
                  <Link
                    href={`/admin/attribute-types/${String(t.id)}/edit`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    <FiEdit2 size={13} /> Düzenle
                  </Link>
                  <DeleteButton id={t.id ? String(t.id) : ""} />
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Henüz attribute tipi eklenmemiş.
          </p>
        </div>
      )}
    </div>
  );
}
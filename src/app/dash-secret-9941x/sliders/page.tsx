"use client";

import useSWR from "swr";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiImage } from "react-icons/fi";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SliderList() {
  const { data: sliders, mutate, isLoading } = useSWR("/api/admin/sliders", fetcher);

  const deleteSlider = async (id: string) => {
    if (!confirm("Bu slider'ı silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/admin/sliders/${id}`, { method: "DELETE" });
      mutate();
    } catch (err) {
      console.error(err);
      alert("Slider silinemedi.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve Yeni Slider Ekle Butonu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Slider Yönetimi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Anasayfa kayan görsellerini ve kampanyalarını buradan yönetebilirsiniz.
          </p>
        </div>
        <Link
          href="/admin/sliders/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium shadow-md shadow-pink-500/20 transition-all"
        >
          <FiPlus size={18} /> Yeni Slider
        </Link>
      </div>

      {/* Tablo Alanı */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3.5 w-16">#</th>
                <th className="px-6 py-3.5">Başlık</th>
                <th className="px-6 py-3.5">Tip</th>
                <th className="px-6 py-3.5">Ürün</th>
                <th className="px-6 py-3.5">Aktif</th>
                <th className="px-6 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                      <span>Sliderlar yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : sliders?.length > 0 ? (
                sliders.map((slider: any, idx: number) => (
                  <tr
                    key={slider.id}
                    className="hover:bg-pink-50/30 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {slider.title || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {slider.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {slider.product?.name || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        slider.isActive 
                          ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400" 
                          : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                      }`}>
                        {slider.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/sliders/${slider.id}`}
                          className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-semibold flex items-center gap-1.5"
                        >
                          <FiEdit2 size={13} /> Düzenle
                        </Link>
                        <button
                          onClick={() => deleteSlider(slider.id)}
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
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Henüz slider eklenmemiş.
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
"use client";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const cellClass = "border px-4 py-2 dark:border-gray-700";
const buttonBase =
  "px-2 py-1 rounded text-white transition-colors duration-200";
const headerClass = `${cellClass} bg-gray-100 dark:bg-gray-800 font-semibold`;

export default function SliderList() {
  const { data: sliders, mutate } = useSWR("/api/admin/sliders", fetcher);

  const deleteSlider = async (id: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    await fetch(`/api/admin/sliders/${id}`, { method: "DELETE" });
    mutate();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Slider Listesi</h1>
        <Link
          href="/admin/sliders/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Yeni Slider
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700 text-sm md:text-base">
          <thead>
            <tr>
              {["#", "Başlık", "Tip", "Ürün", "Aktif", "İşlemler"].map(
                (header) => (
                  <th key={header} className={headerClass}>
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {sliders?.length ? (
              sliders.map((slider: any, idx: number) => (
                <tr
                  key={slider.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className={cellClass}>{idx + 1}</td>
                  <td className={cellClass}>{slider.title || "-"}</td>
                  <td className={cellClass}>{slider.type}</td>
                  <td className={cellClass}>{slider.product?.name || "-"}</td>
                  <td className={cellClass}>{slider.isActive ? "✅" : "❌"}</td>
                  <td className={`${cellClass} flex gap-2`}>
                    <Link
                      href={`/admin/sliders/${slider.id}`}
                      className={`${buttonBase} bg-yellow-500 hover:bg-yellow-600`}
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => deleteSlider(slider.id)}
                      className={`${buttonBase} bg-red-500 hover:bg-red-600`}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className={`${cellClass} text-center py-6 text-gray-500 dark:text-gray-400`}
                >
                  Henüz slider eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

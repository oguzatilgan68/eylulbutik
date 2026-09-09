"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheck, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

interface BrandFormProps {
  initialData?: { name: string; logoUrl?: string };
  brandId?: string;
}

export default function BrandForm({ initialData, brandId }: BrandFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = brandId ? "PATCH" : "POST";
      const url = brandId ? `/api/brands/${brandId}` : "/api/brands";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logoUrl }),
      });

      if (!res.ok) throw new Error("İşlem başarısız");
      router.push("/admin/brands");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Üst Geri Dön Butonu ve Başlık */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <Link
          href="/admin/brands"
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
        >
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {brandId ? "Markayı Düzenle" : "Yeni Marka Ekle"}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Marka bilgilerini güncelleyin veya yeni bir marka tanımlayın.
          </p>
        </div>
      </div>

      {/* Form Kutusu */}
      <form
        onSubmit={submit}
        className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5"
      >
        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Marka Adı *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Eylül Collection"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Logo URL
          </label>
          <input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className={inputClass}
          />
        </div>

        {/* Canlı Logo Önizlemesi */}
        {logoUrl && (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-gray-400">Önizleme:</span>
            <img
              src={logoUrl}
              alt="Logo Önizleme"
              className="w-12 h-12 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
              onError={(e) => {
                // Görsel yüklenemezse kırık resim simgesini gizle
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-pink-600 text-white rounded-xl hover:bg-pink-700 shadow-md shadow-pink-500/20 transition-all font-medium text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <FiCheck size={16} /> {brandId ? "Değişiklikleri Kaydet" : "Markayı Oluştur"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { FiSettings, FiCheck, FiGlobe, FiPhone, FiMail, FiMapPin, FiShare2 } from "react-icons/fi";

interface GenericData {
  id?: string;
  brandName?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  tiktokUrl?: string;
  description?: string;
}

export default function GenericDataPage() {
  const [form, setForm] = useState<GenericData>({});
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Modern input sınıfı (Diğer formlarınla tam uyumlu)
  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  // Form alanları ve ikonları
  const fields = [
    { name: "brandName", label: "Marka Adı", icon: <FiGlobe className="text-gray-400" /> },
    { name: "logoUrl", label: "Logo URL", icon: <FiGlobe className="text-gray-400" /> },
    { name: "phone", label: "İletişim Telefonu", placeholder: "5XXXXXXXXX (10 Haneli)", icon: <FiPhone className="text-gray-400" /> },
    { name: "email", label: "E-posta Adresi", icon: <FiMail className="text-gray-400" /> },
    { name: "address", label: "Firma Adresi", icon: <FiMapPin className="text-gray-400" /> },
    { name: "instagramUrl", label: "Instagram Linki", icon: <FiShare2 className="text-pink-600" /> },
    { name: "facebookUrl", label: "Facebook Linki", icon: <FiShare2 className="text-blue-600" /> },
    { name: "youtubeUrl", label: "YouTube Linki", icon: <FiShare2 className="text-rose-600" /> },
    { name: "linkedinUrl", label: "LinkedIn Linki", icon: <FiShare2 className="text-blue-500" /> },
    { name: "tiktokUrl", label: "TikTok Linki", icon: <FiShare2 className="text-gray-800 dark:text-gray-200" /> },
  ];

  // Veriyi çek ve formu doldur
  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/generic-data");
      const data = await res.json();

      if (data && data.length > 0) {
        setForm(data[0]);
        setEditId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Form değişimi
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Kaydet veya Güncelle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editId ? "PATCH" : "POST";
      const res = await fetch("/api/admin/generic-data", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editId ? { id: editId, ...form } : form),
      });

      if (!res.ok) throw new Error("İşlem başarısız");
      alert("Site bilgileri başarıyla kaydedildi! ✨");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Kaydedilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Üst Başlık */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiSettings className="text-pink-600" /> Genel Site Bilgileri ve Ayarlar
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Eylül Butik'in marka adını, iletişim kanallarını ve sosyal medya hesaplarını buradan yönetin.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6"
      >
        {/* Temel Bilgiler & İletişim */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
            Temel Bilgiler & İletişim
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.slice(0, 5).map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 items-center gap-1.5">
                  {field.icon} {field.label}
                </label>
                <input
                  name={field.name}
                  placeholder={field.placeholder || field.label}
                  value={form[field.name as keyof GenericData] || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sosyal Medya Linkleri */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
            Sosyal Medya Hesapları
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.slice(5).map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 items-center gap-1.5">
                  {field.icon} {field.label}
                </label>
                <input
                  name={field.name}
                  placeholder={`https://${field.name.replace('Url', '')}.com/...`}
                  value={form[field.name as keyof GenericData] || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hakkında / Açıklama */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Firma Açıklaması / Hakkımızda Meta Yazısı
          </label>
          <textarea
            name="description"
            placeholder="Eylül Butik hakkında kısa açıklama..."
            value={form.description || ""}
            onChange={handleChange}
            className={`${inputClass} min-h-[120px] resize-y`}
          />
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium text-sm shadow-md shadow-pink-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <FiCheck size={16} /> {editId ? "Değişiklikleri Güncelle" : "Bilgileri Kaydet"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
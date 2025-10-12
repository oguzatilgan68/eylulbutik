"use client";

import { useEffect, useState } from "react";

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

  // 🔹 Ortak input sınıfı
  const baseInputClass =
    "w-full border border-gray-300 dark:border-gray-700 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition";

  // 🔹 Form alanları
  const fields = [
    { name: "brandName", placeholder: "Marka Adı" },
    { name: "logoUrl", placeholder: "Logo URL" },
    { name: "phone", placeholder: "5XXXXXXXXX 10 Haneli" },
    { name: "email", placeholder: "E-posta" },
    { name: "address", placeholder: "Adres" },
    { name: "instagramUrl", placeholder: "Instagram" },
    { name: "facebookUrl", placeholder: "Facebook" },
    { name: "youtubeUrl", placeholder: "YouTube" },
    { name: "linkedinUrl", placeholder: "LinkedIn" },
    { name: "tiktokUrl", placeholder: "TikTok" },
  ];

  // 🔹 Veriyi çek ve formu doldur
  const fetchData = async () => {
    const res = await fetch("/api/admin/generic-data");
    const data = await res.json();

    if (data && data.length > 0) {
      setForm(data[0]);
      setEditId(data[0].id);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Form değişimi
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Kaydet veya Güncelle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editId ? "PATCH" : "POST";
      await fetch("/api/admin/generic-data", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editId ? { id: editId, ...form } : form),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Genel Site Bilgileri
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
      >
        {/* Dinamik Input Alanları */}
        {fields.map((field) => (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={form[field.name as keyof GenericData] || ""}
            onChange={handleChange}
            className={baseInputClass}
          />
        ))}

        {/* Açıklama */}
        <textarea
          name="description"
          placeholder="Açıklama"
          value={form.description || ""}
          onChange={handleChange}
          className={`${baseInputClass} h-24 resize-none`}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {editId ? "Güncelle" : "Kaydet"}
        </button>
      </form>
    </div>
  );
}

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
  const [dataList, setDataList] = useState<GenericData[]>([]);
  const [form, setForm] = useState<GenericData>({});
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // 🔹 Verileri çek
  const fetchData = async () => {
    const res = await fetch("/api/generic-data");
    const data = await res.json();
    setDataList(data);
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

  // 🔹 Kaydet (create/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await fetch("/api/generic-data", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...form }),
        });
      } else {
        await fetch("/api/generic-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      setForm({});
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Sil
  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;

    await fetch("/api/generic-data", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchData();
  };

  // 🔹 Düzenle
  const handleEdit = (item: GenericData) => {
    setEditId(item.id!);
    setForm(item);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Genel Site Bilgileri</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
      >
        <input
          name="brandName"
          placeholder="Marka Adı"
          value={form.brandName || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="logoUrl"
          placeholder="Logo URL"
          value={form.logoUrl || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="phone"
          placeholder="Telefon"
          value={form.phone || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          placeholder="E-posta"
          value={form.email || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="address"
          placeholder="Adres"
          value={form.address || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="instagramUrl"
          placeholder="Instagram"
          value={form.instagramUrl || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="facebookUrl"
          placeholder="Facebook"
          value={form.facebookUrl || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="youtubeUrl"
          placeholder="YouTube"
          value={form.youtubeUrl || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="linkedinUrl"
          placeholder="LinkedIn"
          value={form.linkedinUrl || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="tiktokUrl"
          placeholder="TikTok"
          value={form.tiktokUrl || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Açıklama"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editId ? "Güncelle" : "Kaydet"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({});
            }}
            className="ml-2 px-4 py-2 border rounded"
          >
            İptal
          </button>
        )}
      </form>

      {/* Liste */}
      <div className="space-y-4">
        {dataList.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-900"
          >
            <div>
              <p className="font-semibold">{item.brandName}</p>
              <p className="text-sm text-gray-600">{item.email}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-600 hover:underline"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(item.id!)}
                className="text-red-600 hover:underline"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

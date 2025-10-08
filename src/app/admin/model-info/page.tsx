"use client";

import { useEffect, useState } from "react";

interface Model {
  id: string;
  name: string;
  height?: number;
  weight?: number;
  chest?: number;
  waist?: number;
  hip?: number;
}

export default function ModelInfoPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [form, setForm] = useState<Partial<Model>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/model-info");
      if (res.ok) {
        const data = await res.json();
        setModels(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleSubmit = async () => {
    try {
      const url = editId
        ? `/api/admin/model-info/${editId}`
        : `/api/admin/model-info`;

      const method = editId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`İstek başarısız: ${res.status} - ${errorText}`);
      }

      setForm({});
      setEditId(null);
      await fetchModels();
    } catch (error) {
      console.error("Veri gönderme hatası:", error);
    }
  };

  const handleEdit = (model: Model) => {
    setForm(model);
    setEditId(model.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;

    const res = await fetch(`/api/model-info/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Silme işlemi başarısız: ${res.status} - ${errorText}`);
    }
    fetchModels();
  };

  const inputClass =
    "w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition";

  const fields = [
    { name: "height", label: "Boy" },
    { name: "weight", label: "Kilo" },
    { name: "chest", label: "Göğüs" },
    { name: "waist", label: "Bel" },
    { name: "hip", label: "Kalça" },
  ];

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
        Manken Bilgileri
      </h1>
      {/* Form Alanı */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {editId ? "Manken Düzenle" : "Yeni Manken Ekle"}
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="İsim"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fields.map((f) => (
              <input
                key={f.name}
                type="number"
                placeholder={f.label}
                value={form[f.name as keyof Model] ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [f.name]: parseInt(e.target.value) || undefined,
                  })
                }
                className={inputClass}
              />
            ))}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition disabled:opacity-50"
            >
              {editId ? "Güncelle" : "Ekle"}
            </button>
            {editId && (
              <button
                onClick={() => {
                  setEditId(null);
                  setForm({});
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                İptal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Manken Listesi */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition hover:shadow-md"
          >
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
              {m.name}
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>Boy: {m.height ?? "-"}</p>
              <p>Kilo: {m.weight ?? "-"}</p>
              <p>Göğüs: {m.chest ?? "-"}</p>
              <p>Bel: {m.waist ?? "-"}</p>
              <p>Kalça: {m.hip ?? "-"}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => handleEdit(m)}
              >
                Düzenle
              </button>
              <button
                className="flex-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => handleDelete(m.id)}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Boş Liste Durumu */}
      {!models.length && !loading && (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-10">
          Henüz kayıtlı manken bulunmuyor.
        </p>
      )}
    </div>
  );
}

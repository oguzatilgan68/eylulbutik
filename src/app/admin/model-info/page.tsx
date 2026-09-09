"use client";

import { useEffect, useState } from "react";
import { FiUserCheck, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

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
    if (!form.name) {
      alert("Lütfen manken adı girin.");
      return;
    }

    try {
      setLoading(true);
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
      alert("Kayıt sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (model: Model) => {
    setForm(model);
    setEditId(model.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu mankeni silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/model-info/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Silme işlemi başarısız: ${res.status} - ${errorText}`);
      }
      fetchModels();
    } catch (error) {
      console.error(error);
      alert("Silme işlemi başarısız.");
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm";

  const fields = [
    { name: "height", label: "Boy (cm)" },
    { name: "weight", label: "Kilo (kg)" },
    { name: "chest", label: "Göğüs (cm)" },
    { name: "waist", label: "Bel (cm)" },
    { name: "hip", label: "Kalça (cm)" },
  ];

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiUserCheck className="text-pink-600" /> Manken ve Ölçü Yönetimi
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Ürün detaylarında gösterilecek manken boy, kilo ve ölçü bilgilerini tanımlayın.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Alanı (Sol Kolon) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            {editId ? "Manken Bilgilerini Düzenle" : "Yeni Manken Tanımla"}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Manken Adı *
              </label>
              <input
                type="text"
                placeholder="Örn: Merve (38 Beden)"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    {f.label}
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form[f.name as keyof Model] ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [f.name]: parseInt(e.target.value) || undefined,
                      })
                    }
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-pink-600 text-white rounded-xl hover:bg-pink-700 shadow-md shadow-pink-500/20 transition-all font-medium text-sm disabled:opacity-50"
              >
                <FiCheck size={16} /> {editId ? "Güncelle" : "Ekle"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({});
                  }}
                  className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm font-medium"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Manken Listesi (Sağ 2 Kolon) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white px-1">
            Kayıtlı Mankenler ({models.length})
          </h2>

          {models.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {models.map((m) => (
                <div
                  key={m.id}
                  className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-3 flex flex-col justify-between hover:border-pink-500/50 transition-all"
                >
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">
                      {m.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                      <span>Boy: <strong className="text-gray-700 dark:text-gray-200">{m.height ?? "-"} cm</strong></span>
                      <span>Kilo: <strong className="text-gray-700 dark:text-gray-200">{m.weight ?? "-"} kg</strong></span>
                      <span>Göğüs: <strong className="text-gray-700 dark:text-gray-200">{m.chest ?? "-"} cm</strong></span>
                      <span>Bel: <strong className="text-gray-700 dark:text-gray-200">{m.waist ?? "-"} cm</strong></span>
                      <span>Kalça: <strong className="text-gray-700 dark:text-gray-200">{m.hip ?? "-"} cm</strong></span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <button
                      type="button"
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      onClick={() => handleEdit(m)}
                    >
                      <FiEdit2 size={13} /> Düzenle
                    </button>
                    <button
                      type="button"
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
                      onClick={() => handleDelete(m.id)}
                    >
                      <FiTrash2 size={13} /> Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : !loading ? (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Henüz kayıtlı manken bulunmuyor. Sol taraftaki formu kullanarak ilk mankeni ekleyin.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
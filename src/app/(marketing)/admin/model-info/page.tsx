"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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
      const res = await axios.get("/api/admin/model-info");
      setModels(res.data);
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
      if (editId) {
        await axios.patch(`/api/admin/model-info/${editId}`, form);
      } else {
        await axios.post("/api/admin/model-info", form);
      }
      setForm({});
      setEditId(null);
      fetchModels();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (model: Model) => {
    setForm(model);
    setEditId(model.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    await axios.delete(`/api/model-info/${id}`);
    fetchModels();
  };

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Mankenler</h1>
      <div className="mt-8 p-4 border rounded dark:border-gray-700 max-w-md">
        <h2 className="text-xl font-semibold mb-2">
          {editId ? "Manken Düzenle" : "Yeni Manken"}
        </h2>
        <input
          type="text"
          placeholder="İsim"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            type="number"
            placeholder="Boy"
            value={form.height || ""}
            onChange={(e) =>
              setForm({ ...form, height: parseInt(e.target.value) })
            }
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          />
          <input
            type="number"
            placeholder="Kilo"
            value={form.weight || ""}
            onChange={(e) =>
              setForm({ ...form, weight: parseInt(e.target.value) })
            }
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          />
          <input
            type="number"
            placeholder="Göğüs"
            value={form.chest || ""}
            onChange={(e) =>
              setForm({ ...form, chest: parseInt(e.target.value) })
            }
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          />
          <input
            type="number"
            placeholder="Bel"
            value={form.waist || ""}
            onChange={(e) =>
              setForm({ ...form, waist: parseInt(e.target.value) })
            }
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          />
          <input
            type="number"
            placeholder="Kalça"
            value={form.hip || ""}
            onChange={(e) =>
              setForm({ ...form, hip: parseInt(e.target.value) })
            }
            className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {editId ? "Güncelle" : "Ekle"}
        </button>
      </div>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((m) => (
          <div key={m.id} className="p-4 border rounded dark:border-gray-700">
            <h2 className="font-semibold">{m.name}</h2>
            <p>Boy: {m.height ?? "-"}</p>
            <p>Kilo: {m.weight ?? "-"}</p>
            <p>Göğüs: {m.chest ?? "-"}</p>
            <p>Bel: {m.waist ?? "-"}</p>
            <p>Kalça: {m.hip ?? "-"}</p>
            <div className="mt-2 flex gap-2">
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleEdit(m)}
              >
                Düzenle
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDelete(m.id)}
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

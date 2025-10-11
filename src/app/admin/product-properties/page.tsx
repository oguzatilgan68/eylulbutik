"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyType {
  id: string;
  name: string;
  values: { id: string; value: string }[];
}

export default function PropertyTypesPage() {
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [values, setValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  // 🟢 Listeyi yükle
  useEffect(() => {
    fetch("/api/admin/product-properties")
      .then((res) => res.json())
      .then(setTypes);
  }, []);

  // Değer ekle
  const addValue = () => {
    if (!newValue.trim()) return;
    setValues([...values, newValue.trim()]);
    setNewValue("");
  };

  const removeValue = (val: string) => {
    setValues(values.filter((v) => v !== val));
  };

  // Kaydet / Güncelle
  const handleSubmit = async () => {
    if (!selectedTypeId) {
      alert("Lütfen bir özellik tipi seçin!");
      return;
    }
    if (!values.length) {
      alert("En az bir değer girin!");
      return;
    }

    try {
      const payload = editingId
        ? { id: selectedTypeId, values } // PATCH
        : {
            name: types.find((t) => t.id === selectedTypeId)?.name || "",
            values,
          }; // POST

      const res = await fetch("/api/product-properties", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Bir hata oluştu!");
        return;
      }

      if (editingId) {
        setTypes((all) => all.map((t) => (t.id === data.id ? data : t)));
        setEditingId(null);
      } else {
        setTypes((all) => [...all, data]);
      }

      setSelectedTypeId("");
      setValues([]);
    } catch (err) {
      console.error(err);
      alert("Sunucu hatası oluştu");
    }
  };

  // Düzenleme
  const handleEdit = (type: PropertyType) => {
    setEditingId(type.id);
    setSelectedTypeId(type.id);
    setValues(type.values.map((v) => v.value));
  };

  // Silme
  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğine emin misin?")) return;
    await fetch(`/api/property-types/${id}`, { method: "DELETE" });
    setTypes((all) => all.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Ürün Özellikler</h1>

      {/* Form */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-6 space-y-4">
        {/* Özellik tipi seçme */}
        <Select
          value={selectedTypeId}
          onValueChange={(val) => setSelectedTypeId(val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Özellik Tipi Seçin" />
          </SelectTrigger>
          <SelectContent>
            {types.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Yeni değer ekleme */}
        <div className="flex gap-2">
          <Input
            placeholder="Yeni değer (örn: Kırmızı)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <Button className="cursor-pointer" onClick={addValue}>
            Ekle
          </Button>
        </div>

        {/* Eklenmiş değerler */}
        <div className="flex flex-wrap gap-2">
          {values.map((val) => (
            <div
              key={val}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center gap-2"
            >
              {val}
              <button
                onClick={() => removeValue(val)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          {editingId ? "Güncelle" : "Kaydet"}
        </Button>
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {types.map((t) => (
          <div
            key={t.id}
            className="p-4 border rounded-lg dark:border-gray-700 flex justify-between"
          >
            <div>
              <h2 className="font-medium">{t.name}</h2>
              <p className="text-sm text-gray-500">
                {t.values.map((v) => v.value).join(", ")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(t)}>
                Düzenle
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(t.id)}
              >
                Sil
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

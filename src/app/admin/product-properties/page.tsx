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
import Swal from "sweetalert2";

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

  // ➕ Değer ekle
  const addValue = () => {
    if (!newValue.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Boş değer eklenemez!",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }
    setValues([...values, newValue.trim()]);
    setNewValue("");
  };

  // ❌ Değer kaldır
  const removeValue = (val: string) => {
    setValues(values.filter((v) => v !== val));
  };

  // 💾 Kaydet / Güncelle
  const handleSubmit = async () => {
    if (!selectedTypeId) {
      Swal.fire({
        icon: "warning",
        title: "Eksik bilgi!",
        text: "Lütfen bir özellik tipi seçin.",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }
    if (!values.length) {
      Swal.fire({
        icon: "warning",
        title: "Eksik bilgi!",
        text: "En az bir değer eklemelisiniz.",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    try {
      const payload = editingId
        ? { id: selectedTypeId, values } // PATCH
        : {
            name: types.find((t) => t.id === selectedTypeId)?.name || "",
            values,
          }; // POST

      const res = await fetch("/api/admin/product-properties", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: data.error || "Bir hata oluştu!",
          confirmButtonColor: "#ef4444",
        });
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

      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: editingId
          ? "Özellik başarıyla güncellendi."
          : "Yeni özellik başarıyla eklendi.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Sunucu Hatası!",
        text: "Bir hata oluştu, lütfen tekrar deneyin.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // ✏️ Düzenleme
  const handleEdit = (type: PropertyType) => {
    setEditingId(type.id);
    setSelectedTypeId(type.id);
    setValues(type.values.map((v) => v.value));

    Swal.fire({
      icon: "info",
      title: "Düzenleme Modu",
      text: `"${type.name}" özelliğini düzenliyorsunuz.`,
      timer: 1200,
      showConfirmButton: false,
    });
  };

  // 🗑️ Silme
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu özellik kalıcı olarak silinecek!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "Vazgeç",
    });

    if (!result.isConfirmed) return;

    const res = await fetch(`/api/property-types/${id}`, { method: "DELETE" });

    if (res.ok) {
      setTypes((all) => all.filter((t) => t.id !== id));
      Swal.fire({
        icon: "success",
        title: "Silindi!",
        text: "Özellik başarıyla silindi.",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Silme işlemi başarısız oldu.",
        confirmButtonColor: "#ef4444",
      });
    }
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

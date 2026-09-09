"use client";

import { useState, useEffect } from "react";
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
import { FiLayers, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

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
  const [loading, setLoading] = useState(false);

  // Listeyi yükle
  useEffect(() => {
    fetch("/api/admin/product-properties")
      .then((res) => res.json())
      .then(setTypes)
      .catch((err) => console.error(err));
  }, []);

  // Değer ekle
  const addValue = () => {
    if (!newValue.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Boş değer eklenemez!",
        confirmButtonColor: "#db2777",
      });
      return;
    }
    if (values.includes(newValue.trim())) {
      Swal.fire({
        icon: "info",
        title: "Bu değer zaten ekli!",
        confirmButtonColor: "#db2777",
      });
      return;
    }
    setValues([...values, newValue.trim()]);
    setNewValue("");
  };

  // Değer kaldır
  const removeValue = (val: string) => {
    setValues(values.filter((v) => v !== val));
  };

  // Kaydet / Güncelle
  const handleSubmit = async () => {
    if (!selectedTypeId) {
      Swal.fire({
        icon: "warning",
        title: "Eksik bilgi!",
        text: "Lütfen bir özellik tipi seçin.",
        confirmButtonColor: "#db2777",
      });
      return;
    }
    if (!values.length) {
      Swal.fire({
        icon: "warning",
        title: "Eksik bilgi!",
        text: "En az bir değer eklemelisiniz.",
        confirmButtonColor: "#db2777",
      });
      return;
    }

    try {
      setLoading(true);
      const payload = editingId
        ? { id: selectedTypeId, values }
        : {
            name: types.find((t) => t.id === selectedTypeId)?.name || "",
            values,
          };

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
        setTypes((all) => all.map((t) => (t.id === data.id ? data : t)));
        // Eğer API yeni eklenen nesneyi dönüyorsa veya listeyi yenilemek gerekiyorsa:
        fetch("/api/admin/product-properties").then(res => res.json()).then(setTypes);
      }

      setSelectedTypeId("");
      setValues([]);

      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: editingId
          ? "Özellik değerleri başarıyla güncellendi."
          : "Yeni özellik değerleri başarıyla eklendi.",
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
    } finally {
      setLoading(false);
    }
  };

  // Düzenleme
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

  // Silme
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu özellik değerleri kalıcı olarak silinecek!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "Vazgeç",
    });

    if (!result.isConfirmed) return;

    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiLayers className="text-pink-600" /> Ürün Özellik Değerleri Yönetimi
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Global özelliklere ait seçenekleri (Örn: Renk için Kırmızı, Mavi; Beden için S, M, L) tanımlayın.
        </p>
      </div>

      {/* Form Alanı */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          {editingId ? "Özellik Değerlerini Düzenle" : "Yeni Değer Grubu Tanımla"}
        </h2>

        {/* Özellik tipi seçme */}
        <Select
          value={selectedTypeId}
          onValueChange={(val) => setSelectedTypeId(val)}
        >
          <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm">
            <SelectValue placeholder="Özellik Tipi Seçin (Örn: Renk)" />
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
            placeholder="Yeni değer yazın (örn: Kırmızı, S, 38)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addValue(); } }}
            className="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm"
          />
          <Button 
            type="button" 
            onClick={addValue}
            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 rounded-xl px-5 text-sm font-medium"
          >
            <FiPlus size={16} className="mr-1" /> Ekle
          </Button>
        </div>

        {/* Eklenmiş değerler (Badge Listesi) */}
        {values.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            {values.map((val) => (
              <div
                key={val}
                className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm"
              >
                <span>{val}</span>
                <button
                  type="button"
                  onClick={() => removeValue(val)}
                  className="text-rose-500 hover:text-rose-700 font-bold"
                >
                  <FiX size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-6 text-sm font-medium shadow-md shadow-pink-500/20"
          >
            <FiCheck size={16} className="mr-1.5" /> {editingId ? "Değişiklikleri Güncelle" : "Değerleri Kaydet"}
          </Button>
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-white px-1">
          Mevcut Özellik Değerleri
        </h2>

        {types.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {types.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                    {t.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 break-words">
                    {t.values.length > 0 
                      ? t.values.map((v) => v.value).join(", ") 
                      : "Henüz değer eklenmemiş."}
                  </p>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 justify-end">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleEdit(t)}
                    className="h-8 px-3 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200"
                  >
                    <FiEdit2 size={13} className="mr-1" /> Düzenle
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(t.id)}
                    className="h-8 px-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                  >
                    <FiTrash2 size={13} className="mr-1" /> Sil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kayıtlı özellik türü bulunmuyor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
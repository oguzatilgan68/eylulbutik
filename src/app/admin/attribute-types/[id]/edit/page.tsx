"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { FiPlus, FiX, FiCheck, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function EditAttributeTypePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [name, setName] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/attribute-types/${params.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Kayıt bulunamadı");
        setName(data.name);
        setValues(data.values.map((v: any) => v.value));
      } catch (err: any) {
        Swal.fire({ icon: "error", title: "Hata!", text: err.message });
        router.push("/admin/attribute-types");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, router]);

  const addValue = () => {
    if (!inputValue.trim()) return;
    if (values.includes(inputValue.trim())) {
      Swal.fire({ icon: "warning", title: "Bu değer zaten ekli!", timer: 1500, showConfirmButton: false });
      return;
    }
    setValues([...values, inputValue.trim()]);
    setInputValue("");
  };

  const removeValue = (val: string) => {
    setValues(values.filter((v) => v !== val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || values.length === 0) {
      Swal.fire({ icon: "warning", title: "Grup adı ve en az bir değer zorunludur!", confirmButtonColor: "#db2777" });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/admin/attribute-types/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, values }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Güncelleme başarısız");

      Swal.fire({ icon: "success", title: "Başarılı!", text: "Varyasyon grubu güncellendi.", timer: 1500, showConfirmButton: false });
      router.push("/admin/attribute-types");
      router.refresh();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Hata!", text: err.message, confirmButtonColor: "#ef4444" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Yükleniyor...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/attribute-types" className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 transition">
          <FiArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Varyasyon Tipini Düzenle</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-1.5">Grup Adı</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl" />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 mb-1.5">Seçenekler / Değerler</label>
          <div className="flex gap-2">
            <Input
              placeholder="Yeni değer ekle..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addValue(); } }}
              className="rounded-xl"
            />
            <Button type="button" onClick={addValue} className="rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 cursor-pointer">
              <FiPlus size={16} className="mr-1" /> Ekle
            </Button>
          </div>
        </div>

        {values.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            {values.map((val) => (
              <span key={val} className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-600 flex items-center gap-2 shadow-sm">
                {val}
                <button type="button" onClick={() => removeValue(val)} className="text-rose-500 hover:text-rose-700 cursor-pointer"><FiX size={13} /></button>
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button type="submit" disabled={submitting} className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-6 font-medium shadow-md shadow-pink-500/20 cursor-pointer">
            <FiCheck size={16} className="mrs-1.5" /> Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
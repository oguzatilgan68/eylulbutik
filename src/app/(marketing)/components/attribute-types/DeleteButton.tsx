"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Bu attribute tipini silmek istediğinizden emin misiniz?"))
      return;

    await fetch(`/api/attribute-types/${id}`, {
      method: "DELETE",
    });

    router.refresh(); // listeyi yeniden yükle
  };

  return (
    <button
      onClick={handleDelete}
      className="px-2 py-1 bg-red-600 text-white rounded text-sm"
    >
      Sil
    </button>
  );
}

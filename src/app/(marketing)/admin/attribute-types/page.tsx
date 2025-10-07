import Link from "next/link";
import DeleteButton from "../../components/attribute-types/DeleteButton";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default async function AttributeTypesPage() {
  const types = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/attribute-types`,
    {
      cache: "no-store",
    }
  ).then((res) => res.json());
  if (types.length === 0)
    return (
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">Attribute Tipleri</h1>
          <Link
            href="/admin/attribute-types/new"
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Yeni Ekle
          </Link>
        </div>
        <p>Henüz attribute tipi eklenmemiş.</p>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Attribute Tipleri</h1>
        <Link
          href="/admin/attribute-types/new"
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Yeni Ekle
        </Link>
      </div>

      <div className="space-y-3">
        {types.map((t: { id: Key | null | undefined; name: string, values: any[]; }) => (
          <div
            key={t.id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-gray-500">
                {t.values.map((v) => v.value).join(", ") || "Değer yok"}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/attribute-types/${t.id}/edit`}
                className="px-2 py-1 bg-yellow-500 text-white rounded text-sm"
              >
                Düzenle
              </Link>
              <DeleteButton id={t.id ? String(t.id) : ""} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

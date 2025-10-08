import { db } from "@/app/(marketing)/lib/db";
import { notFound } from "next/navigation";

export default async function EditUserPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) return notFound();

  return (
    <form className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">Müşteri Düzenle</h1>
      <input defaultValue={user.fullName} className="w-full p-2 mb-2 border" />
      <input defaultValue={user.email} className="w-full p-2 mb-2 border" />
      <input
        defaultValue={user.phone || ""}
        className="w-full p-2 mb-2 border"
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded">
        Güncelle
      </button>
    </form>
  );
}

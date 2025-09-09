import BrandForm from "@/app/(marketing)/components/forms/BrandForm";
import { db } from "@/app/(marketing)/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage(props: Props) {
  const params = await props.params;
  const brand = await db.brand.findUnique({ where: { id: params.id } });
  if (!brand) return <p>Brand not found</p>;

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-100">Marka Düzenle</h1>
      <BrandForm
        initialData={{ name: brand.name, logoUrl: brand.logoUrl || "" }}
        brandId={brand.id}
      />
    </div>
  );
}

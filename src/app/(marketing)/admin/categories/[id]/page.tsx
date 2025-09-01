import React from "react";
import { CategoryForm } from "@/app/(marketing)/components/forms/CategoryForm";
import { db } from "@/app/(marketing)/lib/db";

interface CategoryPageProps {
  params: { id: string };
}

const EditCategoryPage = async ({ params }: CategoryPageProps) => {
  const category = await db.category.findUnique({
    where: { id: params.id },
  });

  if (!category)
    return (
      <p className="text-red-500 dark:text-red-400">Kategori bulunamadı.</p>
    );

  const handleUpdate = async (data: any) => {
    "use server";
    await db.category.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId || null,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Kategori Düzenle
      </h1>
      <CategoryForm initialData={category} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditCategoryPage;

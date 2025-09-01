import React from "react";
import { redirect } from "next/navigation";
import { CategoryForm } from "@/app/(marketing)/components/forms/CategoryForm";
import { db } from "@/app/(marketing)/lib/db";

const NewCategoryPage = () => {
  const handleCreate = async (data: any) => {
    "use server";
    await db.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId || null,
      },
    });
    redirect("/admin/categories");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Yeni Kategori Oluştur</h1>
      <CategoryForm onSubmit={handleCreate} />
    </div>
  );
};

export default NewCategoryPage;

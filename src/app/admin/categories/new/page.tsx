import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/app/(marketing)/lib/db";
import { CategoryForm } from "@/app/(marketing)/components/category/categoryForm";

const NewCategoryPage = () => {
  const handleCreate = async (data: any) => {
    "use server";
    await db.category.create({ data });
    redirect("/admin/categories");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Yeni Kategori Oluştur
      </h1>
      <CategoryForm onSubmit={handleCreate} />
    </div>
  );
};

export default NewCategoryPage;

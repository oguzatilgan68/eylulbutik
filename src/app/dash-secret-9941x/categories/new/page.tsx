import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/app/(marketing)/lib/db";
import { CategoryForm } from "@/app/(marketing)/components/category/categoryForm";
import Link from "next/link";
import { FiArrowLeft, FiFolderPlus } from "react-icons/fi";

const NewCategoryPage = () => {
  const handleCreate = async (data: any) => {
    "use server";
    await db.category.create({ data });
    redirect("/admin/categories");
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Üst Geri Dön Navigasyonu */}
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
        >
          <FiArrowLeft size={14} /> Kategori Listesine Dön
        </Link>
      </div>

      <div className="space-y-6">
        {/* Başlık Kartı */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-2xl shadow-inner">
            <FiFolderPlus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Yeni Kategori Oluştur
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Mağazanız için yeni bir üst veya alt kategori tanımlayın.
            </p>
          </div>
        </div>

        {/* Form Bileşeni */}
        <CategoryForm onSubmit={handleCreate} />
      </div>
    </main>
  );
};

export default NewCategoryPage;
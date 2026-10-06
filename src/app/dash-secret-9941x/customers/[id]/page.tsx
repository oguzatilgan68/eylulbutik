import { db } from "@/app/(marketing)/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Save, ArrowLeft, Shield } from "lucide-react";

export default async function EditUserPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) return notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Üst Geri Dön Navigasyonu */}
      <div className="mb-6">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
        >
          <ArrowLeft size={14} /> Müşteri Listesine Dön
        </Link>
      </div>

      {/* Ana Form Kartı */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
        
        {/* Başlık ve İkon */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="p-3 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-2xl">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Müşteri Düzenle
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Kullanıcıya ait kişisel bilgileri güncelleyin ve kaydedin.
            </p>
          </div>
        </div>

        {/* Form Alanı */}
        <form className="space-y-5">
          
          {/* Ad Soyad */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Ad Soyad
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                defaultValue={user.fullName}
                placeholder="Örn: Ayşe Yılmaz"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* E-posta */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              E-posta Adresi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                defaultValue={user.email}
                placeholder="ornek@email.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Telefon */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Telefon Numarası
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Phone size={18} />
              </span>
              <input
                type="text"
                defaultValue={user.phone || ""}
                placeholder="05XXXXXXXXX"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer"
            >
              <Save size={16} /> Değişiklikleri Kaydet
            </button>
          </div>

        </form>

      </div>
    </main>
  );
}
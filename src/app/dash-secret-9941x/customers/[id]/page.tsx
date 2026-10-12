import { db } from "@/app/(marketing)/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Save, ArrowLeft, Shield, CheckCircle2, XCircle } from "lucide-react";
import { SECRET_ADMIN_PATH } from "../../../../config/admin";
import { revalidatePath } from "next/cache";

export default async function EditUserPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) return notFound();

  // Müşteri bilgilerini ve onay durumunu güncelleyen Server Action
  async function handleUpdate(formData: FormData) {
    "use server";

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const emailVerified = formData.get("emailVerified") === "true";

    await db.user.update({
      where: { id: params.id },
      data: {
        fullName,
        email,
        phone,
        emailVerified,
      },
    });

    revalidatePath(`/${SECRET_ADMIN_PATH}/customers`);
    redirect(`/${SECRET_ADMIN_PATH}/customers`);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Üst Geri Dön Navigasyonu */}
      <div className="mb-6">
        <Link
          href={`/${SECRET_ADMIN_PATH}/customers`}
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
              Kullanıcıya ait kişisel bilgileri ve e-posta onay durumunu güncelleyin.
            </p>
          </div>
        </div>

        {/* Form Alanı */}
        <form action={handleUpdate} className="space-y-5">
          
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
                name="fullName"
                defaultValue={user.fullName}
                placeholder="Örn: Ayşe Yılmaz"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
                required
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
                name="email"
                defaultValue={user.email}
                placeholder="ornek@email.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
                required
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
                name="phone"
                defaultValue={user.phone || ""}
                placeholder="5XXXXXXXXX"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* E-posta Doğrulama Durumu (Manuel Onay / Red) */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              E-posta Doğrulama Durumu
            </label>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 size={16} /> Doğrulanmış
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold text-xs bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900">
                    <XCircle size={16} /> Doğrulanmamış
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <select
                  name="emailVerified"
                  defaultValue={user.emailVerified ? "true" : "false"}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="true">Onayla (Doğrulandı yap)</option>
                  <option value="false">Reddet / Onayı Kaldır</option>
                </select>
              </div>
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
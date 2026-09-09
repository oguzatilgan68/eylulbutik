import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import Link from "next/link";
import AddressesClient from "./AddressesClient";
import { FiMapPin, FiPlus } from "react-icons/fi";

export default async function AddressesPage({ addresses }: { addresses: any[] }) {
  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "Adreslerim", href: "/account/addresses" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb items={breadcrumbs} />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiMapPin className="text-pink-600" /> Adres Yönetimi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Kayıtlı teslimat adreslerinizi buradan yönetebilirsiniz.
          </p>
        </div>
        <Link
          href="/account/addresses/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium shadow-md shadow-pink-500/20 transition-all"
        >
          <FiPlus size={18} /> Yeni Adres Ekle
        </Link>
      </div>

      <AddressesClient addresses={addresses} />
    </div>
  );
}
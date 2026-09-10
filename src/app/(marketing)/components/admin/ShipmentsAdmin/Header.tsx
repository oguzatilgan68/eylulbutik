import {
  PROVIDERS,
  STATUSES,
} from "@/app/(marketing)/components/shipment/shipmentModal";
import { FiSearch, FiPlus } from "react-icons/fi";

export function Header({
  q,
  setQ,
  filterProvider,
  setFilterProvider,
  filterStatus,
  setFilterStatus,
  openCreate,
}: any) {
  return (
    <header className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Kargo Yönetimi
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Tüm kargo gönderilerini, takip numaralarını ve durumlarını buradan yönetin.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center flex-wrap">
        {/* Arama Kutusu */}
        <div className="relative w-full sm:w-auto">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Sipariş no veya takip no ara..."
            className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
          />
        </div>

        {/* Firma Filtresi */}
        <select
          value={filterProvider}
          onChange={(e) => setFilterProvider(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm cursor-pointer"
        >
          <option value="">Tüm Firmalar</option>
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Durum Filtresi */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm cursor-pointer"
        >
          <option value="">Tüm Durumlar</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Yeni Gönderi Butonu */}
        <button
          onClick={openCreate}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer"
        >
          <FiPlus size={16} /> Yeni Gönderi
        </button>
      </div>
    </header>
  );
}
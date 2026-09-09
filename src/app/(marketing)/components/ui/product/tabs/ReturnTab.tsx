import { FiRefreshCw, FiAlertCircle, FiClock, FiCreditCard } from "react-icons/fi";

export default function ReturnTab() {
  return (
    <div className="space-y-6 p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiRefreshCw className="text-pink-600" /> İade ve Değişim Koşulları
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          İncelediğiniz ürün, doğrudan üretici/firma tarafından kargoyla gönderilmektedir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* İade Başvurusu */}
        <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-2">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <FiClock className="text-pink-600" /> İade Başvurusu (15 Gün)
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Ürünün adresinize teslim tarihinden itibaren 15 gün içinde <strong className="text-gray-800 dark:text-gray-200">"Siparişlerim"</strong> sayfasından kolayca iade sürecini başlatabilirsiniz. İade kodu tek kullanımlıktır.
          </p>
        </div>

        {/* Ürün Durumu */}
        <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-2">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <FiAlertCircle className="text-pink-600" /> Ürün Durumu & Şartlar
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            İadenizin kabul edilmesi için ürünün hasar görmemiş, etiketi koparılmamış ve kullanılmamış olması gerekmektedir.
          </p>
        </div>

        {/* Bedel İadesi */}
        <div className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-2">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <FiCreditCard className="text-pink-600" /> Bedel İadesi Süreci
          </h4>
          <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>İade sonuçlandıktan sonra tutar 24 saat içinde karta yansıtılır.</li>
            <li>Banka süreçlerine bağlı olarak 1-10 iş günü sürebilir.</li>
            <li>Kargo ücreti standart hizmet bedeli olduğundan iadeye dahil edilmez.</li>
          </ul>
        </div>

        {/* İade Edilemeyen Ürünler */}
        <div className="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2">
          <h4 className="font-bold text-sm text-rose-900 dark:text-rose-300 flex items-center gap-2">
            <FiAlertCircle className="text-rose-600" /> İade Edilemeyen Ürünler
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Sağlık ve hijyen açısından uygun olmayan ürünler (<span className="font-semibold text-rose-700 dark:text-rose-400">iç çamaşırı, mayo, kozmetik, parfüm, küpe vb.</span>) kesinlikle iade edilemez.
          </p>
        </div>
      </div>
    </div>
  );
}
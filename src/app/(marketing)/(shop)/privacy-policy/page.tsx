"use client";

import { useContext } from "react";
import Breadcrumb from "../../components/ui/breadcrumbs";
import { UserContext } from "../../context/userContext";
import { 
  ShieldCheck, 
  UserCheck, 
  Database, 
  Target, 
  FileLock2, 
  Share2, 
  Scale, 
  Building2 
} from "lucide-react";

const PrivacyPolicy = () => {
  const breadcrumbs = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Gizlilik Politikası", href: "/privacy-policy" },
  ];

  const genericData = useContext(UserContext)?.genericData;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Başlık Bölümü */}
      <div className="text-center sm:text-left mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Gizlilik Politikası ve KVKK
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Kişisel verilerinizin güvenliği bizim için önceliklidir. Verilerinizin nasıl işlendiği hakkında detaylı bilgiye aşağıdan ulaşabilirsiniz.
        </p>
      </div>

      {/* Giriş Metni / Özet Kartı */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm mb-8">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
          <strong className="text-gray-900 dark:text-white font-semibold">
            Eylulbutik Tekstil Sanayi ve Ticaret Ltd. Şti.
          </strong>{" "}
          ({genericData?.brandName} veya “Şirket”) olarak kişisel verilerinizin gizliliğine büyük önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında gerekli tüm tedbirleri alıyoruz. Bu Gizlilik Politikası; <strong className="text-gray-900 dark:text-white">eylulbutik.vercel.app</strong> internet sitesi (“Site”) ve Eylul Butik mobil uygulaması (“Mobil Uygulama”) üzerinden topladığımız kişisel verilerin işlenme amaçlarını, yöntemlerini ve haklarınızı açıklamaktadır.
        </p>
      </div>

      {/* İçerik Alanı - Grid Yapısı */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* 1. Veri Sorumlusu */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Veri Sorumlusu
            </h2>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            <span className="font-semibold text-gray-900 dark:text-white">Veri Sorumlusu:</span> {genericData?.brandName || "Eylulbutik"} - {genericData?.address || "Şirket Adresi Belirtilmemiş"}
          </div>
        </section>

        {/* 2. İşlenen Kişisel Veriler */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              İşlenen Kişisel Veriler
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="block font-semibold text-gray-900 dark:text-white mb-1">Üyelik Bilgileri</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">Ad-soyad, cep telefonu numarası, e-posta adresi, adres bilgisi, alışveriş bilgileri.</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="block font-semibold text-gray-900 dark:text-white mb-1">Alışveriş & İşlem</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">Ad-soyad, adres, telefon, beden ölçüsü, sipariş numarası, ödeme detayları, log kayıtları, IP adresi.</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="block font-semibold text-gray-900 dark:text-white mb-1">Fatura Bilgileri</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">Kimlik bilgileri, TC kimlik numarası (rıza halinde), vergi numarası, firma bilgileri.</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="block font-semibold text-gray-900 dark:text-white mb-1">İletişim & Pazarlama</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">Çağrı merkezi, e-posta, talep metinleri ve izin verilmesi halinde kampanya bildirimleri.</p>
            </div>
          </div>
        </section>

        {/* 3. Kullanım Amaçları */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Kullanım Amaçları
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Üyelik oluşturma ve giriş işlemleri",
              "Alışveriş ve teslimat süreçlerinin yürütülmesi",
              "Fatura düzenleme ve güvenli ödeme işlemleri",
              "Satış sonrası destek (iade, değişim, müşteri hizmetleri)",
              "Site ve uygulama deneyiminizi geliştirmek için çerez kullanımı",
              "Müşteri memnuniyeti ve şikâyet yönetimi"
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Toplanma Yöntemleri ve Veri Aktarımı */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
                  <FileLock2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Yöntemler ve Hukuki Sebepler
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                KVKK’nın 5. ve 6. maddeleri kapsamında kişisel verileriniz; üyelik ve satış sözleşmeleri, yasal yükümlülükler ve Şirketimizin meşru menfaatleri doğrultusunda internet sitesi, mobil uygulama ve çağrı merkezi aracılığıyla elektronik ortamda toplanmaktadır.
              </p>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl">
                  <Share2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Veri Aktarımı
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                KVKK’nın 8. ve 9. maddelerine uygun olarak verileriniz; iş ortaklarımız, tedarikçilerimiz, kargo firmaları ve yasal zorunluluk halinde yetkili kamu kurumları ile gerekli güvenlik tedbirleri alınarak paylaşılmaktadır.
              </p>
            </div>
          </section>
        </div>

        {/* 5. Haklarınız (KVKK Madde 11) */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              KVKK Kapsamındaki Haklarınız (Madde 11)
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Şirketimize başvurarak aşağıdaki haklarınızı her zaman kullanabilirsiniz:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
              "İşlenmişse buna ilişkin bilgi talep etme",
              "Amacına uygun kullanılıp kullanılmadığını öğrenme",
              "Aktarıldığı üçüncü kişileri bilme",
              "Eksik/yanlışsa düzeltilmesini isteme",
              "Silinmesini veya yok edilmesini talep etme",
              "Düzeltme/silme işlemlerinin 3. kişilere bildirilmesini isteme",
              "Otomatik sistemlerle analiz sonucu aleyhinize durumlara itiraz",
              "Zarara uğramanız halinde tazminat talep etme"
            ].map((right, index) => (
              <div key={index} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="font-bold text-primary shrink-0">{index + 1}.</span>
                <span>{right}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
};

export default PrivacyPolicy;
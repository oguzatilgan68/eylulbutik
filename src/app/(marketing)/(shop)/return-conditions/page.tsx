"use client";

import { useContext } from "react";
import Breadcrumb from "../../components/ui/breadcrumbs";
import { UserContext } from "../../context/userContext";
import { 
  RotateCcw, 
  Clock, 
  Mail, 
  PackageCheck, 
  ShieldAlert, 
  FileText, 
  Scale, 
  HelpCircle 
} from "lucide-react";

const ReturnPage = () => {
  const breadcrumbs = [
    { label: "Ana Sayfa", href: "/" },
    { label: "İade Koşulları", href: "/return-conditions" },
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
          <RotateCcw className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Cayma Hakkı ve İade Koşulları
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Alışverişlerinizde memnuniyetiniz bizim için önemli. İade ve değişim süreçlerimiz hakkında merak ettiğiniz detaylar aşağıdadır.
        </p>
      </div>

      {/* İçerik Alanı - Grid Yapısı */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* 1. Cayma Hakkı Kartı */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Cayma Hakkı
            </h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              Tüketici, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve gerekçe göstermeksizin malın kendisine veya gösterdiği adresteki 3. kişiye tesliminden itibaren <strong className="text-gray-900 dark:text-white font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">15 gün içerisinde</strong> cayma hakkını kullanabilir.
            </p>
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <Mail className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-sm">
                Cayma hakkının kullanılabilmesi için bu süre içinde SATICI’ya yazılı olarak veya e-posta yoluyla (
                <a href={`mailto:${genericData?.email}`} className="text-primary font-medium hover:underline">
                  {genericData?.email || "destek@sirketiniz.com"}
                </a>
                ) ya da web sitesi/mobil uygulama üzerinden bildirim yapılmalıdır.
              </p>
            </div>
          </div>
        </section>

        {/* 2. İade Süreci Kartı */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              İade Süreci ve Şartları
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Ürün faturası, kutusu, ambalajı, aksesuarları ve ekleri eksiksiz ve hasarsız şekilde gönderilmelidir.
              </span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Ambalajı açılmış, kullanılmış veya hasar görmüş ürünler iade edilemez.
              </span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Cayma hakkı çerçevesinde iade edilen ürünün bedeli, bildirimin ulaştığı tarihten itibaren en geç 10 gün içinde tüketiciye iade edilir.
              </span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                İade kargo bedeli, SATICI’nın anlaşmalı kargo şirketi kullanıldığı sürece SATICI’ya aittir.
              </span>
            </li>
          </ul>
        </section>

        {/* 3. Cayma Hakkının Kullanılamayacağı Ürünler */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Cayma Hakkının Kullanılamayacağı Ürünler
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-sm text-gray-700 dark:text-gray-300">
              Tüketicinin kişisel ihtiyaçlarına göre hazırlanan ürünler, çabuk bozulabilen veya son kullanma tarihi geçebilecek ürünler.
            </div>
            <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-sm text-gray-700 dark:text-gray-300">
              Sağlık ve hijyen açısından uygun olmayan, ambalajı açılmış iç çamaşırı, mayo, kozmetik, parfüm, küpe vb. ürünler.
            </div>
            <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-sm text-gray-700 dark:text-gray-300">
              Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan ürünler.
            </div>
            <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-sm text-gray-700 dark:text-gray-300">
              Elektronik ortamda anında ifa edilen hizmetler ve tüketiciye anında teslim edilen dijital içerikler.
            </div>
          </div>
        </section>

        {/* 4. Genel Hükümler ve Uyuşmazlıklar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Genel Hükümler
                </h2>
              </div>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p>Ürünler sipariş tarihinden itibaren en geç 30 gün içinde teslim edilir.</p>
                <p>Kredi kartı iadelerinde banka işlem süreçleri tamamen ilgili bankaya bağlıdır.</p>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl">
                  <Scale className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Uyuşmazlıkların Çözümü
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                İşbu sözleşmeden doğabilecek uyuşmazlıklarda, Ticaret Bakanlığı’nca ilan edilen değere kadar <strong className="text-gray-900 dark:text-white">Tüketici Hakem Heyetleri</strong>,imi aşan durumlarda ise <strong className="text-gray-900 dark:text-white">Tüketici Mahkemeleri</strong> yetkilidir.
              </p>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
};

export default ReturnPage;
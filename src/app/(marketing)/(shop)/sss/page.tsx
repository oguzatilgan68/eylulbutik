"use client";

import { useState } from "react";
import Breadcrumb from "../../components/ui/breadcrumbs";
import { HelpCircle, ChevronDown } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Aldığım ürünleri nasıl iade edebilirim?",
    answer: (
      <p>
        Ürünü iade etmek için iade talebi formunu doldurarak kargo ile anlaşmalı
        firmaya gönderebilirsiniz. Ürün, ambalajı açılmamış, kullanılmamış ve
        eksiksiz olmalıdır. İade süreci ve adres bilgileri iade sayfamızda
        mevcuttur.
      </p>
    ),
  },
  {
    question: "Ücret iadem ne zaman yapılır?",
    answer: (
      <p>
        İade talebinizin onaylanmasından sonra ödemeniz, en geç 10 (on) iş günü
        içinde kullandığınız ödeme yöntemiyle iade edilir.
      </p>
    ),
  },
  {
    question: "Siparişim ne zaman gelir?",
    answer: (
      <p>
        Siparişiniz, stok durumuna bağlı olarak 1–3 iş günü içerisinde kargoya
        verilir. Kargo süresi ise bulunduğunuz şehre göre değişir. Kargo takip
        numaranızı sipariş detay sayfasından kontrol edebilirsiniz.
      </p>
    ),
  },
  {
    question: "Sipariş adresimi değiştirebilir miyim?",
    answer: (
      <p>
        Siparişiniz kargoya verilmeden önce bizimle iletişime geçerseniz adres
        değişikliği yapılabilir. Kargo sürecine girmiş siparişlerde adres
        değişikliği mümkün olmayabilir.
      </p>
    ),
  },
];

const breadcrumbItems = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Sıkça Sorulan Sorular", href: "/sss" },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // İlk soru açık gelsin istersen null yapabilirsin

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Başlık Bölümü */}
      <div className="text-center sm:text-left mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Sıkça Sorulan Sorular
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Aklınıza takılan tüm soruların yanıtlarını burada bulabilir, destek almak için bizimle iletişime geçebilirsiniz.
        </p>
      </div>

      {/* SSS Akordeon Alanı */}
      <section className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`border transition-all duration-200 rounded-3xl overflow-hidden bg-white dark:bg-gray-900 ${
                isOpen 
                  ? "border-primary/50 shadow-md ring-1 ring-primary/20" 
                  : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 sm:p-6 text-left font-semibold text-gray-900 dark:text-white focus:outline-none cursor-pointer gap-4"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className="text-base sm:text-lg">{faq.question}</span>
                </div>
                <div className={`p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 transition-transform duration-300 shrink-0 ${
                  isOpen ? "rotate-180 bg-primary/10 text-primary" : "rotate-0"
                }`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {/* İçerik Animasyon Alanı */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-5 sm:p-6 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800/60 leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Ekstra Destek Kartı */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Aradığınız cevabı bulamadınız mı?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
          Destek ekibimiz sorularınızı yanıtlamaktan memnuniyet duyar. Bize dilediğiniz zaman ulaşabilirsiniz.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 font-medium bg-amber-600 text-white hover:bg-amber-700 rounded-2xl shadow-sm transition-all"
        >
           İletişime Geçin
        </Link>
      </div>
    </main>
  );
}
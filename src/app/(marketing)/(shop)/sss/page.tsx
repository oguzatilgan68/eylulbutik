"use client";

import { useState } from "react";
import Breadcrumb from "../../components/ui/breadcrumbs";

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
        numaranızı operatör sitesinden kontrol edebilirsiniz.
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Sıkça Sorulan Sorular
      </h1>
      <section className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-800 dark:text-gray-200 focus:outline-none"
              aria-expanded={openIndex === index}
            >
              {faq.question}
              <span
                className={`transform transition-transform ${
                  openIndex === index ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </button>
            {openIndex === index && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}

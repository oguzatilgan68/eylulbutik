"use client";

import { useContext, useState } from "react";
import Breadcrumb from "../../components/ui/breadcrumbs";
import { UserContext } from "../../context/userContext";
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaMapMarkerAlt 
} from "react-icons/fa";
import { Headphones, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const ContactPage = () => {
  const breadcrumbs = [
    { label: "Ana Sayfa", href: "/" },
    { label: "İletişim", href: "/iletisim" },
  ];

  const genericData = useContext(UserContext)?.genericData;

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const contactItems = [
    genericData?.email && {
      href: `mailto:${genericData.email}`,
      label: `E-posta gönder: ${genericData.email}`,
      icon: <FaEnvelope className="text-primary shrink-0" size={18} />,
      text: genericData.email,
    },
    genericData?.phone && {
      href: `tel:${genericData.phone}`,
      label: `Telefon et: ${genericData.phone}`,
      icon: <FaPhoneAlt className="text-primary shrink-0" size={18} />,
      text: genericData.phone,
    },
    genericData?.phone && {
      href: `https://wa.me/${genericData.phone.replace(/\D/g, "")}`,
      label: `WhatsApp: ${genericData.phone}`,
      icon: <FaWhatsapp className="text-emerald-600 dark:text-emerald-500 shrink-0" size={18} />,
      text: `WhatsApp Destek (${genericData.phone})`,
    },
    genericData?.address && {
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(genericData.address)}`,
      label: `Adresi haritada aç: ${genericData.address}`,
      icon: <FaMapMarkerAlt className="text-primary shrink-0 mt-1" size={18} />,
      text: genericData.address,
      isAddress: true,
    },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; text: string; isAddress?: boolean }[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ success: true, message: "Mesajınız başarıyla gönderildi. En kısa sürede döneceğiz." });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({ success: false, message: data.error || "Bir hata oluştu." });
      }
    } catch (error) {
      setStatus({ success: false, message: "Sunucuya bağlanırken bir hata oluştu." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Başlık Bölümü */}
      <div className="text-center sm:text-left mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-4">
          <Headphones className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          İletişim
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          {genericData?.brandName || "Şirketimiz"} ile ilgili her türlü soru, öneri ve talepleriniz için bize ulaşabilirsiniz.
        </p>
      </div>

      {/* Grid Yapısı */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Taraf: İletişim Kanalları */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            İletişim Bilgilerimiz
          </h2>

          {contactItems.length > 0 ? (
            contactItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : "_self"}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={item.label}
                className="flex items-start gap-3.5 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group"
              >
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl group-hover:bg-primary/10 transition-colors">
                  {item.icon}
                </div>
                <div className="overflow-hidden">
                  <span className="block text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {item.isAddress ? "Adres" : item.href.startsWith("tel") ? "Telefon" : item.href.startsWith("https://wa") ? "WhatsApp" : "E-posta"}
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate block mt-0.5">
                    {item.text}
                  </span>
                </div>
              </a>
            ))
          ) : (
            <p className="text-sm text-gray-500">İletişim bilgisi bulunamadı.</p>
          )}
        </div>

        {/* Sağ Taraf: Mesaj Gönderme Formu */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Bize Mesaj Gönderin
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Formu doldurarak en kısa sürede size geri dönüş yapmamızı sağlayabilirsiniz.
          </p>

          {status?.success && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{status.message}</span>
            </div>
          )}

          {status?.success === false && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-3 text-rose-800 dark:text-rose-200 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Adınız Soyadınız
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: Ayşe Yılmaz"
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                E-Posta Adresiniz
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ornek@mail.com"
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Mesajınız
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mesajınızı buraya yazabilirsiniz..."
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-medium text-white bg-amber-700 hover:bg-amber-600 rounded-2xl shadow-sm transition-all cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gönder</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
};

export default ContactPage;
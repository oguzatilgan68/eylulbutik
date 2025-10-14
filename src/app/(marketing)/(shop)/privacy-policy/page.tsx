"use client";

import { useContext } from "react";
import Breadcrumb from "../../components/ui/breadcrumbs";
import { UserContext } from "../../context/userContext";

const PrivacyPolicy = () => {
  const breadcrumbs = [
    { label: "Ana Sayfa", href: "/" },
    { label: "İade Koşulları", href: "/return-conditions" },
  ];
  const genericData = useContext(UserContext)?.genericData;
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <Breadcrumb items={breadcrumbs} />
      <article className="prose dark:prose-invert max-w-none">
        <h1>Gizlilik Politikası</h1>
        <p>
          <strong>Eylulbutik Tekstil Sanayi ve Ticaret Ltd. Şti.</strong> (
          {genericData?.brandName} veya “Şirket”) olarak kişisel verilerinizin
          gizliliğine büyük önem veriyoruz. 6698 sayılı Kişisel Verilerin
          Korunması Kanunu (“KVKK”) kapsamında gerekli tüm tedbirleri alıyoruz.
          Bu Gizlilik Politikası; <strong>eylulbutik.vercel.app</strong>{" "}
          internet sitesi (“Site”) ve Eylul Butik mobil uygulaması (“Mobil
          Uygulama”) üzerinden topladığımız kişisel verilerin işlenme
          amaçlarını, yöntemlerini ve haklarınızı açıklamaktadır.
        </p>

        <section>
          <h2>Veri Sorumlusu</h2>
          <p>
            Veri Sorumlusu: {genericData?.brandName} - {genericData?.address}
          </p>
        </section>

        <section>
          <h2>İşlenen Kişisel Veriler</h2>
          <ul>
            <li>
              <strong>Üyelik</strong>: Ad-soyad, cep telefonu numarası, e-posta
              adresi, adres bilgisi, alışveriş bilgileri.
            </li>
            <li>
              <strong>Alışveriş</strong>: Ad-soyad, adres, telefon, beden
              ölçüsü, sipariş numarası, ödeme detayları, log kayıtları, IP
              adresi.
            </li>
            <li>
              <strong>Fatura</strong>: Kimlik bilgileri, TC kimlik numarası
              (rıza halinde), vergi numarası, firma bilgileri.
            </li>
            <li>
              <strong>İletişim</strong>: Çağrı merkezi, e-posta, Site veya Mobil
              Uygulama üzerinden ilettiğiniz bilgiler.
            </li>
            <li>
              <strong>Pazarlama</strong>: İzniniz dahilinde kampanya, promosyon
              ve bilgilendirme amaçlı e-posta.
            </li>
          </ul>
        </section>

        <section>
          <h2>Kullanım Amaçları</h2>
          <ul>
            <li>Üyelik oluşturma ve giriş işlemleri</li>
            <li>Alışveriş ve teslimat işlemlerinin yürütülmesi</li>
            <li>Fatura düzenleme ve ödeme süreçleri</li>
            <li>Satış sonrası destek (iade, değişim, müşteri hizmetleri)</li>
            <li>
              Site ve uygulama deneyiminizi geliştirmek için çerez kullanımı
            </li>
            <li>Müşteri memnuniyeti ve şikâyet yönetimi</li>
          </ul>
        </section>

        <section>
          <h2>Kişisel Verilerin Toplanma Yöntemleri ve Hukuki Sebepler</h2>
          <p>
            KVKK’nın 5. ve 6. maddeleri kapsamında kişisel verileriniz; üyelik
            sözleşmesi, satış sözleşmesi, hizmetlerden faydalanabilmeniz,
            onayınız halinde kampanya bilgilendirmeleri, müşteri hizmetleri
            süreçleri ve Şirketimizin meşru menfaatleri doğrultusunda işlenir.
            Verileriniz; internet sitesi, mobil uygulama, çağrı merkezi ve
            e-posta aracılığıyla elektronik veya yazılı yöntemlerle
            toplanabilir.
          </p>
        </section>

        <section>
          <h2>Veri Aktarımı</h2>
          <p>
            KVKK’nın 8. ve 9. maddelerine uygun olarak kişisel verileriniz; iş
            ortaklarımız, tedarikçilerimiz, denetim firmaları, hizmet
            sağlayıcılarımız ve yasal zorunluluk halinde kamu kurumları ile
            paylaşılabilir. Verileriniz yalnızca KVKK çerçevesinde ve gerekli
            güvenlik tedbirleri alınarak aktarılır.
          </p>
        </section>

        <section>
          <h2>Haklarınız</h2>
          <p>
            KVKK’nın 11. maddesi kapsamında, Şirketimiz tarafından işlenen
            kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:
          </p>
          <ul>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>Amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Verilerinizin aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>Silinmesini veya yok edilmesini talep etme</li>
            <li>
              Düzeltme veya silme işlemlerinin üçüncü kişilere bildirilmesini
              isteme
            </li>
            <li>
              Otomatik sistemlerle analiz sonucu aleyhinize durumlara itiraz
            </li>
            <li>Zarara uğramanız halinde tazminat talep etme</li>
          </ul>
        </section>
      </article>
    </main>
  );
};

export default PrivacyPolicy;

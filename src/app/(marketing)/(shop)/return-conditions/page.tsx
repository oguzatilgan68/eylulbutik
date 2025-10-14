"use client";

import { useContext } from "react";
import Breadcrumb from "../../components/ui/breadcrumbs";
import { UserContext } from "../../context/userContext";

const ReturnPage = () => {
  const breadcrumbs = [
    { label: "Ana Sayfa", href: "/" },
    { label: "İade Koşulları", href: "/return-conditions" },
  ];
  const genericData = useContext(UserContext)?.genericData;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <Breadcrumb items={breadcrumbs} />
      <article className="prose dark:prose-invert max-w-none">
        <h1>Cayma Hakkı ve İade Koşulları</h1>
        <section>
          <h2>Cayma Hakkı</h2>
          <p>
            Tüketici, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve
            gerekçe göstermeksizin malın kendisine veya gösterdiği adresteki 3.
            kişiye tesliminden itibaren <strong>15 gün içerisinde</strong> cayma
            hakkını kullanabilir.
          </p>
          <p>
            Cayma hakkının kullanılabilmesi için bu süre içinde SATICI’ya yazılı
            olarak veya e-posta (<strong>{genericData?.email}</strong>) ya da
            web sitesi/mobil uygulama üzerinden bildirim yapılmalıdır.
          </p>
        </section>

        <section>
          <h2>İade Süreci</h2>
          <ul>
            <li>
              Ürün faturası, kutusu, ambalajı, aksesuarları ve ekleri eksiksiz
              ve hasarsız şekilde gönderilmelidir.
            </li>
            <li>
              Ambalajı açılmış, kullanılmış veya hasar görmüş ürünler iade
              edilemez.
            </li>
            <li>
              Cayma hakkı çerçevesinde iade edilen ürünün bedeli, bildirimin
              ulaştığı tarihten itibaren en geç 10 gün içinde tüketiciye iade
              edilir.
            </li>
            <li>
              İade kargo bedeli, SATICI’nın anlaşmalı kargo şirketi kullanıldığı
              sürece SATICI’ya aittir. Farklı bir kargo şirketi tercih edilirse,
              kargo ücreti ve doğabilecek hasarlardan tüketici sorumludur.
            </li>
          </ul>
        </section>

        <section>
          <h2>Cayma Hakkının Kullanılamayacağı Ürünler</h2>
          <ul>
            <li>
              Tüketicinin kişisel ihtiyaçlarına göre hazırlanan ürünler, çabuk
              bozulabilen veya son kullanma tarihi geçebilecek ürünler
            </li>
            <li>
              Sağlık ve hijyen açısından uygun olmayan, ambalajı açılmış iç
              çamaşırı, mayo, kozmetik, parfüm, küpe vb.
            </li>
            <li>
              Tesliminden sonra başka ürünlerle karışan ve ayrıştırılması mümkün
              olmayan ürünler
            </li>
            <li>
              Elektronik ortamda anında ifa edilen hizmetler ve dijital
              içerikler
            </li>
          </ul>
        </section>

        <section>
          <h2>Genel Hükümler</h2>
          <p>
            Tüketici, ürünün temel nitelikleri, satış fiyatı, ödeme ve teslimat
            koşullarını okuduğunu ve elektronik ortamda onayladığını kabul eder.
          </p>
          <p>
            Ürünler, siparişin iletilmesinden itibaren en geç 30 gün içinde
            teslim edilir. Teslim sırasında tüketicinin adreste bulunmaması
            halinde, SATICI yükümlülüğünü yerine getirmiş sayılır.
          </p>
          <p>
            Kredi kartı ile yapılan ödemelerde, bankanın iade süresi tamamen
            banka işlem süreçlerine tabidir. SATICI’nın bu konuda sorumluluğu
            bulunmaz.
          </p>
        </section>

        <section>
          <h2>Uyuşmazlıkların Çözümü</h2>
          <p>
            İşbu sözleşmeden doğabilecek uyuşmazlıklarda, Ticaret Bakanlığı’nın
            belirlediği tutara kadar <strong>Tüketici Hakem Heyetleri</strong>,
            üzerindeki uyuşmazlıklarda ise <strong>Tüketici Mahkemeleri</strong>{" "}
            yetkilidir.
          </p>
        </section>
      </article>
    </main>
  );
};

export default ReturnPage;

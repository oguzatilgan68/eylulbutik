export default function ReturnTab() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <h3 className="text-xl font-semibold mb-2">İade Koşulları</h3>

      <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
        İncelediğiniz ürün, doğrudan firma tarafından size kargoyla
        gönderilecektir.
      </p>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">İade Başvurusu</h4>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            Ürünün adresinize teslim tarihinden itibaren 15 gün içinde
            "Siparişlerim" sayfasından "Kolay İade Et" başvurusunda bulunarak
            iade sürecinizi başlatabilirsiniz. İade işlemleri için tarafımıza
            sağlanan iade kodu tek kullanımlık olarak düzenlenir.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Kod Kullanımı</h4>
          <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-1">
            <li>Kod yalnızca belirtilen iade süreci kapsamında geçerlidir.</li>
            <li>
              Bir kez kullanıldığında yeniden oluşturulamaz ve tekrar
              kullanılamaz.
            </li>
            <li>
              Kodun süresinin geçirilmesi veya iptal edilmesi durumunda yeni kod
              talep edilemez.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Ürün Durumu</h4>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            İadenizin kabul edilmesi için ürünün hasar görmemiş ve kullanılmamış
            olması gerekmektedir. İade edilen ürün, üretici firmaya
            ulaştırılacak ve tarafımızdan takip edilecektir.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Bedel İadesi</h4>
          <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-1">
            <li>
              İade işlemi sonuçlandıktan sonra ödeme kredi kartınıza/banka
              hesabınıza 24 saat içinde yapılır.
            </li>
            <li>
              Ödeme yansıma süresi bankanıza göre değişebilir (1-10 iş günü).
            </li>
            <li>
              Kargo ücreti, standart hizmet bedeli olduğundan geri ödemeye dahil
              edilmez.
            </li>
            <li>
              İptal işlemlerinde ürün tutarı ve kargo ücreti dahil ödemeler
              eksiksiz iade edilir.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Kredi ile Alınan Ürünler</h4>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            Kredili sipariş iptal/iade alındığında kredi kapanmış sayılmaz.
            İptal/iade sonrası cayma talebiniz için bankayla bireysel iletişim
            kurmanız gerekir. Faiz sorumluluğunuz sipariş tarihinizden kredi
            kapama tarihinize kadar devam eder.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">İade Edilemeyen Ürünler</h4>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            Sağlık ve hijyen açısından uygun olmayan ürünler iade edilemez.
            Örnekler:
            <span className="font-medium">
              {" "}
              iç çamaşırı, mayo, deniz giysileri, kozmetik, parfüm, küpe
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

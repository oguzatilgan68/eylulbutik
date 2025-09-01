// app/admin/page.tsx
import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Paneline Hoşgeldiniz</h1>
      <p>Sol menüden işlem yapmak istediğiniz bölüme geçiş yapabilirsiniz.</p>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/admin/products"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ürünler
        </Link>
        <Link
          href="/admin/orders"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Siparişler
        </Link>
        <Link
          href="/admin/categories"
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Kategoriler
        </Link>
      </div>
    </div>
  );
}

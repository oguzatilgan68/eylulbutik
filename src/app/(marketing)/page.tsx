import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-bold">Hoş Geldiniz!</h1>
      <p className="text-lg">En iyi ürünlerimizi keşfedin.</p>
      <Link
        href="/shop"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Alışverişe Başla
      </Link>
    </div>
  );
}

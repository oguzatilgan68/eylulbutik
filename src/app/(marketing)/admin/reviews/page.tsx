import ReviewManager from "../../components/admin/ReviewManager";

export default function AdminReviewsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Yorum Yönetimi</h1>
      <ReviewManager />
    </div>
  );
}

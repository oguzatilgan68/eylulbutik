import MyReviews from "@/app/(marketing)/components/account/MyReviews";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";

export default function MyReviewsPage() {
  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "Yorumlarım", href: "/myreviews" },
  ];
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbs} />
      <h1 className="text-2xl font-bold mb-6">Yorumlarım</h1>
      <MyReviews />
    </div>
  );
}

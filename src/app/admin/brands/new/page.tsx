import BrandForm from "@/app/(marketing)/components/forms/BrandForm";

export default function NewBrandPage() {
  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Marka Ekle
      </h1>
      <BrandForm />
    </div>
  );
}

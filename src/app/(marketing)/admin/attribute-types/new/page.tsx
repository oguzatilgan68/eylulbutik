import AttributeForm from "@/app/(marketing)/components/forms/AttributeForm";

export default function NewAttributePage() {
  const handleSubmit = async (data: { name: string; values: string[] }) => {
    "use server";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/attribute-types`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (res.ok) {
      window.location.href = "/admin/attribute-types";
    } else {
      alert("Attribute tipi oluşturulamadı.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Yeni Attribute Tipi</h1>
      <AttributeForm onSubmit={handleSubmit} />
    </div>
  );
}

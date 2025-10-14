"use client";

import AddressForm from "@/app/(marketing)/components/forms/AddressForm";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

export default function EditAddressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // ✅ params.id yerine unwrap
  const router = useRouter();
  const [address, setAddress] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/address/${id}`)
      .then((res) => res.json())
      .then((data) => setAddress(data.address));
  }, [id]);

  if (!address) return <p>Yükleniyor...</p>;
  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "Adreslerim", href: "/account/addresses" },
    { label: "Adresi Düzenle" },
  ];
  return (
    <>
      <Breadcrumb items={breadcrumbs} />
      <AddressForm
        defaultValues={address}
        onSuccess={() => router.push("/account/addresses")}
      />
    </>
  );
}

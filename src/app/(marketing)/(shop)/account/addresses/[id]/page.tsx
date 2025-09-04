"use client";

import AddressForm from "@/app/(marketing)/components/forms/AddressForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditAddressPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [address, setAddress] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/address/${params.id}`)
      .then((res) => res.json())
      .then((data) => setAddress(data.address));
  }, [params.id]);

  if (!address) return <p>Yükleniyor...</p>;

  return (
    <AddressForm
      defaultValues={address}
      onSuccess={() => router.push("/adresler")}
    />
  );
}

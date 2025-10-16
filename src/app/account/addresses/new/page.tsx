"use client";

import AddressForm from "@/app/(marketing)/components/forms/AddressForm";
import Breadcrumb from "@/app/(marketing)/components/ui/breadcrumbs";
import { useRouter } from "next/navigation";

export default function AddAddressPage() {
  const router = useRouter();
  const breadcrumbs = [
    { label: "Hesabım", href: "/account" },
    { label: "Adreslerim", href: "/account/addresses" },
    { label: "Yeni Adres Ekle" },
  ];
  return (
    <>
      <Breadcrumb items={breadcrumbs} />
      <AddressForm onSuccess={() => router.push("/account/addresses")} />
    </>
  );
}

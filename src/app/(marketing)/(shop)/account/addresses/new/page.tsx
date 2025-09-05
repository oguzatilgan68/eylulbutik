"use client";

import AddressForm from "@/app/(marketing)/components/forms/AddressForm";
import { useRouter } from "next/navigation";

export default function AddAddressPage() {
  const router = useRouter();

  return <AddressForm onSuccess={() => router.push("/account/addresses")} />;
}

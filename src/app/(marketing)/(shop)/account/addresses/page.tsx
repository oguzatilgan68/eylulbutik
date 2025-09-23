import React from "react";
import Link from "next/link";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";
import AddressesClient from "./AddressesClient";
import { redirect } from "next/navigation";

export default async function AddressesPage() {
  const userId = await getAuthUserId();
  if (!userId) {
    redirect("/login");
  }

  const addresses = await db.address.findMany({
    where: { userId },
  });

  // server -> client geçerken serializable olmalı
  const serializable = JSON.parse(JSON.stringify(addresses));

  return (
    <div className="space-y-4 ">
      <Link
        href="/account/addresses/new"
        className="px-4 py-2  bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Yeni Adres Ekle
      </Link>
      <AddressesClient addresses={serializable} />
    </div>
  );
}

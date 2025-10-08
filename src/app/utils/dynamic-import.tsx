"use client";

import dynamic from "next/dynamic";

// Heavy component’leri tek bir yerde dynamic olarak tanımlıyoruz
export const DynamicComponents = {
  ShipmentModal: dynamic(
    () =>
      import("@/app/(marketing)/components/shipment/shipmentModal").then(
        (mod) => mod.ShipmentModal
      ),
    { ssr: false }
  ),
  ReviewManager: dynamic(
    () => import("@/app/(marketing)/components/admin/ReviewManager"),
    { ssr: false }
  ),
  AttributeForm: dynamic(
    () => import("@/app/(marketing)/components/forms/AttributeForm"),
    { ssr: false }
  ),
  ProductForm:dynamic(
    ()=>import("@/app/(marketing)/components/forms/ProductForm")
  )

};

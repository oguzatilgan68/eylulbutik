import { db } from "@/app/(marketing)/lib/db";
import { cache } from "react";

// Bu fonksiyon sadece ilk çağrıldığında veritabanına gider
export const getGenericData = cache(async () => {
  const data = await db.genericData.findFirst(); // Tek kayıt olduğunu varsayıyoruz
  return data;
});

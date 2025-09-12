import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // "token" cookie’sini temizle
  cookieStore.delete("token");

  return NextResponse.json(
    { success: true, message: "Çıkış başarılı" },
    { status: 200 }
  );
}

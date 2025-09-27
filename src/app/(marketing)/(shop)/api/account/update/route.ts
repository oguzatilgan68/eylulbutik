import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { getAuthUserId } from "@/app/(marketing)/lib/auth";

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { fullName, email, phone } = await req.json();

    // Email kontrol
    if (email) {
      const existingEmailUser = await db.user.findFirst({
        where: {
          email,
          NOT: { id: userId }, // kendisi hariç
        },
      });
      if (existingEmailUser) {
        return NextResponse.json(
          { error: "Bu email başka bir kullanıcıya ait" },
          { status: 400 }
        );
      }
    }

    // Telefon kontrol
    if (phone) {
      const existingPhoneUser = await db.user.findFirst({
        where: {
          phone,
          NOT: { id: userId }, // kendisi hariç
        },
      });
      if (existingPhoneUser) {
        return NextResponse.json(
          { error: "Bu telefon numarası başka bir kullanıcıya ait" },
          { status: 400 }
        );
      }
    }

    // Kullanıcıyı güncelle
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { fullName, email, phone },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

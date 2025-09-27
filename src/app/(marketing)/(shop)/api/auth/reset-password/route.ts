// app/api/auth/reset-password/route.ts
import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  const user = await db.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetTokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashed,
      passwordResetToken: null,
      passwordResetTokenExpires: null,
    },
  });

  return NextResponse.json({ message: "Şifre başarıyla sıfırlandı" });
}

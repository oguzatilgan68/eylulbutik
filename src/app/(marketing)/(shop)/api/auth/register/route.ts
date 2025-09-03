import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/app/(marketing)/lib/db";

export async function POST(req: NextRequest) {
  const { fullName, email, password, phone } = await req.json();

  if (!email || !password || !fullName) {
    return NextResponse.json({ error: "Tüm alanlar gerekli" }, { status: 400 });
  }

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "Bu email zaten kayıtlı" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      fullName,
      email,
      passwordHash: hashedPassword,
      phone,
    },
  });

  return NextResponse.json({ user });
}

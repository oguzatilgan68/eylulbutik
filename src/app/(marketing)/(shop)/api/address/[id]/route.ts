import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

// Tek bir adresi GET, PUT, DELETE ile yönetiyoruz
export async function GET(req: NextRequest, props: Params) {
  const params = await props.params;
  const { id } = params;

  try {
    const address = await db.address.findUnique({
      where: { id },
    });
    if (!address)
      return NextResponse.json({ error: "Adres bulunamadı" }, { status: 404 });
    return NextResponse.json({ address });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Adres alınamadı" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: Params) {
  const params = await props.params;
  const { id } = params;

  try {
    const body = await req.json();
    const updatedAddress = await db.address.update({
      where: { id },
      data: body,
    });
    return NextResponse.json({ address: updatedAddress });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Adres güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, props: Params) {
  const params = await props.params;
  const { id } = params;

  try {
    await db.address.delete({ where: { id } });
    return NextResponse.json({ message: "Adres silindi ✅" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Adres silinemedi" }, { status: 500 });
  }
}

import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function PATCH(req: Request) {
  try {
    await requireAdmin();

    const { id, values } = await req.json(); // values: string[] (Güncel liste)

    if (!id || !Array.isArray(values)) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    // 1. Önce bu tipe ait mevcut değerleri bul
    const existingValues = await db.propertyValue.findMany({
      where: { propertyTypeId: id },
    });

    const existingValueMap = new Map(existingValues.map((v) => [v.value, v.id]));

    // 2. Gelen listede olup veritabanında olmayanlar (Yeni eklenecekler)
    const valuesToCreate = values.filter((v: string) => !existingValueMap.has(v));

    // 3. Veritabanında olup gelen listede olmayanlar (Silinecekler)
    const valuesToDelete = existingValues
      .filter((v) => !values.includes(v.value))
      .map((v) => v.id);

    // 4. Transaction ile silme ve ekleme işlemlerini aynı anda yapalım
    const updated = await db.$transaction(async (tx) => {
      if (valuesToDelete.length > 0) {
        await tx.propertyValue.deleteMany({
          where: { id: { in: valuesToDelete } },
        });
      }

      if (valuesToCreate.length > 0) {
        await tx.propertyValue.createMany({
          data: valuesToCreate.map((v: string) => ({
            value: v,
            propertyTypeId: id,
          })),
        });
      }

      return await tx.propertyType.findUnique({
        where: { id },
        include: { values: true },
      });
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("PATCH Hata:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PropertyType ve bağlı değerleri sil
export async function DELETE(
  _: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const params = await props.params;
    const { id } = params;

    // 1. Bu özellik tipine bağlı ürünler var mı kontrol edelim
    const usageCount = await db.productProperty.count({
      where: { propertyTypeId: id },
    });

    if (usageCount > 0) {
      return NextResponse.json(
        { error: `Bu özellik şu anda ${usageCount} üründe tanımlı olduğu için silinemez.` },
        { status: 400 }
      );
    }

    // 2. Bağlı ürün yoksa önce alt değerlerini, sonra tipi silelim
    await db.$transaction(async (tx) => {
      await tx.propertyValue.deleteMany({
        where: { propertyTypeId: id },
      });
      await tx.propertyType.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json({ error: err.message || "Silme başarısız" }, { status: 500 });
  }
}
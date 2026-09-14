import { requireAdmin } from "@/app/(marketing)/lib/adminAuth";
import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await requireAdmin();

        const attributeType = await db.attributeType.findUnique({
            where: { id: params.id },
            include: { values: true },
        });

        if (!attributeType) {
            return NextResponse.json({ error: "Varyasyon tipi bulunamadı." }, { status: 404 });
        }

        return NextResponse.json(attributeType);
    } catch (error) {
        console.error("GET AttributeType Error:", error);
        return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
    }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await requireAdmin();
        const body = await req.json();
        const { name, values } = body;

        if (!name || !Array.isArray(values)) {
            return NextResponse.json({ error: "Geçersiz veri gönderildi." }, { status: 400 });
        }

        const cleanValues: string[] = Array.from(
            new Set(values.map((v: string) => v.trim()).filter(Boolean))
        );

        const updated = await db.$transaction(async (tx) => {
            // 1. Önce grup adını güncelle
            await tx.attributeType.update({
                where: { id: params.id },
                data: { name: name.trim() },
            });

            // 2. Mevcut değerleri al
            const existingValues = await tx.attributeValue.findMany({
                where: { attributeTypeId: params.id },
            });

            const existingMap = new Map(existingValues.map((v) => [v.value, v.id]));

            // 3. Yeni gelenlerde olmayan ve ÜRÜNLER TARAFINDAN KULLANILMAYAN eski değerleri güvenle sil
            const valuesToKeep = new Set(cleanValues);
            for (const ev of existingValues) {
                if (!valuesToKeep.has(ev.value)) {
                    // Bu değer herhangi bir varyantta kullanılıyor mu kontrol edelim
                    const usageCount = await tx.productVariantAttribute.count({
                        where: { attributeValueId: ev.id },
                    });

                    if (usageCount === 0) {
                        await tx.attributeValue.delete({
                            where: { id: ev.id },
                        });
                    }
                    // Eğer ürün tarafından kullanılıyorsa foreign key yememek için veritabanında bırakıyoruz
                }
            }

            // 4. Yeni eklenen değerleri oluşturalım
            for (const val of cleanValues) {
                if (!existingMap.has(val)) {
                    await tx.attributeValue.create({
                        data: {
                            value: val,
                            attributeTypeId: params.id,
                        },
                    });
                }
            }

            // 5. Güncel son hali ilişkileriyle birlikte dön
            return await tx.attributeType.findUnique({
                where: { id: params.id },
                include: { values: true },
            });
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PUT AttributeType Error:", error);
        return NextResponse.json({ error: "Varyasyon tipi güncellenemedi." }, { status: 500 });
    }
}

// ✅ DELETE: Sil
export async function DELETE(_: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await requireAdmin();
        await db.attributeType.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE AttributeType Error:", error);
        return NextResponse.json({ error: "Varyasyon tipi silinemedi (ürünler tarafından kullanılıyor olabilir)." }, { status: 500 });
    }
}
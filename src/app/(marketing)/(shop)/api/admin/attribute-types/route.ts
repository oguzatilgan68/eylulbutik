import { requireAdmin } from "@/app/(marketing)/lib/adminAuth";
import { db } from "@/app/(marketing)/lib/db";
import { NextResponse } from "next/server";

// ✅ GET: Tüm Varyasyon Tiplerini ve Değerlerini Listele
export async function GET() {
    try {
        await requireAdmin();

        const attributeTypes = await db.attributeType.findMany({
            include: {
                values: {
                    orderBy: { value: "asc" }
                }
            },
            orderBy: { name: "asc" },
        });
        return NextResponse.json(attributeTypes);
    } catch (error: any) {
        return NextResponse.json({ error: "Veriler getirilirken bir hata oluştu." }, { status: 500 });
    }
}

// ✅ POST: Yeni Varyasyon Tipi ve Seçeneklerini Oluştur
export async function POST(req: Request) {
    try {
        await requireAdmin();
        const body = await req.json();
        const { name, values } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ error: "Grup adı zorunludur." }, { status: 400 });
        }

        if (!Array.isArray(values) || values.length === 0) {
            return NextResponse.json({ error: "En az bir seçenek eklemelisiniz." }, { status: 400 });
        }

        const cleanValues: string[] = Array.from(
            new Set(values.map((v: string) => v.trim()).filter(Boolean))
        );

        const newAttributeType = await db.attributeType.create({
            data: {
                name: name.trim(),
                values: {
                    create: cleanValues.map((v) => ({ value: v })),
                },
            },
            include: { values: true },
        });

        return NextResponse.json(newAttributeType, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json({ error: "Bu isimde bir varyasyon grubu zaten mevcut." }, { status: 400 });
        }
        return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
    }
}
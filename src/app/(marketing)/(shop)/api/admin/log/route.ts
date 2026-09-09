import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);

    const level = searchParams.get("level"); // info | warn | error
    const query = searchParams.get("q"); // arama kelimesi
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};

    if (level) where.level = level;
    if (query) {
      where.OR = [
        { message: { contains: query, mode: "insensitive" } },
        { stack: { contains: query, mode: "insensitive" } },
        { meta: { path: ["page"], string_contains: query } },
      ];
    }

    const total = await db.log.count({ where });

    const logs = await db.log.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: err.statusCode });
    }
    console.error("🛑 Log list API hatası:", err);
    return NextResponse.json(
      { ok: false, error: "Loglar alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const { message, level, status, stack, meta, createdAt } = await req.json();

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    await db.log.create({
      data: {
        message,
        level,
        status,
        stack,
        meta: { ...meta, ip },
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: err.statusCode });
    }
    console.error("🛑 Log API hatası:", err);
    return NextResponse.json(
      { ok: false, error: "Log kaydedilemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Silinecek log ID'leri belirtilmedi" },
        { status: 400 }
      );
    }

    await db.log.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({ ok: true, message: "Loglar başarıyla silindi" });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: err.statusCode });
    }
    console.error("🛑 Log silme API hatası:", err);
    return NextResponse.json(
      { ok: false, error: "Loglar silinemedi" },
      { status: 500 }
    );
  }
}
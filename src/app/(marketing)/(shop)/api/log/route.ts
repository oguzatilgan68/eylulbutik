import { db } from "@/app/(marketing)/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
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
        { meta: { path: ["page"], string_contains: query } }, // page URL search
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
  } catch (err) {
    console.error("🛑 Log list API hatası:", err);
    return NextResponse.json(
      { ok: false, error: "Loglar alınamadı" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const { message, level, status, stack, meta, createdAt } = await req.json();

    // IP adresini server’dan yakala
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
  } catch (err) {
    console.error("🛑 Log API hatası:", err);
    return NextResponse.json(
      { ok: false, error: "Log kaydedilemedi" },
      { status: 500 }
    );
  }
}

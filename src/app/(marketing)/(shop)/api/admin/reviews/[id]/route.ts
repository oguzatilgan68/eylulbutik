import { NextResponse } from "next/server";
import { db } from "@/app/(marketing)/lib/db";
import { requireAdmin, AdminAuthError } from "@/app/(marketing)/lib/adminAuth";

// PUT / PATCH → Yorum güncelleme
export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const params = await props.params;
    const reviewId = params.id;
    const body = await req.json();

    const { content, isApproved } = body;

    if (content === undefined && isApproved === undefined) {
      return NextResponse.json(
        { error: "Güncellenecek alan belirtilmedi." },
        { status: 400 }
      );
    }

    const updatedReview = await db.review.update({
      where: { id: reviewId },
      data: {
        content: content !== undefined ? content : undefined,
        isApproved: isApproved !== undefined ? isApproved : undefined,
      },
    });

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("Review güncelleme hatası:", err);
    return NextResponse.json(
      { error: "Yorum güncellenemedi." },
      { status: 500 }
    );
  }
}

// DELETE → Yorum silme
export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const params = await props.params;
    const reviewId = params.id;

    await db.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("Review silme hatası:", err);
    return NextResponse.json({ error: "Yorum silinemedi." }, { status: 500 });
  }
}
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const response = NextResponse.next();

  // Global güvenlik header'ları — tüm sayfalar için geçerli
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; connect-src 'self' https://www.google.com https://zbqvmfyxhpuihkgvmxhi.supabase.co https://www.gstatic.com; frame-src https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co; font-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self';"
  );

  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Access-Control-Allow-Origin", "https://localhost:3000");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), camera=(), microphone=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // 🔐 Sadece /admin altında login kontrolü yap
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (pathname.startsWith("/admin")) {
    const isAuthPage = pathname === "/admin-login";

    if (!token && !isAuthPage) {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
  }
  if (pathname.startsWith("/api/admin")) {
    // Token yoksa direkt 401 döndür
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Eğer role alanı varsa buradan admin kontrolü yap
    // (NextAuth JWT callback içinde role bilgisini payload'a gömmelisin)
    const isAdmin = token.role === "admin";

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Admin access only" },
        { status: 403 }
      );
    }
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"], // sayfa bazlı her yerde header'lar aktif
};

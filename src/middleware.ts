import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import getRateLimitMiddlewares from "next-rate-limit";
import { log } from "./app/(marketing)/lib/logger";

const { checkNext } = getRateLimitMiddlewares({
  interval: 60 * 1000, // 1 dakika
  uniqueTokenPerInterval: 500,
});

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const response = NextResponse.next();

  // 🌐 Güvenlik header'ları
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

  // 🔐 NextAuth Token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // /admin login kontrolü
  if (pathname.startsWith("/admin")) {
    const isAuthPage = pathname === "/admin-login";
    if (!token && !isAuthPage) {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
  }

  // /api/admin erişim kontrolü
  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (token.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access only" },
        { status: 403 }
      );
    }
  }

  // ⚡ Gelişmiş Rate Limit
  if (pathname.startsWith("/api/")) {
    try {
      // Her IP’ye özel limit
      const headers = checkNext(req, 30); // dakikada 30 istek
      headers.forEach((value, key) => response.headers.set(key, value));
    } catch (err: any) {
      if (err?.message?.includes("Rate limit exceeded")) {
        // Kalan süreyi hesapla (milisaniyeden saniyeye)
        const resetTime = 60; // 60 saniyelik interval
        const now = Date.now();
        const remainingMs =
          (err?.resetTime ? err.resetTime - now : resetTime * 1000) ||
          resetTime * 1000;
        const remainingSeconds = Math.max(Math.ceil(remainingMs / 1000), 1);
        await log(
          err.message,
          "error",
          { path: req.url },
          err.status,
          err.stack
        );

        return NextResponse.json(
          {
            error: `Çok fazla istek.Lütfen ${remainingSeconds} saniye sonra tekrar deneyiniz.`,
            retryAfterSeconds: remainingSeconds,
          },
          {
            status: 429,
            headers: {
              "Retry-After": remainingSeconds.toString(),
              "X-RateLimit-Reset": remainingSeconds.toString(),
            },
          }
        );
      }

      if (process.env.NODE_ENV === "development") {
        console.error("Rate limit middleware error:", err);
      }

      return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

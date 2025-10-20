import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import getRateLimitMiddlewares from "next-rate-limit";
import { log } from "./app/(marketing)/lib/logger";
import jwt from "jsonwebtoken";
import { db } from "./app/(marketing)/lib/db";

const { checkNext } = getRateLimitMiddlewares({
  interval: 60 * 1000, // 1 dakika
  uniqueTokenPerInterval: 500,
});

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const response = NextResponse.next();

  // ------------------------
  // 🔐 Security headers
  // ------------------------
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

  // ------------------------
  // 🍪 Token yönetimi
  // ------------------------
  const nextAuthToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (pathname.startsWith("account")) {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    let userId: string | null = null;

    // 1️⃣ Access Token geçerli mi kontrol et
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
          userId: string;
        };
        userId = decoded.userId;
      } catch {
        // Token süresi dolmuş olabilir, refresh token ile yenilemeye geç
      }
    }

    // 2️⃣ Refresh Token varsa ve accessToken geçerli değilse yenile
    if (!userId && refreshToken) {
      try {
        const user = await db.user.findFirst({
          where: {
            refreshToken,
            refreshTokenExpiry: { gt: new Date() },
          },
        });

        if (user) {
          const newAccessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            {
              expiresIn: "15m",
            }
          );

          response.cookies.set({
            name: "accessToken",
            value: newAccessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 15 * 60,
          });

          userId = user.id;
        } else {
          // Refresh token geçersizse cookie temizle ve login yönlendir
          const res = NextResponse.redirect(new URL("/login", req.url));
          res.cookies.delete({ name: "accessToken", path: "/" });
          res.cookies.delete({ name: "refreshToken", path: "/" });
          return res;
        }
      } catch {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.delete({ name: "accessToken", path: "/" });
        res.cookies.delete({ name: "refreshToken", path: "/" });
        return res;
      }
    }

    // 3️⃣ Eğer token yok ve admin değilse login sayfasına yönlendir
    if (
      !userId &&
      !pathname.startsWith("/admin") &&
      !pathname.startsWith("/api/admin")
    ) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete({ name: "accessToken", path: "/" });
      res.cookies.delete({ name: "refreshToken", path: "/" });
      return res;
    }
  }
  // /admin ve /api/admin kontrolü (NextAuth)
  // ------------------------
  if (pathname.startsWith("/admin") && pathname !== "/admin-login") {
    if (!nextAuthToken) {
      const res = NextResponse.redirect(new URL("/admin-login", req.url));
      res.cookies.delete({ name: "next-auth.session-token", path: "/" });
      return res;
    }
  }

  if (pathname.startsWith("/api/admin")) {
    if (!nextAuthToken) {
      const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      res.cookies.delete({ name: "next-auth.session-token", path: "/" });
      return res;
    }

    if (nextAuthToken.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access only" },
        { status: 403 }
      );
    }
  }

  // ------------------------
  // ⚡ Rate limit
  // ------------------------
  if (pathname.startsWith("/api/")) {
    try {
      const headers = checkNext(req, 60); // dakikada 30 istek
      headers.forEach((value, key) => response.headers.set(key, value));
    } catch (err: any) {
      if (err?.message?.includes("Rate limit exceeded")) {
        const remainingSeconds = Math.max(
          Math.ceil((err?.resetTime ?? 60 * 1000) / 1000),
          1
        );
        await log(
          err.message,
          "error",
          { path: req.url },
          err.status,
          err.stack
        );

        return NextResponse.json(
          {
            error: `Çok fazla istek. Lütfen ${remainingSeconds} saniye sonra tekrar deneyiniz.`,
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

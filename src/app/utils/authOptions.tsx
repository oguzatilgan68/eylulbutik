import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import { db } from "@/app/(marketing)/lib/db";

declare module "next-auth" {
  interface User {
    fullName?: string;
    role: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      fullName?: string;
      role: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Lütfen email ve şifrenizi girin.");
        }

        const user = await db.user.findUnique({ where: { email: credentials.email } });

        if (!user || !user.passwordHash) {
          throw new Error("Email veya şifre hatalı.");
        }

        // 🔐 Hesap kilitli mi kontrolü
        if (user.isLocked) {
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            const remainingMins = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
            throw new Error(`Hesabınız ${remainingMins} dakika boyunca kilitli.`);
          } else {
            await db.user.update({
              where: { id: user.id },
              data: { isLocked: false, failedLoginAttempts: 0, lockedUntil: null },
            });
          }
        }

        const isValid = await compare(credentials.password, user.passwordHash);

        if (!isValid) {
          const newAttempts = user.failedLoginAttempts + 1;
          if (newAttempts >= 3) {
            const lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            await db.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: newAttempts, isLocked: true, lockedUntil },
            });
            throw new Error("3 kez hatalı giriş yaptınız. Hesabınız 15 dakika süreyle kilitlendi.");
          } else {
            await db.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: newAttempts },
            });
            throw new Error("Email veya şifre hatalı.");
          }
        }

        // ✅ Başarılı giriş: Sayaçları sıfırla ve son giriş tarihini güncelle
        await db.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            isLocked: false,
            lockedUntil: null,
            lastLogin: new Date(),
          },
        });

        // NextAuth bu objeyi JWT token içine gömecek
        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 gün lüks oturum süresi
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = user.fullName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          fullName: token.fullName as string,
          role: token.role as string,
        };
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
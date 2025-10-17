"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { CouponProvider } from "./CouponContext";
import { GenericData } from "@/generated/prisma";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  emailVerified: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  genericData: GenericData | null;
  setGenericData: (data: GenericData | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [genericData, setGenericData] = useState<GenericData | null>(null);
  const router = useRouter();

  // 🧠 Kullanıcıyı çek (accessToken veya refreshToken ile)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include", // cookie'leri gönder
        });
        const data = await res.json();

        if (res.status === 200 && data.user) {
          setUser(data.user);
        } else {
          // Kullanıcı yok veya yetkisiz → login sayfasına yönlendir
          setUser(null);
          router.push("/login");
        }
      } catch (err) {
        setUser(null);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  // 🌐 GenericData’yı çek
  useEffect(() => {
    const fetchGenericData = async () => {
      try {
        const res = await fetch("/api/generic-data", {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json();
        setGenericData(data[0] || null);
      } catch {
        setGenericData(null);
      }
    };

    fetchGenericData();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login"); // logout sonrası login sayfasına yönlendir
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, logout, genericData, setGenericData }}
    >
      <CouponProvider>{children}</CouponProvider>
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};

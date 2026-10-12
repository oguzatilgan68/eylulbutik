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
import { signOut } from "next-auth/react"; // NextAuth çıkış fonksiyonu

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
  isLoading: boolean; // 👈 Yükleme durumunu ekledik ki sayfa erkenden login'e atmasın
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 Başlangıçta yükleniyor
  const [genericData, setGenericData] = useState<GenericData | null>(null);
  const router = useRouter();

  // 🧠 NextAuth oturumunu doğrudan Next.js'in kendi session endpoint'inden çekiyoruz
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          method: "GET",
          cache: "no-store",
        });
        const session = await res.json();

        if (session && session.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false); // 👈 İstek bittiğinde yükleme bitti
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchGenericData = async () => {
      try {
        const res = await fetch("/api/generic-data", {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) return;
        
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        
        if (Array.isArray(data)) {
          setGenericData(data.length > 0 ? data[0] : null);
        } else {
          setGenericData(data || null);
        }
      } catch (err) {
        setGenericData(null);
      }
    };

    fetchGenericData();
  }, []);

  const logout = async () => {
    await signOut({ redirect: false }); // NextAuth çıkış işlemi
    setUser(null);
    router.push("/login");
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, logout, genericData, setGenericData, isLoading }}
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
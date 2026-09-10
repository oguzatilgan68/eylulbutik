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

  // 🧠 Kullanıcıyı bir kez çek
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });
        const data = await res.json();

        if (res.status === 200 && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, []); // router bağımlılığını kaldırdık ki gereksiz tetiklenmesin

  // 🌐 GenericData’yı çek
  useEffect(() => {
    const fetchGenericData = async () => {
      try {
        const res = await fetch("/api/generic-data", {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json();
        setGenericData(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error("Generic data çekilemedi:", err);
        setGenericData(null);
      }
    };

    fetchGenericData();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
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
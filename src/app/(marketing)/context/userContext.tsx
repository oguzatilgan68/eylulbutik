"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { CouponProvider } from "./CouponContext";
import { GenericData } from "@/generated/prisma"; // 💡 GenericData tipi import edildi

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

  // 🧠 Kullanıcıyı çek
  useEffect(() => {
    fetch("/api/auth/me", {
      cache: "no-store",
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  // 🌐 GenericData’yı çek
  useEffect(() => {
    fetch("/api/generic-data", { cache: "no-store", method: "GET" })
      .then((res) => res.json())
      .then((data) => setGenericData(data[0]))
      .catch(() => setGenericData(null));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
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

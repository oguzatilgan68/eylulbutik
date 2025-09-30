"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CouponData {
  code: string;
  discount: number;
  final: number;
}

interface CouponContextType {
  coupon: CouponData | null;
  setCoupon: (data: CouponData) => void;
  clearCoupon: () => void;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: ReactNode }) {
  const [coupon, setCouponState] = useState<CouponData | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("coupon");
    if (saved) {
      setCouponState(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (coupon) {
      sessionStorage.setItem("coupon", JSON.stringify(coupon));
    } else {
      sessionStorage.removeItem("coupon");
    }
  }, [coupon]);

  const setCoupon = (data: CouponData) => {
    setCouponState(data);
  };

  const clearCoupon = () => {
    setCouponState(null);
  };

  return (
    <CouponContext.Provider value={{ coupon, setCoupon, clearCoupon }}>
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (!context) throw new Error("useCoupon must be used inside CouponProvider");
  return context;
}

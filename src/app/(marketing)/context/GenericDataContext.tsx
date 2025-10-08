// src/context/GenericDataContext.tsx
"use client";
import { GenericData } from "@/generated/prisma";
import { createContext, useContext } from "react";

const GenericDataContext = createContext<GenericData | null>(null);

export function GenericDataProvider({
  value,
  children,
}: {
  value: GenericData;
  children: React.ReactNode;
}) {
  return (
    <GenericDataContext.Provider value={value}>
      {children}
    </GenericDataContext.Provider>
  );
}

export function useGenericData() {
  return useContext(GenericDataContext);
}

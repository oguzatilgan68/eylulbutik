// src/context/GenericDataContext.tsx
"use client";
import { createContext, useContext } from "react";

const GenericDataContext = createContext<any>(null);

export function GenericDataProvider({
  value,
  children,
}: {
  value: any;
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

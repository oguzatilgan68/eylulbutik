"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 500); // minimum süre (örneğin 0.5 sn)
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-sm z-[9999]"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 border-solid"></div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}

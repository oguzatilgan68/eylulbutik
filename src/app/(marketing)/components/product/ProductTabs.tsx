"use client";

import DetailsTab from "@/app/(marketing)/components/ui/product/tabs/DetailsTab";
import ModelTab from "@/app/(marketing)/components/ui/product/tabs/ModelTab";
import Reviews from "@/app/(marketing)/components/ui/product/tabs/Reviews";
import InstallmentTab from "@/app/(marketing)/components/ui/product/tabs/InstallmentTab";
import ReturnTab from "@/app/(marketing)/components/ui/product/tabs/ReturnTab";
import { useMemo } from "react";

export default function ProductTabs({
  activeTab,
  setActiveTab,
  tabs,
  product,
}: any) {
  const TabContent = useMemo(() => {
    switch (activeTab) {
      case "details":
        return <DetailsTab properties={product.properties} />;
      case "model":
        return (
          <ModelTab
            modelInfo={{ ...product.modelInfo, size: product.modelSize }}
          />
        );
      case "reviews":
        return <Reviews productId={product.id} />;
      case "installment":
        return <InstallmentTab />;
      case "return":
        return <ReturnTab />;
      default:
        return null;
    }
  }, [activeTab, product]);

  return (
    <div className="mt-16 bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
      {/* Lüks "Pill" Sekme Başlıkları */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
        {tabs.map((tab: any) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                : "bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sekme İçeriği */}
      <div className="text-gray-700 dark:text-gray-300">{TabContent}</div>
    </div>
  );
}
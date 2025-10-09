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
    <div className="mt-12">
      <div className="flex flex-col lg:flex-row border-b dark:border-gray-700">
        {tabs.map((tab: any) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-4 border-b-2 font-semibold transition text-left lg:text-center ${
              activeTab === tab.key
                ? "border-pink-500 text-pink-500"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-pink-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6 text-gray-700 dark:text-gray-300">{TabContent}</div>
    </div>
  );
}

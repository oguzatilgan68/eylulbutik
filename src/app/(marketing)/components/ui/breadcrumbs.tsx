"use client";

import Link from "next/link";
import Head from "next/head";

interface BreadcrumbItem {
  label: string;
  href?: string; // son item için opsiyonel
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // JSON-LD schema hazırlama
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${process.env.NEXT_PUBLIC_APP_URL}${item.href}` : undefined,
    })),
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <nav
        aria-label="breadcrumb"
        className="text-sm text-gray-600 dark:text-gray-300 mb-4"
      >
        <ol className="flex flex-wrap gap-1 items-center">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">›</span>}
                {isLast || !item.href ? (
                  <span className="font-semibold">{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

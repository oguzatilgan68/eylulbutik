// components/ui/Breadcrumb.tsx
import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: Crumb[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-sm mb-4" aria-label="Breadcrumb">
      <ol className="list-reset flex text-gray-600 dark:text-gray-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 dark:text-gray-200">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

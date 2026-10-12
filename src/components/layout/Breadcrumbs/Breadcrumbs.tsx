"use client";

import { Link } from "@/i18n/routing";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/** Path trail in small condensed caps, slash-separated. */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="pt-5 pb-4" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-y-1 list-none p-0 m-0 font-display uppercase tracking-wider text-[0.8rem]">
        {items.map((item, index) => (
          <li key={index} className="flex items-center min-w-0">
            {index > 0 && <span className="mx-2 text-ink-subtle" aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="text-ink-muted hover:text-ink hover:underline underline-offset-4 decoration-2 decoration-hivis">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink font-semibold truncate max-w-[60vw]" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

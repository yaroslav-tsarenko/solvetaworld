"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { ProductSkeleton } from "@/components/product/ProductSkeleton/ProductSkeleton";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";

export default function SearchPage() {
  const t = useTranslations("listing");
  const nav = useTranslations("nav");
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // A new ?q= from the header search replaces the field's contents.
  const [lastParam, setLastParam] = useState(initialQuery);
  if (initialQuery !== lastParam) {
    setLastParam(initialQuery);
    setQuery(initialQuery);
  }

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`)
        .then((res) => res.json())
        .then((d) => setResults(Array.isArray(d) ? d : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-container mx-auto px-4 lg:px-6 pb-16">
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("searchTitle") }]} />

      <section className="border-2 border-line-strong bg-hivis text-coal p-5 sm:p-8 mb-8">
        <h1 className="m-0 text-[2.75rem] max-sm:text-[2rem] leading-none text-coal">{t("searchTitle")}</h1>
        <p className="m-0 mt-2 text-[0.95rem]">{t("searchHint")}</p>
        <div className="mt-5 flex items-stretch h-14 border-2 border-coal bg-white max-w-[760px]">
          <span className="w-12 flex items-center justify-center text-coal" aria-hidden="true">
            <MagnifyingGlass size={22} />
          </span>
          <input
            type="search"
            aria-label={t("searchTitle")}
            placeholder={nav("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 min-w-0 bg-transparent text-coal text-lg outline-none pr-3"
          />
        </div>
      </section>

      {query.length >= 2 && !loading && results.length > 0 && (
        <p className="m-0 mb-4 font-mono text-sm text-ink-muted">
          {t("searchCount", { count: results.length, query })}
        </p>
      )}

      {loading ? (
        <ProductSkeleton count={8} />
      ) : results.length > 0 ? (
        <ProductGrid products={results} wide />
      ) : query.length >= 2 ? (
        <EmptyState
          title={t("searchNoneTitle")}
          subtitle={t("searchNoneText")}
          actionLabel={t("browseDepartments")}
          actionHref="/catalog"
        />
      ) : null}
    </div>
  );
}

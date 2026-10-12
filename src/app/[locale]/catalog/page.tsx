"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { Sliders, X, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters/ProductFilters";
import { ProductSort } from "@/components/product/ProductSort/ProductSort";
import { ProductSkeleton } from "@/components/product/ProductSkeleton/ProductSkeleton";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { cachedFetchJSON, readCached } from "@/lib/utils/reliable-fetch";

export default function CatalogPage() {
  const t = useTranslations("listing");
  const nav = useTranslations("nav");
  const searchParams = useSearchParams();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>(() => {
    const cached = readCached<{ data: any[] }>({ cacheKey: "catalog:last", storage: "session" });
    return cached?.data || [];
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>(() => {
    return readCached<any[]>({ cacheKey: "catalog:categories", storage: "session" }) || [];
  });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>(() => {
    return readCached<string[]>({ cacheKey: "catalog:brands", storage: "session" }) || [];
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const page = parseInt(searchParams.get("page") || "1");
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const inStock = searchParams.get("inStock") === "true";
  const onSale = searchParams.get("onSale") === "true";
  const selectedBrand = searchParams.get("brand") || "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (updates.page === undefined && !updates.page) params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    cachedFetchJSON<unknown>("/api/categories", { cacheKey: "catalog:categories", storage: "session" })
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
    cachedFetchJSON<unknown>("/api/products/brands", { cacheKey: "catalog:brands", storage: "session" })
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("sort", sort);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock) params.set("inStock", "true");
    if (onSale) params.set("onSale", "true");
    if (selectedBrand) params.set("brand", selectedBrand);

    const key = `catalog:products:${params.toString()}`;
    const cached = readCached<{ data: unknown[]; total: number; totalPages: number }>({
      cacheKey: key,
      storage: "session",
      ttlMs: 5 * 60 * 1000,
    });
    if (cached) {
      setProducts(cached.data || []);
      setTotal(cached.total || 0);
      setTotalPages(cached.totalPages || 1);
      setLoading(false);
    } else {
      setLoading(true);
    }

    cachedFetchJSON<{ data: unknown[]; total: number; totalPages: number }>(
      `/api/products?${params}`,
      { cacheKey: key, storage: "session" },
    )
      .then((data) => {
        setProducts(data.data || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, sort, category, minPrice, maxPrice, inStock, onSale, selectedBrand]);

  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  const activeFilterCount = [category, minPrice, maxPrice, inStock, onSale, selectedBrand].filter(Boolean).length;

  const findCat = (slug: string) => {
    for (const c of categories) {
      if (c.slug === slug) return c.name as string;
      for (const ch of c.children || []) if (ch.slug === slug) return ch.name as string;
    }
    return slug;
  };

  const chips: { key: string; label: string; clear: Record<string, string> }[] = [
    ...(category ? [{ key: "cat", label: findCat(category), clear: { category: "" } }] : []),
    ...(selectedBrand ? [{ key: "brand", label: selectedBrand, clear: { brand: "" } }] : []),
    ...(minPrice || maxPrice
      ? [{ key: "price", label: `£${minPrice || "0"} – ${maxPrice ? `£${maxPrice}` : "∞"}`, clear: { minPrice: "", maxPrice: "" } }]
      : []),
    ...(inStock ? [{ key: "stock", label: t("onlyInStock"), clear: { inStock: "" } }] : []),
    ...(onSale ? [{ key: "sale", label: t("onlyReduced"), clear: { onSale: "" } }] : []),
  ];

  const filters = (mobile: boolean) => (
    <ProductFilters
      categories={categories}
      selectedCategory={category}
      minPrice={minPrice}
      maxPrice={maxPrice}
      inStock={inStock}
      onSale={onSale}
      brands={brands}
      selectedBrand={selectedBrand}
      onCategoryChange={(v) => { updateParams({ category: v, page: "1" }); if (mobile) setMobileFiltersOpen(false); }}
      onMinPriceChange={(v) => updateParams({ minPrice: v, page: "1" })}
      onMaxPriceChange={(v) => updateParams({ maxPrice: v, page: "1" })}
      onInStockChange={(v) => updateParams({ inStock: v ? "true" : "", page: "1" })}
      onSaleChange={(v) => updateParams({ onSale: v ? "true" : "", page: "1" })}
      onBrandChange={(v) => { updateParams({ brand: v, page: "1" }); if (mobile) setMobileFiltersOpen(false); }}
    />
  );

  const pages: (number | "gap-a" | "gap-b")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("gap-a");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("gap-b");
    pages.push(totalPages);
  }
  const pageBtn = "min-w-10 h-10 px-3 flex items-center justify-center border-2 border-line-strong bg-surface text-ink font-display font-bold text-base cursor-pointer hover:bg-hivis hover:text-coal disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-ink";

  return (
    <div className="max-w-container mx-auto px-4 lg:px-6 pb-16">
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("catalogueTitle") }]} />

      <header className="flex flex-wrap items-end justify-between gap-4 pb-4 mb-5 border-b-4 border-line-strong">
        <div>
          <h1 className="m-0 text-[3rem] max-sm:text-[2.25rem] leading-none text-ink">
            {onSale ? t("reducedTitle") : t("catalogueTitle")}
          </h1>
          <p className="m-0 mt-2 font-mono text-sm text-ink-muted">
            {t("resultCount", { shown: products.length, total })}
          </p>
        </div>
        <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-between">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden btn-line !min-h-10 !text-base"
            type="button"
          >
            <Sliders size={18} />
            {t("filters")}
            {activeFilterCount > 0 && (
              <span className="bg-hivis text-coal px-1.5 text-sm">{activeFilterCount}</span>
            )}
          </button>
          <ProductSort value={sort} onChange={(v) => updateParams({ sort: v, page: "1" })} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="hidden lg:block sticky top-[calc(var(--header-height)+var(--deptbar-height)+1rem)] self-start max-h-[calc(100vh-var(--header-height)-var(--deptbar-height)-2rem)] overflow-y-auto">
          {filters(false)}
        </aside>

        <div className="min-w-0">
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="u-cond font-bold text-sm">{t("activeFilters")}</span>
              {chips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => updateParams({ ...c.clear, page: "1" })}
                  className="inline-flex items-center gap-1.5 h-8 pl-2.5 pr-1.5 bg-coal text-white text-sm font-semibold border-0 cursor-pointer hover:bg-sale"
                  aria-label={t("removeFilter", { name: c.label })}
                >
                  {c.label} <X size={14} />
                </button>
              ))}
              <button
                type="button"
                onClick={() => updateParams({ category: "", brand: "", minPrice: "", maxPrice: "", inStock: "", onSale: "", page: "1" })}
                className="text-sm font-semibold text-link underline underline-offset-2 bg-transparent border-0 cursor-pointer"
              >
                {t("clearAll")}
              </button>
            </div>
          )}

          {loading ? (
            <ProductSkeleton count={12} />
          ) : products.length === 0 ? (
            <EmptyState
              title={t("noMatchTitle")}
              subtitle={t("noMatchText")}
              actionLabel={t("clearAll")}
              actionHref="/catalog"
            />
          ) : (
            <>
              <ProductGrid products={products} />
              {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-1.5 mt-10 flex-wrap" aria-label={t("pagination")}>
                  <button onClick={() => updateParams({ page: String(page - 1) })} disabled={page <= 1} className={pageBtn}>
                    <CaretLeft size={16} /> <span className="max-sm:hidden u-cond ml-1">{t("prev")}</span>
                  </button>
                  {pages.map((p) =>
                    typeof p === "string" ? (
                      <span key={p} className="min-w-10 h-10 flex items-center justify-center text-ink-muted">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => updateParams({ page: String(p) })}
                        aria-current={p === page ? "page" : undefined}
                        className={p === page ? `${pageBtn} !bg-coal !text-hivis` : pageBtn}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button onClick={() => updateParams({ page: String(page + 1) })} disabled={page >= totalPages} className={pageBtn}>
                    <span className="max-sm:hidden u-cond mr-1">{t("next")}</span> <CaretRight size={16} />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden" role="dialog" aria-modal="true" aria-label={t("filters")}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[min(92vw,380px)] bg-surface overflow-y-auto border-l-4 border-hivis">
            <div className="sticky top-0 z-10 flex justify-between items-center h-14 px-4 bg-coal text-white">
              <span className="u-cond font-bold text-lg">{t("filters")}</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-transparent border-0 cursor-pointer text-white"
                aria-label={t("closeFilters")}
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-3">{filters(true)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

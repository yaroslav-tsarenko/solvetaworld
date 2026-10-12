"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Minus, Plus } from "@phosphor-icons/react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
  children?: Category[];
}

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  onSale: boolean;
  brands: string[];
  selectedBrand: string;
  onCategoryChange: (slug: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onInStockChange: (value: boolean) => void;
  onSaleChange: (value: boolean) => void;
  onBrandChange: (value: string) => void;
}

function count(cat: Category): number {
  return (cat._count?.products || 0) + (cat.children || []).reduce((s, c) => s + count(c), 0);
}

/** Square tick box drawn in the brand style; the real control is the wrapping button/label. */
function Tick({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`w-[18px] h-[18px] shrink-0 flex items-center justify-center border-2 ${
        on ? "bg-hivis border-coal text-coal" : "bg-surface border-line-strong"
      }`}
    >
      {on && <Check size={12} weight="bold" />}
    </span>
  );
}

function Group({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <fieldset className="m-0 p-0 border-0 border-t-2 border-line-strong first:border-t-0">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-1 border-0 cursor-pointer text-ink"
      >
        <span className="font-display font-bold uppercase tracking-wide text-[1.05rem]">{title}</span>
        {open ? <Minus size={16} /> : <Plus size={16} />}
      </button>
      {open && <div className="px-4 py-3">{children}</div>}
    </fieldset>
  );
}

const rowCls =
  "w-full flex items-center gap-2.5 py-1.5 text-left text-[0.875rem] bg-transparent border-0 cursor-pointer text-ink hover:underline underline-offset-2";

/** Left-rail filter checklist: departments, price band, brand, stock & markdown. */
export function ProductFilters({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  inStock,
  onSale,
  brands,
  selectedBrand,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onInStockChange,
  onSaleChange,
  onBrandChange,
}: ProductFiltersProps) {
  const t = useTranslations("listing");
  const [brandQuery, setBrandQuery] = useState("");
  const [showAllDepts, setShowAllDepts] = useState(false);

  const sortedCats = useMemo(
    () => [...categories].filter((c) => count(c) > 0).sort((a, b) => count(b) - count(a)),
    [categories],
  );
  const visibleCats = showAllDepts ? sortedCats : sortedCats.slice(0, 10);
  const shownBrands = useMemo(() => {
    const q = brandQuery.trim().toLowerCase();
    return (q ? brands.filter((b) => b.toLowerCase().includes(q)) : brands).slice(0, 60);
  }, [brands, brandQuery]);

  const bands: { label: string; min: string; max: string }[] = [
    { label: t("bandUnder", { amount: "£25" }), min: "", max: "25" },
    { label: "£25 – £50", min: "25", max: "50" },
    { label: "£50 – £100", min: "50", max: "100" },
    { label: t("bandOver", { amount: "£100" }), min: "100", max: "" },
  ];

  return (
    <div className="border-2 border-line-strong bg-surface" data-sw="filters">
      <Group title={t("filterDepartment")}>
        {categories.length === 0 ? (
          <ul className="list-none m-0 p-0 flex flex-col gap-2 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="h-4 bg-surface-2" style={{ width: `${55 + ((i * 17) % 40)}%` }} />
            ))}
          </ul>
        ) : (
          <ul className="list-none m-0 p-0">
            <li>
              <button type="button" className={rowCls} onClick={() => onCategoryChange("")} aria-pressed={!selectedCategory}>
                <Tick on={!selectedCategory} />
                <span className="flex-1 font-semibold">{t("allDepartments")}</span>
              </button>
            </li>
            {visibleCats.map((cat) => {
              const activeChild = cat.children?.find((c) => c.slug === selectedCategory);
              const on = selectedCategory === cat.slug;
              return (
                <li key={cat.id}>
                  <button type="button" className={rowCls} onClick={() => onCategoryChange(cat.slug)} aria-pressed={on}>
                    <Tick on={on} />
                    <span className="flex-1 min-w-0 truncate">{cat.name}</span>
                    <span className="font-mono text-xs text-ink-subtle tabular-nums">{count(cat)}</span>
                  </button>
                  {(on || activeChild) && cat.children && cat.children.length > 0 && (
                    <ul className="list-none m-0 p-0 pl-6 border-l-2 border-hivis ml-2 mb-1">
                      {cat.children.map((ch) => (
                        <li key={ch.id}>
                          <button
                            type="button"
                            className={rowCls}
                            onClick={() => onCategoryChange(ch.slug)}
                            aria-pressed={selectedCategory === ch.slug}
                          >
                            <Tick on={selectedCategory === ch.slug} />
                            <span className="flex-1 min-w-0 truncate">{ch.name}</span>
                            <span className="font-mono text-xs text-ink-subtle tabular-nums">{count(ch)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {sortedCats.length > 10 && (
          <button
            type="button"
            onClick={() => setShowAllDepts(!showAllDepts)}
            className="mt-2 text-sm font-semibold text-link bg-transparent border-0 cursor-pointer p-0 underline underline-offset-2"
          >
            {showAllDepts ? t("showFewer") : t("showAll", { count: sortedCats.length })}
          </button>
        )}
      </Group>

      <Group title={t("filterPrice")}>
        <ul className="list-none m-0 p-0 mb-3">
          {bands.map((b) => {
            const on = minPrice === b.min && maxPrice === b.max;
            return (
              <li key={b.label}>
                <button
                  type="button"
                  className={rowCls}
                  aria-pressed={on}
                  onClick={() => {
                    onMinPriceChange(on ? "" : b.min);
                    onMaxPriceChange(on ? "" : b.max);
                  }}
                >
                  <Tick on={on} />
                  <span>{b.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="field-label !text-xs">{t("min")}</span>
            <input type="number" inputMode="decimal" min={0} value={minPrice} onChange={(e) => onMinPriceChange(e.target.value)} className="field !min-h-10 !py-1.5" />
          </label>
          <label className="block">
            <span className="field-label !text-xs">{t("max")}</span>
            <input type="number" inputMode="decimal" min={0} value={maxPrice} onChange={(e) => onMaxPriceChange(e.target.value)} className="field !min-h-10 !py-1.5" />
          </label>
        </div>
      </Group>

      {brands.length > 0 && (
        <Group title={t("filterBrand")} defaultOpen={!!selectedBrand}>
          <input
            type="search"
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            placeholder={t("brandSearch")}
            aria-label={t("brandSearch")}
            className="field !min-h-10 !py-1.5 mb-2"
          />
          <ul className="list-none m-0 p-0 max-h-[260px] overflow-y-auto">
            <li>
              <button type="button" className={rowCls} onClick={() => onBrandChange("")} aria-pressed={!selectedBrand}>
                <Tick on={!selectedBrand} />
                <span className="font-semibold">{t("anyBrand")}</span>
              </button>
            </li>
            {shownBrands.map((b) => (
              <li key={b}>
                <button type="button" className={rowCls} onClick={() => onBrandChange(b)} aria-pressed={selectedBrand === b}>
                  <Tick on={selectedBrand === b} />
                  <span className="truncate">{b}</span>
                </button>
              </li>
            ))}
          </ul>
        </Group>
      )}

      <Group title={t("filterStock")}>
        <button type="button" className={rowCls} onClick={() => onInStockChange(!inStock)} aria-pressed={inStock}>
          <Tick on={inStock} />
          <span>{t("onlyInStock")}</span>
        </button>
        <button type="button" className={rowCls} onClick={() => onSaleChange(!onSale)} aria-pressed={onSale}>
          <Tick on={onSale} />
          <span>{t("onlyReduced")}</span>
        </button>
      </Group>
    </div>
  );
}

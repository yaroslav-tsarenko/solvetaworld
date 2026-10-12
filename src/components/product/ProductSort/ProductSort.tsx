"use client";

import { useTranslations } from "next-intl";

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
}

/** Inline "Order by" selector. */
export function ProductSort({ value, onChange }: ProductSortProps) {
  const t = useTranslations("listing");

  const options = [
    { key: "newest", label: t("sortNewest") },
    { key: "price-asc", label: t("sortPriceUp") },
    { key: "price-desc", label: t("sortPriceDown") },
    { key: "name-asc", label: t("sortName") },
  ];

  return (
    <label className="flex items-center gap-2">
      <span className="u-cond font-bold text-sm whitespace-nowrap">{t("orderBy")}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field !w-auto !min-h-10 !py-1.5 pr-8 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

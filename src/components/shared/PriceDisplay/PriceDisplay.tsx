"use client";

import { formatPrice } from "@/lib/utils/format-price";
import { useCurrency } from "@/providers/CurrencyProvider";

interface PriceDisplayProps {
  price: number;
  comparePrice?: number | null;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { price: "text-[1.25rem]", compare: "text-xs" },
  md: { price: "text-[1.75rem]", compare: "text-sm" },
  lg: { price: "text-[2.75rem]", compare: "text-base" },
};

/** Condensed heavy price; a marked-down price shows in signal orange with the was-price struck through. */
export function PriceDisplay({ price, comparePrice, size = "md" }: PriceDisplayProps) {
  const { currency, convert } = useCurrency();
  const isOnSale = comparePrice != null && comparePrice > price;

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`font-display font-extrabold leading-none tabular-nums tracking-tight ${sizes[size].price} ${isOnSale ? "text-sale" : "text-ink"}`}>
        {formatPrice(convert(price), currency)}
      </span>
      {isOnSale && (
        <span className={`${sizes[size].compare} text-ink-subtle line-through tabular-nums`}>
          {formatPrice(convert(comparePrice), currency)}
        </span>
      )}
    </div>
  );
}

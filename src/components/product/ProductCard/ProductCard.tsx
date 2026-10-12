"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ShoppingCartSimple, Check } from "@phosphor-icons/react";
import { useCart } from "@/providers/CartProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatPrice } from "@/lib/utils/format-price";
import { getProductImage, getProductImageFallback } from "@/lib/utils/product-image";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  brand?: string | null;
  price: number;
  comparePrice?: number | null;
  imageUrl?: string | null;
  /** Stock on hand; undefined = unknown (treated as available). */
  quantity?: number;
  lowStockAlert?: number;
  /** Visual density: "rail" cards are fixed-width inside horizontal scrollers. */
  variant?: "grid" | "rail";
}

/**
 * Spec-sheet product card: brand + SKU strip, image, name, big condensed
 * price, stock indicator and a full-width ink "add" bar.
 */
export function ProductCard({
  id,
  name,
  slug,
  sku,
  brand,
  price,
  comparePrice,
  imageUrl,
  quantity,
  lowStockAlert = 5,
  variant = "grid",
}: ProductCardProps) {
  const t = useTranslations("product");
  const { addItem } = useCart();
  const { currency, convert } = useCurrency();
  const [added, setAdded] = useState(false);

  const onSale = comparePrice != null && comparePrice > price;
  const pctOff = onSale ? Math.round(((comparePrice! - price) / comparePrice!) * 100) : 0;
  const stock = quantity ?? 99;
  const out = stock <= 0;
  const low = !out && quantity !== undefined && stock <= lowStockAlert;
  const src = getProductImage(imageUrl, name);
  const href = `/product/${slug}`;

  const add = () => {
    if (out) return;
    addItem({
      productId: id,
      name,
      slug,
      sku: sku || id,
      price,
      quantity: 1,
      imageUrl: src,
      maxQuantity: stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article
      className={`group relative flex flex-col bg-surface border-2 border-line transition-[border-color,box-shadow,transform] hover:border-line-strong hover:shadow-card-hover hover:-translate-x-[2px] hover:-translate-y-[2px] ${
        variant === "rail" ? "w-[232px] max-sm:w-[176px] shrink-0 snap-start" : "min-w-0"
      }`}
      data-sw="card"
    >
      <div className="flex items-center justify-between gap-2 px-2.5 h-7 border-b border-line bg-surface-1 text-[0.7rem] leading-none">
        <span className="font-display font-bold uppercase tracking-wide truncate text-ink">
          {brand || t("unbranded")}
        </span>
        {sku && (
          <span className="font-mono text-ink-muted truncate" title={`${t("sku")} ${sku}`}>
            {sku}
          </span>
        )}
      </div>

      <Link href={href} className="relative block aspect-square bg-white" tabIndex={-1} aria-hidden="true">
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
          className="object-contain p-4 max-sm:p-2"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getProductImageFallback();
          }}
        />
        {onSale && (
          <span className="absolute left-0 bottom-0 bg-coal text-hivis font-display font-extrabold text-[0.95rem] leading-none px-2 py-1.5 tabular-nums">
            −{pctOff}%
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 gap-1.5 px-2.5 pt-2.5 pb-3 border-t border-line">
        <h3 className="m-0 font-sans normal-case tracking-normal text-[0.875rem] max-sm:text-[0.8125rem] font-semibold leading-[1.3] line-clamp-2 min-h-[2.6em] [overflow-wrap:anywhere]">
          <Link href={href} className="hover:underline underline-offset-2 decoration-2 decoration-hivis">
            {name}
          </Link>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col leading-none">
            {onSale && (
              <span className="text-[0.75rem] text-ink-subtle line-through tabular-nums mb-0.5">
                {formatPrice(convert(comparePrice!), currency)}
              </span>
            )}
            <span
              className={`font-display font-extrabold text-[1.6rem] max-sm:text-[1.3rem] tabular-nums tracking-tight ${
                onSale ? "text-sale" : "text-ink"
              }`}
            >
              {formatPrice(convert(price), currency)}
            </span>
          </div>
        </div>

        <p className="m-0 flex items-center gap-1.5 text-[0.75rem] font-medium text-ink-muted">
          <span
            aria-hidden="true"
            className={`inline-block w-2 h-2 ${out ? "bg-danger" : low ? "bg-warning" : "bg-success"}`}
          />
          {out ? t("outOfStock") : low ? t("onlyLeft", { count: stock }) : t("inStock")}
        </p>
      </div>

      <button
        type="button"
        onClick={add}
        disabled={out}
        aria-label={`${t("addToCart")}: ${name}`}
        className={`h-10 w-full flex items-center justify-center gap-2 font-display font-bold uppercase tracking-wide text-[0.95rem] border-0 transition-colors ${
          out
            ? "bg-surface-2 text-ink-subtle cursor-not-allowed"
            : added
              ? "bg-hivis text-coal cursor-pointer"
              : "bg-coal text-white cursor-pointer hover:bg-hivis hover:text-coal"
        }`}
      >
        {added ? <Check size={18} /> : <ShoppingCartSimple size={18} />}
        {out ? t("outOfStock") : added ? t("added") : t("addToCart")}
      </button>
    </article>
  );
}

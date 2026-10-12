"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Heart, ShoppingCartSimple, Package, ArrowsCounterClockwise, Certificate, Lightning } from "@phosphor-icons/react";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { QuantitySelector } from "@/components/shared/QuantitySelector/QuantitySelector";
import { useCart } from "@/providers/CartProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatPrice } from "@/lib/utils/format-price";
import { EXPRESS_PRICE, FREE_STANDARD_MIN, STANDARD_PRICE } from "@/lib/shipping";
import { Link, useRouter } from "@/i18n/routing";
import { toast } from "sonner";

const WARRANTY_OPTIONS = [
  { key: "none", years: 0, percent: 0, min: 0 },
  { key: "1year", years: 1, percent: 10, min: 6.99 },
  { key: "2year", years: 2, percent: 16, min: 9.99 },
  { key: "3year", years: 3, percent: 22, min: 12.99 },
];

// Hide additional warranty for low-priced items where the minimum
// charge would be disproportionate to the product price.
const WARRANTY_MIN_PRODUCT_PRICE = 15;

function calcWarrantyPrice(productPrice: number, option: typeof WARRANTY_OPTIONS[number]): number {
  if (option.percent === 0) return 0;
  return Math.max(productPrice * (option.percent / 100), option.min);
}

interface ProductBuyBoxProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  quantity: number;
  lowStockAlert: number;
  imageUrl?: string | null;
}

/**
 * Sticky purchase panel on the product page: price, stock, optional extended
 * cover, quantity and the two purchase actions, followed by the buying terms.
 */
export function ProductBuyBox({
  id,
  name,
  slug,
  sku,
  price,
  comparePrice,
  quantity: stockQuantity,
  lowStockAlert,
  imageUrl,
}: ProductBuyBoxProps) {
  const t = useTranslations("product");
  const [qty, setQty] = useState(1);
  const [selectedWarranty, setSelectedWarranty] = useState(0);
  const { addItem } = useCart();
  const { currency, convert } = useCurrency();
  const router = useRouter();

  const outOfStock = stockQuantity <= 0;
  const lowStock = stockQuantity > 0 && stockQuantity <= lowStockAlert;

  const warrantyAvailable = price >= WARRANTY_MIN_PRODUCT_PRICE;
  const warrantyOption = warrantyAvailable ? WARRANTY_OPTIONS[selectedWarranty] : WARRANTY_OPTIONS[0];
  const warrantyPrice = calcWarrantyPrice(price, warrantyOption);
  const totalPrice = price + warrantyPrice;

  const lineItem = () => ({
    productId: id,
    name: warrantyOption.years > 0 ? `${name} + ${warrantyOption.years}yr warranty` : name,
    slug,
    sku,
    price: totalPrice,
    quantity: qty,
    imageUrl: imageUrl || null,
    maxQuantity: stockQuantity,
  });

  const handleAddToCart = () => addItem(lineItem());

  const handleBuyNow = () => {
    addItem(lineItem());
    router.push("/checkout");
  };

  const handleWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
      const data = await res.json();
      if (data.action === "added") {
        toast.success(t("addToWishlist"));
      } else {
        toast.success(t("removeFromWishlist"));
      }
    } catch {
      toast.error(t("wishlistSignIn"));
    }
  };

  const isOnSale = comparePrice != null && comparePrice > price;
  const savingsPercent = isOnSale ? Math.round(((comparePrice! - price) / comparePrice!) * 100) : 0;

  return (
    <div className="border-2 border-line-strong bg-surface" data-sw="buybox">
      {/* Price block */}
      <div className="p-5 border-b-2 border-line-strong">
        <div className="flex items-start justify-between gap-3">
          <PriceDisplay price={price} comparePrice={comparePrice} size="lg" />
          {isOnSale && (
            <span className="bg-coal text-hivis font-display font-extrabold text-lg leading-none px-2 py-1.5 tabular-nums">
              −{savingsPercent}%
            </span>
          )}
        </div>
        <p className="m-0 mt-1 text-xs text-ink-subtle">{t("priceNote")}</p>
        <p className="m-0 mt-4 flex items-center gap-2 text-sm font-semibold">
          <span
            aria-hidden="true"
            className={`w-3 h-3 ${outOfStock ? "bg-danger" : lowStock ? "bg-warning" : "bg-success"}`}
          />
          {outOfStock ? t("outOfStock") : lowStock ? t("onlyLeft", { count: stockQuantity }) : t("inStock")}
        </p>
      </div>

      {/* Extended cover */}
      <fieldset className="m-0 p-5 border-0 border-b-2 border-line-strong">
        <legend className="sr-only">{t("warranty")}</legend>
        <p className="m-0 font-display font-bold uppercase text-[1.05rem] flex items-center gap-2">
          <Certificate size={18} /> {t("warranty")}
        </p>
        <p className="m-0 mt-1 mb-3 text-xs text-ink-muted">{t("warrantyStandard")}</p>
        {warrantyAvailable && (
          <ul className="list-none m-0 p-0 border-2 border-line">
            {WARRANTY_OPTIONS.map((opt, idx) => {
              const on = idx === selectedWarranty;
              return (
                <li key={opt.key} className="border-t border-line first:border-t-0">
                  <label className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer text-sm ${on ? "bg-hivis text-coal" : "hover:bg-surface-1"}`}>
                    <input
                      type="radio"
                      name="extended-cover"
                      checked={on}
                      onChange={() => setSelectedWarranty(idx)}
                      className="w-4 h-4 accent-coal"
                    />
                    <span className="flex-1 font-semibold">
                      {idx === 0
                        ? t("noWarranty")
                        : t(`warrantyOption${opt.years}year` as "warrantyOption1year" | "warrantyOption2year" | "warrantyOption3year")}
                    </span>
                    {opt.percent > 0 && (
                      <span className="font-display font-bold tabular-nums">
                        +{formatPrice(convert(calcWarrantyPrice(price, opt)), currency)}
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </fieldset>

      {/* Actions */}
      <div className="p-5 flex flex-col gap-3 border-b-2 border-line-strong">
        <div className="flex items-center justify-between gap-3">
          <span className="u-cond font-bold text-sm">{t("quantity")}</span>
          <QuantitySelector quantity={qty} maxQuantity={Math.max(1, stockQuantity)} onChange={setQty} />
        </div>
        <button type="button" onClick={handleAddToCart} disabled={outOfStock} className="btn-yellow w-full !min-h-[54px] !text-[1.25rem]">
          <ShoppingCartSimple size={22} />
          {selectedWarranty > 0 ? t("addToCartWithWarranty") : t("addToCart")}
        </button>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <button type="button" onClick={handleBuyNow} disabled={outOfStock} className="btn-ink w-full">
            <Lightning size={18} /> {t("buyNow")}
          </button>
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={t("addToWishlist")}
            title={t("addToWishlist")}
            className="btn-line !px-3"
          >
            <Heart size={20} />
          </button>
        </div>
      </div>

      {/* Buying terms */}
      <ul className="list-none m-0 p-5 flex flex-col gap-3 text-sm">
        <li className="flex gap-3">
          <Package size={20} className="shrink-0" />
          <span>
            <strong className="block font-display uppercase tracking-wide">{t("termDelivery")}</strong>
            <span className="text-ink-muted">{t("termDeliveryText", {
              threshold: formatPrice(convert(FREE_STANDARD_MIN), currency),
              standard: formatPrice(convert(STANDARD_PRICE), currency),
              express: formatPrice(convert(EXPRESS_PRICE), currency),
            })}</span>{" "}
            <Link href="/policies/shipping" className="text-link underline underline-offset-2">{t("termDetails")}</Link>
          </span>
        </li>
        <li className="flex gap-3">
          <ArrowsCounterClockwise size={20} className="shrink-0" />
          <span>
            <strong className="block font-display uppercase tracking-wide">{t("termReturns")}</strong>
            <span className="text-ink-muted">{t("termReturnsText")}</span>{" "}
            <Link href="/policies/returns" className="text-link underline underline-offset-2">{t("termDetails")}</Link>
          </span>
        </li>
      </ul>
    </div>
  );
}

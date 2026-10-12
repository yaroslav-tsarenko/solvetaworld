"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Basket, ArrowRight, Lock, X, ImageBroken, Truck } from "@phosphor-icons/react";
import { useCart } from "@/providers/CartProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { QuantitySelector } from "@/components/shared/QuantitySelector/QuantitySelector";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { formatPrice } from "@/lib/utils/format-price";
import { FREE_STANDARD_MIN, amountToFreeStandard } from "@/lib/shipping";

/** Number of blocks in the free-delivery meter. */
const METER_SEGMENTS = 10;

export default function CartPage() {
  const t = useTranslations("cart");
  const nav = useTranslations("nav");
  const { cart, updateQuantity, removeItem } = useCart();
  const { currency, convert } = useCurrency();

  // Free standard delivery is decided in GBP (see src/lib/shipping.ts); only display is converted.
  const freeShippingThreshold = convert(FREE_STANDARD_MIN);
  const subtotalConverted = convert(cart.subtotal);
  const remaining = amountToFreeStandard(cart.subtotal);
  const progress = Math.min(cart.subtotal / FREE_STANDARD_MIN, 1);
  const filledSegments = Math.floor(progress * METER_SEGMENTS);
  const money = (amount: number) => formatPrice(convert(amount), currency);

  return (
    <div className="max-w-container mx-auto px-4 pb-16">
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("title") }]} />

      <header className="sec-head">
        <h1 className="m-0 text-[2.25rem] max-sm:text-[1.75rem] text-ink">{t("title")}</h1>
        {cart.items.length > 0 && (
          <p className="m-0 font-mono text-sm text-ink-muted tabular-nums">
            {t("lineCount", { count: cart.items.length })} · {t("itemCount", { count: cart.itemCount })}
          </p>
        )}
      </header>

      {cart.items.length === 0 ? (
        <EmptyState
          title={t("empty")}
          subtitle={t("emptySubtitle")}
          actionLabel={t("continueShopping")}
          actionHref="/catalog"
          icon={<Basket size={34} />}
        />
      ) : (
        <>
          {/* Free-delivery meter */}
          <section
            aria-label={t("freeDeliveryScale", { amount: formatPrice(freeShippingThreshold, currency) })}
            className="mb-6 border-2 border-line-strong bg-surface-1 p-4 max-sm:p-3"
          >
            <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
              <p className="m-0 flex items-center gap-2 font-display font-bold uppercase tracking-wide text-ink">
                <Truck size={18} />
                {remaining > 0
                  ? t("freeDeliveryRemaining", { amount: formatPrice(convert(remaining), currency) })
                  : t("freeDeliveryReached")}
              </p>
              <span className="font-mono text-xs text-ink-muted tabular-nums">
                {formatPrice(remaining > 0 ? subtotalConverted : freeShippingThreshold, currency)} / {formatPrice(freeShippingThreshold, currency)}
              </span>
            </div>
            <div className="grid grid-cols-10 gap-1" aria-hidden="true">
              {Array.from({ length: METER_SEGMENTS }, (_, i) => (
                <span
                  key={i}
                  className={`h-3 border border-line-strong ${i < filledSegments ? "bg-hivis" : "bg-surface"}`}
                />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8 items-start">
            {/* Line items */}
            <table className="w-full border-collapse border-2 border-line-strong bg-surface max-md:block">
              <thead className="max-md:hidden">
                <tr className="bg-coal text-left">
                  <th scope="col" className="px-4 py-2.5 u-cond text-sm font-bold text-hivis">{t("colItem")}</th>
                  <th scope="col" className="px-3 py-2.5 u-cond text-sm font-bold text-hivis">{t("colSku")}</th>
                  <th scope="col" className="px-3 py-2.5 u-cond text-sm font-bold text-hivis text-right">{t("colUnit")}</th>
                  <th scope="col" className="px-3 py-2.5 u-cond text-sm font-bold text-hivis text-center">{t("colQty")}</th>
                  <th scope="col" className="px-3 py-2.5 u-cond text-sm font-bold text-hivis text-right">{t("colLine")}</th>
                  <th scope="col" className="w-12 px-2 py-2.5"><span className="sr-only">{t("remove")}</span></th>
                </tr>
              </thead>
              <tbody className="max-md:block">
                <AnimatePresence initial={false}>
                  {cart.items.map((item) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="border-t border-line first:border-t-0 align-middle max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-3 max-md:gap-y-3 max-md:p-4"
                    >
                      <td className="px-4 py-4 max-md:p-0 max-md:col-span-2">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-16 h-16 shrink-0 border border-line bg-white">
                            {item.imageUrl ? (
                              <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-contain p-1.5" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-ink-subtle" title={t("noImage")}>
                                <ImageBroken size={22} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/product/${item.slug}`}
                              className="block text-[0.9375rem] font-semibold text-ink leading-snug line-clamp-2 [overflow-wrap:anywhere] hover:underline"
                            >
                              {item.name}
                            </Link>
                            {item.variantName && (
                              <span className="block mt-0.5 text-xs text-ink-muted">{item.variantName}</span>
                            )}
                            <span className="md:hidden block mt-0.5 font-mono text-xs text-ink-subtle">
                              {t("colSku")} {item.sku}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 font-mono text-xs text-ink-muted whitespace-nowrap max-md:hidden">
                        {item.sku}
                      </td>
                      <td className="px-3 py-4 text-right font-mono text-sm tabular-nums whitespace-nowrap max-md:p-0 max-md:text-left max-md:self-center">
                        <span className="md:hidden u-cond text-xs font-bold text-ink-muted mr-2">{t("colUnit")}</span>
                        {money(item.price)}
                      </td>
                      <td className="px-3 py-4 text-center max-md:p-0 max-md:text-right">
                        <QuantitySelector
                          size="sm"
                          quantity={item.quantity}
                          maxQuantity={item.maxQuantity}
                          onChange={(qty) => updateQuantity(item.productId, qty, item.variantId)}
                        />
                      </td>
                      <td className="px-3 py-4 text-right font-display text-lg font-extrabold tabular-nums whitespace-nowrap max-md:p-0 max-md:text-left max-md:self-center">
                        <span className="md:hidden u-cond text-xs font-bold text-ink-muted mr-2">{t("colLine")}</span>
                        {money(item.price * item.quantity)}
                      </td>
                      <td className="px-2 py-4 text-center max-md:p-0 max-md:text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variantId)}
                          aria-label={t("removeItem", { name: item.name })}
                          className="inline-flex items-center justify-center w-9 h-9 border-2 border-line text-ink-muted bg-surface cursor-pointer transition-colors hover:border-danger hover:text-danger"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Summary */}
            <aside className="border-2 border-line-strong bg-surface lg:sticky lg:top-[calc(var(--header-height)+var(--announcement-height)+1rem)]">
              <h2 className="m-0 px-5 py-3 bg-coal text-hivis text-xl">{t("summaryTitle")}</h2>

              <dl className="m-0 px-5 pt-4 pb-2 text-sm">
                <div className="flex justify-between gap-4 py-2 border-b border-line">
                  <dt className="text-ink-muted">{t("subtotal")}</dt>
                  <dd className="m-0 font-mono tabular-nums">{money(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-4 py-2 border-b border-line">
                  <dt className="text-ink-muted">{t("shipping")}</dt>
                  <dd className={`m-0 font-mono tabular-nums ${cart.shippingCost === 0 ? "text-success font-semibold" : ""}`}>
                    {cart.shippingCost > 0 ? money(cart.shippingCost) : t("free")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-ink-muted">{t("tax")} (21%)</dt>
                  <dd className="m-0 font-mono tabular-nums">{money(cart.taxAmount)}</dd>
                </div>
              </dl>

              <div className="mx-5 mb-4 flex items-baseline justify-between gap-4 border-t-2 border-line-strong pt-3">
                <span className="u-cond font-extrabold text-lg">{t("total")}</span>
                <span className="font-display font-extrabold text-2xl tabular-nums">{money(cart.total)}</span>
              </div>

              <div className="px-5 pb-5 flex flex-col gap-2.5">
                <Link href="/checkout" className="btn-yellow w-full">
                  {t("checkout")} <ArrowRight size={18} />
                </Link>
                <Link href="/catalog" className="btn-line w-full">
                  {t("continueShopping")}
                </Link>
                <p className="m-0 mt-1 flex items-center gap-1.5 text-xs text-ink-subtle">
                  <Lock size={13} />
                  {t("secureNote")}
                </p>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

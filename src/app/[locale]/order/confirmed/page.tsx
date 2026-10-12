"use client";

import { useEffect, useState, Suspense } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { CheckSquare, WarningOctagon, ArrowRight, Receipt } from "@phosphor-icons/react";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatPrice } from "@/lib/utils/format-price";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { useCart } from "@/providers/CartProvider";
import type { OrderDetail } from "@/types/order";
import { isShippingMethod } from "@/lib/shipping";

const KNOWN_PAYMENT_STATUSES = ["PAID", "PENDING", "FAILED", "REFUNDED"] as const;

const dtCls = "u-cond text-xs font-bold text-ink-subtle pt-0.5";
const ddCls = "m-0 text-sm text-ink";
const thCls = "px-3 py-2 u-cond text-xs font-bold text-hivis";

function ConfirmedContent() {
  const t = useTranslations("order");
  const tCheckout = useTranslations("checkout");
  const { currency, convert } = useCurrency();
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentLinkId = searchParams.get("id");
  const checkoutId = searchParams.get("checkoutId");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(!!orderId || (!!paymentLinkId && !!checkoutId));

  useEffect(() => {
    if (paymentLinkId && checkoutId) {
      let isSubscribed = true;

      const checkStatus = () => {
        fetch(`/api/orders/verify?paymentLinkId=${paymentLinkId}&checkoutId=${checkoutId}`)
          .then((res) => res.json())
          .then((data) => {
            if (!isSubscribed) return;
            if (data?.id) {
              setOrder(data);
              if (data.paymentStatus === "PAID") {
                clearCart();
                setLoading(false);
                clearInterval(intervalId);
              } else if (data.paymentStatus === "FAILED") {
                setLoading(false);
                clearInterval(intervalId);
              }
            }
          })
          .catch(() => {
            if (isSubscribed) {
              setOrder(null);
              setLoading(false);
              clearInterval(intervalId);
            }
          });
      };

      // Poll every 2 seconds (callbacks above only read intervalId asynchronously)
      const intervalId = setInterval(checkStatus, 2000);

      // Run immediately
      checkStatus();

      return () => {
        isSubscribed = false;
        clearInterval(intervalId);
      };
    } else if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data?.id ? data : null);
          if (data?.paymentStatus === "PAID") {
            clearCart();
          }
        })
        .catch(() => setOrder(null))
        .finally(() => setLoading(false));
    }
  }, [orderId, paymentLinkId, checkoutId, clearCart]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4">
        <div className="border-2 border-line-strong bg-surface-1 px-6 py-10 flex flex-col items-center gap-4 text-center" role="status" aria-live="polite">
          <LoadingSpinner />
          <h1 className="m-0 text-2xl text-ink">{t("checking")}</h1>
          <p className="m-0 text-sm text-ink-muted">{t("checkingHint")}</p>
        </div>
      </div>
    );
  }

  const isFailed = order?.paymentStatus === "FAILED";
  const money = (amount: number | string) => formatPrice(convert(Number(amount)), currency);
  const statusLabel = (s: string) =>
    (KNOWN_PAYMENT_STATUSES as readonly string[]).includes(s)
      ? t(`paymentStatus.${s}` as "paymentStatus.PAID")
      : s;
  const methodLabel = (m: string | null) =>
    isShippingMethod(m) ? tCheckout(`methods.${m}`) : m || "—";
  const placedOn = order
    ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(order.createdAt))
    : "";
  const shippingCost = order ? Number(order.shippingCost) : 0;
  const discountAmount = order ? Number(order.discountAmount ?? 0) : 0;

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-16 px-4">
      <article className="border-2 border-line-strong bg-surface">
        {/* Status bar */}
        <div
          className={`flex items-center gap-2.5 px-5 py-2.5 border-b-2 border-line-strong ${
            isFailed ? "bg-danger text-white" : "bg-hivis text-coal"
          }`}
        >
          {isFailed ? <WarningOctagon size={20} /> : <CheckSquare size={20} />}
          <span className="u-cond font-extrabold tracking-wider">{isFailed ? t("failedBar") : t("receivedBar")}</span>
        </div>

        {/* Docket head */}
        <header className="px-6 pt-6 pb-5 max-sm:px-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end border-b border-line">
          <div>
            <h1 className="m-0 text-[2rem] max-sm:text-[1.6rem] text-ink">
              {order ? (isFailed ? t("failedTitle") : t("receivedTitle")) : t("notFoundTitle")}
            </h1>
            <p className="m-0 mt-2 text-sm text-ink-muted max-w-[52ch]">
              {order ? (isFailed ? t("failedBody") : t("receivedBody")) : t("notFoundBody")}
            </p>
          </div>
          {order && (
            <div className="sm:text-right">
              <span className="block u-cond text-xs font-bold text-ink-subtle">{t("orderNo")}</span>
              <span className="block font-mono text-[1.75rem] max-sm:text-2xl font-bold leading-tight tracking-tight text-ink">
                #{order.orderNumber.slice(-8)}
              </span>
            </div>
          )}
        </header>

        {order && (
          <>
            {/* Details */}
            <dl className="m-0 px-6 py-5 max-sm:px-4 grid grid-cols-[8.5rem_minmax(0,1fr)] max-sm:grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-2.5 border-b border-line">
              <dt className={dtCls}>{t("placed")}</dt>
              <dd className={`${ddCls} font-mono`}>{placedOn}</dd>
              <dt className={dtCls}>{t("email")}</dt>
              <dd className={`${ddCls} break-all`}>{order.customerEmail}</dd>
              <dt className={dtCls}>{t("payment")}</dt>
              <dd className={`${ddCls} font-semibold ${isFailed ? "text-danger" : order.paymentStatus === "PAID" ? "text-success" : ""}`}>
                {statusLabel(order.paymentStatus)}
              </dd>
              <dt className={dtCls}>{t("deliveryService")}</dt>
              <dd className={ddCls}>{methodLabel(order.shippingMethod)}</dd>
              <dt className={dtCls}>{t("deliverTo")}</dt>
              <dd className={`${ddCls} leading-relaxed`}>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                <br />
                {order.shippingAddress.address1}
                {order.shippingAddress.address2 ? (
                  <>
                    <br />
                    {order.shippingAddress.address2}
                  </>
                ) : null}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </dd>
            </dl>

            {/* Items */}
            <section className="px-6 py-5 max-sm:px-4 border-b border-line">
              <h2 className="m-0 mb-3 text-lg text-ink">{t("items")}</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-line-strong text-sm min-w-[460px]">
                  <thead>
                    <tr className="bg-coal text-left">
                      <th scope="col" className={thCls}>{t("colItem")}</th>
                      <th scope="col" className={thCls}>{t("colSku")}</th>
                      <th scope="col" className={`${thCls} text-center`}>{t("colQty")}</th>
                      <th scope="col" className={`${thCls} text-right`}>{t("colUnit")}</th>
                      <th scope="col" className={`${thCls} text-right`}>{t("colLine")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-t border-line align-top">
                        <td className="px-3 py-2.5">
                          <span className="font-semibold text-ink [overflow-wrap:anywhere]">{item.productName}</span>
                          {item.variantName && <span className="block text-xs text-ink-muted">{item.variantName}</span>}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs text-ink-muted whitespace-nowrap">{item.productSku}</td>
                        <td className="px-3 py-2.5 font-mono text-center tabular-nums">{item.quantity}</td>
                        <td className="px-3 py-2.5 font-mono text-right tabular-nums whitespace-nowrap">{money(item.price)}</td>
                        <td className="px-3 py-2.5 font-mono text-right font-semibold tabular-nums whitespace-nowrap">{money(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <dl className="m-0 mt-4 ml-auto max-w-xs text-sm">
                <div className="flex justify-between gap-4 py-1">
                  <dt className="text-ink-muted">{t("subtotal")}</dt>
                  <dd className="m-0 font-mono tabular-nums">{money(order.subtotal)}</dd>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between gap-4 py-1 text-success">
                    <dt>{t("discount")}</dt>
                    <dd className="m-0 font-mono tabular-nums">−{money(discountAmount)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 py-1">
                  <dt className="text-ink-muted">{t("delivery")}</dt>
                  <dd className="m-0 font-mono tabular-nums">{shippingCost === 0 ? t("free") : money(shippingCost)}</dd>
                </div>
                <div className="flex justify-between gap-4 py-1">
                  <dt className="text-ink-muted">{t("tax")}</dt>
                  <dd className="m-0 font-mono tabular-nums">{money(order.taxAmount)}</dd>
                </div>
                <div className="flex justify-between gap-4 mt-2 px-3 py-2 bg-coal text-hivis">
                  <dt className="u-cond font-extrabold">{t("total")}</dt>
                  <dd className="m-0 font-display font-extrabold text-xl tabular-nums">{money(order.total)}</dd>
                </div>
              </dl>
            </section>

            {/* Next steps */}
            <section className="px-6 py-5 max-sm:px-4">
              <h2 className="m-0 mb-3 text-lg text-ink">{t("nextTitle")}</h2>
              <ol className="list-none m-0 p-0 flex flex-col gap-2.5">
                {(isFailed
                  ? [t("failedNext1"), t("failedNext2")]
                  : [
                      ...(order.paymentStatus === "PAID" ? [t("next1", { email: order.customerEmail })] : []),
                      t("next2"),
                      t("next3"),
                      t("next4"),
                    ]
                ).map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ink">
                    <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-hivis text-coal border-2 border-coal font-display font-extrabold tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-1.5 [overflow-wrap:anywhere]">{text}</span>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </article>

      <div className="mt-5 flex gap-3 flex-wrap">
        <Link href="/catalog" className="btn-yellow flex-1 basis-52">
          {t("backToCatalogue")} <ArrowRight size={18} />
        </Link>
        <Link href="/account/orders" className="btn-line flex-1 basis-52">
          <Receipt size={18} /> {t("myOrders")}
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ConfirmedContent />
    </Suspense>
  );
}

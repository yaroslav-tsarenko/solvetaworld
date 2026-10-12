"use client";

import { useEffect, useState, use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "@phosphor-icons/react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge/OrderStatusBadge";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatPrice } from "@/lib/utils/format-price";
import { format } from "date-fns";
import type { OrderDetail } from "@/types/order";

const TH = "u-cond font-bold text-xs px-3 py-2.5 whitespace-nowrap";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations("account");
  const { currency, convert } = useCurrency();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data?.id ? data : null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) {
    return <EmptyState title={t("orderNotFound")} actionLabel={t("allOrders")} actionHref="/account/orders" />;
  }

  const money = (n: number) => formatPrice(convert(Number(n)), currency);
  const addr = order.shippingAddress;

  const spec: { label: string; value: React.ReactNode; mono?: boolean }[] = [
    { label: t("colDate"), value: format(new Date(order.createdAt), "dd MMM yyyy, HH:mm") },
    { label: t("orderStatus"), value: <OrderStatusBadge status={order.status} /> },
    { label: t("specPayment"), value: order.paymentStatus },
  ];
  if (order.paymentMethod) spec.push({ label: t("specMethod"), value: order.paymentMethod });
  if (order.shippingMethod) spec.push({ label: t("specDelivery"), value: order.shippingMethod });
  if (order.trackingNumber) spec.push({ label: t("specTracking"), value: order.trackingNumber, mono: true });

  const totals: { label: string; value: string; tone?: string }[] = [
    { label: t("subtotal"), value: money(order.subtotal) },
    { label: t("delivery"), value: Number(order.shippingCost) === 0 ? t("free") : money(order.shippingCost) },
    { label: t("tax"), value: money(order.taxAmount) },
  ];
  if (Number(order.discountAmount) > 0) {
    totals.push({ label: t("discount"), value: `−${money(order.discountAmount)}`, tone: "text-success" });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/account/orders"
          className="u-cond inline-flex items-center gap-1.5 mb-3 text-sm font-bold text-ink-muted hover:text-ink"
        >
          <ArrowLeft size={14} /> {t("allOrders")}
        </Link>
        <div className="sec-head flex-wrap">
          <h1 className="m-0 text-[2rem] text-ink">
            {t.rich("orderNumber", {
              number: order.orderNumber,
              num: (chunks) => (
                <span className="font-mono font-semibold normal-case text-[1.5rem] break-all">{chunks}</span>
              ),
            })}
          </h1>
          <OrderStatusBadge status={order.status} size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 items-start">
        {/* Spec table */}
        <section className="border-2 border-line-strong">
          <h2 className="m-0 px-4 py-2.5 bg-coal text-white text-lg">{t("orderSpec")}</h2>
          <dl className="m-0 divide-y divide-line">
            {spec.map((row) => (
              <div key={row.label} className="grid grid-cols-[9rem_minmax(0,1fr)] max-sm:grid-cols-[7rem_minmax(0,1fr)] gap-3 px-4 py-2.5 items-center">
                <dt className="u-cond text-xs font-bold text-ink-muted">{row.label}</dt>
                <dd className={`m-0 text-sm text-ink break-words ${row.mono ? "font-mono font-semibold" : ""}`}>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Delivery address */}
        <section className="border-2 border-line-strong">
          <h2 className="m-0 px-4 py-2.5 bg-surface-1 border-b-2 border-line-strong text-lg text-ink">{t("deliverTo")}</h2>
          <address className="not-italic px-4 py-3 text-sm leading-relaxed text-ink">
            <strong className="font-semibold">{addr.firstName} {addr.lastName}</strong><br />
            {addr.address1}<br />
            {addr.address2 && <>{addr.address2}<br /></>}
            {addr.city}, {addr.postalCode}<br />
            {addr.country}
          </address>
        </section>
      </div>

      {/* Line items */}
      <section>
        <div className="sec-head">
          <h2 className="m-0 text-2xl text-ink">{t("lineItems")}</h2>
        </div>
        <div className="border-2 border-line-strong overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-1 border-b-2 border-line-strong">
                <th className={`${TH} text-left`}>{t("colProduct")}</th>
                <th className={`${TH} text-left`}>{t("colSku")}</th>
                <th className={`${TH} text-right`}>{t("colQty")}</th>
                <th className={`${TH} text-right`}>{t("colUnit")}</th>
                <th className={`${TH} text-right`}>{t("colLine")}</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-line">
                  <td className="px-3 py-3">
                    <div className="font-semibold text-ink">{item.productName}</div>
                    {item.variantName && <div className="text-xs text-ink-muted">{item.variantName}</div>}
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{item.productSku}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{item.quantity}</td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">{money(item.price)}</td>
                  <td className="px-3 py-3 text-right font-bold whitespace-nowrap">{money(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-line-strong">
              {totals.map((row) => (
                <tr key={row.label}>
                  <th scope="row" colSpan={4} className={`px-3 py-1.5 text-right font-normal text-ink-muted ${row.tone ?? ""}`}>
                    {row.label}
                  </th>
                  <td className={`px-3 py-1.5 text-right whitespace-nowrap ${row.tone ?? ""}`}>{row.value}</td>
                </tr>
              ))}
              <tr className="bg-hivis text-coal">
                <th scope="row" colSpan={4} className="u-cond px-3 py-3 text-right font-extrabold text-lg">
                  {t("total")}
                </th>
                <td className="px-3 py-3 text-right font-display font-extrabold text-xl whitespace-nowrap">{money(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}

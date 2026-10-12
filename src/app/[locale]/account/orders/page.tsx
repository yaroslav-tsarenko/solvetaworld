"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, Package } from "@phosphor-icons/react";
import { useAuth } from "@/providers/AuthProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge/OrderStatusBadge";
import { formatPrice } from "@/lib/utils/format-price";
import { format } from "date-fns";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string }[];
}

const TH = "u-cond font-bold text-xs px-3 py-2.5 whitespace-nowrap";

export default function OrdersPage() {
  const t = useTranslations("account");
  const { user } = useAuth();
  const { currency, convert } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data.data) ? data.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="sec-head">
        <h1 className="m-0 text-[2rem] text-ink">{t("orders")}</h1>
        {orders.length > 0 && (
          <span className="u-cond text-sm font-bold text-ink-muted">{t("ordersCount", { count: orders.length })}</span>
        )}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title={t("noOrders")}
          subtitle={t("noOrdersSubtitle")}
          actionLabel={t("browseCatalog")}
          actionHref="/catalog"
          icon={<Package size={34} />}
        />
      ) : (
        <div className="border-2 border-line-strong overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-coal text-white">
                <th className={`${TH} text-left w-12`}>#</th>
                <th className={`${TH} text-left`}>{t("colOrder")}</th>
                <th className={`${TH} text-left`}>{t("colDate")}</th>
                <th className={`${TH} text-right`}>{t("colItems")}</th>
                <th className={`${TH} text-left`}>{t("colStatus")}</th>
                <th className={`${TH} text-right`}>{t("colTotal")}</th>
                <th className={`${TH} text-right`}>
                  <span className="sr-only">{t("colOpen")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order.id} className="border-b border-line last:border-b-0 even:bg-surface-1 hover:bg-surface-2">
                  <td className="px-3 py-3 font-mono text-xs text-ink-subtle">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-3 py-3 font-mono font-semibold text-ink">{order.orderNumber}</td>
                  <td className="px-3 py-3 text-ink-muted whitespace-nowrap">{format(new Date(order.createdAt), "dd MMM yyyy")}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{order.items.length}</td>
                  <td className="px-3 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-3 py-3 text-right font-bold whitespace-nowrap">{formatPrice(convert(Number(order.total)), currency)}</td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center gap-1 border-2 border-line-strong px-2 py-1 u-cond text-xs font-bold text-ink hover:bg-hivis hover:text-coal hover:border-coal"
                    >
                      {t("view")} <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

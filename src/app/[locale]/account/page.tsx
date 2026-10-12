"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "@phosphor-icons/react";
import { useAuth } from "@/providers/AuthProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge/OrderStatusBadge";
import { formatPrice } from "@/lib/utils/format-price";
import { format } from "date-fns";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

/** Orders not yet delivered, cancelled or refunded. */
const OPEN_STATUSES = new Set(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"]);

export default function AccountPage() {
  const t = useTranslations("account");
  const common = useTranslations("common");
  const { user, loading } = useAuth();
  const { currency, convert } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data.data) ? data.data : []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const openCount = orders.filter((o) => OPEN_STATUSES.has(o.status)).length;
  const recentOrders = orders.slice(0, 5);

  const tiles: { label: string; value: React.ReactNode; mono?: boolean }[] = [
    { label: t("statOrders"), value: ordersLoading ? "—" : orders.length },
    { label: t("statOpen"), value: ordersLoading ? "—" : openCount },
    { label: t("statSpent"), value: ordersLoading ? "—" : formatPrice(convert(totalSpent), currency) },
    { label: t("statLogin"), value: user?.email, mono: true },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="sec-head">
          <h1 className="m-0 text-[2rem] text-ink">{t("overview")}</h1>
          <p className="m-0 text-sm text-ink-muted truncate">
            {t("welcome", { name: user?.name || user?.email || "" })}
          </p>
        </div>

        {/* Stat blocks: one ruled grid, 2px ink gutters */}
        <dl className="m-0 grid grid-cols-2 lg:grid-cols-4 gap-[2px] bg-line-strong border-2 border-line-strong">
          {tiles.map((tile, i) => (
            <div key={tile.label} className="bg-surface p-4 sm:p-5 flex flex-col gap-2 min-w-0">
              <dt className="u-cond flex items-center gap-2 text-xs font-bold text-ink-muted">
                <span className="px-1 bg-coal text-white">{String(i + 1).padStart(2, "0")}</span>
                {tile.label}
              </dt>
              <dd
                className={`m-0 text-ink truncate ${
                  tile.mono ? "font-mono text-sm pt-2" : "font-display font-extrabold text-[2.25rem] leading-none"
                }`}
              >
                {tile.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-start">
        {/* Latest orders */}
        <section>
          <div className="sec-head">
            <h2 className="m-0 text-2xl text-ink">{t("latestOrders")}</h2>
            <Link href="/account/orders" className="u-cond inline-flex items-center gap-1 text-sm font-bold text-ink hover:underline underline-offset-4 decoration-2 decoration-hivis">
              {t("allOrders")} <ArrowRight size={14} />
            </Link>
          </div>

          {ordersLoading ? (
            <p className="m-0 py-6 text-ink-subtle">{common("loading")}</p>
          ) : recentOrders.length === 0 ? (
            <div className="border-2 border-dashed border-line-strong bg-surface-1 p-6 flex flex-wrap items-center justify-between gap-4">
              <p className="m-0 font-display font-extrabold uppercase text-xl text-ink">{t("noOrders")}</p>
              <Link href="/catalog" className="btn-ink">{t("browseCatalog")}</Link>
            </div>
          ) : (
            <div className="border-2 border-line-strong overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-1 border-b-2 border-line-strong">
                    <th className="u-cond text-left font-bold text-xs px-3 py-2.5">{t("colOrder")}</th>
                    <th className="u-cond text-left font-bold text-xs px-3 py-2.5">{t("colDate")}</th>
                    <th className="u-cond text-left font-bold text-xs px-3 py-2.5">{t("colStatus")}</th>
                    <th className="u-cond text-right font-bold text-xs px-3 py-2.5">{t("colTotal")}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-line last:border-b-0 hover:bg-surface-1">
                      <td className="px-3 py-3">
                        <Link href={`/account/orders/${order.id}`} className="font-mono font-semibold text-ink underline decoration-hivis decoration-2 underline-offset-4 hover:decoration-coal">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-ink-muted whitespace-nowrap">{format(new Date(order.createdAt), "dd MMM yyyy")}</td>
                      <td className="px-3 py-3"><OrderStatusBadge status={order.status} /></td>
                      <td className="px-3 py-3 text-right font-bold whitespace-nowrap">{formatPrice(convert(Number(order.total)), currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Account record */}
        <section className="border-2 border-line-strong">
          <h2 className="m-0 px-4 py-3 bg-coal text-white text-xl">{t("record")}</h2>
          <dl className="m-0 divide-y divide-line">
            <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 px-4 py-3">
              <dt className="u-cond text-xs font-bold text-ink-muted pt-0.5">{t("recordName")}</dt>
              <dd className="m-0 text-ink truncate">{user?.name || t("noName")}</dd>
            </div>
            <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 px-4 py-3">
              <dt className="u-cond text-xs font-bold text-ink-muted pt-0.5">{t("recordEmail")}</dt>
              <dd className="m-0 font-mono text-sm text-ink truncate">{user?.email}</dd>
            </div>
          </dl>
          <div className="p-4 border-t-2 border-line-strong grid grid-cols-2 gap-2">
            <Link href="/account/profile" className="btn-line text-[0.95rem]!">{t("editDetails")}</Link>
            <Link href="/account/addresses" className="btn-line text-[0.95rem]!">{t("addresses")}</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";

const TONES: Record<string, string> = {
  PENDING: "bg-hivis text-coal border-coal",
  CONFIRMED: "bg-surface text-ink border-line-strong",
  PROCESSING: "bg-surface text-ink border-line-strong",
  SHIPPED: "bg-coal text-white border-coal",
  DELIVERED: "bg-surface text-success border-success",
  CANCELLED: "bg-surface text-danger border-danger",
  REFUNDED: "bg-surface text-danger border-danger",
};

/** Square, condensed status tag for an order. Unknown statuses render raw. */
export function OrderStatusBadge({ status, size = "sm" }: { status: string; size?: "sm" | "lg" }) {
  const t = useTranslations("account");
  const key = `status.${status}`;
  const label = t.has(key) ? t(key) : status;

  return (
    <span
      className={`u-cond inline-flex items-center gap-1.5 border-2 font-bold whitespace-nowrap ${
        size === "lg" ? "px-3 py-1 text-base" : "px-2 py-0.5 text-xs"
      } ${TONES[status] || "bg-surface text-ink-muted border-line"}`}
    >
      <span className="w-1.5 h-1.5 bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}

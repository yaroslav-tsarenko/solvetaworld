"use client";

import { Link } from "@/i18n/routing";
import { Toolbox } from "@phosphor-icons/react";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

/** Empty / no-result panel: dashed ink frame, condensed headline, one action. */
export function EmptyState({ title, subtitle, actionLabel, actionHref, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-2 border-dashed border-line-strong bg-surface-1 px-6 py-8 my-6">
      <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-hivis text-coal border-2 border-coal">
        {icon || <Toolbox size={34} />}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="m-0 text-[1.6rem] text-ink">{title}</h2>
        {subtitle && <p className="m-0 mt-1 text-ink-muted max-w-[46ch]">{subtitle}</p>}
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-ink">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

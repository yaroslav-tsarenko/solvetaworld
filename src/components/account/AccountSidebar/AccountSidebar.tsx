"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { SignOut } from "@phosphor-icons/react";

const navItems = [
  { href: "/account", labelKey: "overview" as const },
  { href: "/account/orders", labelKey: "orders" as const },
  { href: "/account/profile", labelKey: "profile" as const },
  { href: "/account/addresses", labelKey: "addresses" as const },
  { href: "/account/wishlist", labelKey: "wishlist" as const },
];

/**
 * Account masthead + horizontal section bar (ink strip, yellow active tab).
 * Kept under its historical name so the layout import stays stable.
 */
export function AccountSidebar() {
  const pathname = usePathname();
  const t = useTranslations("account");
  const { user, signOut } = useAuth();

  return (
    <div className="border-2 border-line-strong">
      <div className="flex flex-wrap items-center gap-4 px-4 sm:px-5 py-4 bg-surface">
        <span
          className="w-12 h-12 shrink-0 flex items-center justify-center bg-hivis text-coal border-2 border-coal font-display font-extrabold text-2xl"
          aria-hidden="true"
        >
          {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="u-cond m-0 text-xs font-bold text-ink-subtle">{t("title")}</p>
          <p className="m-0 font-display font-extrabold uppercase text-xl leading-tight text-ink truncate">
            {user?.name || t("noName")}
          </p>
          <p className="m-0 font-mono text-xs text-ink-muted truncate">{user?.email}</p>
        </div>
        <button type="button" className="btn-line min-h-[38px]! px-3!" onClick={signOut}>
          <SignOut size={16} />
          {t("logout")}
        </button>
      </div>

      <nav aria-label={t("title")} className="bg-coal">
        <ul className="list-none m-0 p-0 flex overflow-x-auto no-scrollbar">
          {navItems.map((item, i) => {
            const isActive =
              pathname.endsWith(item.href) ||
              (item.href !== "/account" && pathname.includes(item.href));
            return (
              <li key={item.href} className="shrink-0 border-r border-white/15">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-baseline gap-2 h-12 px-4 sm:px-5 pt-3.5 font-display uppercase font-bold text-[1.0625rem] whitespace-nowrap transition-colors ${
                    isActive ? "bg-hivis text-coal" : "text-white/80 hover:text-white hover:bg-coal-2"
                  }`}
                >
                  <span className={`text-xs ${isActive ? "text-coal" : "text-hivis"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t(item.labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

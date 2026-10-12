"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import {
  ShoppingCartSimple, MagnifyingGlass, List, X, User, ShieldCheck,
  CaretRight, CaretDown, Heart, ArrowRight,
} from "@phosphor-icons/react";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "../Logo/Logo";
import { cachedFetchJSON, readCached } from "@/lib/utils/reliable-fetch";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
  children?: Category[];
}

function subtreeCount(cat: Category): number {
  const own = cat._count?.products || 0;
  return own + (cat.children || []).reduce((s, c) => s + subtreeCount(c), 0);
}

const toolBtn =
  "relative flex items-center justify-center gap-1.5 h-11 min-w-10 sm:min-w-11 px-1.5 sm:px-2 text-brand-ink border-2 border-transparent transition-colors hover:border-coal cursor-pointer bg-transparent";

/**
 * Two-tier header:
 *  1. a full-width safety-yellow bar — wordmark, big SKU-aware search, account and basket;
 *  2. a black department bar listing top-level departments, which opens a
 *     full-width department panel on hover / tap.
 */
export function Header() {
  const t = useTranslations("nav");
  const router = useRouter();
  const { itemCount } = useCart();
  const { user, role } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [drawerDept, setDrawerDept] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    const cached = readCached<Category[]>({ cacheKey: "header:categories", storage: "session" });
    if (cached) setCategories(cached);
    cachedFetchJSON<Category[]>("/api/categories", { cacheKey: "header:categories", storage: "session" })
      .then((data) => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPanelOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  const departments = useMemo(
    () =>
      [...categories]
        .map((c) => ({ ...c, total: subtreeCount(c) }))
        .filter((c) => c.total > 0)
        .sort((a, b) => b.total - a.total),
    [categories],
  );

  const current = departments.find((d) => d.id === activeDept) ?? departments[0];

  const openPanel = useCallback((id?: string) => {
    clearTimeout(closeTimer.current);
    if (id) setActiveDept(id);
    setPanelOpen(true);
  }, []);

  const schedulePanelClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setPanelOpen(false), 160);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setDrawerOpen(false);
  };

  const isAdmin = !!user && (role === "ADMIN" || role === "SUPER_ADMIN");

  const searchForm = (extra = "") => (
    <form onSubmit={submitSearch} role="search" className={`flex items-stretch h-11 border-2 border-coal bg-white ${extra}`}>
      <label htmlFor={`sw-search-${extra ? "m" : "d"}`} className="sr-only">{t("searchLabel")}</label>
      <input
        id={`sw-search-${extra ? "m" : "d"}`}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="flex-1 min-w-0 px-3 bg-transparent text-[0.9375rem] text-coal placeholder:text-coal/55 outline-none"
        autoComplete="off"
      />
      <button
        type="submit"
        aria-label={t("searchSubmit")}
        className="w-12 shrink-0 flex items-center justify-center bg-coal text-hivis cursor-pointer border-0 hover:bg-coal-2"
      >
        <MagnifyingGlass size={20} />
      </button>
    </form>
  );

  return (
    <>
      <header className="sticky top-0 z-50" data-sw="masthead">
        {/* Tier 1 — yellow utility bar */}
        <div className="bg-hivis text-coal border-b-2 border-coal">
          <div className="max-w-container mx-auto px-3 sm:px-4 lg:px-6 h-[var(--header-height)] max-md:h-16 flex items-center gap-2 sm:gap-3 lg:gap-6">
            <button
              type="button"
              className={`${toolBtn} lg:hidden -ml-2`}
              onClick={() => setDrawerOpen(true)}
              aria-label={t("openMenu")}
            >
              <List size={26} />
            </button>

            <Link href="/" className="shrink-0 flex items-center" aria-label="Solvetaworld">
              <Logo height={34} className="max-sm:h-[24px] max-sm:w-auto" />
            </Link>

            {searchForm("flex-1 max-md:hidden max-w-[720px]")}

            <div className="ml-auto flex items-center gap-0.5">
              <LanguageSwitcher />
              <ThemeToggle />
              {user && (
                <Link href="/account/wishlist" className={`${toolBtn} max-sm:hidden`} aria-label={t("wishlist")}>
                  <Heart size={22} />
                </Link>
              )}
              {isAdmin && (
                <a href="/admin" className={`${toolBtn} max-sm:hidden`} aria-label={t("admin")}>
                  <ShieldCheck size={22} />
                </a>
              )}
              <Link
                href={user ? "/account" : "/auth/login"}
                className={toolBtn}
                aria-label={user ? t("account") : t("signIn")}
              >
                <User size={22} />
                <span className="hidden xl:inline font-display font-bold uppercase text-[0.95rem] tracking-wide">
                  {user ? t("account") : t("signIn")}
                </span>
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 h-11 pl-2 sm:pl-3 pr-1.5 sm:pr-2 sm:ml-1 bg-coal text-white border-2 border-coal hover:bg-coal-2"
                aria-label={t("basketWithCount", { count: itemCount })}
              >
                <ShoppingCartSimple size={22} />
                <span className="hidden sm:inline font-display font-bold uppercase text-[0.95rem] tracking-wide">
                  {t("basket")}
                </span>
                <span className="min-w-6 h-6 px-1 flex items-center justify-center bg-hivis text-coal font-display font-extrabold text-sm tabular-nums">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile search row */}
          <div className="md:hidden px-4 pb-3">{searchForm("w-full")}</div>
        </div>

        {/* Tier 2 — black department bar (desktop) */}
        <nav
          className="hidden lg:block bg-coal text-white relative"
          aria-label={t("departments")}
          onMouseLeave={schedulePanelClose}
        >
          <div className="max-w-container mx-auto px-6 h-[var(--deptbar-height)] flex items-stretch">
            <button
              type="button"
              onClick={() => (panelOpen ? setPanelOpen(false) : openPanel())}
              onMouseEnter={() => openPanel()}
              aria-expanded={panelOpen}
              aria-controls="sw-dept-panel"
              className="flex items-center gap-2 pr-5 mr-2 border-r border-white/20 font-display font-bold uppercase tracking-wide text-[1rem] text-hivis bg-transparent cursor-pointer"
            >
              <List size={18} />
              {t("allDepartments")}
              <CaretDown size={14} className={panelOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
            <ul className="flex items-stretch min-w-0 overflow-hidden list-none m-0 p-0">
              {departments.slice(0, 6).map((d) => (
                <li key={d.id} className="flex">
                  <Link
                    href={`/catalog/${d.slug}`}
                    onMouseEnter={() => openPanel(d.id)}
                    onFocus={() => setActiveDept(d.id)}
                    className={`flex items-center px-3 font-display font-semibold uppercase tracking-wide text-[0.95rem] whitespace-nowrap border-b-[3px] transition-colors ${
                      panelOpen && current?.id === d.id ? "border-hivis text-hivis" : "border-transparent hover:text-hivis"
                    }`}
                  >
                    {shortName(d.name)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="ml-auto flex items-stretch">
              <Link href="/catalog?sort=newest" className="flex items-center px-3 font-display font-bold uppercase tracking-wide text-[0.95rem] text-coal bg-hivis my-1.5">
                {t("justIn")}
              </Link>
              <Link href="/contact" className="flex items-center px-3 font-display font-semibold uppercase tracking-wide text-[0.95rem] hover:text-hivis">
                {t("help")}
              </Link>
            </div>
          </div>

          {panelOpen && departments.length > 0 && (
            <div
              id="sw-dept-panel"
              className="absolute left-0 right-0 top-full bg-surface text-ink border-b-4 border-hivis shadow-[0_6px_0_0_rgba(0,0,0,0.12)]"
              onMouseEnter={() => openPanel()}
            >
              <div className="max-w-container mx-auto px-6 grid grid-cols-[300px_1fr] min-h-[340px]">
                <ul className="list-none m-0 p-0 py-3 border-r-2 border-line-strong max-h-[460px] overflow-y-auto">
                  {departments.map((d) => (
                    <li key={d.id}>
                      <Link
                        href={`/catalog/${d.slug}`}
                        onMouseEnter={() => setActiveDept(d.id)}
                        onClick={() => setPanelOpen(false)}
                        className={`flex items-center justify-between gap-2 px-3 py-2 text-[0.9rem] font-semibold ${
                          current?.id === d.id ? "bg-coal text-white" : "hover:bg-surface-1"
                        }`}
                      >
                        <span className="truncate">{d.name}</span>
                        <CaretRight size={14} className="shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
                {current && (
                  <div className="p-6">
                    <div className="flex items-baseline justify-between gap-4 border-b-2 border-line-strong pb-2 mb-4">
                      <p className="font-display font-extrabold uppercase text-[1.75rem] leading-none m-0">{current.name}</p>
                      <span className="font-display font-semibold uppercase text-ink-muted text-sm">
                        {t("skuCount", { count: current.total })}
                      </span>
                    </div>
                    {current.children && current.children.length > 0 ? (
                      <ul className="list-none m-0 p-0 grid grid-cols-3 gap-x-6 gap-y-1">
                        {current.children.map((c) => (
                          <li key={c.id}>
                            <Link
                              href={`/catalog/${c.slug}`}
                              onClick={() => setPanelOpen(false)}
                              className="flex justify-between gap-2 py-1.5 border-b border-line text-[0.9rem] hover:text-link"
                            >
                              <span className="truncate">{c.name}</span>
                              <span className="text-ink-subtle tabular-nums text-xs pt-0.5">{subtreeCount(c)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-ink-muted text-sm">{t("noSubDepartments")}</p>
                    )}
                    <Link
                      href={`/catalog/${current.slug}`}
                      onClick={() => setPanelOpen(false)}
                      className="btn-ink mt-6"
                    >
                      {t("shopDepartment", { name: current.name })} <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label={t("menu")}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[min(88vw,400px)] bg-surface flex flex-col border-r-4 border-hivis">
            <div className="flex items-center justify-between h-16 px-4 bg-coal">
              <Logo tone="dark" height={24} />
              <button
                type="button"
                className="w-11 h-11 flex items-center justify-center text-white bg-transparent border-0 cursor-pointer"
                onClick={() => setDrawerOpen(false)}
                aria-label={t("closeMenu")}
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <p className="px-4 pt-4 pb-2 m-0 font-display font-bold uppercase text-sm text-ink-muted tracking-wider">
                {t("departments")}
              </p>
              <ul className="list-none m-0 p-0 border-t border-line">
                {departments.map((d) => {
                  const open = drawerDept === d.id;
                  return (
                    <li key={d.id} className="border-b border-line">
                      <div className="flex items-stretch">
                        <Link
                          href={`/catalog/${d.slug}`}
                          onClick={() => setDrawerOpen(false)}
                          className="flex-1 px-4 py-3 font-semibold text-[0.95rem]"
                        >
                          {d.name}
                        </Link>
                        {d.children && d.children.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setDrawerDept(open ? null : d.id)}
                            aria-expanded={open}
                            aria-label={d.name}
                            className="w-12 flex items-center justify-center border-l border-line bg-transparent cursor-pointer text-ink"
                          >
                            <CaretDown size={16} className={open ? "rotate-180" : ""} />
                          </button>
                        )}
                      </div>
                      {open && (
                        <ul className="list-none m-0 p-0 pb-2 bg-surface-1">
                          {d.children!.map((c) => (
                            <li key={c.id}>
                              <Link
                                href={`/catalog/${c.slug}`}
                                onClick={() => setDrawerOpen(false)}
                                className="block pl-7 pr-4 py-2 text-sm text-ink-muted"
                              >
                                {c.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
              <ul className="list-none m-0 p-0 mt-4 border-t-2 border-line-strong">
                {[
                  { href: "/catalog?sort=newest", label: t("justIn") },
                  { href: "/catalog", label: t("fullCatalogue") },
                  { href: "/contact", label: t("help") },
                ].map((l) => (
                  <li key={l.href} className="border-b border-line">
                    <Link
                      href={l.href}
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center justify-between px-4 py-3 font-display font-bold uppercase tracking-wide"
                    >
                      {l.label} <CaretRight size={16} />
                    </Link>
                  </li>
                ))}
                {isAdmin && (
                  <li className="border-b border-line">
                    <a href="/admin" className="flex items-center justify-between px-4 py-3 font-display font-bold uppercase tracking-wide">
                      {t("admin")} <CaretRight size={16} />
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div className="p-4 border-t-2 border-line-strong grid grid-cols-2 gap-2">
              {user ? (
                <Link href="/account" onClick={() => setDrawerOpen(false)} className="btn-yellow col-span-2">
                  {t("account")}
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setDrawerOpen(false)} className="btn-yellow">
                    {t("signIn")}
                  </Link>
                  <Link href="/auth/register" onClick={() => setDrawerOpen(false)} className="btn-line">
                    {t("register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Long department names ("Thermometers and meteorological instruments") are
 *  trimmed to their first clause for the bar; the panel shows them in full. */
function shortName(name: string) {
  const cut = name.split(/,| and /i)[0].trim();
  return cut.length >= 4 ? cut : name;
}

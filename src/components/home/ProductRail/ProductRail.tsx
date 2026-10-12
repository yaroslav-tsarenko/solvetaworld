"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CaretLeft, CaretRight, ArrowRight } from "@phosphor-icons/react";
import { ProductCard } from "@/components/product/ProductCard/ProductCard";
import type { HomepageProduct } from "@/lib/homepage-products";

interface ProductRailProps {
  id: string;
  index: string;
  title: string;
  note?: string;
  href: string;
  products: HomepageProduct[];
  tone?: "plain" | "panel";
}

/** Horizontal scroller of product cards with a numbered condensed header and step buttons. */
export function ProductRail({ id, index, title, note, href, products, tone = "plain" }: ProductRailProps) {
  const t = useTranslations("home");
  const track = useRef<HTMLUListElement>(null);
  if (products.length === 0) return null;

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 240), behavior: "smooth" });
  };

  return (
    <section
      className={tone === "panel" ? "mt-14 py-10 bg-surface-1 border-y-2 border-line" : "mt-14"}
      aria-labelledby={`${id}-title`}
    >
      <div className="max-w-container mx-auto px-4 lg:px-6">
        <div className="sec-head">
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="font-mono text-sm text-ink-subtle">{index}</span>
            <h2 id={`${id}-title`} className="m-0 text-[2.25rem] max-sm:text-[1.75rem] text-ink truncate">{title}</h2>
            {note && <span className="text-sm text-ink-muted max-md:hidden truncate">{note}</span>}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Link href={href} className="u-cond font-bold text-[1rem] flex items-center gap-1 mr-2 hover:underline decoration-hivis decoration-[3px] underline-offset-4">
              {t("railAll")} <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t("railPrev")}
              className="w-10 h-10 flex items-center justify-center border-2 border-line-strong bg-surface text-ink cursor-pointer hover:bg-hivis hover:text-coal max-sm:hidden"
            >
              <CaretLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t("railNext")}
              className="w-10 h-10 flex items-center justify-center border-2 border-line-strong bg-surface text-ink cursor-pointer hover:bg-hivis hover:text-coal max-sm:hidden"
            >
              <CaretRight size={18} />
            </button>
          </div>
        </div>

        <ul ref={track} className="list-none m-0 p-0 pb-2 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
          {products.map((p) => (
            <li key={p.id} className="flex">
              <ProductCard
                variant="rail"
                id={p.id}
                name={p.name}
                slug={p.slug}
                sku={p.sku}
                brand={p.brand}
                price={Number(p.price)}
                comparePrice={p.comparePrice != null ? Number(p.comparePrice) : null}
                imageUrl={p.images?.[0]?.url}
                quantity={p.quantity}
                lowStockAlert={p.lowStockAlert}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

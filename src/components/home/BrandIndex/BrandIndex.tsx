import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

/** Text-only brand index — names set as condensed wordmarks with line counts. */
export async function BrandIndex({ brands }: { brands: { name: string; count: number }[] }) {
  const t = await getTranslations("home");
  if (brands.length === 0) return null;
  const fmt = new Intl.NumberFormat("en-GB");

  return (
    <section className="max-w-container mx-auto px-4 lg:px-6 pt-14" aria-labelledby="sw-brands-title">
      <div className="sec-head">
        <h2 id="sw-brands-title" className="m-0 text-[2.25rem] max-sm:text-[1.75rem] text-ink">{t("brandsTitle")}</h2>
        <span className="text-sm text-ink-muted">{t("brandsText")}</span>
      </div>
      <ul className="list-none m-0 p-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {brands.map((b) => (
          <li key={b.name}>
            <Link
              href={`/catalog?brand=${encodeURIComponent(b.name)}`}
              className="flex flex-col justify-between h-[88px] px-3 py-2.5 border-2 border-line bg-surface-1 hover:border-line-strong hover:bg-hivis hover:text-coal"
            >
              <span className="font-display font-extrabold uppercase text-[1.35rem] leading-none truncate">{b.name}</span>
              <span className="text-xs text-ink-muted tabular-nums">{t("brandLines", { count: fmt.format(b.count) })}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

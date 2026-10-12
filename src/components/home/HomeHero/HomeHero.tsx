import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export interface HeroDepartment {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  total: number;
}

/**
 * Static opening block: oversized condensed headline with two actions on the
 * left; a stacked column of three department shortcuts on the right.
 */
export async function HomeHero({ departments, lineCount }: { departments: HeroDepartment[]; lineCount: number }) {
  const t = await getTranslations("home");
  const fmt = new Intl.NumberFormat("en-GB");

  return (
    <section className="border-b-2 border-line-strong bg-surface" aria-labelledby="sw-hero-title">
      <div className="max-w-container mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-0">
        <div className="py-10 lg:py-16 lg:pr-12 flex flex-col justify-center">
          <p className="u-cond m-0 mb-4 text-sm font-bold tracking-[0.18em] text-ink-muted">
            {t("eyebrow")}
          </p>
          <h1 id="sw-hero-title" className="m-0 text-[3.25rem] sm:text-[4.5rem] xl:text-[5.5rem] leading-[0.92] text-ink">
            {t("heroLine1")}
            <br />
            <span className="inline-block bg-hivis text-coal px-2 -mx-2 mt-1">{t("heroLine2")}</span>
          </h1>
          <p className="mt-6 mb-0 text-[1.0625rem] leading-relaxed text-ink-muted max-w-[52ch]">{t("heroText")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalog" className="btn-yellow !min-h-[52px] !px-6 !text-[1.2rem]">
              {t("heroPrimary")} <ArrowRight size={20} weight="bold" />
            </Link>
            <Link href="/catalog?sort=newest" className="btn-line !min-h-[52px] !px-6 !text-[1.2rem]">
              {t("heroSecondary")}
            </Link>
          </div>
          {lineCount > 0 && (
            <p className="mt-8 mb-0 flex items-center gap-3 text-sm text-ink-muted">
              <span className="font-display font-extrabold text-[1.75rem] leading-none text-ink tabular-nums">{fmt.format(lineCount)}</span>
              <span className="u-cond font-semibold tracking-wider">{t("heroLines")}</span>
            </p>
          )}
        </div>

        {departments.length > 0 && (
          <nav aria-label={t("quickTitle")} className="lg:border-l-2 border-line-strong max-lg:border-t-2 max-lg:-mx-4 flex flex-col">
            <p className="u-cond m-0 px-5 py-3 text-sm font-bold tracking-[0.14em] bg-coal text-hivis">{t("quickTitle")}</p>
            <ol className="list-none m-0 p-0 flex-1 flex flex-col">
              {departments.map((d, i) => (
                <li key={d.id} className="flex-1 border-t-2 first:border-t-0 border-line-strong">
                  <Link
                    href={`/catalog/${d.slug}`}
                    className="group h-full min-h-[120px] grid grid-cols-[auto_1fr_96px] items-center gap-4 px-5 py-4 hover:bg-hivis hover:text-coal"
                  >
                    <span className="font-display font-extrabold text-[2.5rem] leading-none text-ink-subtle group-hover:text-coal tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display font-extrabold uppercase text-[1.5rem] leading-[1.05]">{d.name}</span>
                      <span className="mt-1 flex items-center gap-1 text-sm text-ink-muted group-hover:text-coal">
                        {t("deptLines", { count: fmt.format(d.total) })} <ArrowUpRight size={14} weight="bold" />
                      </span>
                    </span>
                    <span className="relative w-24 h-24 bg-white border-2 border-line-strong">
                      {d.imageUrl && (
                        <Image src={d.imageUrl} alt="" fill sizes="96px" className="object-contain p-1.5" />
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  );
}

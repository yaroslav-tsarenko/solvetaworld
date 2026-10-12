import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { HeroDepartment } from "../HomeHero/HomeHero";

/** Dense department grid: square photo tiles with an index number and line count. */
export async function DepartmentIndex({ departments }: { departments: HeroDepartment[] }) {
  const t = await getTranslations("home");
  const fmt = new Intl.NumberFormat("en-GB");
  if (departments.length === 0) return null;

  return (
    <section className="max-w-container mx-auto px-4 lg:px-6 pt-12" aria-labelledby="sw-dept-title">
      <div className="sec-head">
        <div>
          <h2 id="sw-dept-title" className="m-0 text-[2.25rem] max-sm:text-[1.75rem] text-ink">{t("deptTitle")}</h2>
          <p className="m-0 mt-1 text-sm text-ink-muted">{t("deptText")}</p>
        </div>
        <Link href="/catalog" className="u-cond font-bold text-[1rem] flex items-center gap-1 hover:underline decoration-hivis decoration-[3px] underline-offset-4 shrink-0">
          {t("deptAll")} <ArrowRight size={16} weight="bold" />
        </Link>
      </div>

      <ul className="list-none m-0 p-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-l-2 border-t-2 border-line-strong">
        {departments.map((d, i) => (
          <li key={d.id} className="border-r-2 border-b-2 border-line-strong">
            <Link href={`/catalog/${d.slug}`} className="group flex flex-col h-full bg-surface hover:bg-hivis hover:text-coal">
              <span className="flex items-center justify-between px-3 pt-2.5 font-mono text-xs text-ink-subtle group-hover:text-coal">
                <span>D-{String(i + 1).padStart(2, "0")}</span>
                <span className="tabular-nums">{fmt.format(d.total)}</span>
              </span>
              <span className="relative block aspect-[4/3] mx-3 my-2 bg-white">
                {d.imageUrl && (
                  <Image src={d.imageUrl} alt="" fill sizes="(max-width: 640px) 45vw, 22vw" className="object-contain p-2" />
                )}
              </span>
              <span className="px-3 pb-3 font-display font-bold uppercase text-[1.1rem] max-sm:text-[0.95rem] leading-[1.1]">
                {d.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

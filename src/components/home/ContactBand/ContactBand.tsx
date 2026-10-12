import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

/** Full-width yellow band pointing larger or technical enquiries at the contact page. */
export async function ContactBand() {
  const t = await getTranslations("home");
  return (
    <section className="mt-14 bg-hivis text-coal border-y-2 border-coal" aria-labelledby="sw-band-title">
      <div className="max-w-container mx-auto px-4 lg:px-6 py-10 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h2 id="sw-band-title" className="m-0 text-[2.5rem] max-sm:text-[1.9rem] leading-[0.95] text-coal">{t("bandTitle")}</h2>
          <p className="m-0 mt-3 text-[1.0625rem] max-w-[60ch]">{t("bandText")}</p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 min-h-[56px] px-7 bg-coal text-white font-display font-bold uppercase tracking-wide text-[1.25rem] border-2 border-coal hover:bg-white hover:text-coal shrink-0"
        >
          {t("bandCta")} <ArrowRight size={22} weight="bold" />
        </Link>
      </div>
    </section>
  );
}

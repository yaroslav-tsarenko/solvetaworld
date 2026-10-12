import { getLocale, getTranslations } from "next-intl/server";
import { EXPRESS_PRICE, FREE_STANDARD_MIN, STANDARD_PRICE, formatGbp } from "@/lib/shipping";
import { Link } from "@/i18n/routing";
import { Package, ArrowsCounterClockwise, Certificate, CreditCard } from "@phosphor-icons/react/dist/ssr";

/**
 * "Counter terms" — the four buying conditions customers ask about most,
 * each linked to the policy that defines it. An ink band, not icon cards.
 */
export async function CounterTerms() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const delivery = {
    threshold: formatGbp(FREE_STANDARD_MIN, locale),
    standard: formatGbp(STANDARD_PRICE, locale),
    express: formatGbp(EXPRESS_PRICE, locale),
  };
  const items = [
    { icon: Package, title: t("termDeliveryTitle", delivery), text: t("termDeliveryText", delivery), href: "/policies/shipping" },
    { icon: ArrowsCounterClockwise, title: t("termReturnsTitle"), text: t("termReturnsText"), href: "/policies/returns" },
    { icon: Certificate, title: t("termGuaranteeTitle"), text: t("termGuaranteeText"), href: "/policies/warranty" },
    { icon: CreditCard, title: t("termPayTitle"), text: t("termPayText"), href: "/policies/payment" },
  ];

  return (
    <section className="mt-12 bg-coal text-white" aria-labelledby="sw-terms-title">
      <div className="max-w-container mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-[220px_1fr]">
        <h2 id="sw-terms-title" className="m-0 py-6 lg:py-8 lg:pr-6 text-[1.75rem] leading-none text-hivis lg:border-r border-white/20">
          {t("termsTitle")}
        </h2>
        <dl className="m-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {items.map(({ icon: Icon, title, text, href }) => (
            <div key={href} className="flex gap-3 px-0 sm:px-5 py-5 lg:py-8 border-t sm:border-l border-white/20 lg:border-t-0">
              <Icon size={28} className="text-hivis shrink-0 mt-0.5" weight="bold" />
              <div>
                <dt className="font-display font-bold uppercase text-[1.15rem] leading-tight">{title}</dt>
                <dd className="m-0 mt-1 text-sm text-white/75 leading-snug">
                  {text}{" "}
                  <Link href={href} className="text-hivis underline underline-offset-2 whitespace-nowrap">{t("termMore")}</Link>
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

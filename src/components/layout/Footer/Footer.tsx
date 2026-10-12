"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { LinkedinLogo, InstagramLogo } from "@phosphor-icons/react";
import { Logo } from "../Logo/Logo";
import { COMPANY } from "@/lib/company";
import visaLogo from "@/assets/visa-logo.svg";
import mastercardLogo from "@/assets/mastercard-logo.svg";
import pciDssLogo from "@/assets/pci-dss-compliant-logo-vector.svg";

const colHead =
  "font-display font-bold uppercase tracking-[0.08em] text-hivis text-[0.95rem] m-0 mb-3 pb-2 border-b border-white/15";
const colLink = "block py-1 text-[0.9rem] text-white/80 hover:text-hivis hover:underline underline-offset-4";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const columns: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: t("colShop"),
      links: [
        { href: "/catalog", label: t("linkCatalogue") },
        { href: "/catalog?sort=newest", label: t("linkJustIn") },
        { href: "/search", label: t("linkSearch") },
        { href: "/account/wishlist", label: t("linkSaved") },
      ],
    },
    {
      title: t("colHelp"),
      links: [
        { href: "/contact", label: t("contact") },
        { href: "/faq", label: t("linkFaq") },
        { href: "/policies/shipping", label: t("shipping") },
        { href: "/policies/returns", label: t("returns") },
        { href: "/policies/warranty", label: t("linkWarranty") },
        { href: "/account/orders", label: t("linkOrders") },
      ],
    },
    {
      title: t("colSmallPrint"),
      links: [
        { href: "/policies/terms", label: t("terms") },
        { href: "/policies/privacy", label: t("privacy") },
        { href: "/policies/cookies", label: t("linkCookies") },
        { href: "/policies/payment", label: t("linkPayment") },
        { href: "/policies", label: t("linkAllPolicies") },
        { href: "/about", label: t("about") },
      ],
    },
  ];

  return (
    <footer className="mt-auto bg-coal text-white" data-sw="footer">
      <div className="h-1.5 bg-hivis" aria-hidden="true" />

      <div className="max-w-container mx-auto px-4 lg:px-6">
        {/* Masthead row */}
        <div className="py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/15">
          <Link href="/" aria-label="Solvetaworld" className="inline-flex">
            <Logo tone="dark" height={52} className="max-sm:h-[36px] max-sm:w-auto" />
          </Link>
          <p className="font-display font-semibold uppercase text-[1.35rem] leading-[1.15] tracking-wide text-white/90 max-w-[520px] m-0 md:text-right">
            {t("slogan")}
          </p>
        </div>

        {/* Four columns */}
        <div className="py-10 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className={colHead}>{col.title}</h2>
              <ul className="list-none m-0 p-0">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={colLink}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 lg:col-span-1">
            <h2 className={colHead}>{t("colCompany")}</h2>
            <dl className="m-0 text-[0.875rem] text-white/80 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
              <dt className="font-display uppercase tracking-wide text-white/50">{t("entity")}</dt>
              <dd className="m-0 font-semibold text-white">{COMPANY.name}</dd>
              <dt className="font-display uppercase tracking-wide text-white/50">{t("regNo")}</dt>
              <dd className="m-0 tabular-nums">{COMPANY.companyNumber}</dd>
              <dt className="font-display uppercase tracking-wide text-white/50">{t("office")}</dt>
              <dd className="m-0">{COMPANY.registeredOffice}</dd>
              {COMPANY.phone ? (
                <>
                  <dt className="font-display uppercase tracking-wide text-white/50">{t("phone")}</dt>
                  <dd className="m-0">
                    <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-hivis">{COMPANY.phone}</a>
                  </dd>
                </>
              ) : null}
              <dt className="font-display uppercase tracking-wide text-white/50">{t("email")}</dt>
              <dd className="m-0">
                <a href={`mailto:${COMPANY.email}`} className="hover:text-hivis break-all">{COMPANY.email}</a>
              </dd>
            </dl>
          </div>
        </div>

        {/* Base line */}
        <div className="py-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
          <p className="m-0 text-xs text-white/60">
            {t("copyright", { year, storeName: "Solvetaworld" })}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {process.env.NEXT_PUBLIC_LINKEDIN_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center border border-white/25 text-white hover:bg-hivis hover:text-coal hover:border-hivis"
                >
                  <LinkedinLogo size={18} />
                </a>
              )}
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center border border-white/25 text-white hover:bg-hivis hover:text-coal hover:border-hivis"
                >
                  <InstagramLogo size={18} />
                </a>
              )}
            </div>
            <ul className="list-none m-0 p-0 flex items-center gap-1.5" aria-label={t("weAccept")}>
              {[
                { src: visaLogo, alt: "Visa" },
                { src: mastercardLogo, alt: "Mastercard" },
                { src: pciDssLogo, alt: "PCI DSS" },
              ].map((logo) => (
                <li key={logo.alt} className="bg-white h-8 w-14 flex items-center justify-center px-1.5">
                  <Image src={logo.src} alt={logo.alt} width={48} height={24} className="!w-auto !h-[20px] object-contain" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@/i18n/routing";
import { ReactNode } from "react";
import { COMPANY } from "@/lib/company";

/**
 * Policy documents are presented as numbered "spec sheets": a sticky document
 * card on the left (reference, revision date, contents, other documents) and
 * the clauses on the right, each in its own <section> with an anchor.
 */

export const POLICY_DOCS = [
  { href: "/policies/terms", label: "Terms & Conditions of Sale", ref: "SW-01" },
  { href: "/policies/shipping", label: "Delivery & Dispatch", ref: "SW-02" },
  { href: "/policies/returns", label: "Returns, Refunds & Cancellations", ref: "SW-03" },
  { href: "/policies/warranty", label: "Guarantee & Warranty", ref: "SW-04" },
  { href: "/policies/payment", label: "Payments", ref: "SW-05" },
  { href: "/policies/privacy", label: "Privacy Notice", ref: "SW-06" },
  { href: "/policies/cookies", label: "Cookies", ref: "SW-07" },
] as const;

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  /** Document reference shown on the document card, e.g. "SW-01". */
  docRef?: string;
  /** Short at-a-glance facts shown above the clauses. Must restate, not alter, the clauses. */
  keyFacts?: { label: string; value: string }[];
  /** Contents list: section ids + titles, in order. */
  toc?: { id: string; title: string }[];
  children: ReactNode;
}

const clauseCls = [
  "text-[0.9375rem] leading-[1.7] text-ink-muted [overflow-wrap:anywhere]",
  "[&_p]:mb-3 [&_p:last-child]:mb-0",
  "[&_strong]:text-ink",
  "[&_a]:text-link [&_a]:underline [&_a]:underline-offset-2",
  "[&_h3]:font-display [&_h3]:text-[1.05rem] [&_h3]:text-ink [&_h3]:mt-5 [&_h3]:mb-2",
  "[&_ul]:my-3 [&_ul]:pl-0 [&_ul]:list-none [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:mb-1.5",
  "[&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-[0.6em] [&_ul_li]:before:w-2 [&_ul_li]:before:h-2 [&_ul_li]:before:bg-hivis [&_ul_li]:before:border [&_ul_li]:before:border-coal",
  "[&_ol]:my-3 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol_li]:mb-1.5",
  "[&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-sm [&_table]:border-2 [&_table]:border-line-strong",
  "[&_th]:bg-coal [&_th]:text-white [&_th]:font-display [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-left [&_th]:px-3 [&_th]:py-2",
  "[&_td]:border-t [&_td]:border-line [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
  "[&_h2]:font-display [&_h2]:text-[1.35rem] [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:pt-3 [&_h2]:border-t-2 [&_h2]:border-line-strong",
].join(" ");

export function PolicyLayout({ title, lastUpdated, docRef, keyFacts, toc, children }: PolicyLayoutProps) {
  const ref = docRef ?? POLICY_DOCS.find((d) => d.label === title)?.ref;
  return (
    <div className="max-w-container mx-auto px-4 lg:px-6 pt-6 pb-20">
      <nav aria-label="Breadcrumb" className="text-xs font-display uppercase tracking-wider text-ink-muted mb-4">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/policies" className="hover:text-ink">Store policies</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-start">
        <aside className="lg:sticky lg:top-[calc(var(--header-height)+var(--deptbar-height)+1rem)] border-2 border-line-strong bg-surface">
          <div className="bg-coal text-white px-4 py-3">
            <p className="m-0 font-display uppercase tracking-widest text-hivis text-xs">Document {ref ?? ""}</p>
            <p className="m-0 font-display font-extrabold uppercase text-xl leading-tight">{title}</p>
          </div>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 py-3 text-xs border-b border-line">
            <dt className="font-display uppercase tracking-wide text-ink-subtle">Revised</dt>
            <dd className="m-0 font-semibold">{lastUpdated}</dd>
            <dt className="font-display uppercase tracking-wide text-ink-subtle">Issued by</dt>
            <dd className="m-0 font-semibold">{COMPANY.name}</dd>
          </dl>
          {toc && toc.length > 0 && (
            <div className="px-4 py-3 border-b border-line max-lg:hidden">
              <p className="m-0 mb-2 font-display font-bold uppercase text-sm tracking-wide">Contents</p>
              <ol className="list-none m-0 p-0 max-h-[40vh] overflow-y-auto text-[0.8125rem]">
                {toc.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex gap-2 py-1 text-ink-muted hover:text-ink">
                      <span className="font-mono text-ink-subtle w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div className="px-4 py-3">
            <p className="m-0 mb-2 font-display font-bold uppercase text-sm tracking-wide">Other documents</p>
            <ul className="list-none m-0 p-0 text-[0.8125rem]">
              {POLICY_DOCS.filter((d) => d.label !== title).map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className="flex gap-2 py-1 text-ink-muted hover:text-ink">
                    <span className="font-mono text-ink-subtle w-12 shrink-0">{d.ref}</span>
                    <span>{d.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <article className="min-w-0 max-w-[820px]">
          <h1 className="text-[2.75rem] max-sm:text-[2rem] m-0 mb-6 text-ink">{title}</h1>

          {keyFacts && keyFacts.length > 0 && (
            <div className="mb-8 border-2 border-line-strong">
              <p className="m-0 px-4 py-2 bg-hivis text-coal font-display font-bold uppercase tracking-wide text-sm border-b-2 border-line-strong">
                At a glance
              </p>
              <dl className="m-0 grid sm:grid-cols-2">
                {keyFacts.map((f) => (
                  <div key={f.label} className="px-4 py-3 border-b border-line sm:odd:border-r">
                    <dt className="font-display uppercase tracking-wide text-xs text-ink-subtle">{f.label}</dt>
                    <dd className="m-0 font-semibold text-ink text-sm">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className={clauseCls}>{children}</div>
        </article>
      </div>
    </div>
  );
}

/** One numbered clause group. `id` becomes the anchor used by the contents list. */
export function PolicySection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number | string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-40 mt-10 first:mt-0">
      <header className="flex items-stretch gap-0 mb-4 border-2 border-line-strong">
        <span className="flex items-center justify-center min-w-12 px-2 bg-hivis text-coal font-display font-extrabold text-lg border-r-2 border-line-strong tabular-nums">
          {String(number).padStart(2, "0")}
        </span>
        <h2 className="!m-0 !p-0 !border-0 flex items-center px-3 py-2 font-display text-[1.2rem] text-ink">{title}</h2>
      </header>
      {children}
    </section>
  );
}

/** Seller identity block, read from the single COMPANY record. */
export function ContactBlock() {
  return (
    <dl className="not-prose my-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-l-4 border-hivis bg-surface-1 px-4 py-3 text-sm text-ink">
      <dt className="font-display uppercase tracking-wide text-ink-subtle">Seller</dt>
      <dd className="m-0 font-semibold">{COMPANY.name}</dd>
      <dt className="font-display uppercase tracking-wide text-ink-subtle">Company no.</dt>
      <dd className="m-0">{COMPANY.companyNumber}</dd>
      <dt className="font-display uppercase tracking-wide text-ink-subtle">Registered office</dt>
      <dd className="m-0">{COMPANY.registeredOffice}</dd>
      {COMPANY.phone ? (
        <>
          <dt className="font-display uppercase tracking-wide text-ink-subtle">Telephone</dt>
          <dd className="m-0">{COMPANY.phone}</dd>
        </>
      ) : null}
      <dt className="font-display uppercase tracking-wide text-ink-subtle">Email</dt>
      <dd className="m-0">{COMPANY.email}</dd>
    </dl>
  );
}

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { ContactBlock, POLICY_DOCS } from "@/components/layout/PolicyLayout/PolicyLayout";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Store policies" };

/** One-line plain-English summary per document, keyed by route. */
const SUMMARIES: Record<(typeof POLICY_DOCS)[number]["href"], string> = {
  "/policies/terms": "The contract that applies when you buy from us: ordering, prices, delivery, returns, liability and governing law.",
  "/policies/shipping": "How orders are processed and sent, transit times by destination, delivery charges and customs.",
  "/policies/returns": "Cancelling an order, the 14-day consumer cancellation right, sending goods back and getting refunds.",
  "/policies/warranty": "Your statutory rights, manufacturer warranties, the optional Additional Warranty and how to claim.",
  "/policies/payment": "Cards and currencies we accept, how payments are checked and secured, invoices and chargebacks.",
  "/policies/privacy": "What personal data we collect, why we use it, who we share it with and your rights over it.",
  "/policies/cookies": "The cookies and similar technologies on this site, what each category does and how to control them.",
};

export default function PoliciesIndexPage() {
  return (
    <div className="max-w-container mx-auto px-4 lg:px-6 pb-20">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Store policies" }]} />

      <header className="sec-head mb-6 pb-3">
        <div>
          <p className="m-0 mb-1 font-display uppercase tracking-widest text-xs text-ink-subtle">
            Document register
          </p>
          <h1 className="m-0 text-[2.75rem] max-sm:text-[2rem] leading-none text-ink">Store policies</h1>
        </div>
      </header>

      <p className="max-w-[720px] m-0 mb-8 text-[0.9375rem] leading-[1.7] text-ink-muted">
        Every rule that applies when you use this site or buy from us is set out in the documents below. Each
        has a reference number so you can quote it when you get in touch. Open a document to read it in full.
      </p>

      <div className="border-2 border-line-strong overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-coal text-white">
              <th scope="col" className="px-3 py-2 text-left font-display uppercase tracking-wide w-24">Ref.</th>
              <th scope="col" className="px-3 py-2 text-left font-display uppercase tracking-wide">Document</th>
              <th scope="col" className="px-3 py-2 text-left font-display uppercase tracking-wide max-md:hidden">
                What it covers
              </th>
              <th scope="col" className="px-3 py-2 w-12">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {POLICY_DOCS.map((doc) => (
              <tr key={doc.href} className="group border-t border-line hover:bg-surface-1">
                <td className="px-3 py-3 align-top font-mono text-ink-subtle">{doc.ref}</td>
                <td className="px-3 py-3 align-top">
                  <Link
                    href={doc.href}
                    className="font-display font-bold uppercase text-base text-ink hover:underline underline-offset-4 decoration-2 decoration-hivis"
                  >
                    {doc.label}
                  </Link>
                  <p className="m-0 mt-1 text-ink-muted md:hidden">{SUMMARIES[doc.href]}</p>
                </td>
                <td className="px-3 py-3 align-top text-ink-muted max-md:hidden">{SUMMARIES[doc.href]}</td>
                <td className="px-3 py-3 align-top text-right">
                  <Link
                    href={doc.href}
                    aria-label={`Open ${doc.label}`}
                    tabIndex={-1}
                    className="inline-flex items-center justify-center w-8 h-8 border-2 border-line-strong text-ink group-hover:bg-hivis group-hover:text-coal"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10 max-w-[720px]">
        <h2 className="m-0 mb-2 text-[1.2rem] text-ink">Question about a policy?</h2>
        <p className="m-0 text-[0.9375rem] leading-[1.7] text-ink-muted">
          Quote the reference number and send it to us using the details below.
        </p>
        <ContactBlock />
      </section>
    </div>
  );
}

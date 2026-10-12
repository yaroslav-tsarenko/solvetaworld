import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { Link } from "@/i18n/routing";
import { COMPANY } from "@/lib/company";
import { DELIVERY_ZONES, EXPRESS_PRICE, FREE_STANDARD_MIN, STANDARD_PRICE, formatGbp } from "@/lib/shipping";
import { Plus } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Help desk — common questions",
  description: "Answers on delivery times, returns, payment, order changes and how to reach the Solvetaworld team.",
};

const UK_TIMES = DELIVERY_ZONES.find((z) => z.key === "uk")!.days;
const INTL = DELIVERY_ZONES.filter((z) => z.key !== "uk");

const groups: { id: string; title: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    id: "delivery",
    title: "Delivery",
    items: [
      {
        q: "When will my order arrive?",
        a: (
          <>
            Orders are usually prepared within 1–2 business days of payment. Within the UK, standard delivery then
            takes {UK_TIMES.standard} business days and costs {formatGbp(STANDARD_PRICE)}, or is free when your order
            comes to {formatGbp(FREE_STANDARD_MIN)} or more after discounts. Express delivery takes{" "}
            {UK_TIMES.express} business days and costs {formatGbp(EXPRESS_PRICE)} on every order. If you shop in EUR or
            USD, checkout shows the converted equivalent. Times for other destinations are in the{" "}
            <Link href="/policies/shipping" className="text-link underline underline-offset-2">delivery document</Link>.
          </>
        ),
      },
      {
        q: "Can you deliver outside the UK?",
        a: (
          <>
            Yes — we send orders to most countries worldwide, at the same delivery prices. After dispatch, allow
            roughly:{" "}
            {INTL.map((z, i) => (
              <span key={z.key}>
                {z.name} {z.days.standard} business days standard / {z.days.express} express
                {i < INTL.length - 1 ? "; " : "."}
              </span>
            ))}
          </>
        ),
      },
      {
        q: "How do I follow my parcel?",
        a: (
          <>
            When your order leaves us you get a confirmation email containing a tracking number. The same
            information is available under <Link href="/account/orders" className="text-link underline underline-offset-2">your orders</Link> once you are signed in.
          </>
        ),
      },
    ],
  },
  {
    id: "returns",
    title: "Returns",
    items: [
      {
        q: "How long do I have to send something back?",
        a: (
          <>
            You have 14 days from delivery to tell us you want to return an item, and a further 14 days to send it
            back. It needs to be unused and in its original packaging — get in touch with our team to start the
            return. Full conditions are in the{" "}
            <Link href="/policies/returns" className="text-link underline underline-offset-2">returns document</Link>.
          </>
        ),
      },
    ],
  },
  {
    id: "orders",
    title: "Orders & payment",
    items: [
      {
        q: "Which payment methods can I use?",
        a: "We accept Visa and Mastercard cards. Every payment travels over an SSL-encrypted connection.",
      },
      {
        q: "I need to change or cancel an order — is that possible?",
        a: "Within 1 hour of placing it, an order can still be amended or cancelled. After that, contact our team and we will do what we can.",
      },
    ],
  },
  {
    id: "contact",
    title: "Reaching us",
    items: [
      {
        q: "What is the best way to contact the team?",
        a: (
          <>
            Use the <Link href="/contact" className="text-link underline underline-offset-2">enquiry form</Link> or email{" "}
            <a href={`mailto:${COMPANY.email}`} className="text-link underline underline-offset-2">{COMPANY.email}</a>. The team is
            available Monday to Friday, 9:00–18:00 GMT.
          </>
        ),
      },
    ],
  },
];

// Running question numbers across all groups (Q01, Q02, …).
const offsets = groups.map((_, i) => groups.slice(0, i).reduce((s, g) => s + g.items.length, 0));

export default function FaqPage() {
  return (
    <div className="max-w-container mx-auto px-4 lg:px-6 pb-20">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Help desk" }]} />

      <header className="pb-5 mb-8 border-b-4 border-line-strong">
        <h1 className="m-0 text-[3.25rem] max-sm:text-[2.25rem] leading-none text-ink">Help desk</h1>
        <p className="m-0 mt-3 text-[1.0625rem] text-ink-muted max-w-[60ch]">
          Short answers to what customers ask us most. For anything else, the{" "}
          <Link href="/contact" className="text-link underline underline-offset-2">contact page</Link> is the quickest route.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12 items-start">
        <nav aria-label="Topics" className="lg:sticky lg:top-[calc(var(--header-height)+var(--deptbar-height)+1rem)] border-2 border-line-strong">
          <p className="m-0 px-4 py-2.5 bg-coal text-hivis font-display font-bold uppercase tracking-wider">Topics</p>
          <ul className="list-none m-0 p-0">
            {groups.map((g) => (
              <li key={g.id} className="border-t border-line first:border-t-0">
                <a href={`#${g.id}`} className="flex justify-between px-4 py-2.5 font-semibold hover:bg-hivis hover:text-coal">
                  {g.title}
                  <span className="font-mono text-xs text-ink-subtle">{g.items.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-10 min-w-0">
          {groups.map((g, gi) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="scroll-mt-40">
              <h2 id={`${g.id}-h`} className="sec-head !mb-0 m-0 text-[1.9rem] text-ink">{g.title}</h2>
              <div className="border-x-2 border-b-2 border-line-strong">
                {g.items.map((item, ii) => {
                  const n = offsets[gi] + ii + 1;
                  return (
                    <details key={item.q} className="group border-t border-line first:border-t-0">
                      <summary className="flex items-center gap-4 px-4 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-surface-1">
                        <span className="font-mono text-xs text-ink-subtle w-8 shrink-0">Q{String(n).padStart(2, "0")}</span>
                        <span className="flex-1 font-semibold text-[1rem] text-ink">{item.q}</span>
                        <Plus size={18} weight="bold" className="shrink-0 transition-transform group-open:rotate-45" />
                      </summary>
                      <div className="px-4 pb-5 pl-16 text-[0.9375rem] leading-relaxed text-ink-muted border-l-4 border-hivis ml-4">
                        {item.a}
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

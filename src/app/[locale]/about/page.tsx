import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { Link } from "@/i18n/routing";
import { COMPANY } from "@/lib/company";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata = {
  title: "Who we are",
  description: "Solvetaworld is the online tools and hardware store operated by SOLVETA LTD, a company registered in England and Wales.",
};

async function getCounts() {
  try {
    const [lines, departments, brands] = await Promise.all([
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.category.count({ where: { isActive: true, parentId: null } }),
      prisma.product.groupBy({ by: ["brand"], where: { status: "ACTIVE", brand: { not: null } } }).then((r) => r.length),
    ]);
    return { lines, departments, brands };
  } catch {
    return null;
  }
}

const principles = [
  {
    title: "Say what it is",
    text: "Every listing carries its brand, SKU and, where the maker supplies them, the full technical specification — so you can check fit and rating before you buy.",
  },
  {
    title: "Organise it like a trade counter",
    text: "Stock is filed by department — hand and power tools, ironmongery, garden machinery, plumbing, cable and wiring, test and measurement — and searchable by name, brand or code.",
  },
  {
    title: "Keep the terms plain",
    text: "Delivery charges, return conditions and guarantee cover are written down in our store policies and apply to every order.",
  },
];

export default async function AboutPage() {
  const counts = await getCounts();
  const fmt = new Intl.NumberFormat("en-GB");

  return (
    <div className="max-w-container mx-auto px-4 lg:px-6 pb-20">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Who we are" }]} />

      <header className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 pb-8 mb-10 border-b-4 border-line-strong items-end">
        <div>
          <h1 className="m-0 text-[3.5rem] max-sm:text-[2.4rem] leading-[0.95] text-ink">
            Tools and hardware,
            <br />
            <span className="bg-hivis text-coal px-2 -mx-2">sold straight.</span>
          </h1>
          <p className="m-0 mt-5 text-[1.0625rem] text-ink-muted leading-relaxed max-w-[60ch]">
            Solvetaworld is an online store for the people who build, repair and maintain — on site, in the
            workshop or at home. We list the kit, the fixings and the consumables in one catalogue and ship them
            to your door.
          </p>
        </div>
        {counts && (
          <dl className="m-0 grid grid-cols-3 border-2 border-line-strong">
            {[
              { k: "Product lines", v: counts.lines },
              { k: "Departments", v: counts.departments },
              { k: "Brands", v: counts.brands },
            ].map((s) => (
              <div key={s.k} className="px-4 py-4 border-l-2 first:border-l-0 border-line-strong">
                <dt className="font-display uppercase tracking-wide text-xs text-ink-subtle">{s.k}</dt>
                <dd className="m-0 font-display font-extrabold text-[2rem] leading-none tabular-nums text-ink">{fmt.format(s.v)}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      <section aria-labelledby="principles" className="mb-14">
        <h2 id="principles" className="sec-head m-0 text-[2rem] text-ink">How we run the shop</h2>
        <ol className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-line-strong">
          {principles.map((p, i) => (
            <li key={p.title} className="p-6 border-t-2 md:border-t-0 md:border-l-2 first:border-0 border-line-strong">
              <span className="inline-flex w-10 h-10 items-center justify-center bg-hivis text-coal font-display font-extrabold text-lg border-2 border-coal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="m-0 mt-4 text-[1.35rem] text-ink">{p.title}</h3>
              <p className="m-0 mt-2 text-[0.9375rem] text-ink-muted leading-relaxed">{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="record" className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-start">
        <div>
          <h2 id="record" className="sec-head m-0 text-[2rem] text-ink">Company record</h2>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[0.9375rem]">
            <dt className="font-display uppercase tracking-wide text-ink-subtle">Trading name</dt>
            <dd className="m-0 font-semibold">Solvetaworld</dd>
            <dt className="font-display uppercase tracking-wide text-ink-subtle">Operated by</dt>
            <dd className="m-0 font-semibold">{COMPANY.name}</dd>
            <dt className="font-display uppercase tracking-wide text-ink-subtle">Company no.</dt>
            <dd className="m-0">{COMPANY.companyNumber}</dd>
            <dt className="font-display uppercase tracking-wide text-ink-subtle">Registered office</dt>
            <dd className="m-0">{COMPANY.registeredOffice}</dd>
            {COMPANY.phone && (
              <>
                <dt className="font-display uppercase tracking-wide text-ink-subtle">Telephone</dt>
                <dd className="m-0">{COMPANY.phone}</dd>
              </>
            )}
            <dt className="font-display uppercase tracking-wide text-ink-subtle">Email</dt>
            <dd className="m-0">{COMPANY.email}</dd>
          </dl>
        </div>
        <div className="bg-coal text-white p-8 border-l-8 border-hivis">
          <p className="m-0 font-display font-extrabold uppercase text-[1.9rem] leading-none">Need a hand choosing?</p>
          <p className="m-0 mt-3 text-white/80 leading-relaxed">
            Questions about a specification, compatibility or a larger quantity — send them over and the team will reply by email.
          </p>
          <Link href="/contact" className="btn-yellow mt-6">
            Contact the team <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}

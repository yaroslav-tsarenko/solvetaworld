import { COMPANY } from "@/lib/company";

const dtCls = "u-cond text-[0.6875rem] font-bold text-ink-subtle";
const ddCls = "m-0 text-ink";

/** Seller block for the checkout summary: a compact definition list. */
export function MerchantInfo({ title }: { title: string }) {
  return (
    <section className="border-t-2 border-line-strong px-5 py-4 text-xs leading-relaxed">
      <h3 className="m-0 mb-2.5 text-sm text-ink">{title}</h3>
      <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5">
        <dt className={dtCls}>Company</dt>
        <dd className={`${ddCls} font-semibold`}>{COMPANY.name}</dd>
        <dt className={dtCls}>Reg. no.</dt>
        <dd className={`${ddCls} font-mono`}>{COMPANY.companyNumber}</dd>
        <dt className={dtCls}>Address</dt>
        <dd className={ddCls}>
          {COMPANY.addressLine}, {COMPANY.country}
        </dd>
        {COMPANY.phone ? (
          <>
            <dt className={dtCls}>Phone</dt>
            <dd className={ddCls}>
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="underline decoration-line hover:decoration-ink">
                {COMPANY.phone}
              </a>
            </dd>
          </>
        ) : null}
        <dt className={dtCls}>Email</dt>
        <dd className={ddCls}>
          <a href={`mailto:${COMPANY.email}`} className="underline decoration-line hover:decoration-ink break-all">
            {COMPANY.email}
          </a>
        </dd>
      </dl>
    </section>
  );
}

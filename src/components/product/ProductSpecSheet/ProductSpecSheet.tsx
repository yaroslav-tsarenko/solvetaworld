import { getTranslations } from "next-intl/server";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null };
}

interface ProductSpecSheetProps {
  keyData: { label: string; value: string }[];
  description?: string | null;
  characteristics?: Record<string, Record<string, string>> | null;
  reviews: Review[];
}

/** Supplier descriptions arrive with stray HTML; render them as plain paragraphs. */
function toParagraphs(html: string): string[] {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function SheetHeading({ n, id, title, aside }: { n: string; id: string; title: string; aside?: string }) {
  return (
    <header className="flex items-stretch border-2 border-line-strong mb-4">
      <span className="flex items-center px-3 bg-hivis text-coal font-display font-extrabold text-lg border-r-2 border-line-strong">{n}</span>
      <h2 id={id} className="m-0 flex-1 flex items-center px-3 py-2 text-[1.5rem] text-ink">{title}</h2>
      {aside && <span className="flex items-center px-3 font-mono text-xs text-ink-muted">{aside}</span>}
    </header>
  );
}

/**
 * Product dossier rendered as one continuous sheet — specification first,
 * then the maker's description, then customer reviews. No tabs.
 */
export async function ProductSpecSheet({ keyData, description, characteristics, reviews }: ProductSpecSheetProps) {
  const t = await getTranslations("product");
  const groups = characteristics ? Object.entries(characteristics) : [];
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="flex flex-col gap-12 mt-12">
      <section aria-labelledby="spec-title">
        <SheetHeading n="01" id="spec-title" title={t("specTitle")} />
        <table className="w-full border-collapse text-sm border-2 border-line-strong">
          <caption className="sr-only">{t("specTitle")}</caption>
          <tbody>
            {keyData.map((row) => (
              <tr key={row.label} className="border-t border-line first:border-t-0">
                <th scope="row" className="w-[38%] text-left align-top px-3 py-2.5 bg-surface-1 font-display font-semibold uppercase tracking-wide text-ink-muted">
                  {row.label}
                </th>
                <td className="px-3 py-2.5 font-semibold text-ink [overflow-wrap:anywhere]">{row.value}</td>
              </tr>
            ))}
            {groups.map(([groupName, entries]) => (
              <GroupRows key={groupName} name={groupName} entries={entries} />
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="desc-title">
        <SheetHeading n="02" id="desc-title" title={t("descriptionTitle")} />
        {description ? (
          <div className="text-[0.9375rem] leading-[1.75] text-ink-muted max-w-[78ch] [&_p]:mb-4">
            {toParagraphs(description).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-ink-subtle text-sm">{t("noDescription")}</p>
        )}
      </section>

      <section aria-labelledby="rev-title">
        <SheetHeading
          n="03"
          id="rev-title"
          title={t("reviewsTitle")}
          aside={reviews.length > 0 ? `${avgRating.toFixed(1)} / 5 · ${reviews.length}` : undefined}
        />
        {reviews.length > 0 ? (
          <ol className="list-none m-0 p-0 border-2 border-line">
            {reviews.map((review) => (
              <li key={review.id} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 px-4 py-4 border-t border-line first:border-t-0">
                <div>
                  <p className="m-0 font-semibold text-ink">{review.user.name || t("reviewAnonymous")}</p>
                  <p className="m-0 mt-1 flex gap-0.5" aria-label={`${review.rating} / 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`w-3 h-3 border border-coal ${i < review.rating ? "bg-hivis" : "bg-surface"}`} />
                    ))}
                  </p>
                  <p className="m-0 mt-1 font-mono text-xs text-ink-subtle">{new Date(review.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
                {review.comment && <p className="m-0 text-sm text-ink-muted leading-relaxed">{review.comment}</p>}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-ink-subtle text-sm">{t("noReviews")}</p>
        )}
      </section>
    </div>
  );
}

function GroupRows({ name, entries }: { name: string; entries: Record<string, string> }) {
  return (
    <>
      <tr>
        <th colSpan={2} scope="colgroup" className="text-left px-3 py-2 bg-coal text-white font-display font-bold uppercase tracking-wide">
          {name}
        </th>
      </tr>
      {Object.entries(entries).map(([key, value]) => (
        <tr key={key} className="border-t border-line">
          <th scope="row" className="w-[38%] text-left align-top px-3 py-2.5 bg-surface-1 font-normal text-ink-muted">{key}</th>
          <td className="px-3 py-2.5 font-semibold text-ink [overflow-wrap:anywhere]">{value}</td>
        </tr>
      ))}
    </>
  );
}

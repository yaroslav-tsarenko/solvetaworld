import {
  PolicyLayout,
  PolicySection,
  ContactBlock,
} from "@/components/layout/PolicyLayout/PolicyLayout";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "Cookies" };

const TOC = [
  { id: "about", title: "About this document" },
  { id: "what", title: "Cookies in plain terms" },
  { id: "similar", title: "Other technologies covered" },
  { id: "categories", title: "Categories at a glance" },
  { id: "necessary", title: "Strictly necessary" },
  { id: "functional", title: "Functional" },
  { id: "analytics", title: "Analytics and performance" },
  { id: "marketing", title: "Marketing and targeting" },
  { id: "payment", title: "Checkout, payment and security tools" },
  { id: "third-party", title: "Cookies set by third parties" },
  { id: "consent", title: "How consent works" },
  { id: "browser", title: "Controlling cookies in your browser" },
  { id: "withdraw", title: "Changing or withdrawing consent" },
  { id: "personal-data", title: "Cookies and personal data" },
  { id: "revisions", title: "Revisions to this document" },
  { id: "contact", title: "Cookie queries" },
] as const;

type SectionId = (typeof TOC)[number]["id"];

function sec(id: SectionId) {
  const i = TOC.findIndex((s) => s.id === id);
  return { id, number: i + 1, title: TOC[i].title };
}

const KEY_FACTS = [
  { label: "Strictly necessary cookies", value: "Used without consent — the store needs them to work" },
  { label: "Analytics, marketing, targeting", value: "Only where permitted by law and with any required consent" },
  { label: "Website analytics cookie", value: "Usually kept 12–26 months" },
  { label: "Silence or continued browsing", value: "Never treated as consent to non-essential cookies" },
  { label: "Withdrawing consent", value: "Possible at any time" },
  { label: "Card details", value: "Full card number and security code are not stored by Solvetaworld" },
];

type CookieRow = { name: string; purpose: string; duration: string };

const NECESSARY: CookieRow[] = [
  { name: "Cart cookie or local storage", purpose: "Keeps track of the products you have added to your basket", duration: "Session or limited persistent period" },
  { name: "Checkout session cookie", purpose: "Supports a secure checkout and completion of the order", duration: "Session" },
  { name: "Account session cookie", purpose: "Keeps you signed in for the length of your visit", duration: "Session or limited persistent period" },
  { name: "Currency preference cookie", purpose: "Remembers the display currency you picked, such as EUR, GBP or USD", duration: "Limited persistent period" },
  { name: "Cookie consent preference", purpose: "Records your cookie choices so they are respected on later visits", duration: "Limited persistent period" },
  { name: "Security cookie", purpose: "Helps guard the Website against fraud, abuse, bots and unauthorised activity", duration: "Session or limited persistent period" },
];

const FUNCTIONAL: CookieRow[] = [
  { name: "Recently viewed products", purpose: "Helps show the products you looked at recently", duration: "Limited persistent period" },
  { name: "Preference storage", purpose: "Remembers optional display or browsing preferences", duration: "Limited persistent period" },
  { name: "Support tool cookie", purpose: "Helps keep a support chat or help session going, where offered", duration: "Session or limited persistent period" },
];

const ANALYTICS: CookieRow[] = [
  { name: "Website analytics cookie", purpose: "Measures visits, page views and the routes users take", duration: "Usually 12–26 months" },
  { name: "Performance monitoring cookie", purpose: "Helps spot technical issues and Website performance problems", duration: "Session or limited persistent period" },
  { name: "Conversion measurement cookie", purpose: "Helps us see whether Website improvements or campaigns lead to purchases", duration: "Limited persistent period" },
];

const MARKETING: CookieRow[] = [
  { name: "Advertising pixel", purpose: "Measures how adverts perform and how users interact with them", duration: "Limited persistent period" },
  { name: "Retargeting cookie", purpose: "Helps show relevant adverts after you have left the Website", duration: "Limited persistent period" },
  { name: "Campaign tracking cookie", purpose: "Helps measure how effective campaigns and promotions are", duration: "Limited persistent period" },
];

function CookieTable({ caption, rows }: { caption: string; rows: CookieRow[] }) {
  return (
    <table>
      <caption className="caption-top text-left font-display uppercase tracking-wide text-ink text-sm pb-2">
        {caption}
      </caption>
      <thead>
        <tr>
          <th>Cookie / technology</th>
          <th>What it does</th>
          <th>Typical lifetime</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td>{r.name}</td>
            <td>{r.purpose}</td>
            <td className="whitespace-nowrap max-sm:whitespace-normal">{r.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const dlCls = "my-4 grid grid-cols-1 sm:grid-cols-[11rem_1fr] border-2 border-line-strong text-sm";
const dtCls = "px-3 py-2 bg-surface-1 font-display uppercase tracking-wide text-ink border-b border-line sm:border-r";
const ddCls = "m-0 px-3 py-2 border-b border-line";

export default function CookiePolicyPage() {
  return (
    <PolicyLayout
      title="Cookies"
      docRef="SW-07"
      lastUpdated="29 May 2026"
      toc={[...TOC]}
      keyFacts={KEY_FACTS}
    >
      <PolicySection {...sec("about")}>
        <p>
          This document explains how {COMPANY.name}, trading as Solvetaworld, uses cookies and similar
          technologies on www.solvetaworld.com.
        </p>
        <p>The Website is run by the company below:</p>
        <ContactBlock />
        <dl className={dlCls}>
          <dt className={dtCls}>&ldquo;Solvetaworld&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;</dt>
          <dd className={ddCls}>{COMPANY.name}.</dd>
          <dt className={dtCls}>&ldquo;You&rdquo;, &ldquo;your&rdquo;</dt>
          <dd className={ddCls}>
            Anyone who visits or uses the Website, including customers, account holders and business customers.
          </dd>
        </dl>
        <p>
          Read it together with our Privacy Policy, which sets out how we collect, use, store and protect
          personal data.
        </p>
        <h3>What this document covers</h3>
        <ol>
          <li>It explains:</li>
        </ol>
        <ul>
          <li>what cookies and similar technologies are;</li>
          <li>the categories of cookies we use;</li>
          <li>the reasons we use them;</li>
          <li>when we need your consent;</li>
          <li>how to manage your cookie preferences or withdraw them.</li>
        </ul>
        <ol start={2}>
          <li>
            It applies to cookies and similar technologies used on the Website, including those that support
            the shopping basket, checkout, account access, payment security, currency preferences, analytics,
            performance measurement and, where applicable, marketing.
          </li>
          <li>
            We may use cookies, pixels, tags, scripts, local storage, session storage, software development kits
            and similar technologies. To keep things simple, this document calls all of them
            &ldquo;cookies&rdquo;.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("what")}>
        <ol>
          <li>A cookie is a small text file placed on your device when you visit a website.</li>
          <li>
            Cookies let a website recognise your browser or device and remember certain things &mdash; for
            example what is in your basket, the currency you picked, your account session, your language
            preference or your cookie settings.
          </li>
        </ol>
        <dl className={dlCls}>
          <dt className={dtCls}>First-party</dt>
          <dd className={ddCls}>Set directly by Solvetaworld.</dd>
          <dt className={dtCls}>Third-party</dt>
          <dd className={ddCls}>
            Set by outside providers whose services we use, such as analytics, payment, security, advertising
            or embedded service providers.
          </dd>
          <dt className={dtCls}>Session</dt>
          <dd className={ddCls}>Expire when you close your browser.</dd>
          <dt className={dtCls}>Persistent</dt>
          <dd className={ddCls}>
            Stay on your device for a set period unless you delete them sooner.
          </dd>
        </dl>
        <p>A cookie can be first-party or third-party, and session or persistent.</p>
      </PolicySection>

      <PolicySection {...sec("similar")}>
        <ol>
          <li>Besides cookies, we may use similar technologies, such as:</li>
        </ol>
        <dl className={dlCls}>
          <dt className={dtCls}>Local storage</dt>
          <dd className={ddCls}>Keeps information in your browser.</dd>
          <dt className={dtCls}>Session storage</dt>
          <dd className={ddCls}>Keeps information for the length of a browser session.</dd>
          <dt className={dtCls}>Pixels and tags</dt>
          <dd className={ddCls}>Help measure activity or support marketing, where used.</dd>
          <dt className={dtCls}>Scripts</dt>
          <dd className={ddCls}>Support Website functionality, analytics, security or integrations.</dd>
        </dl>
        <ol start={2}>
          <li>
            These technologies can serve the same purposes as cookies, and this document covers them wherever
            they store information on, or read information from, your device.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("categories")}>
        <p>We use the categories of cookies below. Each is described in its own section.</p>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Consent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Strictly necessary</td>
              <td>Not required &mdash; needed to provide the service you ask for</td>
            </tr>
            <tr>
              <td>Functional</td>
              <td>Non-essential functional cookies used only with your consent, where the law requires it</td>
            </tr>
            <tr>
              <td>Analytics and performance</td>
              <td>Used only with your consent, where the law requires it</td>
            </tr>
            <tr>
              <td>Marketing and targeting</td>
              <td>Used only where enabled on the Website and with your consent, where the law requires it</td>
            </tr>
          </tbody>
        </table>
      </PolicySection>

      <PolicySection {...sec("necessary")}>
        <ol>
          <li>The Website cannot work properly without strictly necessary cookies.</li>
          <li>They make core functions possible, such as:</li>
        </ol>
        <ul>
          <li>moving between pages;</li>
          <li>the shopping basket;</li>
          <li>checkout;</li>
          <li>payment security;</li>
          <li>signing in to your account;</li>
          <li>fraud prevention;</li>
          <li>order processing;</li>
          <li>showing prices in your currency;</li>
          <li>storing your cookie preferences;</li>
          <li>Website security;</li>
          <li>load balancing and technical stability.</li>
        </ul>
        <ol start={3}>
          <li>
            We do not need your consent for these cookies, because they are necessary to provide the service you
            ask for.
          </li>
          <li>
            If you switch strictly necessary cookies off in your browser, parts of the Website may not work
            properly &mdash; you may not be able to add products to your basket, complete checkout, sign in or
            use essential store features.
          </li>
        </ol>
        <CookieTable caption="Strictly necessary — examples" rows={NECESSARY} />
      </PolicySection>

      <PolicySection {...sec("functional")}>
        <ol>
          <li>Functional cookies support extra Website features and personalisation.</li>
          <li>They may remember choices you make, for example:</li>
        </ol>
        <ul>
          <li>your preferred currency;</li>
          <li>language or region settings;</li>
          <li>products you viewed recently;</li>
          <li>account preferences;</li>
          <li>saved display settings;</li>
          <li>support chat preferences, where applicable.</li>
        </ul>
        <ol start={3}>
          <li>
            Some functional cookies can matter for a smooth shopping experience, but not all of them are strictly
            necessary.
          </li>
          <li>
            Where the law requires it, we use non-essential functional cookies only with your consent.
          </li>
        </ol>
        <CookieTable caption="Functional — examples" rows={FUNCTIONAL} />
      </PolicySection>

      <PolicySection {...sec("analytics")}>
        <ol>
          <li>Analytics and performance cookies help us understand how people use the Website.</li>
          <li>They may help us measure:</li>
        </ol>
        <ul>
          <li>the pages people visit;</li>
          <li>how visitors make their way through the Website;</li>
          <li>the products or categories viewed;</li>
          <li>how customers use checkout;</li>
          <li>how fast the Website is and how it performs;</li>
          <li>errors, broken pages or technical issues;</li>
          <li>whether changes to the Website are working.</li>
        </ul>
        <ol start={3}>
          <li>
            Analytics data helps us improve how the Website works, the user experience, how products are
            presented, navigation and how the store performs.
          </li>
          <li>
            You do not need analytics cookies to complete a purchase. Where the law requires it, we use them only
            with your consent.
          </li>
          <li>
            Analytics information may be aggregated or pseudonymised but can still involve personal data, such
            as an IP address, device identifiers or online identifiers, depending on the tool.
          </li>
        </ol>
        <CookieTable caption="Analytics and performance — examples" rows={ANALYTICS} />
      </PolicySection>

      <PolicySection {...sec("marketing")}>
        <ol>
          <li>
            Marketing and targeting cookies may be used to show relevant adverts, measure how adverts perform,
            limit how often the same advert appears, build audience segments or understand how people engage
            with marketing campaigns.
          </li>
          <li>They may be set by Solvetaworld or by outside advertising and marketing partners.</li>
          <li>
            Marketing cookies may follow your browsing across websites and may be used to build a profile of your
            interests.
          </li>
          <li>
            We use marketing or targeting cookies only where they are switched on for the Website and, where the
            law requires it, you have consented.
          </li>
          <li>
            Rejecting marketing cookies will not stop adverts appearing, but they may be less relevant or less
            personalised.
          </li>
        </ol>
        <CookieTable caption="Marketing and targeting — examples" rows={MARKETING} />
      </PolicySection>

      <PolicySection {...sec("payment")}>
        <ol>
          <li>
            At checkout, cookies and similar technologies may be used by payment processors, fraud prevention
            providers, card payment systems and security tools.
          </li>
          <li>They may be needed to:</li>
        </ol>
        <ul>
          <li>process Visa and Mastercard payments;</li>
          <li>guard against fraudulent transactions;</li>
          <li>verify checkout sessions;</li>
          <li>prevent unauthorised activity;</li>
          <li>support secure payment authentication;</li>
          <li>detect suspicious behaviour;</li>
          <li>meet payment security requirements.</li>
        </ul>
        <ol start={3}>
          <li>
            Some payment and security cookies are strictly necessary for checkout and fraud prevention; others
            may be controlled by the third-party provider concerned.
          </li>
          <li>Solvetaworld does not store your full card number or your full card security code.</li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("third-party")}>
        <ol>
          <li>Some cookies may be set by outside providers that support our Website.</li>
          <li>Those providers can include:</li>
        </ol>
        <ul>
          <li>payment processors;</li>
          <li>fraud prevention providers;</li>
          <li>analytics providers;</li>
          <li>advertising and marketing providers;</li>
          <li>hosting, performance and security providers;</li>
          <li>customer support or communication tools;</li>
          <li>embedded content providers;</li>
          <li>social media platforms, where applicable.</li>
        </ul>
        <ol start={3}>
          <li>
            A third-party cookie is controlled by the third party that sets it, and its use is governed by that
            party&rsquo;s own privacy and cookie policies.
          </li>
          <li>
            Once set, not every third-party cookie is under our control, but we aim to work with reputable
            providers and to configure cookies in a privacy-conscious way where we can.
          </li>
          <li>
            Third-party cookies that are not strictly necessary should only be used once appropriate consent has
            been obtained.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("consent")}>
        <ol>
          <li>On your first visit to the Website, you may see a cookie banner or consent tool.</li>
          <li>The banner may let you:</li>
        </ol>
        <ul>
          <li>accept all cookies;</li>
          <li>reject non-essential cookies;</li>
          <li>customise your cookie preferences;</li>
          <li>find out more about the categories of cookies we use.</li>
        </ul>
        <ol start={3}>
          <li>
            Strictly necessary cookies may be used without consent, because the Website needs them to function
            and to provide the services you ask for.
          </li>
          <li>
            Non-essential cookies &mdash; analytics, marketing and targeting cookies, and certain functional
            cookies &mdash; are used only where the law permits and once any required consent has been given.
          </li>
          <li>
            Silence, inactivity, pre-ticked boxes or simply carrying on browsing are not treated by us as consent
            to non-essential cookies.
          </li>
          <li>
            Your cookie choice may be saved in your browser in a cookie, local storage or a similar technology,
            so we can remember it next time you visit.
          </li>
          <li>
            You can change or withdraw consent at any time through the cookie settings tool where it is
            available, by clearing your browser cookies/local storage, or by changing your browser settings.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("browser")}>
        <ol>
          <li>Most browsers let you manage cookies in their settings.</li>
          <li>Depending on your browser, you may be able to:</li>
        </ol>
        <ul>
          <li>see the cookies stored on your device;</li>
          <li>delete cookies;</li>
          <li>block every cookie;</li>
          <li>block third-party cookies;</li>
          <li>set cookie preferences site by site;</li>
          <li>be alerted before a cookie is stored.</li>
        </ul>
        <ol start={3}>
          <li>Blocking or deleting cookies can affect how the Website works.</li>
          <li>
            Blocking strictly necessary cookies may stop you using essential store functions such as the basket,
            checkout, account sign-in, payment processing or security features.
          </li>
          <li>
            Each browser provider handles this differently; see your browser&rsquo;s help pages for how to manage
            cookies.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("withdraw")}>
        <ol>
          <li>You can withdraw or change consent to non-essential cookies whenever you like.</li>
          <li>To do so, you can:</li>
        </ol>
        <ul>
          <li>use the cookie settings or preferences tool on the Website, where available;</li>
          <li>clear cookies and local storage in your browser;</li>
          <li>change your browser settings;</li>
          <li>block third-party cookies in your browser.</li>
        </ul>
        <ol start={3}>
          <li>
            Withdrawing consent does not make cookie use based on that consent before the withdrawal unlawful.
          </li>
          <li>
            After you withdraw consent, some cookies already on your device may stay there until you delete them
            or they expire.
          </li>
          <li>Where technically possible, we stop setting non-essential cookies once consent is withdrawn.</li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("personal-data")}>
        <ol>
          <li>
            Some cookies may collect information that is, or can be linked to, personal data &mdash; for example
            an IP address, device identifiers, account session data, browsing behaviour or online identifiers.
          </li>
          <li>Where cookies involve personal data, we handle it as set out in our Privacy Policy.</li>
          <li>
            The legal basis for processing personal data collected through cookies depends on the category and
            purpose of the cookie, and may be consent, legitimate interests, contractual necessity or legal
            obligation.
          </li>
          <li>Our Privacy Policy gives more detail on how we process personal data.</li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("revisions")}>
        <ol>
          <li>We may revise this document from time to time to reflect changes to:</li>
        </ol>
        <ul>
          <li>the cookies we use;</li>
          <li>how the Website works;</li>
          <li>checkout, payment, security or analytics tools;</li>
          <li>marketing technologies;</li>
          <li>third-party providers;</li>
          <li>legal or regulatory requirements;</li>
          <li>how we run the business.</li>
        </ul>
        <ol start={2}>
          <li>Each time we revise this document, we change the revision date shown with it.</li>
          <li>
            Unless stated otherwise, a revised version applies from the date it is published on the Website.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("contact")}>
        <p>For questions about this document or how we use cookies and similar technologies, get in touch:</p>
        <ContactBlock />
      </PolicySection>
    </PolicyLayout>
  );
}

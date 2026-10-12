import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { PolicyLayout, PolicySection, ContactBlock } from "@/components/layout/PolicyLayout/PolicyLayout";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "Privacy Notice" };

const TITLE = "Privacy Notice";

const TOC = [
  { id: "about", title: "About this notice" },
  { id: "controller", title: "Who controls your data" },
  { id: "data-collected", title: "What we collect" },
  { id: "data-not-collected", title: "Data we do not intend to collect" },
  { id: "sources", title: "Where the data comes from" },
  { id: "uses", title: "What we use it for" },
  { id: "legal-bases", title: "Legal bases" },
  { id: "marketing", title: "Marketing messages" },
  { id: "cookies", title: "Cookies and similar technologies" },
  { id: "sharing", title: "Who we share data with" },
  { id: "transfers", title: "International transfers" },
  { id: "retention", title: "How long we keep data" },
  { id: "security", title: "Keeping data secure" },
  { id: "rights", title: "Your rights" },
  { id: "complaints", title: "Complaints" },
  { id: "automated-decisions", title: "Automated decisions and profiling" },
  { id: "third-party-sites", title: "Other websites and services" },
  { id: "children", title: "Children" },
  { id: "updates", title: "Updates to this notice" },
  { id: "contact", title: "Contacting us" },
];

const KEY_FACTS = [
  { label: "Data controller", value: COMPANY.name },
  { label: "Selling your data", value: "We do not sell personal data" },
  { label: "Intended users", value: "Aged 18 or over" },
  { label: "Order, tax & accounting records", value: "Kept for up to 7 years" },
  { label: "Support communications", value: "Up to 3 years after the matter is closed, unless longer is needed" },
  { label: "UK complaints body", value: "Information Commissioner’s Office" },
];

/** Lettered sub-clauses: (a), (b), (c)… */
function Clauses({ children }: { children: ReactNode }) {
  return <ol className="list-none! pl-0! my-3 border-l-2 border-line">{children}</ol>;
}

function Clause({ mark, children }: { mark: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[2.5rem_1fr] mb-3! last:mb-0!">
      <span className="font-mono text-xs text-ink-subtle pt-[0.35em] pl-2">({mark})</span>
      <div>{children}</div>
    </li>
  );
}

function Email() {
  return <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>;
}

/** Categories of personal data (section 3). Items and notes restate the clauses exactly. */
const DATA_CATEGORIES: { ref: string; name: string; when: string; items: string[]; notes?: string[] }[] = [
  {
    ref: "A",
    name: "Identity and contact data",
    when: "In general",
    items: [
      "full name",
      "billing address",
      "delivery address",
      "email address",
      "phone number",
      "company name, where applicable",
      "VAT number, tax number or business details, where applicable",
      "account username or customer reference",
    ],
  },
  {
    ref: "B",
    name: "Account data",
    when: "When you open an account or use customer account features",
    items: [
      "account login details",
      "account preferences",
      "saved addresses",
      "order history",
      "wishlist or saved products, where available",
      "account status",
      "communication preferences",
    ],
    notes: ["Where secure password systems are used, we cannot see your password in readable form."],
  },
  {
    ref: "C",
    name: "Order and transaction data",
    when: "When you order",
    items: [
      "products ordered",
      "order number",
      "order value",
      "selected currency",
      "payment status",
      "delivery method",
      "dispatch and tracking information",
      "invoice and receipt information",
      "refund, return, cancellation or warranty records",
      "customer service history relating to the order",
    ],
  },
  {
    ref: "D",
    name: "Payment data",
    when: "When you pay — limited payment-related information we may receive and store",
    items: [
      "payment confirmation",
      "transaction ID",
      "payment provider reference",
      "last four digits of a card, where the payment provider supplies them",
      "card brand, such as Visa or Mastercard",
      "fraud screening status",
      "refund or chargeback information",
    ],
    notes: [
      "Payments are handled by secure third-party payment providers.",
      "Your full card number, full card security code and complete card credentials are not stored by us.",
    ],
  },
  {
    ref: "E",
    name: "Delivery and customs data",
    when: "To fulfil your order",
    items: [
      "delivery address",
      "recipient name",
      "phone number",
      "email address",
      "tracking number",
      "courier records",
      "proof of delivery",
      "customs declaration information",
      "commercial invoice information",
      "import/export information needed for international shipments",
    ],
    notes: [
      "On international orders, some order and delivery details may be passed to couriers, customs brokers, customs authorities or local delivery partners.",
    ],
  },
  {
    ref: "F",
    name: "Business and trade customer data",
    when: "When you buy as a Business Customer, apply for trade access or deal with us in a professional capacity",
    items: [
      "company name",
      "trading name",
      "registration details",
      "VAT/tax details",
      "business address",
      "business contact person",
      "professional role",
      "trade or contractor information",
      "order history",
      "business communication records",
    ],
  },
  {
    ref: "G",
    name: "Customer support and communication data",
    when: "When you contact us",
    items: [
      "email correspondence",
      "phone call details",
      "contact form submissions",
      "support request details",
      "product questions",
      "complaint details",
      "return or refund requests",
      "warranty claim information",
      "photos, videos, documents or other files you send as evidence of product issues, delivery damage, installation concerns or warranty claims",
    ],
  },
  {
    ref: "H",
    name: "Technical and usage data",
    when: "Collected automatically when you use the Website",
    items: [
      "IP address",
      "browser type and version",
      "device type",
      "operating system",
      "approximate location derived from your IP address",
      "pages visited",
      "referring website",
      "time and date of visits",
      "session information",
      "clickstream data",
      "error logs",
      "security logs",
      "performance data",
    ],
  },
  {
    ref: "I",
    name: "Cookie and tracking data",
    when: "Through cookies and similar technologies",
    items: [
      "browsing activity",
      "preferences",
      "basket activity",
      "analytics interactions",
      "marketing or advertising interactions, where you consent",
    ],
    notes: ["Our Cookies policy gives more detail."],
  },
  {
    ref: "J",
    name: "Marketing preference data",
    when: "When you subscribe to marketing or engage with promotional messages",
    items: [
      "email address",
      "subscription status",
      "marketing consent",
      "unsubscribe records",
      "communication preferences",
      "email engagement data such as opens and clicks, where our marketing tools support it",
    ],
  },
  {
    ref: "K",
    name: "Fraud prevention and compliance data",
    when: "To protect our business, our customers and our payment systems, and to meet our legal obligations",
    items: [
      "order risk indicators",
      "payment verification results",
      "mismatches between billing and delivery details",
      "IP address and location indicators",
      "sanctions or restricted destination checks",
      "chargeback history",
      "suspected fraud records",
      "compliance review notes",
    ],
  },
];

/** Purposes of processing (section 6). */
const PURPOSES: { name: string; items: string[]; notes?: string[] }[] = [
  {
    name: "Processing and fulfilling orders",
    items: [
      "receiving and processing orders",
      "confirming payment",
      "issuing confirmations, receipts and invoices",
      "preparing goods for dispatch",
      "arranging delivery",
      "providing tracking details",
      "dealing with customs paperwork where required",
      "handling cancellations, returns, refunds and warranty claims",
    ],
  },
  {
    name: "Customer support",
    items: [
      "answering enquiries",
      "helping with questions about products, orders or delivery",
      "investigating damaged, faulty, incorrect or missing goods",
      "handling complaints",
      "processing return and warranty requests",
      "communicating with you about your order or account",
    ],
  },
  {
    name: "Running and improving the Website",
    items: [
      "keeping the Website working",
      "improving navigation and user experience",
      "monitoring performance",
      "fixing errors",
      "testing and improving Website features",
      "understanding how customers use the Website",
    ],
  },
  {
    name: "Accounts and trade access",
    items: [
      "creating and managing customer accounts",
      "verifying business or trade information where applicable",
      "providing account features",
      "managing trade pricing or business access where available",
      "keeping accounts secure",
    ],
  },
  {
    name: "Fraud prevention and security",
    items: [
      "detecting and preventing fraud",
      "monitoring suspicious activity",
      "protecting payment systems",
      "preventing misuse of the Website",
      "securing accounts and systems",
      "investigating unauthorised access or abuse",
      "managing chargebacks and payment disputes",
    ],
  },
  {
    name: "Legal and regulatory obligations",
    items: [
      "meeting tax, accounting, company, consumer protection, customs, sanctions, financial crime and other legal obligations",
      "keeping the records the law requires",
      "responding to lawful requests from authorities",
      "handling disputes and legal claims",
    ],
  },
  {
    name: "Marketing communications",
    items: [
      "where the law permits, using your contact details to send marketing about products, offers, promotions, updates or services that may be relevant to you",
    ],
    notes: ["You may unsubscribe from marketing whenever you like."],
  },
  {
    name: "Cookies and analytics",
    items: [
      "running essential Website functions",
      "remembering preferences",
      "keeping the basket working",
      "measuring Website traffic",
      "analysing performance",
      "improving the Website",
      "supporting marketing or advertising where you have given consent, where consent is required",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title={TITLE} docRef="SW-06" lastUpdated="12 October 2026" toc={TOC} keyFacts={KEY_FACTS}>
      <PolicySection id="about" number={1} title="About this notice">
        <p>
          This notice sets out how {COMPANY.name}, which trades as Solvetaworld, collects, uses, stores, shares
          and protects personal data whenever you visit www.solvetaworld.com, open an account, order, get in
          touch, use our services or otherwise deal with us. We are committed to protecting your privacy and to
          handling your personal data lawfully, fairly and transparently.
        </p>
        <p>The Website is run by:</p>
        <ContactBlock />
        <table>
          <thead>
            <tr>
              <th>Term used</th>
              <th>Who it refers to</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&ldquo;Solvetaworld&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;</td>
              <td>{COMPANY.name}</td>
            </tr>
            <tr>
              <td>&ldquo;Customer&rdquo;, &ldquo;you&rdquo;, &ldquo;your&rdquo;</td>
              <td>
                Anyone who uses the Website, places an order, opens an account, contacts us or interacts with our
                services
              </td>
            </tr>
          </tbody>
        </table>
        <Clauses>
          <Clause mark="a">
            <p>This notice covers personal data that we process in connection with:</p>
            <ul>
              <li>visiting or browsing the Website;</li>
              <li>opening or using a customer account;</li>
              <li>placing, managing or receiving an order;</li>
              <li>buying tools, hardware, workshop supplies and related goods;</li>
              <li>applying for or using trade, business or professional customer access;</li>
              <li>contacting customer support;</li>
              <li>asking for delivery updates, returns, refunds, warranty support or product help;</li>
              <li>signing up to marketing communications;</li>
              <li>interacting with cookies, analytics, advertising or similar technologies;</li>
              <li>communicating with us by email, phone, forms or other channels.</li>
            </ul>
          </Clause>
          <Clause mark="b">It applies to Consumers and Business Customers alike.</Clause>
          <Clause mark="c">
            Read it together with our <Link href="/policies/terms">Terms &amp; Conditions of Sale</Link>, our{" "}
            <Link href="/policies/shipping">Delivery &amp; Dispatch</Link> policy, our{" "}
            <Link href="/policies/returns">Returns, Refunds &amp; Cancellations</Link> policy, our{" "}
            <Link href="/policies/cookies">Cookies</Link> policy and any other policy or notice made available on
            the Website.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="controller" number={2} title="Who controls your data">
        <Clauses>
          <Clause mark="a">
            {COMPANY.name} is the data controller of your personal data for the purposes of applicable data
            protection laws, including the UK General Data Protection Regulation, the Data Protection Act 2018
            and, where it applies, the EU General Data Protection Regulation.
          </Clause>
          <Clause mark="b">In other words, we decide why your personal data is processed and how.</Clause>
          <Clause mark="c">
            <p>Privacy questions can be sent to us using these details:</p>
            <ContactBlock />
          </Clause>
          <Clause mark="d">
            We are not currently required to appoint a Data Protection Officer and have not done so. Privacy
            enquiries can nonetheless be sent to the contact details above.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="data-collected" number={3} title="What we collect">
        <p>
          What personal data we collect depends on how you deal with Solvetaworld. We may collect and process the
          categories set out in the table below.
        </p>
        <table>
          <thead>
            <tr>
              <th>Ref.</th>
              <th>Category</th>
              <th>May include</th>
            </tr>
          </thead>
          <tbody>
            {DATA_CATEGORIES.map((c) => (
              <tr key={c.ref}>
                <td className="font-mono">{c.ref}</td>
                <td>
                  <strong>{c.name}</strong>
                  <br />
                  <span className="text-xs">{c.when}</span>
                </td>
                <td>
                  {c.items.join("; ")}.
                  {c.notes?.map((n) => (
                    <span key={n} className="block mt-2 text-xs">
                      {n}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Category I is explained further in our <Link href="/policies/cookies">Cookies</Link> policy.
        </p>
      </PolicySection>

      <PolicySection id="data-not-collected" number={4} title="Data we do not intend to collect">
        <Clauses>
          <Clause mark="a">
            We do not set out to collect special category personal data &mdash; for example information about
            health, race, ethnicity, political opinions, religious beliefs, trade union membership, biometric data
            or sexual orientation.
          </Clause>
          <Clause mark="b">
            Please do not send us special category data unless we have asked for it and it is strictly necessary
            for a specific matter.
          </Clause>
          <Clause mark="c">We do not knowingly collect personal data from children.</Clause>
          <Clause mark="d">
            The Website is meant for users aged 18 or over, because the goods we sell include power tools, machinery
            and other workshop supplies that may call for technical understanding and safe use.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="sources" number={5} title="Where the data comes from">
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>(a) Directly from you</td>
              <td>
                when you visit the Website; open an account; place an order; enter billing or delivery details;
                make a payment; contact us; ask for support; submit a return, refund or warranty request; subscribe
                to marketing; or complete forms or give us information through the Website.
              </td>
            </tr>
            <tr>
              <td>(b) Automatically</td>
              <td>
                when you use the Website, including by means of cookies, analytics tools, logs, security systems and
                similar technologies.
              </td>
            </tr>
            <tr>
              <td>(c) From third parties</td>
              <td>
                payment processors; card networks and fraud prevention providers; couriers and delivery partners;
                customs brokers and customs authorities; e-commerce platform providers; analytics providers;
                marketing and communication service providers; IT, hosting, security and infrastructure providers;
                professional advisers; and public authorities where the law requires.
              </td>
            </tr>
          </tbody>
        </table>
      </PolicySection>

      <PolicySection id="uses" number={6} title="What we use it for">
        <p>Your personal data is used for the purposes listed below.</p>
        <ol className="list-none! pl-0! my-3 grid gap-3">
          {PURPOSES.map((p, i) => (
            <li key={p.name} className="border-2 border-line mb-0!">
              <p className="m-0! px-3 py-2 bg-surface-1 border-b border-line font-display uppercase tracking-wide text-ink text-sm">
                <span className="font-mono text-ink-subtle mr-2">6.{i + 1}</span>
                {p.name}
              </p>
              <div className="px-3 py-2">
                <ul className="my-0!">
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                {p.notes?.map((n) => (
                  <p key={n} className="mt-2! mb-0!">
                    {n}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </PolicySection>

      <PolicySection id="legal-bases" number={7} title="Legal bases">
        <Clauses>
          <Clause mark="a">
            <p>We only process personal data where we have a lawful basis for doing so, as set out here:</p>
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Lawful basis relied on</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Processing and fulfilling orders</td><td>Contractual necessity</td></tr>
                <tr><td>Taking payment and confirming transactions</td><td>Contractual necessity</td></tr>
                <tr><td>Delivering goods</td><td>Contractual necessity</td></tr>
                <tr><td>Handling returns, refunds and warranty claims</td><td>Contractual necessity; legal obligation; legitimate interests</td></tr>
                <tr><td>Customer support</td><td>Contractual necessity; legitimate interests</td></tr>
                <tr><td>Creating and managing accounts</td><td>Contractual necessity; legitimate interests</td></tr>
                <tr><td>Verifying business or trade accounts</td><td>Contractual necessity; legitimate interests</td></tr>
                <tr><td>Fraud prevention and Website security</td><td>Legitimate interests; legal obligation</td></tr>
                <tr><td>Customs, tax, accounting and legal records</td><td>Legal obligation</td></tr>
                <tr><td>Responding to legal claims or disputes</td><td>Legitimate interests; legal obligation</td></tr>
                <tr><td>Service improvement and Website analytics</td><td>Legitimate interests; consent where required</td></tr>
                <tr><td>Non-essential cookies and tracking</td><td>Consent where required</td></tr>
                <tr><td>Marketing emails</td><td>Consent, or legitimate interests where the law permits</td></tr>
                <tr><td>Sanctions and compliance checks</td><td>Legal obligation; legitimate interests</td></tr>
              </tbody>
            </table>
          </Clause>
          <Clause mark="b">
            We rely on legitimate interests only where we consider that your rights and freedoms do not override
            those interests.
          </Clause>
          <Clause mark="c">
            Those interests may include running an online store, fulfilling customer orders, improving the
            Website, preventing fraud, protecting our systems, managing customer relationships, enforcing our
            Terms and protecting our legal and commercial interests.
          </Clause>
          <Clause mark="d">
            Where consent is our basis, you can withdraw it at any time. Processing that took place before you
            withdrew it is not affected.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="marketing" number={8} title="Marketing messages">
        <Clauses>
          <Clause mark="a">
            We may send you marketing where you have given consent or where applicable law otherwise allows it.
          </Clause>
          <Clause mark="b">
            Such messages may cover product updates, offers, promotions, availability notices, service updates or
            products similar to ones you have bought or looked at.
          </Clause>
          <Clause mark="c">
            You can opt out whenever you like, either through the unsubscribe link in the email concerned or by
            writing to <Email />.
          </Clause>
          <Clause mark="d">
            Unsubscribing from marketing does not stop service messages, which we may still send &mdash; for
            example order confirmations, delivery updates, payment notices, refund updates, warranty
            communications and important account or policy notices.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="cookies" number={9} title="Cookies and similar technologies">
        <Clauses>
          <Clause mark="a">
            The Website uses cookies together with similar technologies such as pixels, tags, local storage and
            analytics tools.
          </Clause>
          <Clause mark="b">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Used for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Essential</td>
                  <td>
                    Needed for the Website to work, including basket functionality, checkout, security, fraud
                    prevention and account access.
                  </td>
                </tr>
                <tr>
                  <td>Non-essential</td>
                  <td>
                    May be used for analytics, performance measurement, personalisation, advertising or marketing,
                    where the law permits and where consent is required.
                  </td>
                </tr>
              </tbody>
            </table>
          </Clause>
          <Clause mark="c">
            On your first visit you may be shown a cookie banner or consent tool that lets you manage
            non-essential cookies. Cookies can also be managed through your browser settings.
          </Clause>
          <Clause mark="d">
            Our <Link href="/policies/cookies">Cookies</Link> policy has more information.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="sharing" number={10} title="Who we share data with">
        <Clauses>
          <Clause mark="a">
            <strong>We do not sell your personal data.</strong>
          </Clause>
          <Clause mark="b">
            Where it is necessary to run the Website, process orders, deliver goods, comply with the law or
            protect our business, we may share your personal data with trusted third parties.
          </Clause>
          <Clause mark="c">
            <p>Recipients may include:</p>
            <ul>
              <li>payment processors and card payment providers;</li>
              <li>banks, card networks and fraud prevention providers;</li>
              <li>e-commerce platform providers;</li>
              <li>hosting, IT, infrastructure and security providers;</li>
              <li>couriers, delivery partners, postal operators, customs brokers and logistics providers;</li>
              <li>customs authorities and other public authorities where required;</li>
              <li>email, communication and customer support providers;</li>
              <li>analytics and cookie technology providers;</li>
              <li>marketing service providers, where applicable;</li>
              <li>professional advisers, such as accountants, auditors, insurers, lawyers and consultants;</li>
              <li>regulators, courts, law enforcement, tax authorities or government bodies where the law requires;</li>
              <li>business partners or successors if all or part of our business is restructured, merged, sold, financed or transferred.</li>
            </ul>
          </Clause>
          <Clause mark="d">
            Our service providers must process personal data only for authorised purposes and must apply
            appropriate security and confidentiality measures.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="transfers" number={11} title="International transfers">
        <Clauses>
          <Clause mark="a">
            Since Solvetaworld sells internationally and relies on third-party service providers, your personal
            data may be processed outside the United Kingdom, the European Economic Area or the country where you
            live.
          </Clause>
          <Clause mark="b">
            Such transfers can happen when the hosting, e-commerce, payment, analytics, communication, delivery,
            customs or support providers we use are based in other countries.
          </Clause>
          <Clause mark="c">
            <p>Where data protection law requires it, we put appropriate safeguards in place, which may include:</p>
            <ul>
              <li>adequacy regulations or adequacy decisions;</li>
              <li>the UK International Data Transfer Agreement;</li>
              <li>the UK Addendum to the EU Standard Contractual Clauses;</li>
              <li>EU Standard Contractual Clauses;</li>
              <li>contractual and organisational safeguards;</li>
              <li>other lawful transfer mechanisms that applicable law permits.</li>
            </ul>
          </Clause>
          <Clause mark="d">
            We take reasonable steps so that personal data sent abroad stays protected in line with applicable data
            protection requirements.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="retention" number={12} title="How long we keep data">
        <Clauses>
          <Clause mark="a">
            Personal data is kept only as long as is reasonably necessary for the purposes in this notice, unless
            the law requires or permits a longer period.
          </Clause>
          <Clause mark="b">
            Retention periods can differ according to the type of data, the purpose of processing, legal
            requirements, accounting obligations, tax rules, warranty periods, dispute risks, fraud prevention
            needs and operational requirements.
          </Clause>
          <Clause mark="c">
            <p>The general guide is:</p>
            <table>
              <thead>
                <tr>
                  <th>Records</th>
                  <th>Usual retention</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Order, transaction, invoice, accounting and tax records</td><td>Up to 7 years</td></tr>
                <tr><td>Customer account data</td><td>While the account stays active, then for a reasonable period afterwards</td></tr>
                <tr><td>Customer support communications</td><td>Up to 3 years after the matter is closed, unless longer retention is needed</td></tr>
                <tr><td>Return, refund, complaint and warranty records</td><td>For the relevant warranty, limitation or dispute period</td></tr>
                <tr><td>Marketing consent and unsubscribe records</td><td>Until withdrawn, and then as long as needed to honour suppression preferences</td></tr>
                <tr><td>Analytics and technical data</td><td>Usually 12&ndash;26 months, depending on the tool concerned</td></tr>
                <tr><td>Fraud, chargeback, sanctions or compliance records</td><td>As long as reasonably necessary for prevention, investigation and legal compliance</td></tr>
              </tbody>
            </table>
          </Clause>
          <Clause mark="d">
            We may keep data for longer where we need to in order to establish, exercise or defend legal claims,
            meet legal obligations, investigate fraud or abuse, resolve disputes or enforce our Terms &amp;
            Conditions of Sale.
          </Clause>
          <Clause mark="e">
            Once personal data is no longer needed, we delete it, anonymise it or, where appropriate, archive it
            securely.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="security" number={13} title="Keeping data secure">
        <Clauses>
          <Clause mark="a">
            We take reasonable technical and organisational measures to guard personal data against unauthorised
            access, loss, misuse, alteration, disclosure or destruction. These may include access controls,
            secure payment processing, encryption where appropriate, system monitoring, account security
            measures, due diligence on providers and internal controls.
          </Clause>
          <Clause mark="b">
            No website, payment system, method of transmission or storage system can be guaranteed to be
            completely secure.
          </Clause>
          <Clause mark="c">
            You are responsible for keeping your account login details confidential and for telling us promptly
            if you think your account has been accessed without authorisation.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="rights" number={14} title="Your rights">
        <Clauses>
          <Clause mark="a">
            <p>
              Depending on where you are and the data protection law that applies, you may have the following
              rights over your personal data:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Right</th>
                  <th>What it means</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>To be informed</td><td>to know how your personal data is used</td></tr>
                <tr><td>Access</td><td>to obtain a copy of your personal data</td></tr>
                <tr><td>Rectification</td><td>to ask for inaccurate or incomplete personal data to be corrected</td></tr>
                <tr><td>Erasure</td><td>to ask for your personal data to be deleted, in certain circumstances</td></tr>
                <tr><td>Restriction</td><td>to ask for processing to be restricted, in certain circumstances</td></tr>
                <tr><td>Objection</td><td>to object to processing based on legitimate interests, and to object to direct marketing at any time</td></tr>
                <tr><td>Portability</td><td>to data portability, in certain circumstances</td></tr>
                <tr><td>Withdrawing consent</td><td>to withdraw consent where processing is based on consent</td></tr>
                <tr><td>Automated decisions</td><td>rights relating to automated decision-making and profiling, where applicable</td></tr>
                <tr><td>Complaint</td><td>to lodge a complaint with a supervisory authority</td></tr>
              </tbody>
            </table>
          </Clause>
          <Clause mark="b">
            These rights are not absolute. They may be subject to legal conditions, exemptions, identity
            verification and our own legal obligations.
          </Clause>
          <Clause mark="c">
            To use any of these rights, contact us at <Email />. We may have to verify your identity before we
            respond, and we aim to answer valid data protection requests within the time limit set by applicable
            law.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="complaints" number={15} title="Complaints">
        <Clauses>
          <Clause mark="a">
            If you are worried about how we handle your personal data, please raise it with us first at{" "}
            <Email /> so that we have the chance to put things right.
          </Clause>
          <Clause mark="b">
            <table>
              <thead>
                <tr>
                  <th>Where you are</th>
                  <th>Who you can complain to</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>United Kingdom</td>
                  <td>You have the right to lodge a complaint with the Information Commissioner&rsquo;s Office.</td>
                </tr>
                <tr>
                  <td>European Union or European Economic Area</td>
                  <td>You may have the right to lodge a complaint with your local data protection supervisory authority.</td>
                </tr>
              </tbody>
            </table>
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="automated-decisions" number={16} title="Automated decisions and profiling">
        <Clauses>
          <Clause mark="a">
            At present we do not use personal data to take decisions based solely on automated processing that
            have legal or similarly significant effects on you.
          </Clause>
          <Clause mark="b">
            Automated tools may be used by us to support fraud prevention, payment security, Website security,
            risk scoring or transaction monitoring.
          </Clause>
          <Clause mark="c">
            Those tools help to flag potentially suspicious activity, but without appropriate review they do not
            normally take final decisions with legal or similarly significant effects.
          </Clause>
          <Clause mark="d">
            Should we introduce automated decision-making with legal or similarly significant effects, we will
            update this notice and give you the information that applicable law requires.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="third-party-sites" number={17} title="Other websites and services">
        <Clauses>
          <Clause mark="a">
            The Website may link to third-party websites, manufacturer websites, payment pages, courier tracking
            pages, social media pages or other external services.
          </Clause>
          <Clause mark="b">
            We have no responsibility for the privacy practices, security, content or policies of those
            third-party websites or services.
          </Clause>
          <Clause mark="c">
            Before giving personal data to any third-party website or service, you should read its privacy
            policy.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="children" number={18} title="Children">
        <Clauses>
          <Clause mark="a">
            The Website is not aimed at children, and we do not knowingly collect personal data from them.
          </Clause>
          <Clause mark="b">
            If you think a child has given us personal data, let us know at <Email />; we will take appropriate
            steps to review the information and delete it where required.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="updates" number={19} title="Updates to this notice">
        <Clauses>
          <Clause mark="a">
            This notice may be updated from time to time to reflect changes to our business, Website
            functionality, service providers, data processing practices, legal requirements or regulatory
            guidance.
          </Clause>
          <Clause mark="b">
            Whenever we update it, we will change the &ldquo;Revised&rdquo; date shown on this page&rsquo;s document card.
          </Clause>
          <Clause mark="c">
            Unless stated otherwise, the updated version takes effect from the date it is published on the
            Website.
          </Clause>
          <Clause mark="d">
            We suggest that you look at this notice from time to time so that you stay informed about how we
            handle personal data.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="contact" number={20} title="Contacting us">
        <p>
          For any question, request or concern about this notice or the way we process personal data, use the
          details below:
        </p>
        <ContactBlock />
      </PolicySection>
    </PolicyLayout>
  );
}

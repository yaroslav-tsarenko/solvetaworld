import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { PolicyLayout, PolicySection, ContactBlock } from "@/components/layout/PolicyLayout/PolicyLayout";
import { COMPANY } from "@/lib/company";
import { EXPRESS_PRICE, FREE_STANDARD_MIN, STANDARD_PRICE, formatGbp } from "@/lib/shipping";

export const metadata = { title: "Terms & Conditions of Sale" };

const TITLE = "Terms & Conditions of Sale";

const TOC = [
  { id: "parties", title: "The parties and these terms" },
  { id: "who-may-buy", title: "Who may buy" },
  { id: "product-information", title: "Product information and suitability" },
  { id: "electrical-safety", title: "Electrical safety and installation" },
  { id: "accounts", title: "Accounts and trade access" },
  { id: "ordering", title: "Ordering and when a contract is made" },
  { id: "prices", title: "Prices, VAT and currencies" },
  { id: "payment", title: "Paying for your order" },
  { id: "offers", title: "Offers, codes and free delivery" },
  { id: "delivery", title: "Delivery and dispatch" },
  { id: "customs", title: "Orders outside the UK: customs and import charges" },
  { id: "ownership-risk", title: "Ownership and risk" },
  { id: "consumer-cancellation", title: "Cancelling as a consumer" },
  { id: "restricted-returns", title: "Items with restricted returns" },
  { id: "faulty-goods", title: "Goods that arrive faulty, damaged or wrong" },
  { id: "statutory-rights", title: "Statutory rights and the legal guarantee" },
  { id: "additional-warranty", title: "Additional Warranty" },
  { id: "business-customers", title: "Terms for business customers" },
  { id: "local-compliance", title: "Compliance with local rules" },
  { id: "intellectual-property", title: "Intellectual property" },
  { id: "website-use", title: "Acceptable use of the website" },
  { id: "sanctions", title: "Sanctions, export controls and restricted destinations" },
  { id: "privacy-cookies", title: "Personal data and cookies" },
  { id: "liability", title: "Limits on our liability" },
  { id: "force-majeure", title: "Events beyond our control" },
  { id: "changes", title: "Changes to the website, products and terms" },
  { id: "general", title: "Severability and transfer of rights" },
  { id: "law", title: "Governing law and courts" },
  { id: "contact", title: "Contacting us" },
];

const KEY_FACTS = [
  { label: "Seller", value: `${COMPANY.name}, trading as Solvetaworld` },
  { label: "Minimum age to order", value: "18 years" },
  { label: "Consumer cancellation", value: "14 days from receipt of the goods" },
  {
    label: "Delivery charges",
    value: `Standard ${formatGbp(STANDARD_PRICE)}, free on orders of ${formatGbp(FREE_STANDARD_MIN)} or more; Express ${formatGbp(EXPRESS_PRICE)}`,
  },
  { label: "Visible transit damage", value: "Tell us within 48 hours of delivery where possible" },
  { label: "Governing law", value: "England and Wales" },
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

export default function TermsPage() {
  return (
    <PolicyLayout title={TITLE} docRef="SW-01" lastUpdated="12 October 2026" toc={TOC} keyFacts={KEY_FACTS}>
      <PolicySection id="parties" number={1} title="The parties and these terms">
        <p>
          This document (the &ldquo;Terms&rdquo;) sets the rules for visiting and using www.solvetaworld.com,
          together with every related page, service, order, purchase, communication and transaction carried
          out under the Solvetaworld name.
        </p>
        <p>The Website is run by the company below:</p>
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
                Any person or business that visits the Website, places an order, buys goods or makes use of our
                services in any other way
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Please take the time to read these Terms before you order. You accept them, and agree to be bound by
          them, as soon as you visit the Website, open an account, submit an order or buy goods from
          Solvetaworld.
        </p>
        <Clauses>
          <Clause mark="a">
            Every use of the Website, and every purchase of goods through Solvetaworld, is covered by these
            Terms.
          </Clause>
          <Clause mark="b">
            Solvetaworld supplies physical goods for domestic, commercial, trade and professional use: hand and
            power tools, hardware and ironmongery, fixings and fasteners, garden machinery, cable and test
            equipment, and other workshop supplies.
          </Clause>
          <Clause mark="c">
            These Terms operate alongside the other policies published on the Website, among them our{" "}
            <Link href="/policies/shipping">Delivery &amp; Dispatch</Link> policy, our{" "}
            <Link href="/policies/returns">Returns, Refunds &amp; Cancellations</Link> policy, our{" "}
            <Link href="/policies/privacy">Privacy Notice</Link>, our <Link href="/policies/cookies">Cookies</Link>{" "}
            policy, and any warranty or additional warranty terms that relate to a particular product.
          </Clause>
          <Clause mark="d">
            Where a product-specific term is clearly shown on a product page or at checkout and it conflicts
            with these Terms, that product-specific term prevails, but only for the product or order concerned.
          </Clause>
          <Clause mark="e">
            Any legal right you hold that the law does not allow to be excluded or limited is unaffected by
            anything in these Terms.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="who-may-buy" number={2} title="Who may buy">
        <h3>Eligibility and your responsibilities</h3>
        <Clauses>
          <Clause mark="a">
            To order on the Website you must be 18 years of age or older and have the legal capacity to do so.
          </Clause>
          <Clause mark="b">
            When you order for a business, company, partnership, organisation, trade customer or any other legal
            entity, you confirm that you have authority to bind that entity to these Terms.
          </Clause>
          <Clause mark="c">
            It is your job to make sure that everything you tell us is accurate, complete and current &mdash;
            this covers your name, billing details, delivery address, contact details, VAT or tax details and any
            other information we need in order to process your order.
          </Clause>
          <Clause mark="d">
            Neither the Website nor goods bought from Solvetaworld may be used for any purpose that is unlawful,
            unsafe, fraudulent or unauthorised.
          </Clause>
        </Clauses>

        <h3>Consumers and business customers</h3>
        <p>Solvetaworld supplies consumers as well as business customers. In these Terms:</p>
        <dl className="my-3 border-2 border-line-strong">
          <div className="px-4 py-3 border-b border-line">
            <dt className="font-display uppercase tracking-wide text-ink text-sm">Consumer</dt>
            <dd className="m-0">
              an individual who is acting entirely or mainly for purposes outside their trade, business, craft
              or profession.
            </dd>
          </div>
          <div className="px-4 py-3">
            <dt className="font-display uppercase tracking-wide text-ink text-sm">Business Customer</dt>
            <dd className="m-0">
              any person, company, sole trader, contractor, installer, reseller, organisation, public body or
              professional that buys goods for business, commercial, trade, resale, installation or professional
              purposes.
            </dd>
          </div>
        </dl>
        <Clauses>
          <Clause mark="e">
            Some rights set out in these Terms &mdash; statutory consumer cancellation rights among them &mdash;
            are available to Consumers only, and Business Customers do not benefit from them unless the law
            requires it.
          </Clause>
          <Clause mark="f">
            We expect Business Customers to have suitable technical knowledge, or to have taken professional
            advice, before buying electrical goods. Before ordering, a Business Customer must check every
            specification, rating, compatibility point, suitability question, compliance requirement and
            installation condition.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="product-information" number={3} title="Product information and suitability">
        <Clauses>
          <Clause mark="a">
            We try to keep the descriptions, images, prices, technical details, stock status and other
            information on the Website accurate and current.
          </Clause>
          <Clause mark="b">
            Product images are there to illustrate only. The goods you receive may differ slightly from them as
            a result of manufacturer updates, new packaging, lighting, screen settings, colour differences,
            batch variations or technical improvements.
          </Clause>
          <Clause mark="c">
            Specifications may come from manufacturers, suppliers, distributors or product databases. We take
            reasonable care with this data but cannot promise that it is free of errors or omissions or that it
            will not be updated.
          </Clause>
          <Clause mark="d">
            <p>
              It is your responsibility, before you order, to confirm that the product suits what you intend to
              do with it. Points to check include, without limitation:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Check</th>
                  <th>What to confirm</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Electrical rating</td><td>Voltage and electrical rating</td></tr>
                <tr><td>Power</td><td>Current, load, wattage and power requirements</td></tr>
                <tr><td>Size</td><td>Dimensions and the space available for installation</td></tr>
                <tr><td>Connection</td><td>Cable type, cable size and connection requirements</td></tr>
                <tr><td>Environment</td><td>IP rating and environmental suitability; whether it is suitable indoors or outdoors</td></tr>
                <tr><td>Compatibility</td><td>Fit with existing systems, fittings, devices and installations</td></tr>
                <tr><td>Rules</td><td>Regulatory, safety and installation requirements in the country or region concerned</td></tr>
              </tbody>
            </table>
          </Clause>
          <Clause mark="e">
            If you are not sure that a product is right for the use you have in mind, get in touch with us before
            ordering, or ask a qualified electrician or other competent professional.
          </Clause>
          <Clause mark="f">
            We cannot guarantee that a product is available until your order has been accepted and processed. We
            may cancel or hold up an order if a product becomes unavailable, is discontinued, has been listed
            incorrectly or cannot be supplied for reasons beyond our reasonable control.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="electrical-safety" number={4} title="Electrical safety and installation">
        <Clauses>
          <Clause mark="a">
            An electrical product can be dangerous if it is chosen, installed, connected, modified, overloaded or
            used incorrectly.
          </Clause>
          <Clause mark="b">
            Use every product only for what it is designed for, and always in line with the manufacturer&rsquo;s
            instructions, safety warnings, installation manuals, voltage ratings, load limits and technical
            specifications, and with all applicable laws, building regulations, electrical standards and local
            requirements.
          </Clause>
          <Clause mark="c">
            Where it is required or appropriate, any product that needs electrical installation, wiring,
            connection, testing, commissioning or integration into an electrical system should be fitted only by
            a qualified electrician or other competent professional.
          </Clause>
          <Clause mark="d">
            The Website does not offer electrical engineering, installation, compliance, inspection,
            certification or safety approval services from Solvetaworld.
          </Clause>
          <Clause mark="e">
            Any guidance, description, compatibility note or support reply we give is general information only.
            It is not a replacement for professional advice, an electrical inspection or a compliance assessment.
          </Clause>
          <Clause mark="f">
            We accept no responsibility for damage, loss, injury, malfunction, non-compliance, failed installation
            or safety incidents that result from incorrect installation, the wrong choice of product, misuse,
            overloading, unauthorised modification, work by third parties, failure to follow instructions or use
            for something other than the product&rsquo;s intended purpose.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="accounts" number={5} title="Accounts and trade access">
        <Clauses>
          <Clause mark="a">
            The Website may let you open an account, or apply for trade, professional or business customer
            access.
          </Clause>
          <Clause mark="b">
            We decide, at our discretion, whether to approve, reject, suspend or remove any account, trade
            account, pricing access or professional access.
          </Clause>
          <Clause mark="c">
            We may ask you for further information to check your identity, business status, professional
            activity, VAT/tax details, delivery address or anything else relevant.
          </Clause>
          <Clause mark="d">
            Keeping your login details secure is your responsibility. If you think someone has used your account
            without authorisation, tell us straight away.
          </Clause>
          <Clause mark="e">
            Unless the law requires otherwise, we are not responsible for losses arising from your failure to
            keep your account details secure.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="ordering" number={6} title="Ordering and when a contract is made">
        <Clauses>
          <Clause mark="a">
            Placing an order is an offer by you to buy the goods you have selected on these Terms.
          </Clause>
          <Clause mark="b">
            Once you have ordered, you may be sent an order confirmation or a payment confirmation. Receiving
            either does not by itself mean that we have accepted your order.
          </Clause>
          <Clause mark="c">
            The contract between you and Solvetaworld comes into existence only at the earliest of these three
            points: when we accept your order, when we process it for fulfilment, or when we dispatch the goods.
          </Clause>
          <Clause mark="d">
            <p>Before acceptance, we may refuse, cancel or limit an order in any of these cases:</p>
            <ul>
              <li>the product is not available;</li>
              <li>there is an error in the product, the price, the delivery cost or the description;</li>
              <li>payment has not been authorised, or has been reversed;</li>
              <li>we suspect fraud, abuse, suspicious activity or misuse;</li>
              <li>we cannot deliver to the destination requested;</li>
              <li>customs, sanctions, export, payment processor, carrier or legal restrictions apply;</li>
              <li>the order looks as though it is for unauthorised resale or an unlawful purpose;</li>
              <li>we cannot verify customer, billing or delivery information that we need.</li>
            </ul>
          </Clause>
          <Clause mark="e">
            If we cancel an order after taking payment, we will refund what you paid for the cancelled goods,
            except where the law requires us to withhold the payment or the transaction is under fraud,
            chargeback, sanctions or compliance review.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="prices" number={7} title="Prices, VAT and currencies">
        <Clauses>
          <Clause mark="a">Prices on the Website may be shown in EUR, GBP and USD.</Clause>
          <Clause mark="b">
            Unless it is clearly stated otherwise, the prices shown on the Website include VAT where VAT applies.
          </Clause>
          <Clause mark="c">You will see the final amount payable for your order at checkout, before you pay.</Clause>
          <Clause mark="d">
            We may change prices at any time and without notice. Orders we have already accepted are not
            affected, except where there has been a clear pricing error.
          </Clause>
          <Clause mark="e">
            We are entitled to correct obvious errors in pricing, currency, tax, discounts or products. If such an
            error affects an order you have placed, we may get in touch to ask whether you want to go ahead at the
            corrected price or cancel.
          </Clause>
          <Clause mark="f">
            Currency conversion, bank charges, foreign transaction fees, card issuer fees and exchange rate
            differences are outside Solvetaworld&rsquo;s control and are for the customer to bear.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="payment" number={8} title="Paying for your order">
        <Clauses>
          <Clause mark="a">Payment is due at checkout.</Clause>
          <Clause mark="b">We take secure card payments, including Visa and Mastercard.</Clause>
          <Clause mark="c">
            Secure third-party payment providers process payments on our behalf. Solvetaworld does not keep your
            full card number or your full card security details.
          </Clause>
          <Clause mark="d">
            We do not process your order until payment has been successfully authorised or received.
          </Clause>
          <Clause mark="e">
            We may suspend, cancel or delay your order if your payment is declined, reversed, disputed, charged
            back or flagged as suspicious.
          </Clause>
          <Clause mark="f">
            You must not make a fraudulent payment, use a payment method you are not authorised to use, or try to
            get around payment, security, verification or fraud prevention measures.
          </Clause>
          <Clause mark="g">
            Where applicable, and where we have been given enough billing information, we may issue Business
            Customers with VAT invoices or commercial invoices.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="offers" number={9} title="Offers, codes and free delivery">
        <Clauses>
          <Clause mark="a">
            Solvetaworld may run discounts, promotional codes, special prices, free delivery thresholds or trade
            pricing from time to time.
          </Clause>
          <Clause mark="b">
            Standard delivery costs {formatGbp(STANDARD_PRICE)} and is free on orders of{" "}
            {formatGbp(FREE_STANDARD_MIN)} or more; express delivery costs {formatGbp(EXPRESS_PRICE)} on every
            order. These amounts are set in pounds sterling (GBP); if you shop in EUR or USD, checkout shows the
            converted equivalent, which is the amount you pay.
          </Clause>
          <Clause mark="c">
            The free-delivery threshold applies to standard delivery only and is measured against the product
            subtotal after discounts, before tax, customs duties, import taxes or additional local charges are
            added.
          </Clause>
          <Clause mark="d">
            Free delivery may be unavailable for some destinations and for oversized, heavy, restricted or
            special order goods, or goods that need special handling.
          </Clause>
          <Clause mark="e">
            If we suspect misuse, error, fraud or technical abuse, we may withdraw, change, refuse or cancel
            promotional codes and discounts at any time.
          </Clause>
          <Clause mark="f">
            Promotions have no cash alternative and, unless clearly stated, cannot be used together with other
            offers.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="delivery" number={10} title="Delivery and dispatch">
        <Clauses>
          <Clause mark="a">Orders are dispatched by Solvetaworld from the United Kingdom.</Clause>
          <Clause mark="b">
            We deliver to the supported destinations listed on the Website or at checkout.
          </Clause>
          <Clause mark="c">
            For now we offer standard delivery only; express delivery is not available unless checkout expressly
            offers it.
          </Clause>
          <Clause mark="d">
            All delivery times are estimates. They run from the date of dispatch, not from the date you order.
          </Clause>
          <Clause mark="e">
            <p>As a general guide, estimated delivery times are:</p>
            <table>
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Estimate, counted from dispatch</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>United Kingdom</td><td>1&ndash;3 business days</td></tr>
                <tr><td>Europe</td><td>3&ndash;7 business days</td></tr>
                <tr><td>North America</td><td>5&ndash;10 business days</td></tr>
                <tr><td>Asia &amp; Oceania</td><td>7&ndash;14 business days</td></tr>
                <tr><td>Africa &amp; South America</td><td>8&ndash;15 business days</td></tr>
              </tbody>
            </table>
          </Clause>
          <Clause mark="f">
            Deliveries to Europe and other international destinations may be carried by DHL, partner carriers,
            local couriers or other logistics providers.
          </Clause>
          <Clause mark="g">
            Things outside our control can affect delivery times &mdash; for example customs processing, handling
            by local couriers, remote or rural addresses, incomplete delivery details, public holidays, weather,
            transport disruption, strikes, security checks, import controls or carrier delays.
          </Clause>
          <Clause mark="h">
            You must give us a full and accurate delivery address. Where delivery fails, is late or goes to the
            wrong place because the information you supplied was incorrect or incomplete, we are not
            responsible.
          </Clause>
          <Clause mark="i">It may not be possible to change the delivery address once an order has left us.</Clause>
          <Clause mark="j">
            Unless the law prevents it, if a parcel comes back to us because you gave an incorrect address, did
            not collect it, refused delivery or did not complete customs or courier requirements, we may deduct
            delivery costs, return costs, customs charges, carrier fees and other reasonable costs from any
            refund.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="customs" number={11} title="Orders outside the UK: customs and import charges">
        <Clauses>
          <Clause mark="a">
            Orders delivered outside the United Kingdom may be subject to customs clearance and to import duties,
            import VAT, taxes, brokerage fees, handling fees, carrier fees or other local charges.
          </Clause>
          <Clause mark="b">
            Unless checkout expressly says otherwise, you are liable for all customs duties, import VAT, taxes,
            brokerage fees and local charges due in the destination country.
          </Clause>
          <Clause mark="c">
            Customs processing times, customs decisions, import restrictions, local tax assessments and charges
            levied by authorities, couriers or customs brokers are all outside Solvetaworld&rsquo;s control.
          </Clause>
          <Clause mark="d">
            It is for you to make sure that the goods you order may lawfully be imported into, and used in, your
            country or region.
          </Clause>
          <Clause mark="e">
            Except where the law requires otherwise, Solvetaworld is not responsible for loss, delay or costs that
            follow when customs or local authorities delay, return, seize, reject or destroy an order because of
            import restrictions, unpaid charges, incorrect information you provided or a failure to meet local
            requirements.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="ownership-risk" number={12} title="Ownership and risk">
        <Clauses>
          <Clause mark="a">
            The goods become yours only once we have been paid in full for them and for any delivery charges that
            apply.
          </Clause>
          <Clause mark="b">
            <p>Risk in the goods passes to you as follows:</p>
            <table>
              <thead>
                <tr>
                  <th>Type of order</th>
                  <th>Risk passes to you when</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Consumer order</td>
                  <td>the goods are delivered to you, or to someone you have named to receive them</td>
                </tr>
                <tr>
                  <td>Business Customer order</td>
                  <td>
                    depending on the delivery method agreed or used, the goods are delivered to the delivery
                    address, handed to the first carrier for delivery, or otherwise made available for collection
                  </td>
                </tr>
              </tbody>
            </table>
          </Clause>
          <Clause mark="c">
            On delivery, you are responsible for inspecting the goods and for storing them safely and
            appropriately.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="consumer-cancellation" number={13} title="Cancelling as a consumer">
        <Clauses>
          <Clause mark="a">
            As a Consumer, you may be legally entitled to cancel an eligible online purchase within 14 days of
            receiving the goods, without having to give a reason.
          </Clause>
          <Clause mark="b">
            The cancellation period ends 14 days after the day on which the goods reach you or a person you have
            named.
          </Clause>
          <Clause mark="c">
            Where an order arrives in several parcels, the period will usually end 14 days after the day the last
            parcel reaches you.
          </Clause>
          <Clause mark="d">
            To cancel, send us a clear statement by email to <Email /> before the cancellation period runs out.
          </Clause>
          <Clause mark="e">
            Once you have told us you are cancelling, send the goods back without undue delay, and in any case
            within 14 days of the date on which you notified us.
          </Clause>
          <Clause mark="f">
            Goods you return must be unused, uninstalled and complete, in their original packaging where
            possible, and include every accessory, manual, label, protective material and other item that came
            with them.
          </Clause>
          <Clause mark="g">
            You pay the cost of returning the goods unless they are faulty, damaged or incorrect, or we have
            agreed otherwise in writing.
          </Clause>
          <Clause mark="h">
            If the value of the goods has gone down because they were handled more than was needed to establish
            their nature, characteristics and functioning, we may reduce your refund to reflect that.
          </Clause>
          <Clause mark="i">
            Where the law requires it, we will refund the basic standard delivery cost you paid for the original
            delivery. Unless the law requires otherwise, we may not refund additional delivery costs, upgraded
            services, international charges, customs charges, import duties, brokerage fees or special delivery
            costs.
          </Clause>
          <Clause mark="j">Wherever possible, refunds go back to the payment method you originally used.</Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="restricted-returns" number={14} title="Items with restricted returns">
        <Clauses>
          <Clause mark="a">
            Some goods cannot be sent back simply because you have changed your mind, unless they are faulty,
            damaged or incorrect, or the law requires a right of return.
          </Clause>
          <Clause mark="b">
            <p>Goods that may be non-returnable, or returnable only on restricted terms, include:</p>
            <ul>
              <li>goods made to order, or ordered specially for you;</li>
              <li>goods cut to size, cable and similar materials included;</li>
              <li>goods that have been customised, modified, assembled or altered;</li>
              <li>electrical goods that have been installed, wired, connected, tested, commissioned or used;</li>
              <li>goods damaged after delivery;</li>
              <li>goods that are missing parts, accessories, packaging, manuals, labels, seals or protective materials;</li>
              <li>goods no longer in a condition to be resold;</li>
              <li>goods affected by incorrect storage, moisture, heat, impact, contamination, misuse or unauthorised handling;</li>
              <li>clearance, final sale or discontinued items, where return restrictions are clearly stated and lawful.</li>
            </ul>
          </Clause>
          <Clause mark="c">
            Nothing in this section limits your legal rights where goods are faulty, not as described, unsafe or
            otherwise fail to comply with applicable law.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="faulty-goods" number={15} title="Goods that arrive faulty, damaged or wrong">
        <Clauses>
          <Clause mark="a">
            If what you receive is damaged, faulty, incomplete or not what you ordered, contact us at <Email /> as
            soon as you can.
          </Clause>
          <Clause mark="b">
            Please include your order number, a description of the problem and, where reasonably possible, clear
            photos or videos of the goods, packaging, labels, damage or defect.
          </Clause>
          <Clause mark="c">
            Hold on to the product, packaging, labels and delivery materials until we have reviewed the issue:
            we may need them for a carrier claim, a supplier inspection or a warranty assessment.
          </Clause>
          <Clause mark="d">
            Where possible, report visible delivery damage within 48 hours of delivery. This lets us look into
            courier problems quickly; it does not take away any mandatory legal rights you may have.
          </Clause>
          <Clause mark="e">
            If we confirm that goods are faulty, were damaged before delivery, are incorrect or otherwise do not
            conform to the contract, we may offer a repair, replacement, refund, partial refund or other remedy in
            line with applicable law.
          </Clause>
          <Clause mark="f">
            We may ask for the goods to be sent back for inspection before we approve a refund, replacement or
            warranty remedy.
          </Clause>
          <Clause mark="g">
            Once goods are confirmed as faulty, damaged or incorrect, we will either pay reasonable return
            shipping costs or give you return instructions.
          </Clause>
          <Clause mark="h">
            We are not responsible for faults or damage that result from incorrect installation, misuse,
            overloading, unauthorised modification, external damage, an unsuitable environment, incorrect storage,
            work by third parties, failure to follow instructions, power surges, wear and tear, or use for
            something other than the product&rsquo;s intended purpose.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="statutory-rights" number={16} title="Statutory rights and the legal guarantee">
        <Clauses>
          <Clause mark="a">
            Applicable consumer protection laws may give Consumers statutory rights where goods are faulty, not
            as described, not fit for purpose, unsafe or not in conformity with the contract.
          </Clause>
          <Clause mark="b">
            <p>How those rights apply depends on where you are:</p>
            <table>
              <thead>
                <tr>
                  <th>Consumer location</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>European Union</td>
                  <td>
                    Applicable consumer law may provide a legal guarantee of at least 2 years from the date the goods
                    are received. It covers defects or lack of conformity that existed at delivery and come to light
                    during the legal guarantee period.
                  </td>
                </tr>
                <tr>
                  <td>United Kingdom</td>
                  <td>
                    Statutory rights apply under applicable UK consumer law and may include remedies where goods are
                    faulty, not as described or not fit for purpose.
                  </td>
                </tr>
              </tbody>
            </table>
          </Clause>
          <Clause mark="c">
            Your statutory rights stand apart from any manufacturer warranty, commercial warranty, additional
            warranty or return policy that Solvetaworld offers, and none of those limits them.
          </Clause>
          <Clause mark="d">
            Save where mandatory law says otherwise, Business Customers do not have consumer statutory
            cancellation rights and may have narrower rights than Consumers.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="additional-warranty" number={17} title="Additional Warranty">
        <Clauses>
          <Clause mark="a">
            For selected products, Solvetaworld may offer paid Additional Warranty options. Additional Warranty
            is optional and, where offered, can be bought at checkout.
          </Clause>
          <Clause mark="b">
            <p>Unless the product page or checkout says otherwise, Additional Warranty is priced as follows:</p>
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>+1 Year Additional Warranty</td><td>10% of the product price, minimum &euro;6.99 / &pound;6.99 / $6.99</td></tr>
                <tr><td>+2 Year Additional Warranty</td><td>16% of the product price, minimum &euro;9.99 / &pound;9.99 / $9.99</td></tr>
                <tr><td>+3 Year Additional Warranty</td><td>22% of the product price, minimum &euro;12.99 / &pound;12.99 / $12.99</td></tr>
              </tbody>
            </table>
          </Clause>
          <Clause mark="c">
            The price is worked out on the product price before any delivery charges, customs duties, import
            taxes, brokerage fees or other local charges.
          </Clause>
          <Clause mark="d">
            Additional Warranty is a commercial warranty that sits on top of your statutory rights. It does not
            replace, reduce or limit any mandatory legal rights you may have.
          </Clause>
          <Clause mark="e">
            Unless stated otherwise, Additional Warranty cover starts once the original warranty, legal guarantee,
            manufacturer warranty or standard warranty period that applies to the product has expired.
          </Clause>
          <Clause mark="f">
            It covers eligible manufacturing and material defects that appear during normal use of the product
            in accordance with the manufacturer&rsquo;s instructions and the applicable technical requirements.
          </Clause>
          <Clause mark="g">
            <p>Additional Warranty does not extend to:</p>
            <ul>
              <li>incorrect installation, wiring, connection, testing or commissioning;</li>
              <li>installation by an unqualified or unauthorised person where professional installation is required or appropriate;</li>
              <li>misuse, negligence, abuse, overloading or operation outside rated specifications;</li>
              <li>repair, modification, opening, dismantling or alteration carried out without authorisation;</li>
              <li>accidental, impact, water, moisture, fire or other external damage;</li>
              <li>damage from power surges, an unstable power supply, incorrect voltage, lightning or electrical faults in the wider installation;</li>
              <li>normal wear and tear;</li>
              <li>cosmetic damage that does not affect how the product works;</li>
              <li>consumable parts, batteries, bulbs, fuses, seals, connectors, accessories or parts expected to wear out, unless expressly covered;</li>
              <li>defects caused by unsuitable storage, transport, environment, contamination, corrosion, dust, humidity, chemicals or temperature conditions;</li>
              <li>products used for purposes other than the use intended by the manufacturer;</li>
              <li>loss of profits, labour costs, electrician costs, removal costs, reinstallation costs, downtime or indirect losses.</li>
            </ul>
          </Clause>
          <Clause mark="h">
            To claim, email <Email /> with your order number, proof of purchase and a description of the defect,
            plus supporting photos, videos or diagnostic information where we reasonably ask for them.
          </Clause>
          <Clause mark="i">
            Before approving any warranty remedy, we may ask for the product to be returned for inspection.
          </Clause>
          <Clause mark="j">
            If we approve a valid claim, we may, depending on the product and the circumstances, repair it,
            replace it, supply an equivalent replacement, give a partial refund or provide another reasonable
            remedy.
          </Clause>
          <Clause mark="k">
            Additional Warranty is tied to the product and the original order, and may not be transferred unless
            we expressly agree in writing.
          </Clause>
          <Clause mark="l">
            If you lawfully cancel or return a product before its Additional Warranty has started, the Additional
            Warranty bought for it will also be refunded where the law requires it.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="business-customers" number={18} title="Terms for business customers">
        <Clauses>
          <Clause mark="a">
            Before ordering, Business Customers must check every product specification, suitability point,
            compatibility point, compliance requirement, installation requirement and local regulatory
            obligation.
          </Clause>
          <Clause mark="b">
            Unless we agree otherwise in writing, Business Customers have no general right to cancel or return
            goods because of a change of mind, an ordering mistake, surplus stock, an unsuitable specification, a
            change to their project, or because the goods are simply not faulty.
          </Clause>
          <Clause mark="c">
            Whether we accept a return from a Business Customer is at our discretion, and any return we accept may
            be subject to inspection, restocking fees, return shipping costs and a deduction for reduced resale
            value.
          </Clause>
          <Clause mark="d">
            Business Customers must inspect goods promptly when they arrive and tell us as soon as reasonably
            possible about visible damage, shortages, wrong goods or delivery problems.
          </Clause>
          <Clause mark="e">
            So far as the law permits, our total liability to a Business Customer for any order is capped at the
            price paid for the goods that give rise to the claim.
          </Clause>
          <Clause mark="f">
            We are not liable to Business Customers for loss of profit, revenue, contract, business opportunity,
            goodwill or data, for labour, installation, removal or reinstallation costs, for downtime or project
            delays, or for any indirect or consequential loss.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="local-compliance" number={19} title="Compliance with local rules">
        <Clauses>
          <Clause mark="a">
            Products sold by Solvetaworld may have been designed for particular markets, standards, voltage
            systems, fittings or installation environments.
          </Clause>
          <Clause mark="b">
            You must check whether a product is suitable for, and may lawfully be used in, installed in, resold in
            or imported into, your country, region, property, project or electrical system.
          </Clause>
          <Clause mark="c">
            Beyond what is expressly stated on the product page, we do not guarantee that products bought from
            Solvetaworld will satisfy every local building code, electrical code, certification requirement,
            insurance requirement, workplace requirement or project specification.
          </Clause>
          <Clause mark="d">
            Business Customers, installers, contractors, resellers and professional buyers must obtain every
            permit, approval, inspection, certification and professional sign-off needed for their use,
            installation, resale or project.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="intellectual-property" number={20} title="Intellectual property">
        <Clauses>
          <Clause mark="a">
            All Website content &mdash; text, layout, branding, logos, graphics, icons, product descriptions,
            photographs, videos, design elements and other materials &mdash; belongs to Solvetaworld,{" "}
            {COMPANY.name}, our suppliers, manufacturers or licensors, or other rights holders.
          </Clause>
          <Clause mark="b">
            You may use the Website only for personal, business or purchasing purposes and in line with these
            Terms.
          </Clause>
          <Clause mark="c">
            Without our prior written permission, you must not copy, reproduce, scrape, extract, distribute, sell,
            modify, publish or commercially exploit any Website content.
          </Clause>
          <Clause mark="d">
            Buying a product does not transfer to you any intellectual property rights in the product, brand,
            design, software, documentation or related materials; you receive only the right to use the product
            you bought lawfully and as intended.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="website-use" number={21} title="Acceptable use of the website">
        <Clauses>
          <Clause mark="a">
            <p>Misuse of the Website is not permitted. In particular, you must not:</p>
            <ul>
              <li>try to gain unauthorised access to the Website or to its servers, systems, accounts or data;</li>
              <li>interfere with the security, operation or availability of the Website;</li>
              <li>use bots, scrapers, crawlers, automated tools or data extraction methods without permission;</li>
              <li>upload malicious code, viruses or harmful material;</li>
              <li>place orders that are fraudulent, false, abusive or speculative;</li>
              <li>pretend to be another person or business;</li>
              <li>use the Website for any unlawful, harmful, misleading or prohibited purpose;</li>
              <li>try to get around geographic, payment, security, fraud prevention or sanctions controls.</li>
            </ul>
          </Clause>
          <Clause mark="b">
            Where we suspect misuse, fraud, a security risk, a breach of these Terms or unlawful activity, we may
            restrict, suspend or end access to the Website.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="sanctions" number={22} title="Sanctions, export controls and restricted destinations">
        <Clauses>
          <Clause mark="a">
            We may refuse, cancel, suspend or block an order where sanctions, export controls, financial crime
            controls, payment processor rules, courier restrictions, customs restrictions or legal obligations
            require it or make it appropriate.
          </Clause>
          <Clause mark="b">
            Orders, customers, billing details, delivery addresses, payment information and destinations may be
            screened by us against applicable sanctions, restricted party, fraud prevention and compliance
            requirements.
          </Clause>
          <Clause mark="c">
            We are unable to accept an order if doing so would breach applicable laws, sanctions, export controls,
            carrier rules, payment processor requirements or our internal compliance controls.
          </Clause>
          <Clause mark="d">
            You confirm that you are not subject to sanctions, are not located in a restricted territory, and are
            not buying goods for export, resale, transfer or use in breach of applicable sanctions, export controls
            or laws.
          </Clause>
          <Clause mark="e">
            Losses, delays, cancellations or blocked transactions caused by sanctions, export controls, customs
            restrictions, payment processor rules or legal compliance requirements are not our responsibility.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="privacy-cookies" number={23} title="Personal data and cookies">
        <Clauses>
          <Clause mark="a">
            Personal data is processed by us in line with our <Link href="/policies/privacy">Privacy Notice</Link>.
          </Clause>
          <Clause mark="b">
            Cookies and similar technologies are used on the Website in line with our{" "}
            <Link href="/policies/cookies">Cookies</Link> policy.
          </Clause>
          <Clause mark="c">
            By using the Website, you acknowledge that your personal data may be processed for order fulfilment,
            payment processing, delivery, customer support, fraud prevention, legal compliance, account
            management, analytics and service improvement, among other purposes.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="liability" number={24} title="Limits on our liability">
        <Clauses>
          <Clause mark="a">
            These Terms do not exclude or limit any liability where doing so would be unlawful &mdash; including
            liability for death or personal injury caused by negligence, for fraud or fraudulent
            misrepresentation, and any other liability that applicable law does not allow to be excluded.
          </Clause>
          <Clause mark="b">Your mandatory statutory rights as a Consumer are not limited by anything in these Terms.</Clause>
          <Clause mark="c">
            <p>Subject to clauses 24(a) and 24(b), Solvetaworld is not liable for:</p>
            <ul>
              <li>indirect, incidental, special, consequential or punitive losses;</li>
              <li>loss of profit, revenue, business, opportunity, contract, goodwill or anticipated savings;</li>
              <li>loss of data or interruption to systems;</li>
              <li>costs of labour, installation, removal, reinstallation, testing, inspection, certification or contractors;</li>
              <li>project delays, operational downtime or business interruption;</li>
              <li>losses arising from incorrect product selection, installation, misuse, overloading, unauthorised modification or failure to follow instructions;</li>
              <li>losses arising from events beyond our reasonable control.</li>
            </ul>
          </Clause>
          <Clause mark="d">
            Products have to be chosen, installed and used correctly. We are not responsible for the consequences
            of incorrect or unsafe installation, or of use that goes against the manufacturer&rsquo;s instructions
            or applicable regulations.
          </Clause>
          <Clause mark="e">
            If you are a Business Customer, then to the fullest extent the law permits, our total liability in
            connection with any order will not be more than the amount paid for the goods that give rise to the
            claim.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="force-majeure" number={25} title="Events beyond our control">
        <Clauses>
          <Clause mark="a">
            We are not responsible for any failure or delay in meeting our obligations that is caused by events
            beyond our reasonable control.
          </Clause>
          <Clause mark="b">
            Examples include supply chain disruption, manufacturer delays, transport disruption, courier failure,
            customs delays, strikes, labour disputes, extreme weather, natural disasters, fire, flood, war,
            terrorism, civil unrest, epidemics, pandemics, government action, regulatory change, sanctions, power
            failure, internet failure, technical failure and any other circumstances beyond our reasonable
            control.
          </Clause>
          <Clause mark="c">
            If your order is affected by such an event, we will take reasonable steps to keep disruption to a
            minimum and may contact you with updated information where appropriate.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="changes" number={26} title="Changes to the website, products and terms">
        <Clauses>
          <Clause mark="a">
            The Website, our product range, pricing, delivery options, policies and these Terms may be updated by
            us from time to time.
          </Clause>
          <Clause mark="b">
            Each order is governed by the version of the Terms in force when it was placed, unless a change is
            required by law or concerns a correction that has to be applied.
          </Clause>
          <Clause mark="c">
            If you carry on using the Website after updated Terms are published, you accept those updated Terms
            for future use and future orders.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="general" number={27} title="Severability and transfer of rights">
        <h3>Severability</h3>
        <Clauses>
          <Clause mark="a">
            Should any part of these Terms be held invalid, unlawful or unenforceable, that part will be treated
            as removed, or as modified only so far as is necessary.
          </Clause>
          <Clause mark="b">Everything else in these Terms stays fully in force and effect.</Clause>
        </Clauses>
        <h3>Transfer of rights</h3>
        <Clauses>
          <Clause mark="c">
            We may transfer, assign or subcontract our rights and obligations under these Terms, or otherwise deal
            with them, provided this does not materially reduce your rights as a Consumer.
          </Clause>
          <Clause mark="d">
            You may not transfer your rights or obligations under these Terms unless we have given our prior
            written consent, except where the law requires it.
          </Clause>
        </Clauses>
      </PolicySection>

      <PolicySection id="law" number={28} title="Governing law and courts">
        <Clauses>
          <Clause mark="a">The laws of England and Wales govern these Terms.</Clause>
          <Clause mark="b">
            As a Consumer, you may also have the benefit of any mandatory consumer protection rights available
            under the laws of the country where you live.
          </Clause>
        </Clauses>
        <table>
          <thead>
            <tr>
              <th>Who you are</th>
              <th>Where disputes are heard</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>(c) Consumer living in the United Kingdom</td>
              <td>
                Disputes may be brought before the courts of England and Wales, or before any other UK court with
                jurisdiction under applicable law.
              </td>
            </tr>
            <tr>
              <td>(d) Consumer living in the European Union, or elsewhere where mandatory local consumer rights apply</td>
              <td>Nothing in these Terms stops you from relying on those mandatory rights.</td>
            </tr>
            <tr>
              <td>(e) Business Customer</td>
              <td>
                The courts of England and Wales have exclusive jurisdiction over any dispute arising out of, or in
                connection with, these Terms, the Website or any order.
              </td>
            </tr>
          </tbody>
        </table>
      </PolicySection>

      <PolicySection id="contact" number={29} title="Contacting us">
        <p>
          Questions about these Terms, an order, delivery, returns, warranty or anything else can be sent to us
          using the details below:
        </p>
        <ContactBlock />
      </PolicySection>
    </PolicyLayout>
  );
}

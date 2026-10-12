import {
  PolicyLayout,
  PolicySection,
  ContactBlock,
} from "@/components/layout/PolicyLayout/PolicyLayout";
import { COMPANY } from "@/lib/company";
import { EXPRESS_PRICE, FREE_STANDARD_MIN, STANDARD_PRICE, formatGbp } from "@/lib/shipping";

export const metadata = { title: "Payments" };

const TOC = [
  { id: "about", title: "About this document" },
  { id: "methods", title: "Cards we accept" },
  { id: "currencies", title: "Currencies" },
  { id: "prices", title: "Prices, VAT and the order total" },
  { id: "promotions", title: "Discount codes and pricing errors" },
  { id: "delivery", title: "Delivery charges and free delivery" },
  { id: "additional-warranty", title: "Paying for Additional Warranty" },
  { id: "processing", title: "How a payment is processed" },
  { id: "security", title: "Card security and payment data" },
  { id: "authentication", title: "Strong Customer Authentication and checks" },
  { id: "failed", title: "Declined, failed or pending payments" },
  { id: "fraud", title: "Fraud screening and payment reviews" },
  { id: "billing", title: "Billing details and invoices" },
  { id: "business", title: "Payment terms for Business Customers" },
  { id: "customs", title: "Orders outside the UK: customs and import charges" },
  { id: "refunds", title: "Refunds" },
  { id: "chargebacks", title: "Chargebacks and payment disputes" },
  { id: "compliance", title: "Sanctions, restricted payments and compliance" },
  { id: "revisions", title: "Revisions to this document" },
  { id: "contact", title: "Payment queries" },
] as const;

type SectionId = (typeof TOC)[number]["id"];

function sec(id: SectionId) {
  const i = TOC.findIndex((s) => s.id === id);
  return { id, number: i + 1, title: TOC[i].title };
}

const KEY_FACTS = [
  { label: "Cards accepted", value: "Visa and Mastercard" },
  { label: "Checkout currencies", value: "EUR, GBP, USD" },
  { label: "When you pay", value: "At checkout, before the order is processed" },
  { label: "VAT", value: "Included in displayed product prices where applicable, unless clearly stated otherwise" },
  {
    label: "Delivery charges",
    value: `Standard ${formatGbp(STANDARD_PRICE)}, free on orders of ${formatGbp(FREE_STANDARD_MIN)} or more; Express ${formatGbp(EXPRESS_PRICE)}`,
  },
  { label: "Card details", value: "Full card number and security code are not stored on our systems" },
];

const AW_OPTIONS = [
  { term: "+1 Year Additional Warranty", rate: "10% of the product price", min: "€6.99 / £6.99 / $6.99" },
  { term: "+2 Year Additional Warranty", rate: "16% of the product price", min: "€9.99 / £9.99 / $9.99" },
  { term: "+3 Year Additional Warranty", rate: "22% of the product price", min: "€12.99 / £12.99 / $12.99" },
];

const dlCls = "my-4 grid grid-cols-1 sm:grid-cols-[11rem_1fr] border-2 border-line-strong text-sm";
const dtCls = "px-3 py-2 bg-surface-1 font-display uppercase tracking-wide text-ink border-b border-line sm:border-r";
const ddCls = "m-0 px-3 py-2 border-b border-line";

export default function PaymentPolicyPage() {
  return (
    <PolicyLayout
      title="Payments"
      docRef="SW-05"
      lastUpdated="12 October 2026"
      toc={[...TOC]}
      keyFacts={KEY_FACTS}
    >
      <PolicySection {...sec("about")}>
        <p>
          This document describes how payment for purchases on www.solvetaworld.com is accepted, processed,
          checked, refunded and otherwise handled.
        </p>
        <p>The Website is run by the company below:</p>
        <ContactBlock />
        <dl className={dlCls}>
          <dt className={dtCls}>&ldquo;Solvetaworld&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;</dt>
          <dd className={ddCls}>{COMPANY.name}.</dd>
          <dt className={dtCls}>&ldquo;Customer&rdquo;, &ldquo;you&rdquo;, &ldquo;your&rdquo;</dt>
          <dd className={ddCls}>Any individual or business that places an order through the Website.</dd>
        </dl>
        <p>
          Read it together with our Terms and Conditions, Shipping Policy, Returns and Refunds Policy, Privacy
          Policy, Cookie Policy and Warranty Policy.
        </p>
        <h3>What this document covers</h3>
        <ol>
          <li>
            Every payment made through the Website &mdash; for physical goods, delivery charges, additional
            warranty options and any other paid service or charge shown at checkout.
          </li>
          <li>
            Solvetaworld sells hand and power tools, hardware and ironmongery, fixings and fasteners, garden
            machinery, cable and test equipment, and other workshop supplies.
          </li>
          <li>
            Placing an order and submitting your payment details means you accept this document.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("methods")}>
        <table>
          <thead>
            <tr>
              <th>Payment method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Visa (secure card payment)</td><td>Accepted</td></tr>
            <tr><td>Mastercard (secure card payment)</td><td>Accepted</td></tr>
            <tr>
              <td>
                Cash on delivery, payment on account, open credit terms, cheque, cryptocurrency, instalments
              </td>
              <td>
                Not currently offered, unless clearly stated on the Website or separately agreed in writing
              </td>
            </tr>
          </tbody>
        </table>
        <ol>
          <li>
            No other payment method is accepted unless it is expressly shown at checkout or Solvetaworld agrees
            to it in writing.
          </li>
          <li>Payment has to be completed at checkout before we process the order.</li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("currencies")}>
        <p>The Website may show prices and take payment in:</p>
        <ul>
          <li>EUR</li>
          <li>GBP</li>
          <li>USD</li>
        </ul>
        <ol>
          <li>
            Which currency you can use may depend on where you are, the store settings you choose, which payment
            providers are available, how checkout is configured or how the Website works.
          </li>
          <li>Before you complete the order, checkout shows the final currency and the amount to pay.</li>
          <li>
            If your card or bank account is in a different currency from the one used at checkout, your card
            issuer or bank may apply its own exchange rate, conversion fee or foreign transaction fee.
          </li>
          <li>
            Exchange rates, bank conversion fees, card issuer charges and foreign transaction fees are outside
            Solvetaworld&rsquo;s control.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("prices")}>
        <ol>
          <li>
            Product prices shown on the Website include VAT where applicable, unless it is clearly stated that
            they do not.
          </li>
          <li>The final total at checkout may be made up of:</li>
        </ol>
        <ul>
          <li>the product price;</li>
          <li>VAT, where applicable;</li>
          <li>delivery charges;</li>
          <li>paid Additional Warranty options you have selected;</li>
          <li>valid discounts or promotional codes;</li>
          <li>any other charge clearly shown before payment.</li>
        </ul>
        <ol start={3}>
          <li>Prices can change at any time before an order is placed.</li>
          <li>
            A change in price does not affect an order Solvetaworld has already accepted, except where there has
            been an obvious pricing, currency, tax, discount or technical error.
          </li>
          <li>
            If we find a pricing or payment error after you have ordered, we may contact you to ask whether you
            want to go ahead at the corrected price or cancel the affected order.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("promotions")}>
        <ol>
          <li>
            Promotional codes, discounts, offers and special prices may carry extra terms, expiry dates,
            eligibility rules, minimum order values, product exclusions or destination restrictions.
          </li>
          <li>
            A promotional code has to be applied before payment is completed; we do not have to apply one
            retrospectively once the order has been placed.
          </li>
          <li>Discounts have no cash alternative.</li>
          <li>
            We may refuse, cancel or reverse a discount that has been used fraudulently, incorrectly or
            abusively, in breach of its terms, or because of a technical error.
          </li>
          <li>
            If a product price, delivery charge, warranty option, currency amount, discount or order total is
            clearly wrong because of a technical or administrative error, we may cancel the order or contact you
            to ask whether you want to go ahead at the corrected price.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("delivery")}>
        <ol>
          <li>Any delivery charge is shown at checkout before you pay.</li>
          <li>The delivery charges, set in pounds sterling (GBP), are:</li>
        </ol>
        <table>
          <thead>
            <tr>
              <th>Delivery service</th>
              <th>Charge (GBP)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Standard delivery</td>
              <td>
                {formatGbp(STANDARD_PRICE)}; free when the order comes to {formatGbp(FREE_STANDARD_MIN)} or more
              </td>
            </tr>
            <tr>
              <td>Express delivery</td>
              <td>{formatGbp(EXPRESS_PRICE)} on every order (free delivery does not apply)</td>
            </tr>
          </tbody>
        </table>
        <ol start={3}>
          <li>
            If you pay in euros (EUR) or US dollars (USD), checkout shows the converted equivalent of these GBP
            amounts and of the {formatGbp(FREE_STANDARD_MIN)} threshold, and the converted amount is what you pay.
          </li>
          <li>
            The {formatGbp(FREE_STANDARD_MIN)} threshold is measured against the product subtotal after discounts
            and before tax, customs duties, import VAT, local taxes, brokerage fees or other destination charges.
          </li>
          <li>
            Free delivery may not be available for every destination, or for oversized, heavy or restricted
            goods, special order items, remote areas or products needing special handling.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("additional-warranty")}>
        <ol>
          <li>Where offered, paid Additional Warranty options can be chosen at checkout.</li>
          <li>Unless stated otherwise, the price of Additional Warranty is worked out as follows:</li>
        </ol>
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Price</th>
              <th>Minimum charge</th>
            </tr>
          </thead>
          <tbody>
            {AW_OPTIONS.map((o) => (
              <tr key={o.term}>
                <td>{o.term}</td>
                <td>{o.rate}</td>
                <td>{o.min}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ol start={3}>
          <li>The Additional Warranty charge is paid at checkout along with the product price.</li>
          <li>
            It is governed by the Warranty Policy and by any warranty terms specific to the product.
          </li>
          <li>
            If you validly cancel or return the product before the Additional Warranty has started, and a refund
            is either required by law or approved by Solvetaworld, the linked Additional Warranty charge may also
            be refunded.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("processing")}>
        <ol>
          <li>Payments are handled by secure third-party payment providers.</li>
          <li>
            When you submit your payment details, the provider may verify, authorise, authenticate, approve,
            decline or review the transaction.
          </li>
          <li>
            Solvetaworld cannot guarantee your payment will go through. Approval depends on your card issuer,
            bank and payment provider, fraud checks, authentication requirements, available funds, transaction
            limits and other factors we do not control.
          </li>
          <li>
            We do not process your order for fulfilment until the payment has been successfully authorised or
            received.
          </li>
          <li>
            An order or payment confirmation does not always mean we have accepted your order; acceptance is
            governed by our Terms and Conditions.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("security")}>
        <ol>
          <li>Solvetaworld treats payment security seriously.</li>
          <li>
            Card payments go through secure third-party payment providers. Solvetaworld&rsquo;s own systems do
            not store your full card number, your full card security code or your complete card credentials.
          </li>
          <li>Payment providers may pass us a limited amount of payment information, for example:</li>
        </ol>
        <ul>
          <li>the payment status;</li>
          <li>the transaction reference;</li>
          <li>the payment provider ID;</li>
          <li>the card brand;</li>
          <li>the last four digits of the card, where supplied;</li>
          <li>the refund status;</li>
          <li>chargeback or dispute information;</li>
          <li>the result of fraud screening.</li>
        </ul>
        <ol start={4}>
          <li>
            Payment providers may apply secure authentication, encryption, fraud prevention and other payment
            security controls.
          </li>
          <li>
            Do not try to pay with any card, account or payment method you are not authorised to use.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("authentication")}>
        <ol>
          <li>
            Your bank, card issuer or payment provider may require extra authentication for some card payments
            &mdash; for example 3D Secure, one-time passwords, approval in your banking app or other
            verification steps.
          </li>
          <li>
            If authentication is not completed successfully, the payment may be declined or the order may not be
            processed.
          </li>
          <li>
            We may also ask for further information where we need it to verify billing, delivery or business
            details, the legitimacy of the order, fraud risk or compliance requirements.
          </li>
          <li>
            If you do not supply the verification information we ask for, the order may be delayed or cancelled.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("failed")}>
        <ol>
          <li>
            If your payment is declined, fails, expires, is reversed or stays pending, your order may not be
            processed.
          </li>
          <li>
            Solvetaworld is not responsible for payment failures caused by your bank, card issuer or payment
            provider, insufficient funds, incorrect card details, failed authentication, transaction limits,
            network problems or fraud controls.
          </li>
          <li>
            If a payment fails, you may need to try again, use another accepted card, speak to your bank or
            contact us for help.
          </li>
          <li>We reserve the right to cancel orders that are unpaid, failed, pending, suspicious or incomplete.</li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("fraud")}>
        <ol>
          <li>
            To protect customers, Solvetaworld, payment providers and card networks, transactions may be screened
            for fraud, abuse, unauthorised activity, sanctions risk and payment security concerns.
          </li>
          <li>
            Where an order looks suspicious or high-risk, we may delay, cancel or reject it, or ask for further
            verification.
          </li>
          <li>Signs of risk can include:</li>
        </ol>
        <ul>
          <li>billing and delivery information that do not match;</li>
          <li>an unusual order value or quantity;</li>
          <li>several failed payment attempts;</li>
          <li>suspected unauthorised use of a card;</li>
          <li>a high-risk destination or forwarding address;</li>
          <li>a restricted or sanctioned destination;</li>
          <li>unusual IP, location or device data;</li>
          <li>a history of chargebacks or fraud;</li>
          <li>customer information that is inconsistent.</li>
        </ul>
        <ol start={4}>
          <li>
            We do not have to fulfil an order we reasonably believe may be fraudulent, unauthorised, unlawful,
            abusive or non-compliant.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("billing")}>
        <ol>
          <li>The billing information you give at checkout must be accurate.</li>
          <li>
            If you are buying as a business, give your correct business name, billing address, VAT/tax details
            and anything else needed for invoicing.
          </li>
          <li>
            Where applicable, Solvetaworld may issue order confirmations, payment confirmations, receipts, VAT
            invoices or commercial invoices.
          </li>
          <li>
            Once an order has been processed we may be unable to change invoice details &mdash; particularly if
            the invoice has already been generated, passed to accounting or used for customs documentation.
          </li>
          <li>Business Customers must check their billing details are correct before paying.</li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("business")}>
        <ol>
          <li>
            Business Customers pay in full at checkout unless we have expressly agreed otherwise in writing.
          </li>
          <li>
            Solvetaworld does not give Business Customers credit terms, open account purchasing or deferred
            payment unless this has been approved separately in writing.
          </li>
          <li>
            Business Customers must make sure purchase orders, internal approvals, VAT/tax information, billing
            details and delivery details are correct before they pay.
          </li>
          <li>
            An order placed by a Business Customer is treated as a business purchase unless we decide otherwise.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("customs")}>
        <ol>
          <li>Solvetaworld sends orders out from the United Kingdom.</li>
          <li>
            An order delivered outside the United Kingdom may be subject to customs clearance, import duties,
            import VAT, local taxes, brokerage fees, courier handling fees, customs clearance fees or other local
            charges.
          </li>
          <li>
            Unless checkout expressly says otherwise, those customs and import charges are not part of the
            product price, the delivery price or the payment Solvetaworld collects.
          </li>
          <li>
            You must pay any customs duties, import VAT, taxes, brokerage fees, handling charges and local
            charges imposed in the destination country.
          </li>
          <li>
            Customs authorities, customs delays, import tax assessments, courier clearance fees and local charges
            are not in Solvetaworld&rsquo;s control.
          </li>
          <li>
            Not paying customs or import charges can lead to delay, return of the parcel, abandonment, disposal,
            seizure or extra costs.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("refunds")}>
        <ol>
          <li>Refunds follow our Returns, Refunds and Cancellation Policy.</li>
          <li>An approved refund normally goes back to the payment method used for the order.</li>
          <li>We cannot normally refund to a different card, account, person or payment method.</li>
          <li>
            Once we have processed a refund, your bank, card issuer or payment provider may take extra time to
            make the money available.
          </li>
          <li>
            Currency conversion differences, card issuer fees, foreign transaction fees and bank charges are not
            in Solvetaworld&rsquo;s control, and Solvetaworld does not refund them.
          </li>
          <li>
            Customs duties, import VAT, local taxes, brokerage fees, courier handling fees, customs clearance fees
            and other local charges are not charged by Solvetaworld, and Solvetaworld does not refund them.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("chargebacks")}>
        <ol>
          <li>
            If something is wrong with an order, payment, delivery, return, refund or warranty claim, email us
            first at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> so that we can look into it and
            try to put it right.
          </li>
          <li>
            If you raise a chargeback, card dispute or payment dispute, we may have to give information to our
            payment provider, bank, card network, fraud prevention provider or dispute resolution provider.
          </li>
          <li>That information may include:</li>
        </ol>
        <ul>
          <li>order details and payment records;</li>
          <li>tracking information and delivery confirmation;</li>
          <li>communications with you;</li>
          <li>refund records and return status;</li>
          <li>fraud screening information;</li>
          <li>other relevant evidence.</li>
        </ul>
        <ol start={4}>
          <li>
            We reserve the right to challenge a chargeback or payment dispute where we believe the order was
            correctly processed, fulfilled, delivered or refunded, or otherwise handled in line with our
            policies.
          </li>
          <li>
            Fraudulent, abusive or repeated chargebacks may lead to future orders being cancelled, account access
            being restricted or further action where the law permits.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("compliance")}>
        <ol>
          <li>
            We may refuse, cancel, suspend or block a payment or order where this is required or appropriate
            because of sanctions, export controls, financial crime controls, payment processor rules, card
            network rules, courier or customs restrictions, or legal obligations.
          </li>
          <li>
            You confirm that you are not subject to sanctions, are not located in a restricted territory and are
            not using the Website to buy goods in breach of applicable laws, sanctions or export controls.
          </li>
          <li>
            We are not responsible for delays, blocked payments, cancelled orders, withheld transactions or
            payment failures caused by sanctions, compliance checks, payment processor requirements, card network
            rules or legal restrictions.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("revisions")}>
        <ol>
          <li>
            We may revise this document from time to time to reflect changes to payment methods, currencies,
            checkout processes, payment providers, fraud controls, legal requirements, tax rules or how we run
            the business.
          </li>
          <li>
            Your order is governed by the version that was in force when you placed it, unless a change is
            required by law or is a correction that has to be applied.
          </li>
          <li>Each time we revise this document, we change the revision date shown with it.</li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("contact")}>
        <p>
          For questions about paying, billing, invoices, refunds, failed payments or payment disputes, get in
          touch:
        </p>
        <ContactBlock />
      </PolicySection>
    </PolicyLayout>
  );
}

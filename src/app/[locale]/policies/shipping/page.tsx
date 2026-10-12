import {
  PolicyLayout,
  PolicySection,
  ContactBlock,
} from "@/components/layout/PolicyLayout/PolicyLayout";
import { COMPANY } from "@/lib/company";
import {
  DELIVERY_ZONES,
  EXPRESS_PRICE,
  FREE_STANDARD_MIN,
  STANDARD_PRICE,
  formatGbp,
} from "@/lib/shipping";

export const metadata = { title: "Delivery & Dispatch" };

const TOC = [
  { id: "about", title: "About this document" },
  { id: "processing", title: "Getting your order ready" },
  { id: "dispatch", title: "Dispatch point and tracking" },
  { id: "transit-times", title: "Transit times by destination" },
  { id: "charges", title: "Delivery services, charges and free delivery" },
  { id: "carriers", title: "Carriers and services" },
  { id: "address", title: "Your delivery address" },
  { id: "split", title: "Orders sent in more than one parcel" },
  { id: "international", title: "Sending orders outside the UK" },
  { id: "customs", title: "Customs, duty and import taxes" },
  { id: "electrical", title: "Electrical goods and local rules" },
  { id: "restricted", title: "Restricted destinations and compliance" },
  { id: "attempts", title: "Delivery attempts, missed and refused parcels" },
  { id: "third-party", title: "Forwarders and third-party addresses" },
  { id: "damage", title: "Parcels that arrive damaged or wrong" },
  { id: "lost", title: "Late or missing parcels" },
  { id: "trade", title: "Trade and business orders" },
  { id: "force-majeure", title: "Events beyond our control" },
  { id: "revisions", title: "Revisions to this document" },
  { id: "contact", title: "Delivery queries" },
] as const;

type SectionId = (typeof TOC)[number]["id"];

function sec(id: SectionId) {
  const i = TOC.findIndex((s) => s.id === id);
  return { id, number: i + 1, title: TOC[i].title };
}

const KEY_FACTS = [
  { label: "Dispatched from", value: "United Kingdom" },
  { label: "Order processing", value: "Typically 1–2 business days after payment is confirmed" },
  {
    label: "UK transit time",
    value: `Standard ${DELIVERY_ZONES[0].days.standard} / Express ${DELIVERY_ZONES[0].days.express} business days from dispatch`,
  },
  {
    label: "Delivery charges",
    value: `Standard ${formatGbp(STANDARD_PRICE)}, free on orders of ${formatGbp(FREE_STANDARD_MIN)} or more; Express ${formatGbp(EXPRESS_PRICE)} on every order`,
  },
  { label: "Visible transit damage", value: "Tell us within 48 hours of delivery where possible" },
  { label: "Import charges (outside UK)", value: "Paid by the customer unless checkout says otherwise" },
];

const dlCls = "my-4 grid grid-cols-1 sm:grid-cols-[11rem_1fr] border-2 border-line-strong text-sm";
const dtCls = "px-3 py-2 bg-surface-1 font-display uppercase tracking-wide text-ink border-b border-line sm:border-r";
const ddCls = "m-0 px-3 py-2 border-b border-line";

export default function DeliveryPolicyPage() {
  return (
    <PolicyLayout
      title="Delivery & Dispatch"
      docRef="SW-02"
      lastUpdated="12 October 2026"
      toc={[...TOC]}
      keyFacts={KEY_FACTS}
    >
      <PolicySection {...sec("about")}>
        <p>
          This document sets out how an order placed on www.solvetaworld.com is handled from the moment it is
          paid for: how it is processed, sent out and delivered, and what happens if something goes wrong on
          the way.
        </p>
        <p>The Website is run by the company below:</p>
        <ContactBlock />
        <dl className={dlCls}>
          <dt className={dtCls}>&ldquo;Solvetaworld&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;</dt>
          <dd className={ddCls}>{COMPANY.name}.</dd>
          <dt className={dtCls}>&ldquo;Customer&rdquo;, &ldquo;you&rdquo;, &ldquo;your&rdquo;</dt>
          <dd className={ddCls}>The individual or business that places an order through the Website.</dd>
        </dl>
        <p>
          Read it alongside our Terms and Conditions, our Returns and Refunds Policy, our Privacy Policy and
          anything extra shown to you at checkout.
        </p>
        <h3>What this document covers</h3>
        <ol>
          <li>It governs delivery of the physical goods you buy through Solvetaworld.</li>
          <li>
            Our range covers hand and power tools, hardware and ironmongery, fixings and fasteners, garden
            machinery, cable and test equipment, and other workshop supplies.
          </li>
          <li>
            Delivery charges are the flat per-order rates set out in the section on delivery services and
            charges below. Estimated times and the destinations open to you can differ according to the
            destination country, the type, size and weight of the product, which couriers are available,
            customs requirements and other operational factors.
          </li>
          <li>
            An estimate is an estimate: it is not a guaranteed delivery date unless Solvetaworld has expressly
            said otherwise in writing.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("processing")}>
        <ol>
          <li>
            Once payment has been successfully confirmed, we typically process an order within 1&ndash;2
            business days.
          </li>
          <li>
            &ldquo;Processing&rdquo; is the work needed to review the order, confirm the payment, prepare the
            goods, carry out fulfilment checks and pass the parcel to the carrier.
          </li>
          <li>
            Expect this to take longer during peak seasons, promotions, public holidays and other busy periods,
            or where there are supplier delays, stock checks, payment reviews or fraud prevention reviews, or
            where the order needs further verification.
          </li>
          <li>
            Where an order contains several products, they may travel together or in separate parcels,
            depending on stock, the type of product, how it has to be packed and what is most efficient
            logistically.
          </li>
          <li>
            If an item turns out to be unavailable, delayed, discontinued, wrongly listed or impossible to
            supply, we may get in touch to propose an alternative, hold the order back, send part of it, or
            cancel that item and refund it.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("dispatch")}>
        <ol>
          <li>All Solvetaworld orders leave from the United Kingdom.</li>
          <li>
            The delivery times in this document are counted from the day of dispatch, not from the day you
            placed the order.
          </li>
          <li>
            After dispatch you may get an email confirming that the order has shipped, or tracking details
            where these exist.
          </li>
          <li>
            Whether tracking is offered depends on the courier, the destination, the delivery method and the
            service used.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("transit-times")}>
        <p>
          After dispatch, orders generally take the following time to arrive, depending on the delivery service
          chosen at checkout:
        </p>
        <table>
          <thead>
            <tr>
              <th>Delivery zone</th>
              <th>Standard delivery (business days from dispatch)</th>
              <th>Express delivery (business days from dispatch)</th>
            </tr>
          </thead>
          <tbody>
            {DELIVERY_ZONES.map((z) => (
              <tr key={z.key}>
                <td>{z.name}</td>
                <td>{z.days.standard}</td>
                <td>{z.days.express}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ol>
          <li>
            The times above are only estimates. They can shift because of courier capacity, customs
            processing, the destination country, handling by local couriers, remote or rural delivery areas,
            public holidays, weather, transport disruption, security checks, import controls and other things
            we cannot control.
          </li>
          <li>
            Delivery can take longer to remote islands, rural, military and industrial addresses, construction
            sites, freight forwarding addresses and anywhere couriers have limited access.
          </li>
          <li>
            Solvetaworld is not responsible for delays caused by customs authorities, local postal operators or
            courier networks, by incorrect delivery information, failed delivery attempts or unpaid import
            charges, or by events outside our reasonable control.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("charges")}>
        <ol>
          <li>The delivery cost is worked out and shown at checkout, before you complete the order.</li>
          <li>We offer two delivery services, charged per order:</li>
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
            Our delivery charges and the free-delivery threshold are set in pounds sterling (GBP). If you shop
            in euros (EUR) or US dollars (USD), checkout shows the converted equivalent at the exchange rate in
            use at the time, and that converted amount is what you pay.
          </li>
          <li>
            The {formatGbp(FREE_STANDARD_MIN)} threshold is measured against the product subtotal after discounts
            have been taken off and before tax, customs duties, import VAT, brokerage fees, courier surcharges,
            special handling fees or other local charges are added.
          </li>
          <li>
            Free delivery may not be available for every destination, or for oversized, heavy or restricted
            goods, special order items, split shipments, remote delivery areas or products that need special
            handling.
          </li>
          <li>
            Our delivery rates can change over time because of carrier pricing, fuel surcharges, destination
            restrictions, logistics costs, customs requirements or operational changes.
          </li>
          <li>
            If a technical error caused the wrong delivery rate to be shown, we may contact you before dispatch
            either to correct the charge or to offer to cancel the order.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("carriers")}>
        <ol>
          <li>Orders are delivered by trusted courier and postal partners.</li>
          <li>
            Within the UK, your order may travel with Royal Mail, DHL or another suitable domestic carrier,
            depending on the size of the parcel, the destination, the type of product and operational needs.
          </li>
          <li>
            Orders going abroad generally travel with DHL international services, partner carriers, local
            couriers or other logistics providers that suit the destination.
          </li>
          <li>
            The carrier may be chosen automatically from the delivery address, the characteristics of the
            parcel, which services are available and what is most efficient to ship.
          </li>
          <li>
            We may switch carrier or delivery method where we need to in order to get the order to you safely
            and efficiently.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("address")}>
        <ol>
          <li>
            It is your job to give us, at checkout, a delivery address that is complete, accurate and can
            actually be delivered to.
          </li>
          <li>The address should contain every relevant detail, namely:</li>
        </ol>
        <ul>
          <li>the recipient&rsquo;s name, and the company name where relevant;</li>
          <li>street address, building number and any apartment or unit number;</li>
          <li>postcode, city and country;</li>
          <li>a phone number;</li>
          <li>any access instructions the courier will need.</li>
        </ul>
        <ol start={3}>
          <li>
            Solvetaworld is not responsible for delays, failed deliveries, lost parcels, return charges or extra
            costs that result from address details you supplied being incorrect, incomplete, out of date or
            wrongly formatted.
          </li>
          <li>We may not be able to change the delivery address once the order has been dispatched.</li>
          <li>
            Where a parcel comes back to us because the address was incorrect, incomplete or inaccessible, or
            because the parcel was refused or not collected, we may take the original shipping cost, the
            return shipping cost, courier and customs charges and other reasonable costs out of any refund,
            unless the law does not allow it.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("split")}>
        <ol>
          <li>
            We may send an order as several parcels or separate shipments where that is more efficient, or
            where product availability, size, weight, packaging requirements, warehouse handling or carrier
            restrictions make it necessary.
          </li>
          <li>
            A split order may come with more than one tracking number and arrive on different days.
          </li>
          <li>
            Splitting an order does not normally raise the delivery charge you pay, unless this was clearly
            stated before you completed the order.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("international")}>
        <ol>
          <li>
            Solvetaworld may take international orders for the supported delivery destinations shown on the
            Website or at checkout.
          </li>
          <li>
            Whether we can deliver abroad may depend on the destination country, available courier services,
            product restrictions, customs requirements, sanctions, export controls, payment processing rules
            and operational limits.
          </li>
          <li>
            We cannot promise delivery to every country, region, island, territory, remote location or
            restricted destination.
          </li>
          <li>
            If, after you have ordered, it turns out we cannot deliver to your destination, we may cancel the
            order and refund what you paid for the delivery that cannot be made, unless the transaction is
            under legal, fraud, sanctions or compliance review.
          </li>
          <li>
            Shipments abroad may need customs declarations, commercial invoices, product classification
            details and other export or import information.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("customs")}>
        <ol>
          <li>
            Orders delivered outside the United Kingdom may be subject to customs clearance and to import
            duties, import VAT, taxes, brokerage fees, handling charges, disbursement fees, customs clearance
            fees or other local charges.
          </li>
          <li>
            The customer pays these charges unless checkout expressly says otherwise.
          </li>
          <li>
            Customs authorities, import tax assessments, duty rates, customs inspections, couriers&rsquo;
            customs procedures and local government charges are not in Solvetaworld&rsquo;s control.
          </li>
          <li>
            Neither the product price nor the delivery price includes customs charges or import taxes, unless
            checkout expressly states that they do.
          </li>
          <li>
            Before completing delivery, the courier or the customs authority may contact you directly to
            collect duties, taxes or clearance charges.
          </li>
          <li>
            If customs charges, import taxes, courier fees or required local charges are not paid, the goods
            may be delayed, sent back, abandoned, seized or disposed of.
          </li>
          <li>
            If a parcel comes back to us because you did not pay customs charges, did not complete customs
            requirements, refused delivery or did not cooperate with the courier or customs authority, we may
            deduct shipping costs, return costs, customs charges, courier fees and other reasonable costs from
            any refund, unless the law does not allow it.
          </li>
          <li>
            It is up to you to check that the goods you order may lawfully be imported into, and used in, your
            destination country.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("electrical")}>
        <ol>
          <li>
            Some electrical goods are subject to import, safety, certification, voltage, plug, labelling or
            installation requirements that depend on the destination.
          </li>
          <li>
            You must make sure that whatever you order is suitable to be imported, installed, used, resold or
            applied professionally in your country or region.
          </li>
          <li>Check every product specification before you order, including:</li>
        </ol>
        <ul>
          <li>voltage, current and wattage;</li>
          <li>IP rating and dimensions;</li>
          <li>cable type and connector type;</li>
          <li>product code;</li>
          <li>installation environment and compliance requirements.</li>
        </ul>
        <ol start={4}>
          <li>
            We are not responsible for delays, refusal by customs, failed installation, non-compliance or
            rejection that results from rules specific to the destination or from choosing the wrong product.
          </li>
          <li>
            Where it is required or appropriate, products that need installing, wiring, connecting, testing,
            commissioning or integrating into an electrical system should be installed only by a qualified
            electrician or competent professional.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("restricted")}>
        <ol>
          <li>
            We may refuse, cancel, suspend or block an order where delivering it would or might breach
            sanctions, export controls, customs restrictions, payment processor rules, courier restrictions,
            legal requirements or our internal compliance controls.
          </li>
          <li>
            Orders, billing details, delivery addresses, customers, countries, regions and payment information
            may be screened against applicable sanctions, restricted party, fraud prevention and compliance
            requirements.
          </li>
          <li>
            We do not send goods to destinations where delivery is prohibited by applicable law, sanctions,
            carrier restrictions, payment processor restrictions or our compliance requirements.
          </li>
          <li>
            Trying to get round restricted-destination controls through a freight forwarder, a third-party or
            false address, altered billing information or misleading order details may lead to the order being
            cancelled and your access to the Website being restricted.
          </li>
          <li>
            We are not responsible for loss, delay, cancellation, blocked delivery, customs seizure or extra
            costs caused by sanctions, export controls, customs or courier restrictions, or legal compliance
            requirements.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("attempts")}>
        <h3>Attempts and missed deliveries</h3>
        <ol>
          <li>
            Depending on the destination and the courier&rsquo;s rules, the courier may try to deliver to the
            address you gave or may divert the parcel to a collection point, parcel shop, depot, locker or local
            delivery partner.
          </li>
          <li>
            Keep an eye on tracking updates and respond to courier notifications where this is required.
          </li>
          <li>
            If a delivery is missed, refused or unsuccessful, follow the courier&rsquo;s instructions to
            rearrange it or to collect the parcel within the time the courier gives.
          </li>
          <li>
            Solvetaworld is not responsible for a failed delivery where you do not respond to courier notices,
            do not collect or refuse the parcel, give an inaccessible address, or do not pay customs or local
            charges.
          </li>
          <li>
            Where the law permits, extra redelivery, storage, return or handling fees may be deducted from any
            refund or charged to you separately.
          </li>
        </ol>
        <h3>Refused deliveries</h3>
        <ol>
          <li>
            A parcel may be sent back to us if you refuse delivery without a valid reason, do not accept it or
            do not collect it from the courier.
          </li>
          <li>
            If it is sent back, we may take the original shipping cost, the return shipping cost, courier fees,
            customs charges, storage fees, handling charges and any other reasonable costs out of your refund,
            unless the law does not allow it.
          </li>
          <li>
            If you are a Consumer and refuse delivery as a way of exercising your legal cancellation rights,
            your refund is dealt with under our Returns and Refunds Policy and applicable law.
          </li>
          <li>
            Customs charges, courier charges or local fees that have already been assessed are not
            automatically cancelled because delivery was refused.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("third-party")}>
        <ol>
          <li>
            If you have your order sent to a freight forwarder, parcel forwarding service, hotel, workplace,
            construction site, third-party address or collection point, delivery is complete once the carrier
            hands the parcel over at that address or to the authorised recipient.
          </li>
          <li>
            Once the parcel has reached a third party, forwarding service, collection point or authorised
            recipient chosen by you, Solvetaworld is not responsible for any later loss, damage, delay, customs
            issue, onward shipping problem or failed delivery.
          </li>
          <li>
            You must make sure that the third party is authorised to accept the parcel and is able to handle it
            safely.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("damage")}>
        <ol>
          <li>Where you can, check the parcel when it is delivered.</li>
          <li>
            If the parcel looks damaged, opened, wet, crushed, tampered with or incomplete, photograph it before
            you open it and hold on to all of the packaging.
          </li>
          <li>
            If the goods arrive damaged, missing, incomplete or incorrect, email us at{" "}
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> as soon as you can.
          </li>
          <li>Your message should contain:</li>
        </ol>
        <ul>
          <li>your order number;</li>
          <li>a description of the problem;</li>
          <li>
            clear photos or videos of the product, the packaging, the shipping label and any visible damage.
          </li>
        </ul>
        <ol start={5}>
          <li>
            Where possible, let us know about visible delivery damage within 48 hours of delivery. This lets us
            pursue courier claims quickly; it does not take away any mandatory legal rights you may have.
          </li>
          <li>
            Keep the goods, packaging, labels, accessories, manuals and delivery materials until we have looked
            into the problem.
          </li>
          <li>
            Before we approve a replacement, refund or other remedy, we may need the damaged or incorrect goods
            to be returned or inspected.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("lost")}>
        <ol>
          <li>
            If your parcel has not turned up within the estimated delivery time, start by checking the tracking
            information and any notifications from the courier.
          </li>
          <li>
            If tracking shows an unusual delay, a failed delivery, a customs hold or no movement for a long
            period, email us at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
          </li>
          <li>We may have to open an investigation with the courier before a parcel can be confirmed as lost.</li>
          <li>
            Courier investigations can take a while, particularly for international shipments, customs delays,
            remote destinations or parcels that pass through several delivery partners.
          </li>
          <li>
            We will take reasonable steps to help you, but we are not responsible for delays caused by customs
            processing, courier investigations, local delivery partners, incorrect address details, unpaid
            import charges or events outside our control.
          </li>
          <li>
            Where the courier confirms a parcel as lost and the loss was not the customer&rsquo;s error, we may
            offer a replacement, a refund or another appropriate remedy.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("trade")}>
        <ol>
          <li>
            Business Customers, trade customers, contractors, installers and professional buyers must satisfy
            themselves that delivery dates, product availability, import requirements and installation
            schedules suit their projects.
          </li>
          <li>Do not treat a delivery estimate as a guaranteed project deadline.</li>
          <li>
            Except where liability cannot lawfully be excluded, Solvetaworld is not responsible for labour,
            electrician, contractor or installation costs, project delay, missed appointments, downtime, loss of
            profit, loss of contract or other indirect losses arising from a delivery delay, customs delay,
            courier issue or product unavailability.
          </li>
          <li>
            Business Customers should not book installation, labour or site work, or set project deadlines,
            until the goods have arrived, been inspected and been confirmed as correct and suitable.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("force-majeure")}>
        <ol>
          <li>
            We are not responsible where delivery fails or is delayed because of events outside our reasonable
            control.
          </li>
          <li>Such events can include:</li>
        </ol>
        <ul>
          <li>severe weather and natural disasters;</li>
          <li>transport disruption, carrier failure and customs delay;</li>
          <li>strikes, labour disputes and public holidays;</li>
          <li>government action, regulatory changes and sanctions;</li>
          <li>war, civil unrest, epidemic and pandemic;</li>
          <li>power failure, technical failure and security checks;</li>
          <li>supply chain disruption and other force majeure events.</li>
        </ul>
        <ol start={3}>
          <li>
            If such an event affects your order, we will take reasonable steps to keep the disruption to a
            minimum and will update you where appropriate.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("revisions")}>
        <ol>
          <li>
            We may revise this document from time to time to reflect changes to our delivery methods, courier
            partners, delivery regions, shipping rates, customs processes, operational practices or legal
            requirements.
          </li>
          <li>
            Your order is governed by the version that was in force when you placed it, unless a change is
            required by law or is a correction that has to be applied.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("contact")}>
        <p>
          For anything about delivery &mdash; order status, customs, damaged parcels, missed deliveries or any
          other delivery matter &mdash; get in touch:
        </p>
        <ContactBlock />
      </PolicySection>
    </PolicyLayout>
  );
}

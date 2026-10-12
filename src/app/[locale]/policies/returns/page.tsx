import {
  PolicyLayout,
  PolicySection,
  ContactBlock,
} from "@/components/layout/PolicyLayout/PolicyLayout";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "Returns, Refunds & Cancellations" };

const TOC = [
  { id: "about", title: "About this document" },
  { id: "definitions", title: "Consumers and Business Customers" },
  { id: "before-dispatch", title: "Stopping an order before it ships" },
  { id: "cancel-14-days", title: "The Consumer 14-day cancellation right" },
  { id: "procedure", title: "How to start a return" },
  { id: "condition", title: "Condition of goods sent back" },
  { id: "restricted", title: "Items that cannot be returned for change of mind" },
  { id: "electrical", title: "Electrical goods and installation" },
  { id: "faulty", title: "Faulty, damaged or wrong goods" },
  { id: "return-postage", title: "Who pays for return postage" },
  { id: "unauthorised", title: "Returns sent without contacting us" },
  { id: "refund-timing", title: "When and how refunds are paid" },
  { id: "delivery-charges", title: "Delivery charges on refunds" },
  { id: "international", title: "Returning goods from outside the UK" },
  { id: "address", title: "Wrong or incomplete addresses" },
  { id: "refused", title: "Refused or uncollected parcels" },
  { id: "business", title: "Returns by Business Customers" },
  { id: "exchanges", title: "Exchanges and replacements" },
  { id: "warranty", title: "Warranty claims and Additional Warranty" },
  { id: "chargebacks", title: "Chargebacks and payment disputes" },
  { id: "legal-rights", title: "Your statutory rights" },
  { id: "revisions", title: "Revisions to this document" },
  { id: "contact", title: "Returns queries" },
] as const;

type SectionId = (typeof TOC)[number]["id"];

function sec(id: SectionId) {
  const i = TOC.findIndex((s) => s.id === id);
  return { id, number: i + 1, title: TOC[i].title };
}

const KEY_FACTS = [
  { label: "Consumer cancellation window", value: "14 days from the day you receive the goods (the final parcel, for split orders)" },
  { label: "Sending goods back", value: "No later than 14 days after you tell us you are cancelling" },
  { label: "Change-of-mind postage", value: "Paid by the customer unless we agree otherwise in writing" },
  { label: "Faulty, damaged or wrong goods", value: "Reasonable return postage covered by Solvetaworld" },
  { label: "Visible transit damage", value: "Report within 48 hours of delivery where possible" },
  { label: "Refunds paid to", value: "The original payment method, where possible" },
];

const dlCls = "my-4 grid grid-cols-1 sm:grid-cols-[11rem_1fr] border-2 border-line-strong text-sm";
const dtCls = "px-3 py-2 bg-surface-1 font-display uppercase tracking-wide text-ink border-b border-line sm:border-r";
const ddCls = "m-0 px-3 py-2 border-b border-line";

const stepCls = "!my-4 !list-none !p-0 border-2 border-line-strong";
const stepItemCls = "!mb-0 flex border-b border-line last:border-b-0";
const stepNoCls =
  "flex items-start justify-center shrink-0 w-10 py-2 bg-hivis text-coal font-display font-extrabold tabular-nums border-r-2 border-line-strong";
const stepBodyCls = "px-3 py-2";

function Mail() {
  return <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>;
}

export default function ReturnsPolicyPage() {
  return (
    <PolicyLayout
      title="Returns, Refunds & Cancellations"
      docRef="SW-03"
      lastUpdated="29 May 2026"
      toc={[...TOC]}
      keyFacts={KEY_FACTS}
    >
      <PolicySection {...sec("about")}>
        <p>
          This document explains what happens when an order bought on www.solvetaworld.com is cancelled or
          returned, how refunds work, and how we deal with goods that are damaged, faulty or incorrect, and
          with items whose return is restricted.
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
          Read it together with our Terms and Conditions, Shipping Policy, Privacy Policy and Cookie Policy,
          and with any warranty or additional warranty terms that apply to a particular product.
        </p>
        <p>
          <strong>
            None of this document restricts mandatory legal rights you may hold under applicable consumer
            protection law.
          </strong>
        </p>
        <h3>What this document covers</h3>
        <ol>
          <li>It governs physical goods bought through Solvetaworld.</li>
          <li>
            Our range covers hand and power tools, hardware and ironmongery, fixings and fasteners, garden
            machinery, cable and test equipment, and other workshop supplies.
          </li>
          <li>
            Electrical products can be safety-critical, so whether an item can come back depends on what type
            of product it is, its condition and packaging, whether it has been installed or used, and whether
            the buyer was a Consumer or a Business Customer.
          </li>
          <li>
            Consumers and Business Customers are both covered, but certain rights belong to Consumers only.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("definitions")}>
        <dl className={dlCls}>
          <dt className={dtCls}>Consumer</dt>
          <dd className={ddCls}>
            An individual buying goods wholly or mainly for personal use, not for trade, business, craft or
            professional purposes.
          </dd>
          <dt className={dtCls}>Business Customer</dt>
          <dd className={ddCls}>
            Any company, sole trader, contractor, electrician, installer, reseller, organisation, public body or
            professional buyer purchasing goods for trade, commercial, installation, resale, professional or
            business purposes.
          </dd>
        </dl>
        <ol>
          <li>Only Consumers have consumer cancellation rights.</li>
          <li>
            Unless we agree otherwise in writing, a Business Customer has no general right to send back goods
            that are not faulty because of a change of mind, an ordering error, surplus stock, a change to the
            project, an unsuitable specification or any other mistake on the customer&rsquo;s side.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("before-dispatch")}>
        <ol>
          <li>You can ask us to cancel an order up until it is dispatched.</li>
          <li>
            Email us at <Mail /> as soon as you can, quoting your order number.
          </li>
          <li>
            We will make reasonable efforts to stop the order before it ships, but we cannot guarantee
            cancellation once the order has been processed, packed, handed to the carrier, specially ordered,
            prepared, cut, customised or dispatched.
          </li>
          <li>
            Where we confirm the cancellation before dispatch, we refund what you paid for the cancelled goods
            together with any delivery charge you paid for that order.
          </li>
          <li>
            A dispatched order can no longer be cancelled before it is delivered; a Consumer return may still be
            possible under this document.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("cancel-14-days")}>
        <ol>
          <li>
            As a Consumer, you may have a legal right to cancel an eligible online purchase within 14 days of
            receiving the goods, with no need to give a reason.
          </li>
          <li>
            That period ends 14 days after the day on which the goods reach you or a person you have named.
          </li>
          <li>
            For an order delivered in several parcels, the period will usually end 14 days after the day the
            last parcel reaches you.
          </li>
          <li>
            To cancel, you must tell us clearly by email at <Mail /> before the period runs out.
          </li>
          <li>Your email should give:</li>
        </ol>
        <ul>
          <li>your full name;</li>
          <li>the order number;</li>
          <li>the delivery address;</li>
          <li>the product name or SKU;</li>
          <li>confirmation that you want to cancel or return that item.</li>
        </ul>
        <ol start={6}>
          <li>
            Once you have told us you are cancelling, you must send the goods back without undue delay and no
            later than 14 days after the date you told us.
          </li>
          <li>
            The cost of sending goods back is yours, unless they are faulty, damaged or incorrect, or we have
            agreed otherwise in writing.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("procedure")}>
        <p>Do not send goods back before you have contacted us. The process runs as follows:</p>
        <ol className={stepCls}>
          <li className={stepItemCls}>
            <span className={stepNoCls}>01</span>
            <div className={stepBodyCls}>
              Email <Mail /> to start the return, with:
              <ul>
                <li>the order number;</li>
                <li>the product name or SKU;</li>
                <li>why you are returning it;</li>
                <li>photos or videos if the item is damaged, faulty, incorrect or incomplete;</li>
                <li>whether the product has been opened, installed, connected, tested or used.</li>
              </ul>
            </div>
          </li>
          <li className={stepItemCls}>
            <span className={stepNoCls}>02</span>
            <div className={stepBodyCls}>
              If we accept the return, or need to inspect the item, we send you return instructions. The
              return address or method can vary with the product, supplier, courier, destination or nature of
              the problem.
            </div>
          </li>
          <li className={stepItemCls}>
            <span className={stepNoCls}>03</span>
            <div className={stepBodyCls}>
              Pack the goods securely so they are not damaged in transit. Where the law allows, we may reduce
              or refuse the refund if returned goods are damaged in transit because of poor packaging.
            </div>
          </li>
        </ol>
        <p>
          Goods that arrive without prior contact, without the information we need, or at the wrong address
          may be delayed, rejected or sent back to you.
        </p>
      </PolicySection>

      <PolicySection {...sec("condition")}>
        <ol>
          <li>Treat goods you are returning with reasonable care.</li>
          <li>Unless they are faulty, damaged or incorrect, returned goods must be:</li>
        </ol>
        <ul>
          <li>unused;</li>
          <li>uninstalled;</li>
          <li>unwired and unconnected;</li>
          <li>not tested, commissioned or integrated into any electrical system;</li>
          <li>complete with every part, accessory, manual, label, seal and piece of protective material;</li>
          <li>in their original packaging where possible;</li>
          <li>in a condition that allows them to be resold.</li>
        </ul>
        <ol start={3}>
          <li>
            You may examine the goods as you would reasonably be allowed to in a shop. Do not install, wire,
            connect, use, modify or damage them, or handle them beyond what you need to establish their nature,
            characteristics and functioning.
          </li>
          <li>
            We may cut your refund to reflect any loss in value caused by handling beyond what was necessary
            &mdash; for example installation, use, missing packaging or accessories, damage, contamination or a
            lower resale value.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("restricted")}>
        <ol>
          <li>
            Some goods cannot come back for change of mind unless they are faulty, damaged or incorrect, or the
            law requires a right of return.
          </li>
          <li>Goods that may be non-returnable, or returnable only on restricted terms, include:</li>
        </ol>
        <ul>
          <li>goods made to order;</li>
          <li>goods specially ordered for you;</li>
          <li>goods cut to size, such as cables or similar materials;</li>
          <li>goods that have been customised, modified, assembled or altered;</li>
          <li>electrical goods that have been installed, wired, connected, tested, commissioned or used;</li>
          <li>goods damaged after delivery;</li>
          <li>goods missing parts, accessories, manuals, packaging, labels, seals or protective materials;</li>
          <li>
            goods affected by incorrect storage, moisture, heat, impact, contamination, dust, chemicals,
            corrosion, misuse or unauthorised handling;
          </li>
          <li>goods no longer in a resaleable condition;</li>
          <li>
            clearance, final sale, discontinued or special order items, where the return restrictions are
            clearly stated and lawful.
          </li>
        </ul>
        <ol start={3}>
          <li>
            Nothing in this section restricts your legal rights where goods are faulty, not as described,
            unsafe or otherwise fail to comply with applicable law.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("electrical")}>
        <ol>
          <li>
            Electrical goods can be unsafe if they are selected, installed, wired, connected, modified,
            overloaded or used incorrectly.
          </li>
          <li>
            Before you buy, it is up to you to confirm the product suits what you intend to do with it,
            including its voltage, current, load, wattage, IP rating, dimensions, cable type, compatibility,
            installation environment and local regulatory requirements.
          </li>
          <li>
            Where it is required or appropriate, products that need electrical installation, wiring, connecting,
            testing, commissioning or integrating into an electrical system should be installed only by a
            qualified electrician or competent professional.
          </li>
          <li>
            Goods that have been installed, wired, connected, modified, commissioned or used may not qualify for
            return unless they are faulty or incorrect, or mandatory legal rights otherwise cover them.
          </li>
          <li>
            We may refuse or reduce a refund where the product comes back in a condition that rules out safe
            resale or a proper inspection.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("faulty")}>
        <ol>
          <li>
            If goods arrive faulty, damaged, incomplete or incorrect, email us at <Mail /> as soon as you can.
          </li>
          <li>Please send:</li>
        </ol>
        <ul>
          <li>your order number;</li>
          <li>a clear description of the problem;</li>
          <li>photos or videos of the goods;</li>
          <li>photos of the packaging and the shipping label;</li>
          <li>any relevant product labels, serial numbers or manufacturer markings.</li>
        </ul>
        <ol start={3}>
          <li>
            Where possible, report visible delivery damage within 48 hours of delivery. This lets us pursue
            courier claims quickly; it does not take away any mandatory legal rights you may have.
          </li>
          <li>
            Keep the product, packaging, labels, manuals, accessories and delivery materials until we have
            looked into the problem.
          </li>
          <li>
            Before we approve a refund, replacement, repair or other remedy, we may need the goods to be
            returned or inspected.
          </li>
          <li>
            Where the goods are confirmed as faulty, damaged before delivery, incorrect or otherwise not in
            conformity with the contract, we may repair or replace them, give a refund or partial refund, or
            provide another remedy in line with applicable law.
          </li>
          <li>
            Where goods are confirmed as faulty, damaged or incorrect, we will pay reasonable return shipping
            costs or give you return instructions.
          </li>
          <li>We are not responsible for faults or damage resulting from:</li>
        </ol>
        <ul>
          <li>incorrect installation or unsuitable product selection;</li>
          <li>misuse, overloading or unauthorised modification;</li>
          <li>external damage, incorrect storage or an unsuitable environment;</li>
          <li>work by third parties or power surges;</li>
          <li>wear and tear;</li>
          <li>
            not following the manufacturer&rsquo;s instructions, or use outside the product&rsquo;s intended
            purpose.
          </li>
        </ul>
      </PolicySection>

      <PolicySection {...sec("return-postage")}>
        <table>
          <thead>
            <tr>
              <th>Type of return</th>
              <th>Who pays return shipping</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Change of mind</td>
              <td>The customer, unless we agree otherwise in writing</td>
            </tr>
            <tr>
              <td>Faulty, damaged or incorrect goods</td>
              <td>
                Solvetaworld covers reasonable return shipping costs where the issue is confirmed or where we
                give return instructions
              </td>
            </tr>
          </tbody>
        </table>
        <ol>
          <li>Contact us before you send anything back.</li>
          <li>
            If you use a premium, express, oversized, international or non-approved return method without our
            agreement in advance, we may not be able to refund the return shipping cost.
          </li>
          <li>
            We recommend a tracked and insured return service. The returned goods remain your responsibility
            until they reach us or the return location we nominate.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("unauthorised")}>
        <ol>
          <li>Contact us before returning any goods.</li>
          <li>
            Goods sent back without contacting us first, or without following our return instructions, may be
            delayed, rejected or sent back to you.
          </li>
          <li>
            We are not responsible for goods sent to the wrong address or sent back without enough tracking,
            identification or order information.
          </li>
          <li>
            If we cannot match a returned item to an order or a customer, we may be unable to process the
            return.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("refund-timing")}>
        <ol>
          <li>
            When the returned goods have arrived and been inspected, we will let you know whether the refund is
            approved.
          </li>
          <li>An approved refund goes back to the original payment method where possible.</li>
          <li>
            For Consumer cancellation returns, we pay any refund due within the time limit set by applicable
            law.
          </li>
          <li>
            Where the law allows, we may hold back the refund until we have the goods back or until you show us
            evidence that you have sent them, whichever happens first.
          </li>
          <li>
            Once we have processed a refund, your bank, card issuer or payment provider may take extra time to
            make the money available to you.
          </li>
          <li>We cannot normally refund to a different card, account, person or payment method.</li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("delivery-charges")}>
        <ol>
          <li>
            When a Consumer validly cancels an eligible order under statutory cancellation rights, we refund the
            price of the product and the standard basic delivery charge paid for the original delivery, where
            the law requires it.
          </li>
          <li>
            We do not have to refund the extra cost if you chose a delivery method more expensive than the
            cheapest standard delivery option we offered.
          </li>
          <li>
            Unless we agree otherwise or applicable law requires it, delivery charges may not be refunded for:
          </li>
        </ol>
        <ul>
          <li>returns by Business Customers;</li>
          <li>discretionary returns;</li>
          <li>failed or refused deliveries;</li>
          <li>an incorrect address;</li>
          <li>parcels that were not collected;</li>
          <li>returns of goods that are not faulty.</li>
        </ul>
        <ol start={4}>
          <li>
            Customs duties, import VAT, brokerage fees, courier handling fees, local taxes, customs clearance
            fees and other local charges are not charged by Solvetaworld, and Solvetaworld does not refund them.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("international")}>
        <ol>
          <li>
            Customers outside the UK must make sure returned goods are properly packed, labelled, declared and
            sent in line with the applicable courier and customs requirements.
          </li>
          <li>Any customs declarations needed for the return are your responsibility.</li>
          <li>
            We may be unable to process a refund if a return is delayed, rejected, seized, abandoned or sent
            back because of incorrect customs documents, unpaid charges, prohibited goods or a failure to follow
            our return instructions.
          </li>
          <li>
            For international change-of-mind returns, you pay the return shipping, customs charges, taxes,
            brokerage fees and related costs, unless the goods are faulty, damaged or incorrect, or we agree
            otherwise in writing.
          </li>
          <li>
            Where Solvetaworld incurs customs or courier charges because of an international return, the law
            permitting, these may be taken out of any refund.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("address")}>
        <ol>
          <li>
            You must give complete and accurate billing and delivery details at checkout.
          </li>
          <li>
            Solvetaworld is not responsible for delays, failed deliveries, lost parcels, return charges or extra
            costs that result from address details you supplied being incorrect, incomplete, out of date or
            wrongly formatted.
          </li>
          <li>
            Where an order comes back to us because the address was incorrect, incomplete or inaccessible, or
            because it was refused or not collected, we may deduct the original shipping costs, return shipping
            costs, courier charges, customs charges, storage fees and other reasonable costs from any refund,
            unless the law does not allow it.
          </li>
          <li>
            If you ask us to send the order again after a delivery failed through customer error, extra shipping
            charges may apply.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("refused")}>
        <ol>
          <li>
            If you refuse or do not accept delivery, do not pay customs or import charges, or do not collect the
            parcel from the courier in the time required, the courier may send it back to us, hold it up,
            abandon it or dispose of it.
          </li>
          <li>
            If it comes back to us, we may deduct the original shipping cost, the return shipping cost, courier
            charges, customs charges, storage fees, handling charges and any other reasonable costs from your
            refund, unless the law does not allow it.
          </li>
          <li>
            Customs charges, courier fees or local charges that have already been assessed are not
            automatically cancelled because delivery was refused.
          </li>
          <li>
            If you are a Consumer and refuse delivery as a way of exercising your legal cancellation rights, your
            refund is dealt with under this document and applicable law.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("business")}>
        <ol>
          <li>
            Business Customers have no general right to cancel or send back goods that are not faulty because
            of a change of mind, a change to the customer&rsquo;s project, an ordering error, surplus stock, an
            unsuitable specification or because the goods are no longer needed.
          </li>
          <li>
            Whether to accept a non-faulty return from a Business Customer is for Solvetaworld to decide.
          </li>
          <li>If we do accept such a return, we may attach conditions, for example:</li>
        </ol>
        <ul>
          <li>written approval in advance;</li>
          <li>return within a set period;</li>
          <li>goods that are unused, uninstalled, complete and resaleable;</li>
          <li>original packaging and accessories included;</li>
          <li>return shipping paid by the customer;</li>
          <li>a deduction for reduced value;</li>
          <li>a restocking or handling fee, where reasonable and agreed or permitted.</li>
        </ul>
        <ol start={4}>
          <li>
            Business Customers must check goods promptly on delivery and tell us about visible damage, shortages,
            incorrect goods or delivery problems as soon as reasonably possible.
          </li>
          <li>
            Where approved, a Business Customer may receive a refund, a replacement, account credit or another
            remedy agreed by Solvetaworld.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("exchanges")}>
        <ol>
          <li>
            We may offer a replacement or exchange where goods are faulty, damaged or incorrect, or where we
            choose to agree to an exchange.
          </li>
          <li>Any exchange depends on stock being available.</li>
          <li>
            If no replacement is available, we may offer a refund, a partial refund, an equivalent alternative
            or another appropriate remedy.
          </li>
          <li>
            If you exchange because you changed your mind, you may have to pay for return shipping and any extra
            delivery costs.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("warranty")}>
        <ol>
          <li>
            This document deals with returns, refunds and cancellations. Warranty claims may in addition be
            governed by our warranty terms, product-specific terms, the manufacturer&rsquo;s warranty conditions
            and any paid Additional Warranty bought at checkout.
          </li>
          <li>Additional Warranty does not take the place of, or reduce, your statutory rights.</li>
          <li>
            For a warranty claim we may need proof of purchase, photos, videos or diagnostic information, or to
            inspect the product or have it returned.
          </li>
          <li>Unless expressly stated otherwise, warranty cover does not normally extend to:</li>
        </ol>
        <ul>
          <li>incorrect installation, misuse, overloading or unauthorised modification;</li>
          <li>power surges, external damage or an unsuitable environment;</li>
          <li>wear and tear or consumable parts;</li>
          <li>labour, electrician, removal or reinstallation costs;</li>
          <li>project delays.</li>
        </ul>
        <ol start={5}>
          <li>
            When a warranty claim is approved, the remedy &mdash; depending on the circumstances and applicable
            law &mdash; may be a repair, a replacement or equivalent replacement, a partial or full refund, or
            another reasonable remedy.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("chargebacks")}>
        <ol>
          <li>
            If something is wrong with an order, delivery, return, refund or warranty claim, please come to us
            first so that we can look into it and try to put it right.
          </li>
          <li>
            If you raise a chargeback or payment dispute, we may have to share information about the order,
            delivery, communications, return, tracking, refund and fraud prevention with our payment provider,
            bank, card network or dispute resolution provider.
          </li>
          <li>
            We reserve the right to contest a chargeback or payment dispute where we believe the order was
            fulfilled correctly or the claim is inaccurate, fraudulent, abusive or unsupported.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("legal-rights")}>
        <ol>
          <li>Your mandatory legal rights are not limited by anything in this document.</li>
          <li>
            Consumers may have statutory rights where goods are faulty, not as described, not fit for purpose,
            unsafe or not in conformity with the contract.
          </li>
          <li>Consumers in the EU may have legal guarantee rights under applicable consumer law.</li>
          <li>Consumers in the UK may have rights under applicable UK consumer law.</li>
          <li>
            These rights stand apart from any manufacturer warranty, commercial warranty, additional warranty
            or voluntary return policy.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("revisions")}>
        <ol>
          <li>
            We may revise this document from time to time to reflect changes to our products, operations,
            courier processes, legal requirements, payment provider requirements, warranty processes or
            customer support procedures.
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
          For questions about cancelling an order, sending something back, refunds, damaged, faulty or
          incorrect goods, or warranty claims, get in touch:
        </p>
        <ContactBlock />
      </PolicySection>
    </PolicyLayout>
  );
}

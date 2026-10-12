import {
  PolicyLayout,
  PolicySection,
  ContactBlock,
} from "@/components/layout/PolicyLayout/PolicyLayout";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "Guarantee & Warranty" };

const TOC = [
  { id: "about", title: "About this document" },
  { id: "layers", title: "How the layers of protection fit together" },
  { id: "uk", title: "Consumers in the UK" },
  { id: "eu", title: "Consumers in the EU: legal guarantee" },
  { id: "manufacturer", title: "Manufacturer warranties" },
  { id: "additional", title: "Additional Warranty: options and prices" },
  { id: "start", title: "When Additional Warranty runs" },
  { id: "covered", title: "What Additional Warranty covers" },
  { id: "excluded", title: "What is not covered" },
  { id: "installation", title: "Electrical installation responsibility" },
  { id: "instructions", title: "Manufacturer instructions and documentation" },
  { id: "claim", title: "Making a claim" },
  { id: "inspection", title: "Inspection and assessment" },
  { id: "postage", title: "Sending products in for a claim" },
  { id: "replacements", title: "Replacement and repaired products" },
  { id: "refunds", title: "Refunds under warranty" },
  { id: "aw-cancel", title: "Cancelling or refunding Additional Warranty" },
  { id: "business", title: "Business Customers" },
  { id: "returns-link", title: "How this sits with returns" },
  { id: "revisions", title: "Revisions to this document" },
  { id: "contact", title: "Warranty queries" },
] as const;

type SectionId = (typeof TOC)[number]["id"];

function sec(id: SectionId) {
  const i = TOC.findIndex((s) => s.id === id);
  return { id, number: i + 1, title: TOC[i].title };
}

const AW_OPTIONS = [
  { term: "+1 Year Additional Warranty", rate: "10% of the product price", min: "€6.99 / £6.99 / $6.99" },
  { term: "+2 Year Additional Warranty", rate: "16% of the product price", min: "€9.99 / £9.99 / $9.99" },
  { term: "+3 Year Additional Warranty", rate: "22% of the product price", min: "€12.99 / £12.99 / $12.99" },
];

const KEY_FACTS = [
  { label: "EU Consumer legal guarantee", value: "Minimum 2 years under applicable EU consumer law" },
  { label: "Additional Warranty terms", value: "+1, +2 or +3 years — optional, chosen at checkout where offered" },
  { label: "+1 year", value: "10% of product price, minimum €6.99 / £6.99 / $6.99" },
  { label: "+2 years", value: "16% of product price, minimum €9.99 / £9.99 / $9.99" },
  { label: "+3 years", value: "22% of product price, minimum €12.99 / £12.99 / $12.99" },
  { label: "Additional Warranty begins", value: "When the applicable original warranty or legal guarantee period ends" },
];

const dlCls = "my-4 grid grid-cols-1 sm:grid-cols-[11rem_1fr] border-2 border-line-strong text-sm";
const dtCls = "px-3 py-2 bg-surface-1 font-display uppercase tracking-wide text-ink border-b border-line sm:border-r";
const ddCls = "m-0 px-3 py-2 border-b border-line";

const stepCls = "!my-4 !list-none !p-0 border-2 border-line-strong";
const stepItemCls = "!mb-0 flex border-b border-line last:border-b-0";
const stepNoCls =
  "flex items-start justify-center shrink-0 w-10 py-2 bg-hivis text-coal font-display font-extrabold tabular-nums border-r-2 border-line-strong";
const stepBodyCls = "px-3 py-2";

export default function WarrantyPolicyPage() {
  return (
    <PolicyLayout
      title="Guarantee & Warranty"
      docRef="SW-04"
      lastUpdated="29 May 2026"
      toc={[...TOC]}
      keyFacts={KEY_FACTS}
    >
      <PolicySection {...sec("about")}>
        <p>
          This document explains how your statutory rights, legal guarantees, manufacturer warranties and the
          optional paid Additional Warranty work for products bought on www.solvetaworld.com.
        </p>
        <p>The Website is run by the company below:</p>
        <ContactBlock />
        <dl className={dlCls}>
          <dt className={dtCls}>&ldquo;Solvetaworld&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;</dt>
          <dd className={ddCls}>{COMPANY.name}.</dd>
          <dt className={dtCls}>&ldquo;Customer&rdquo;, &ldquo;you&rdquo;, &ldquo;your&rdquo;</dt>
          <dd className={ddCls}>Any individual or business buying goods through the Website.</dd>
        </dl>
        <p>
          Read it together with our Terms and Conditions, Shipping Policy, Returns, Refunds and Cancellation
          Policy, Payment Policy and Privacy Policy, and with any warranty information specific to a product.
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
            Electrical goods can be safety-critical, so whether a claim qualifies may turn on the product having
            been correctly selected and installed, properly used, used in line with the manufacturer&rsquo;s
            instructions and operated in suitable conditions.
          </li>
          <li>
            Consumers and Business Customers are both covered, but certain statutory rights belong to Consumers
            only.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("layers")}>
        <table>
          <thead>
            <tr>
              <th>Protection</th>
              <th>Where it comes from</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Statutory rights</td>
              <td>Applicable consumer law</td>
            </tr>
            <tr>
              <td>Legal guarantee (EU Consumers)</td>
              <td>Applicable EU consumer law</td>
            </tr>
            <tr>
              <td>Manufacturer warranty</td>
              <td>The manufacturer, on its own terms</td>
            </tr>
            <tr>
              <td>Additional Warranty</td>
              <td>Optional paid commercial warranty from Solvetaworld, chosen at checkout</td>
            </tr>
          </tbody>
        </table>
        <ol>
          <li>Your statutory rights are the rights given to you by applicable consumer law.</li>
          <li>
            They may come into play where goods are faulty, not as described, not fit for purpose, unsafe or not
            in conformity with the contract.
          </li>
          <li>
            They are separate from any manufacturer warranty, commercial warranty, paid Additional Warranty or
            voluntary warranty service.
          </li>
          <li>
            This document does not exclude, restrict or reduce any mandatory statutory rights that apply to you.
          </li>
          <li>
            A manufacturer warranty or Additional Warranty can add extra protection, but your legal rights stay
            in place alongside it.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("uk")}>
        <ol>
          <li>
            As a UK Consumer, you may have statutory rights under applicable UK consumer protection law where
            goods are faulty, not as described, not fit for purpose or otherwise fall short of the required
            standards.
          </li>
          <li>
            Depending on the circumstances, timing, condition of the product and applicable law, those rights
            may lead to a repair, replacement, refund or price reduction.
          </li>
          <li>Rights that cannot lawfully be excluded are not limited by this document.</li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("eu")}>
        <ol>
          <li>
            As an EU Consumer, you may have a legal guarantee of at least 2 years under applicable EU consumer
            law.
          </li>
          <li>
            The legal guarantee may apply where goods are not in conformity with the contract, are defective,
            are not as described, are not fit for purpose or otherwise do not meet applicable conformity
            requirements.
          </li>
          <li>
            It is given by law and is separate from any paid Additional Warranty, manufacturer warranty or
            commercial warranty.
          </li>
          <li>
            Its availability, the procedure, the burden of proof, the remedies and the limitation periods can
            depend on the law of the country you live in and on the circumstances of the claim.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("manufacturer")}>
        <ol>
          <li>Some products are sold with a manufacturer warranty.</li>
          <li>Its terms are set by the manufacturer, not by Solvetaworld.</li>
          <li>
            The terms can differ by product, brand, country, product type, installation requirements and
            conditions of use.
          </li>
          <li>A manufacturer warranty may require:</li>
        </ol>
        <ul>
          <li>proof of purchase;</li>
          <li>the product serial number;</li>
          <li>evidence of installation;</li>
          <li>documentation of professional installation;</li>
          <li>correct use;</li>
          <li>compliance with the manufacturer&rsquo;s instructions;</li>
          <li>registration with the manufacturer;</li>
          <li>return or inspection of the product.</li>
        </ul>
        <ol start={5}>
          <li>
            Where reasonable, Solvetaworld may help with a manufacturer warranty claim, but the
            manufacturer&rsquo;s decisions, warranty processing times, inspection results, replacement
            availability and repair procedures are outside our control.
          </li>
          <li>
            Where the manufacturer&rsquo;s warranty terms differ from this document, those terms may govern the
            manufacturer warranty claim.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("additional")}>
        <ol>
          <li>For selected products, Solvetaworld may offer paid Additional Warranty options.</li>
          <li>Additional Warranty is optional, and where offered it can be chosen at checkout.</li>
          <li>It is commercial warranty protection that sits on top of your statutory rights.</li>
          <li>
            It does not replace, reduce or limit your statutory rights or any legal guarantee that may apply.
          </li>
          <li>
            Unless the product page or checkout says otherwise, the price of Additional Warranty is worked out
            as follows:
          </li>
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
        <ol start={6}>
          <li>
            The price is based on the product price before delivery charges, customs duties, import VAT,
            brokerage fees, local taxes or other destination charges.
          </li>
          <li>
            Whether Additional Warranty is offered can depend on the product, category, destination, order type
            or checkout configuration.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("start")}>
        <ol>
          <li>
            Unless checkout or product-specific warranty terms say otherwise, paid Additional Warranty starts
            once the standard warranty, manufacturer warranty, statutory warranty period or legal guarantee
            period that applies to the product has expired.
          </li>
          <li>
            Where more than one warranty or legal guarantee may apply, Additional Warranty is meant to give
            extra protection once the original applicable warranty period is over &mdash; not to shorten it or
            take its place.
          </li>
          <li>It lasts only for the term chosen at checkout:</li>
        </ol>
        <ul>
          <li>+1 year;</li>
          <li>+2 years;</li>
          <li>+3 years.</li>
        </ul>
        <ol start={4}>
          <li>Additional Warranty is tied to the product and to the original order.</li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("covered")}>
        <ol>
          <li>
            Subject to this document and any product-specific terms, Additional Warranty covers eligible
            manufacturing and material defects that appear during normal use.
          </li>
          <li>Cover applies only if the product has been:</li>
        </ol>
        <ul>
          <li>correctly chosen for its intended purpose;</li>
          <li>correctly installed, where installation is needed;</li>
          <li>used as the manufacturer instructs;</li>
          <li>run within its rated specifications;</li>
          <li>kept in suitable storage conditions;</li>
          <li>maintained where maintenance is required;</li>
          <li>kept free of misuse, overloading, modification and damage.</li>
        </ul>
        <ol start={3}>
          <li>When a valid Additional Warranty claim is approved, we may provide one or more of:</li>
        </ol>
        <ul>
          <li>repair;</li>
          <li>replacement;</li>
          <li>equivalent replacement;</li>
          <li>partial refund;</li>
          <li>refund;</li>
          <li>store credit, where agreed;</li>
          <li>another reasonable remedy.</li>
        </ul>
        <ol start={4}>
          <li>
            Which remedy applies depends on the type of product, the defect, whether replacement parts are
            available, the position of the manufacturer or supplier, the inspection results, the age of the
            product and applicable law.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("excluded")}>
        <ol>
          <li>
            Unless expressly stated otherwise, statutory warranty support, manufacturer warranties and paid
            Additional Warranty do not extend to problems caused by factors on the customer&rsquo;s side,
            external events, misuse or incorrect installation.
          </li>
          <li>As a rule, warranty cover does not include:</li>
        </ol>
        <table>
          <thead>
            <tr>
              <th>Group</th>
              <th>Not normally covered</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Selection</td>
              <td>
                Incorrect product selection; incompatibility with your installation, system, wiring, voltage,
                environment or project requirements.
              </td>
            </tr>
            <tr>
              <td>Installation</td>
              <td>
                Incorrect installation, wiring, connection, testing, commissioning or integration; installation
                by an unqualified or unauthorised person where professional installation is required or
                appropriate.
              </td>
            </tr>
            <tr>
              <td>Instructions</td>
              <td>
                Not following manufacturer instructions, installation manuals, safety warnings or technical
                specifications.
              </td>
            </tr>
            <tr>
              <td>Use</td>
              <td>
                Misuse, negligence, abuse, careless handling or unsafe use; overloading, incorrect voltage,
                incorrect current, excessive load, an unsuitable power supply or operation outside rated
                specifications; use for purposes outside the manufacturer&rsquo;s intended use; use in
                industrial, commercial, rental or high-load environments the product is not designed for.
              </td>
            </tr>
            <tr>
              <td>Interference</td>
              <td>
                Unauthorised repair, modification, opening, dismantling, alteration or tampering.
              </td>
            </tr>
            <tr>
              <td>Damage</td>
              <td>
                Accidental, impact, fire, water, moisture or chemical damage, corrosion, contamination, dust or
                dirt ingress; damage from power surges, lightning, an unstable power supply, electrical faults
                or wider installation faults; damage from unsuitable storage, transport, temperature, humidity
                or environment.
              </td>
            </tr>
            <tr>
              <td>Wear</td>
              <td>
                Normal wear and tear; cosmetic damage that does not affect how the product works; consumable
                parts, replaceable parts, batteries, bulbs, fuses, lamps, seals, connectors, accessories,
                filters or items expected to wear out, unless expressly covered.
              </td>
            </tr>
            <tr>
              <td>Software</td>
              <td>
                Software, firmware, configuration, calibration or compatibility issues, unless expressly
                covered.
              </td>
            </tr>
            <tr>
              <td>Costs and losses</td>
              <td>
                Labour, electrician, contractor, testing, inspection, removal, reinstallation and certification
                costs; project delays; downtime; loss of profit; indirect losses.
              </td>
            </tr>
          </tbody>
        </table>
        <ol start={3}>
          <li>
            Warranty does not cover defects or damage arising after delivery from events outside
            Solvetaworld&rsquo;s control.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("installation")}>
        <ol>
          <li>
            Electrical products can be dangerous if they are selected, installed, connected, wired, modified,
            overloaded or used incorrectly.
          </li>
          <li>Before you buy, it is up to you to make sure the product suits what you intend to use it for.</li>
          <li>Check every relevant specification, including:</li>
        </ol>
        <ul>
          <li>voltage, current and wattage;</li>
          <li>load rating and IP rating;</li>
          <li>dimensions;</li>
          <li>cable type and connector type;</li>
          <li>installation environment;</li>
          <li>compatibility;</li>
          <li>local electrical requirements;</li>
          <li>product code and technical documentation.</li>
        </ul>
        <ol start={4}>
          <li>
            Where it is required or appropriate, products that need installing, wiring, connecting, testing,
            commissioning or integrating into an electrical system should be installed only by a qualified
            electrician or competent professional.
          </li>
          <li>
            Warranty may be refused or limited where a defect results from incorrect, unsafe or non-compliant
            installation, unsuitable use or not following instructions.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("instructions")}>
        <ol>
          <li>
            Keep and follow every manufacturer instruction, manual, label, safety warning and piece of technical
            documentation that comes with the product or that the manufacturer makes available.
          </li>
          <li>Not following the manufacturer&rsquo;s instructions can affect whether a warranty claim qualifies.</li>
          <li>
            If you are not sure how to install, connect, test or use a product safely, ask a qualified
            electrician or competent professional.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("claim")}>
        <ol className={stepCls}>
          <li className={stepItemCls}>
            <span className={stepNoCls}>01</span>
            <div className={stepBodyCls}>
              <strong>Stop and make safe.</strong> Stop using the product if carrying on could be unsafe, could
              make the defect worse or could cause damage. Do not attempt unauthorised repair, modification,
              dismantling or testing where this could affect safety or whether the claim qualifies.
            </div>
          </li>
          <li className={stepItemCls}>
            <span className={stepNoCls}>02</span>
            <div className={stepBodyCls}>
              <strong>Email us</strong> at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> with:
              <ul>
                <li>your full name;</li>
                <li>the order number;</li>
                <li>the product name or SKU;</li>
                <li>the date of purchase;</li>
                <li>a description of the problem;</li>
                <li>when the problem first showed;</li>
                <li>photos or videos of the product and the defect;</li>
                <li>photos of product labels, serial numbers, model numbers or manufacturer markings;</li>
                <li>installation details, where relevant;</li>
                <li>proof of professional installation, where reasonably required;</li>
                <li>any troubleshooting you have already tried.</li>
              </ul>
            </div>
          </li>
          <li className={stepItemCls}>
            <span className={stepNoCls}>03</span>
            <div className={stepBodyCls}>
              <strong>Answer follow-up questions.</strong> We may ask for more information to assess the claim.
            </div>
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("inspection")}>
        <ol>
          <li>
            A warranty claim may need to be inspected by Solvetaworld, the manufacturer, the supplier, a service
            provider or another authorised party.
          </li>
          <li>We may ask you to send the product in for inspection before we approve a remedy.</li>
          <li>The inspection may look at:</li>
        </ol>
        <ul>
          <li>the condition of the product;</li>
          <li>evidence of installation;</li>
          <li>signs of misuse or external damage;</li>
          <li>signs of overloading or incorrect voltage;</li>
          <li>environmental exposure;</li>
          <li>modification or tampering;</li>
          <li>the manufacturer&rsquo;s findings;</li>
          <li>whether the evidence is consistent with the fault claimed;</li>
          <li>whether the law, the manufacturer warranty or Additional Warranty covers the defect.</li>
        </ul>
        <ol start={4}>
          <li>
            If the inspection confirms the problem is covered, we provide an appropriate remedy under this
            document and applicable law.
          </li>
          <li>
            If the inspection finds the problem is not covered, we may reject the claim and, where applicable,
            send the product back to you at your cost, or offer a paid repair or replacement if one is
            available.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("postage")}>
        <ol>
          <li>Contact us before sending a product back for warranty assessment.</li>
          <li>Where a return is needed, we give you return instructions.</li>
          <li>
            For valid claims about faulty, damaged or non-conforming goods, Solvetaworld may pay the return
            shipping where the law requires it or where we approve it.
          </li>
          <li>
            If a claim is rejected because the defect is not covered, you may have to pay the return shipping,
            inspection costs, handling costs or other reasonable costs, where the law permits and where this was
            clearly communicated.
          </li>
          <li>
            International warranty claims may involve customs declarations, import/export documents, taxes,
            duties, brokerage fees and courier charges. These may fall to the customer unless the claim is
            confirmed as valid and applicable law requires otherwise.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("replacements")}>
        <ol>
          <li>
            Where the law permits and it is appropriate in the circumstances, a replacement may be new,
            equivalent, refurbished, reconditioned, repaired or functionally equivalent.
          </li>
          <li>
            If the original product has been discontinued or is unavailable, we may offer an equivalent or
            reasonably comparable product.
          </li>
          <li>
            A repair or replacement does not automatically restart the original warranty period, unless the law
            requires it or we have expressly said so in writing.
          </li>
          <li>
            Unless applicable law requires otherwise, a replacement, repaired or equivalent product is normally
            covered only for what is left of the original warranty or Additional Warranty period.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("refunds")}>
        <ol>
          <li>
            We may offer a refund under warranty where a repair or replacement is not available, not practical
            or not proportionate, or where the law requires a refund.
          </li>
          <li>
            The amount may reflect the age, use and condition of the product, the inspection results, applicable
            law and the nature of the defect.
          </li>
          <li>Refunds are normally paid to the original payment method where possible.</li>
          <li>
            Unless the law requires it, the following are not normally refunded under warranty: delivery
            charges, customs duties, import VAT, brokerage fees, courier handling charges, local taxes,
            installation costs, labour costs and other third-party costs.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("aw-cancel")}>
        <ol>
          <li>
            If you validly cancel or return a product before its Additional Warranty has started and the refund
            for the product is approved, the linked Additional Warranty charge may also be refunded where the law
            requires it or Solvetaworld approves it.
          </li>
          <li>
            Once Additional Warranty has started, or has already been used for a claim, it may not be refundable
            unless the law requires it.
          </li>
          <li>
            Additional Warranty belongs to the relevant product and order, and cannot normally be moved to
            another product, order, person or customer.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("business")}>
        <ol>
          <li>
            Before buying, Business Customers must check the product&rsquo;s suitability, specifications,
            compatibility, installation requirements and regulatory requirements.
          </li>
          <li>
            When buying electrical goods, Business Customers are expected to have suitable technical knowledge
            or professional advice.
          </li>
          <li>
            Except where mandatory law says otherwise, Business Customers may have more limited warranty
            remedies than Consumers.
          </li>
          <li>
            To the fullest extent the law allows, Solvetaworld is not liable to Business Customers, in
            connection with a warranty issue, for labour, electrician, contractor, testing, removal,
            reinstallation or certification costs, project delays, downtime, loss of profit, loss of contract,
            loss of revenue, loss of business opportunity, or indirect or consequential losses.
          </li>
          <li>
            Business Customers should not book installation or labour, set project deadlines or start site work
            until the goods have arrived, been inspected and been confirmed as correct and suitable.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("returns-link")}>
        <ol>
          <li>This document deals with warranty and defect claims.</li>
          <li>
            Our Returns, Refunds and Cancellation Policy deals with change-of-mind returns, consumer cancellation
            rights, refund timing, non-returnable items, damaged deliveries, incorrect goods and the returns
            procedure.
          </li>
          <li>Making a warranty claim is different from returning something because you changed your mind.</li>
          <li>
            If a product is faulty, damaged, incorrect or not as described, your claim may be dealt with under
            applicable consumer law, the Returns Policy, the manufacturer warranty, this document, or a mix of
            these, depending on the circumstances.
          </li>
        </ol>
      </PolicySection>

      <PolicySection {...sec("revisions")}>
        <ol>
          <li>
            We may revise this document from time to time to reflect changes to warranty options, product
            categories, manufacturer terms, additional warranty pricing, legal requirements, supplier procedures
            or how we run the business.
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
          For questions about statutory rights, manufacturer warranties, Additional Warranty, making a claim,
          product defects or what is excluded, get in touch:
        </p>
        <ContactBlock />
      </PolicySection>
    </PolicyLayout>
  );
}

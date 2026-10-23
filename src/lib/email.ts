import nodemailer, { type Transporter } from "nodemailer";
import { COMPANY } from "@/lib/company";
import { FREE_STANDARD_MIN, deliveryDays, formatGbp, isShippingMethod } from "@/lib/shipping";

let transporter: Transporter | null = null;

// Builds (once) an SMTP transport from the environment. Returns null when SMTP
// is not configured so callers can no-op instead of throwing in local dev.
function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return null;

  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host,
      port,
      // 465 is implicit TLS; 587 upgrades via STARTTLS (secure=false).
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: { user, pass },
    });
  }
  return transporter;
}

function getFrom(): string {
  // A From address must belong to the authenticated mailbox's domain or the
  // provider will reject the message, so default to the SMTP user.
  return (
    process.env.SMTP_FROM ||
    (process.env.SMTP_USER
      ? `Solvetaworld <${process.env.SMTP_USER}>`
      : "Solvetaworld <noreply@solvetaworld.com>")
  );
}

function getReplyTo(): string | undefined {
  return COMPANY.email;
}

function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}


// "Bold Utility" palette (matches src/styles/variables.css): safety yellow
// bars with ink type, ink headers, white body, square corners, no gradients.
const YELLOW = "#FFD21F";
const INK = "#111111";
const PAPER = "#FFFFFF";
const PANEL = "#F4F4F2";
const RULE = "#DADAD6";
const MUTED = "#55554F";
const SUBTLE = "#85857E";
const SUCCESS = "#1D8A3A";
const DANGER = "#C62F12";
const LINK = "#1F6FEB";

const FONT_STACK = "'Barlow','Helvetica Neue',Arial,sans-serif";
const COND_STACK = "'Barlow Condensed','Arial Narrow',Arial,sans-serif";
const MONO_STACK = "ui-monospace,'SF Mono',Menlo,'Courier New',monospace";

// Small reusable inline-style fragments.
const LABEL = `margin:0 0 4px;font-family:${COND_STACK};font-size:12px;color:${MUTED};text-transform:uppercase;letter-spacing:0.08em;font-weight:700;`;
const H1 = `margin:0;font-family:${COND_STACK};font-size:26px;line-height:1.1;font-weight:800;text-transform:uppercase;letter-spacing:0.01em;color:${INK};`;
const BODY = `color:${INK};font-size:15px;line-height:1.6;margin:0 0 16px;`;
const PANEL_BOX = `background:${PANEL};border:1px solid ${RULE};border-left:4px solid ${INK};padding:16px;margin:0 0 16px;`;

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

async function send({ to, subject, html, replyTo }: SendArgs): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    console.log(`[Email] Skipped (SMTP not configured) → ${subject} to ${to}`);
    return false;
  }
  try {
    await t.sendMail({
      from: getFrom(),
      to,
      subject,
      html,
      replyTo: replyTo ?? getReplyTo(),
    });
    return true;
  } catch (err) {
    console.error(`[Email] Exception → ${subject} to ${to}:`, err);
    return false;
  }
}

function wordmark(): string {
  return `<a href="${getSiteUrl()}" style="display:inline-block;text-decoration:none;background:${INK};padding:8px 12px;font-family:${COND_STACK};font-size:22px;line-height:1;font-weight:800;letter-spacing:0.04em;color:${YELLOW};">SOLVETA<span style="color:${PAPER};">WORLD</span></a>`;
}

function emailWrapper(content: string, options: { preheader?: string } = {}): string {
  const preheader = options.preheader
    ? `<div style="display:none;font-size:1px;color:${PAPER};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${options.preheader}</div>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Solvetaworld</title>
</head>
<body style="margin:0;padding:0;background:${PANEL};font-family:${FONT_STACK};color:${INK};">
  ${preheader}
  <div style="max-width:600px;margin:0 auto;padding:24px 12px;">
    <div style="background:${INK};padding:14px 20px;border:2px solid ${INK};">
      ${wordmark()}
    </div>
    <div style="height:6px;background:${YELLOW};border-left:2px solid ${INK};border-right:2px solid ${INK};"></div>
    <div style="background:${PAPER};padding:28px 24px;border:2px solid ${INK};border-top:0;">
      ${content}
    </div>
    <div style="margin-top:16px;padding:14px 16px;background:${PAPER};border:1px solid ${RULE};font-size:12px;color:${MUTED};line-height:1.6;">
      <p style="margin:0 0 4px;"><strong style="color:${INK};">${COMPANY.name}</strong> &middot; ${COMPANY.country} &middot; <a href="${getSiteUrl()}" style="color:${INK};text-decoration:underline;">solvetaworld.com</a></p>
      <p style="margin:0 0 6px;">&copy; ${new Date().getFullYear()} Solvetaworld. All rights reserved.</p>
      <p style="margin:0;font-family:${COND_STACK};text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">
        <a href="${getSiteUrl()}/en/policies/privacy" style="color:${INK};text-decoration:none;margin-right:12px;">Privacy</a>
        <a href="${getSiteUrl()}/en/policies/terms" style="color:${INK};text-decoration:none;margin-right:12px;">Terms</a>
        <a href="${getSiteUrl()}/en/contact" style="color:${INK};text-decoration:none;">Contact</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/** Primary action: yellow block, ink type, 2px ink rule, square corners. */
function button(href: string, label: string): string {
  return `
    <div style="margin:24px 0;">
      <a href="${href}" style="display:inline-block;padding:13px 28px;background:${YELLOW};color:${INK};text-decoration:none;border:2px solid ${INK};border-radius:0;font-family:${COND_STACK};font-weight:800;font-size:17px;text-transform:uppercase;letter-spacing:0.04em;">
        ${label}
      </a>
    </div>`;
}

/** Yellow status bar with ink text — the head of every transactional email. */
function statusBar(label: string, ref?: string): string {
  return `
    <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 20px;background:${YELLOW};border:2px solid ${INK};">
      <tr>
        <td style="padding:10px 14px;font-family:${COND_STACK};font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:${INK};">${label}</td>
        ${ref ? `<td style="padding:10px 14px;text-align:right;font-family:${MONO_STACK};font-size:14px;font-weight:700;color:${INK};">${ref}</td>` : ""}
      </tr>
    </table>`;
}

function escape(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============================================================
// Welcome email
// ============================================================

export async function sendWelcomeEmail(email: string, name?: string | null): Promise<boolean> {
  const greeting = name ? `Hi ${escape(name)}` : "Welcome";
  const siteUrl = getSiteUrl();

  return send({
    to: email,
    subject: "Your Solvetaworld account is set up",
    html: emailWrapper(
      `
      ${statusBar("Account open")}
      <h1 style="${H1}margin-bottom:12px;">${greeting} — your account is live</h1>
      <p style="${BODY}">
        You can now order hand and power tools, ironmongery, plumbing, cabling, electrical wiring and test equipment from one account.
      </p>
      <div style="${PANEL_BOX}">
        <p style="${LABEL}">On your account</p>
        <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;color:${INK};">
          <tr><td style="width:32px;padding:4px 0;font-family:${COND_STACK};font-weight:800;">01</td><td style="padding:4px 0;">Search and browse the whole catalogue</td></tr>
          <tr><td style="padding:4px 0;font-family:${COND_STACK};font-weight:800;">02</td><td style="padding:4px 0;">Keep a wishlist of parts and tools</td></tr>
          <tr><td style="padding:4px 0;font-family:${COND_STACK};font-weight:800;">03</td><td style="padding:4px 0;">Follow the status of every order</td></tr>
          <tr><td style="padding:4px 0;font-family:${COND_STACK};font-weight:800;">04</td><td style="padding:4px 0;">Standard delivery is free on orders of ${escape(formatGbp(FREE_STANDARD_MIN))} or more</td></tr>
        </table>
      </div>
      ${button(`${siteUrl}/en/catalog`, "Browse the catalogue")}
      <p style="color:${MUTED};font-size:13px;margin:0;border-top:1px solid ${RULE};padding-top:12px;">
        All products carry the standard 2-year EU warranty.
      </p>
    `,
      { preheader: `${greeting}! Your Solvetaworld account is ready.` },
    ),
  });
}

// ============================================================
// Order emails (confirmation, invoice, status updates)
// ============================================================

interface OrderItem {
  productName: string;
  productSku: string;
  quantity: number;
  price: number | { toNumber?: () => number };
  total: number | { toNumber?: () => number };
}

interface ShippingAddress {
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string | null;
  city?: string;
  province?: string | null;
  postalCode?: string;
  country?: string;
}

interface OrderEmailData {
  orderId: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number | { toNumber?: () => number };
  taxAmount: number | { toNumber?: () => number };
  shippingCost: number | { toNumber?: () => number };
  discountAmount?: number | { toNumber?: () => number };
  total: number | { toNumber?: () => number };
  shippingMethod: string;
  shippingAddress?: ShippingAddress;
  trackingNumber?: string | null;
  createdAt?: Date | string;
}

function toNum(v: number | { toNumber?: () => number } | undefined | null): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "object" && typeof v.toNumber === "function") return v.toNumber();
  return Number(v);
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount);
}

function formatDate(d: Date | string | undefined): string {
  const date = d ? new Date(d) : new Date();
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function shortId(order: { orderNumber?: string; orderId: string }): string {
  const raw = order.orderNumber || order.orderId;
  return raw.slice(-8).toUpperCase();
}

function shippingLabelFor(method: string, country?: string | null): string {
  if (!isShippingMethod(method)) return escape(method || "Standard");
  const name = method === "express" ? "Express" : "Standard";
  return `${name} (${deliveryDays(method, country)} business days after dispatch)`;
}

function formatAddress(addr?: ShippingAddress): string {
  if (!addr) return "—";
  const lines: string[] = [];
  const name = [addr.firstName, addr.lastName].filter(Boolean).join(" ");
  if (name) lines.push(escape(name));
  if (addr.address1) lines.push(escape(addr.address1));
  if (addr.address2) lines.push(escape(addr.address2));
  const cityLine = [addr.city, addr.postalCode].filter(Boolean).join(", ");
  if (cityLine) lines.push(escape(cityLine));
  if (addr.country) lines.push(escape(addr.country));
  return lines.join("<br />");
}

const TH = `padding:8px 10px;font-family:${COND_STACK};font-size:12px;font-weight:800;color:${YELLOW};text-transform:uppercase;letter-spacing:0.08em;`;
const TD = `padding:10px;border-bottom:1px solid ${RULE};vertical-align:top;font-size:14px;color:${INK};`;

function itemRowsTable(items: OrderItem[], options: { showUnitPrice?: boolean } = {}): string {
  return items
    .map((item) => {
      const qty = item.quantity;
      const unit = formatEur(toNum(item.price));
      const total = formatEur(toNum(item.total));
      return `
        <tr>
          <td style="${TD}">
            <div style="font-weight:600;">${escape(item.productName)}</div>
            <div style="font-family:${MONO_STACK};font-size:12px;color:${MUTED};margin-top:2px;">SKU ${escape(item.productSku)}</div>
          </td>
          <td style="${TD}text-align:center;font-family:${MONO_STACK};">
            ${qty}${options.showUnitPrice ? ` &times; ${unit}` : ""}
          </td>
          <td style="${TD}text-align:right;font-weight:700;white-space:nowrap;">
            ${total}
          </td>
        </tr>`;
    })
    .join("");
}

function totalsBlock(data: OrderEmailData): string {
  const discount = toNum(data.discountAmount);
  const shipping = toNum(data.shippingCost);
  const row = (label: string, value: string, extra = "") => `
        <tr>
          <td style="color:${MUTED};font-size:14px;padding:5px 0;${extra}">${label}</td>
          <td style="text-align:right;font-size:14px;padding:5px 0;font-family:${MONO_STACK};${extra}">${value}</td>
        </tr>`;
  return `
    <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 16px;">
      <tr><td style="width:45%;"></td><td>
        <table role="presentation" style="width:100%;border-collapse:collapse;">
          ${row("Subtotal", formatEur(toNum(data.subtotal)))}
          ${row(`Delivery (${shippingLabelFor(data.shippingMethod, data.shippingAddress?.country)})`, shipping === 0 ? "Free" : formatEur(shipping), shipping === 0 ? `color:${SUCCESS};` : "")}
          ${row("Tax (21%)", formatEur(toNum(data.taxAmount)))}
          ${discount > 0 ? row("Discount", `&minus;${formatEur(discount)}`, `color:${SUCCESS};`) : ""}
          <tr>
            <td style="padding:10px 10px;background:${INK};font-family:${COND_STACK};font-weight:800;font-size:16px;text-transform:uppercase;letter-spacing:0.04em;color:${YELLOW};">Total</td>
            <td style="padding:10px 10px;background:${INK};text-align:right;font-weight:800;font-size:16px;font-family:${MONO_STACK};color:${YELLOW};">${formatEur(toNum(data.total))}</td>
          </tr>
        </table>
      </td></tr>
    </table>`;
}

function itemsTable(items: OrderItem[], options: { showUnitPrice?: boolean } = {}): string {
  return `
    <table style="width:100%;border-collapse:collapse;margin:0 0 16px;border:2px solid ${INK};">
      <thead>
        <tr style="background:${INK};">
          <th style="${TH}text-align:left;">Item</th>
          <th style="${TH}text-align:center;">${options.showUnitPrice ? "Qty &times; Unit" : "Qty"}</th>
          <th style="${TH}text-align:right;">Line</th>
        </tr>
      </thead>
      <tbody>
        ${itemRowsTable(items, options)}
      </tbody>
    </table>`;
}

/** Two-column label/value cell used by the invoice and dispatch emails. */
function infoCell(label: string, body: string, side: "left" | "right"): string {
  const pad = side === "left" ? "padding:0 12px 16px 0;" : "padding:0 0 16px 12px;";
  return `
          <td style="width:50%;vertical-align:top;${pad}">
            <p style="${LABEL}">${label}</p>
            <p style="margin:0;font-size:13px;color:${INK};line-height:1.55;border-top:2px solid ${INK};padding-top:6px;">
              ${body}
            </p>
          </td>`;
}

// Order confirmation — quick "we got your order" email
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  const siteUrl = getSiteUrl();
  const id = shortId(data);

  return send({
    to: data.customerEmail,
    subject: `Order received — #${id}`,
    html: emailWrapper(
      `
      ${statusBar("Order received", `#${id}`)}
      <h1 style="${H1}margin-bottom:12px;">We have your order</h1>
      <p style="${BODY}">
        Hi ${escape(data.customerName)}, thanks — your order is logged and is now being picked and packed.
      </p>

      ${itemsTable(data.items)}
      ${totalsBlock(data)}

      ${button(`${siteUrl}/en/account/orders/${data.orderId}`, "Open order")}

      <p style="color:${MUTED};font-size:13px;margin:0;border-top:1px solid ${RULE};padding-top:12px;">
        A second email follows as soon as the parcel is handed to the carrier.
      </p>
    `,
      { preheader: `Order #${id} received — thanks for ordering.` },
    ),
  });
}

// Invoice email — formal, with full company + customer details
export async function sendOrderInvoiceEmail(data: OrderEmailData): Promise<boolean> {
  const id = shortId(data);
  const date = formatDate(data.createdAt);

  return send({
    to: data.customerEmail,
    subject: `Invoice — Order #${id}`,
    html: emailWrapper(
      `
      ${statusBar("Invoice", `#${id}`)}
      <p style="margin:0 0 20px;font-family:${MONO_STACK};font-size:13px;color:${MUTED};">Issued ${date}</p>

      <table role="presentation" style="width:100%;border-collapse:collapse;">
        <tr>
          ${infoCell("Billed to", `${escape(data.customerName)}<br />${escape(data.customerEmail)}`, "left")}
          ${infoCell("Deliver to", formatAddress(data.shippingAddress), "right")}
        </tr>
        <tr>
          ${infoCell(
            "Seller",
            `<strong>${COMPANY.name}</strong><br />
              Company number: ${COMPANY.companyNumber}<br />
              ${COMPANY.registeredOffice}<br />
              ${COMPANY.country}${COMPANY.phone ? `<br />Phone: ${COMPANY.phone}` : ""}`,
            "left",
          )}
          ${infoCell("Delivery method", shippingLabelFor(data.shippingMethod, data.shippingAddress?.country), "right")}
        </tr>
      </table>

      ${itemsTable(data.items, { showUnitPrice: true })}
      ${totalsBlock(data)}

      <p style="color:${MUTED};font-size:12px;margin:0;line-height:1.6;border-top:1px solid ${RULE};padding-top:12px;">
        VAT is included in the prices shown where applicable. Keep this invoice as your proof of purchase.<br />
        Questions about this invoice: reply to this email or write to <a href="mailto:${COMPANY.email}" style="color:${LINK};">${COMPANY.email}</a>.
      </p>
    `,
      { preheader: `Invoice for order #${id} — ${formatEur(toNum(data.total))}` },
    ),
  });
}

// Order shipped — sent when admin marks order SHIPPED
export async function sendOrderShippedEmail(data: OrderEmailData): Promise<boolean> {
  const siteUrl = getSiteUrl();
  const id = shortId(data);
  const tracking = data.trackingNumber;

  return send({
    to: data.customerEmail,
    subject: `Order #${id} has been dispatched`,
    html: emailWrapper(
      `
      ${statusBar("Dispatched", `#${id}`)}
      <h1 style="${H1}margin-bottom:12px;">Your parcel is with the carrier</h1>
      <p style="${BODY}">
        Hi ${escape(data.customerName)}, your order has been packed, has left the warehouse and is on its way.
      </p>

      ${
        tracking
          ? `<div style="${PANEL_BOX}">
              <p style="${LABEL}">Tracking number</p>
              <p style="margin:0;font-size:20px;font-weight:700;color:${INK};font-family:${MONO_STACK};">${escape(tracking)}</p>
            </div>`
          : ""
      }

      <div style="${PANEL_BOX}">
        <p style="${LABEL}">Delivery address</p>
        <p style="margin:0;font-size:13px;color:${INK};line-height:1.55;">
          ${formatAddress(data.shippingAddress)}
        </p>
      </div>

      <p style="color:${MUTED};font-size:14px;line-height:1.6;margin:0;">
        Delivery service: <strong style="color:${INK};">${shippingLabelFor(data.shippingMethod, data.shippingAddress?.country)}</strong>.
        We will email you again once it has been delivered.
      </p>

      ${button(`${siteUrl}/en/account/orders/${data.orderId}`, "Follow this order")}
    `,
      { preheader: `Order #${id} dispatched${tracking ? ` — ${tracking}` : ""}` },
    ),
  });
}

// Generic status update — DELIVERED / CANCELLED / REFUNDED
export async function sendOrderStatusEmail(
  data: OrderEmailData,
  status: "DELIVERED" | "CANCELLED" | "REFUNDED",
): Promise<boolean> {
  const siteUrl = getSiteUrl();
  const id = shortId(data);

  const variants = {
    DELIVERED: {
      subject: `Order #${id} delivered`,
      bar: "Delivered",
      title: "Your order has arrived",
      accent: SUCCESS,
      message: "your order is now marked as delivered. If something is not right, reply to this email and tell us.",
      cta: "Review your items",
      ctaHref: `${siteUrl}/en/account/orders/${data.orderId}`,
    },
    CANCELLED: {
      subject: `Order #${id} cancelled`,
      bar: "Cancelled",
      title: "This order has been cancelled",
      accent: DANGER,
      message: "this order has been cancelled. If you were charged, the refund goes back to your original payment method within 5–10 business days.",
      cta: "Back to the catalogue",
      ctaHref: `${siteUrl}/en/catalog`,
    },
    REFUNDED: {
      subject: `Order #${id} refunded`,
      bar: "Refunded",
      title: "Refund issued",
      accent: INK,
      message: `a refund of <strong>${formatEur(toNum(data.total))}</strong> has been sent to your original payment method. Allow 5–10 business days for it to show on your statement.`,
      cta: "Open order",
      ctaHref: `${siteUrl}/en/account/orders/${data.orderId}`,
    },
  } as const;

  const v = variants[status];

  return send({
    to: data.customerEmail,
    subject: v.subject,
    html: emailWrapper(
      `
      ${statusBar(v.bar, `#${id}`)}
      <h1 style="${H1}margin-bottom:12px;border-left:6px solid ${v.accent};padding-left:10px;">${v.title}</h1>
      <p style="${BODY}">
        Hi ${escape(data.customerName)}, ${v.message}
      </p>

      ${button(v.ctaHref, v.cta)}
    `,
      { preheader: v.title },
    ),
  });
}

// ============================================================
// Password reset
// ============================================================

export async function sendPasswordResetEmail(email: string, resetUrl: string, name?: string | null): Promise<boolean> {
  const greeting = name ? `Hi ${escape(name)}` : "Hello";
  return send({
    to: email,
    subject: "Solvetaworld password reset link",
    html: emailWrapper(
      `
      ${statusBar("Password reset")}
      <h1 style="${H1}margin-bottom:12px;">Set a new password</h1>
      <p style="${BODY}">
        ${greeting}, someone asked to reset the password on your Solvetaworld account.
        Use the button below to pick a new one. The link stops working after <strong>1 hour</strong>.
      </p>
      ${button(resetUrl, "Set new password")}
      <p style="color:${MUTED};font-size:13px;line-height:1.6;margin:0 0 16px;">
        Button not working? Paste this address into your browser:
        <br />
        <a href="${resetUrl}" style="color:${LINK};word-break:break-all;font-family:${MONO_STACK};font-size:12px;">${resetUrl}</a>
      </p>
      <p style="color:${MUTED};font-size:13px;margin:0;border-top:1px solid ${RULE};padding-top:12px;">
        Didn&rsquo;t ask for this? Ignore this email — your current password stays as it is.
      </p>
    `,
      { preheader: "Your password reset link — valid for 1 hour." },
    ),
  });
}

// ============================================================
// Contact form
// ============================================================

interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Internal notification to support inbox
export async function sendContactFormEmail(submission: ContactSubmission): Promise<boolean> {
  const supportInbox = getReplyTo() || process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!supportInbox) {
    console.log("[Email] Contact form notification skipped (no inbox configured)");
    return false;
  }

  return send({
    to: supportInbox,
    subject: `Contact: ${submission.subject}`,
    replyTo: submission.email,
    html: emailWrapper(`
      ${statusBar("Website enquiry")}
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:14px;border-top:2px solid ${INK};">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid ${RULE};color:${MUTED};width:80px;font-family:${COND_STACK};text-transform:uppercase;font-weight:700;letter-spacing:0.06em;">From</td>
          <td style="padding:8px 0;border-bottom:1px solid ${RULE};color:${INK};font-weight:600;">${escape(submission.name)} &lt;${escape(submission.email)}&gt;</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid ${RULE};color:${MUTED};font-family:${COND_STACK};text-transform:uppercase;font-weight:700;letter-spacing:0.06em;">Subject</td>
          <td style="padding:8px 0;border-bottom:1px solid ${RULE};color:${INK};font-weight:600;">${escape(submission.subject)}</td>
        </tr>
      </table>
      <div style="${PANEL_BOX}color:${INK};font-size:14px;line-height:1.6;white-space:pre-wrap;">${escape(submission.message)}</div>
      <p style="color:${SUBTLE};font-size:12px;margin:0;">
        Replying to this email goes straight to ${escape(submission.email)}.
      </p>
    `),
  });
}

// Auto-reply to the customer who submitted the form
export async function sendContactAutoReplyEmail(submission: ContactSubmission): Promise<boolean> {
  return send({
    to: submission.email,
    subject: "Message received — Solvetaworld",
    html: emailWrapper(
      `
      ${statusBar("Message received")}
      <h1 style="${H1}margin-bottom:12px;">Got it — we&rsquo;ll be in touch</h1>
      <p style="${BODY}">
        Hi ${escape(submission.name)}, your message has reached us. Expect a reply within 24 hours.
      </p>
      <div style="${PANEL_BOX}">
        <p style="${LABEL}">What you sent</p>
        <p style="margin:0 0 8px;font-size:14px;color:${INK};font-weight:600;">${escape(submission.subject)}</p>
        <p style="margin:0;font-size:14px;color:${MUTED};line-height:1.6;white-space:pre-wrap;">${escape(submission.message)}</p>
      </div>
      <p style="color:${MUTED};font-size:13px;margin:0;">
        While you wait: the <a href="${getSiteUrl()}/en/faq" style="color:${LINK};">FAQ</a> covers common questions, and the <a href="${getSiteUrl()}/en/catalog" style="color:${LINK};">catalogue</a> is always open.
      </p>
    `,
      { preheader: "Message received — reply within 24 hours." },
    ),
  });
}

"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validators/checkout";
import { formatPrice } from "@/lib/utils/format-price";
import { COUNTRIES } from "@/lib/countries";
import {
  SHIPPING_METHODS,
  DEFAULT_SHIPPING_METHOD,
  FREE_STANDARD_MIN,
  amountToFreeStandard,
  deliveryZone,
  isShippingMethod,
  shippingCost,
} from "@/lib/shipping";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { MerchantInfo } from "@/components/checkout/MerchantInfo";
import { PayntWidget } from "@/components/checkout/PayntWidget";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Check, Lock, ShieldCheck, Tag, Truck, UserCircle, X as XIcon } from "@phosphor-icons/react";

interface AppliedDiscount {
  type: "welcome" | "newsletter";
  percent: number;
  code: string;
  source: "auto" | "code";
}

const TOTAL_STEPS = 3;

const errCls = "block mt-1 text-xs font-medium text-danger";
const fieldCls = (hasError: boolean) => `field ${hasError ? "!border-danger" : ""}`;

type StepState = "active" | "done" | "todo";

/** One numbered checkout stage: yellow number block, heading, optional summary or body. */
function StepBlock({
  index,
  title,
  state,
  changeLabel,
  onChange,
  summary,
  children,
}: {
  index: number;
  title: string;
  state: StepState;
  changeLabel: string;
  onChange?: () => void;
  summary?: ReactNode;
  children?: ReactNode;
}) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <li className={`border-2 ${state === "todo" ? "border-line" : "border-line-strong"} bg-surface`}>
      <div className="flex items-center gap-3.5 pr-4">
        <span
          className={`w-12 h-12 shrink-0 flex items-center justify-center font-display font-extrabold text-xl tabular-nums border-r-2 ${
            state === "todo"
              ? "bg-surface-1 text-ink-subtle border-line"
              : "bg-hivis text-coal border-line-strong"
          }`}
          aria-hidden="true"
        >
          {state === "done" ? <Check size={20} /> : num}
        </span>
        <h2 className={`m-0 flex-1 text-xl max-sm:text-lg ${state === "todo" ? "text-ink-subtle" : "text-ink"}`}>
          <span className="sr-only">{num} </span>
          {title}
        </h2>
        {state === "done" && onChange && (
          <button
            type="button"
            onClick={onChange}
            className="u-cond text-sm font-bold text-ink underline underline-offset-4 decoration-2 decoration-hivis bg-transparent border-0 cursor-pointer hover:decoration-ink"
          >
            {changeLabel}
          </button>
        )}
      </div>
      {state === "done" && summary && (
        <div className="border-t border-line px-4 py-3 pl-[4.125rem] text-sm text-ink-muted">{summary}</div>
      )}
      {state === "active" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          className="border-t-2 border-line-strong p-6 max-sm:p-4 flex flex-col gap-5"
        >
          {children}
        </motion.div>
      )}
    </li>
  );
}

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tc = useTranslations("cart");
  const nav = useTranslations("nav");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { cart } = useCart();
  const { user } = useAuth();
  const { currency, convert } = useCurrency();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [payntData, setPayntData] = useState<{
    orderId: string;
    orderNumber: string;
    checkoutId: string;
    scriptUrl: string;
    integrity?: string;
    shopperResultUrl: string;
  } | null>(null);
  const [discount, setDiscount] = useState<AppliedDiscount | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      contact: { email: user?.email || "", phone: "" },
      shipping: {
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      },
      shippingMethod: DEFAULT_SHIPPING_METHOD,
      acceptedPolicies: false,
    },
  });

  const steps = [t("contact"), t("shipping"), t("review")];
  const selectedMethod = watch("shippingMethod");
  const selectedCountry = watch("shipping.country");
  const zone = deliveryZone(selectedCountry);

  const countryData = COUNTRIES.find((c) => c.code === selectedCountry);
  const phoneHint = countryData ? `${countryData.phone} XX XXX XXXX` : "+44 XX XXX XXXX";

  const discountAmount = discount ? +(cart.subtotal * (discount.percent / 100)).toFixed(2) : 0;
  const discountedSubtotal = Math.max(cart.subtotal - discountAmount, 0);
  const taxOnDiscounted = +(discountedSubtotal * 0.21).toFixed(2);
  // Delivery terms (prices in GBP, free standard from £120 after discounts) come from src/lib/shipping.ts,
  // the same helper /api/checkout charges with.
  const methodKey = isShippingMethod(selectedMethod) ? selectedMethod : DEFAULT_SHIPPING_METHOD;
  const finalShipping = shippingCost(methodKey, discountedSubtotal);

  useEffect(() => {
    let cancelled = false;
    if (user) {
      fetch("/api/discounts")
        .then((r) => r.json())
        .then((d) => {
          if (!cancelled && d?.discount) setDiscount(d.discount);
        })
        .catch(() => null);
    }
    return () => { cancelled = true; };
  }, [user]);

  const applyPromo = async () => {
    const code = promoInput.trim();
    if (!code) return;
    setApplyingPromo(true);
    setPromoError(null);
    try {
      const r = await fetch(`/api/discounts?code=${encodeURIComponent(code)}`);
      const data = await r.json();
      if (data?.discount) {
        setDiscount(data.discount);
        setPromoInput("");
        toast.success(t("promoApplied", { percent: data.discount.percent }));
      } else {
        setPromoError(t("promoInvalid"));
      }
    } catch {
      setPromoError(t("promoFailed"));
    } finally {
      setApplyingPromo(false);
    }
  };

  const removeDiscount = () => {
    setDiscount(null);
    setPromoError(null);
  };

  const goNext = async () => {
    if (step === 0) {
      const valid = await trigger("contact");
      if (!valid) return;
    } else if (step === 1) {
      const valid = await trigger(["shipping", "shippingMethod"]);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, 2));
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          locale,
          discountCode: discount?.source === "code" ? discount.code : undefined,
          currency,
          items: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            variantName: item.variantName,
          })),
        }),
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          // ignore
        }
        console.error("Checkout submission failed on server:", errorData);
        throw new Error(errorData?.details || errorData?.error || "Failed to create order");
      }

      const order = await res.json();
      if (order.checkoutId && order.scriptUrl && order.shopperResultUrl) {
        setPayntData({
          orderId: order.id,
          orderNumber: order.orderNumber,
          checkoutId: order.checkoutId,
          scriptUrl: order.scriptUrl,
          integrity: order.integrity,
          shopperResultUrl: order.shopperResultUrl,
        });
      } else if (order.paymentLink) {
        window.location.href = order.paymentLink;
      } else {
        toast.success(t("orderPlaced"));
        router.push(`/order/confirmed?orderId=${order.id}`);
      }
    } catch (err: unknown) {
      toast.error((err instanceof Error && err.message) || t("orderFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/cart");
    }
  }, [cart.items.length, router]);

  if (cart.items.length === 0) return null;

  const amountToFreeShipping = amountToFreeStandard(discountedSubtotal);
  const meterFilled = Math.floor(Math.min(discountedSubtotal / FREE_STANDARD_MIN, 1) * 10);

  const money = (amount: number) => formatPrice(convert(amount), currency);
  // Rounded to the penny before conversion, exactly as /api/checkout does.
  const grandTotal = +(discountedSubtotal + taxOnDiscounted + finalShipping).toFixed(2);
  const stateOf = (i: number): StepState => (i === step ? "active" : i < step ? "done" : "todo");
  const methodName = (key: string) => (isShippingMethod(key) ? t(`methods.${key}`) : key);

  const contact = watch("contact");
  const ship = watch("shipping");
  const countryName = COUNTRIES.find((c) => c.code === ship.country)?.name ?? ship.country;

  return (
    <div className="max-w-container mx-auto px-4 pb-16">
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: tc("title"), href: "/cart" }, { label: t("title") }]} />

      <header className="sec-head">
        <h1 className="m-0 text-[2.25rem] max-sm:text-[1.75rem] text-ink">{t("title")}</h1>
        <p className="m-0 font-mono text-sm text-ink-muted tabular-nums">
          {t("stepOf", { current: step + 1, total: TOTAL_STEPS })}
        </p>
      </header>

      {!user && (
        <div className="flex items-start gap-3 mb-6 border-2 border-line-strong border-l-[6px] border-l-hivis bg-surface-1 px-4 py-3 text-sm">
          <UserCircle size={20} className="shrink-0 mt-px" />
          <p className="m-0">
            <strong className="u-cond font-bold mr-1.5">{t("guestTitle")}.</strong>
            {t.rich("guestBody", {
              login: (chunks) => <Link href="/auth/login" className="font-semibold underline decoration-2 underline-offset-2">{chunks}</Link>,
              register: (chunks) => <Link href="/auth/register" className="font-semibold underline decoration-2 underline-offset-2">{chunks}</Link>,
            })}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8 items-start">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <ol className="list-none m-0 p-0 flex flex-col gap-3">
            {/* 01 — Contact */}
            <StepBlock
              index={0}
              title={steps[0]}
              state={stateOf(0)}
              changeLabel={t("change")}
              onChange={() => setStep(0)}
              summary={
                <span className="break-all">
                  {contact.email}
                  {contact.phone ? ` · ${contact.phone}` : ""}
                </span>
              }
            >
              <div>
                <label htmlFor="co-email" className="field-label">{t("email")} *</label>
                <input
                  id="co-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.co.uk"
                  className={fieldCls(!!errors.contact?.email)}
                  {...register("contact.email")}
                />
                {errors.contact?.email && <span className={errCls}>{errors.contact.email.message}</span>}
                {!user && <span className="block mt-1 text-xs text-ink-subtle">{t("emailHint")}</span>}
              </div>
              <div>
                <label htmlFor="co-phone" className="field-label">
                  {t("phone")} <span className="font-normal normal-case text-ink-subtle">({t("optional")})</span>
                </label>
                <input
                  id="co-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder={phoneHint}
                  className={fieldCls(!!errors.contact?.phone)}
                  {...register("contact.phone")}
                />
                {errors.contact?.phone && <span className={errCls}>{errors.contact.phone.message}</span>}
                <span className="block mt-1 text-xs text-ink-subtle">{t("phoneHint")}</span>
              </div>
              <div>
                <button type="button" onClick={goNext} className="btn-yellow">
                  {t("nextDelivery")} <ArrowRight size={18} />
                </button>
              </div>
            </StepBlock>

            {/* 02 — Delivery address + service */}
            <StepBlock
              index={1}
              title={steps[1]}
              state={stateOf(1)}
              changeLabel={t("change")}
              onChange={() => setStep(1)}
              summary={
                <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1">
                  <dt className="u-cond text-xs font-bold text-ink-subtle">{t("shipping")}</dt>
                  <dd className="m-0 text-ink">
                    {ship.firstName} {ship.lastName}, {ship.address1}
                    {ship.address2 ? `, ${ship.address2}` : ""}, {ship.city} {ship.postalCode}, {countryName}
                  </dd>
                  <dt className="u-cond text-xs font-bold text-ink-subtle">{t("shippingMethod")}</dt>
                  <dd className="m-0 text-ink">
                    {methodName(selectedMethod)} — {finalShipping > 0 ? money(finalShipping) : t("free")}
                  </dd>
                </dl>
              }
            >
              <fieldset className="m-0 p-0 border-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <legend className="sr-only">{t("shipping")}</legend>
                <div>
                  <label htmlFor="co-first" className="field-label">{t("firstName")} *</label>
                  <input id="co-first" autoComplete="given-name" placeholder="Jane" className={fieldCls(!!errors.shipping?.firstName)} {...register("shipping.firstName")} />
                  {errors.shipping?.firstName && <span className={errCls}>{errors.shipping.firstName.message}</span>}
                </div>
                <div>
                  <label htmlFor="co-last" className="field-label">{t("lastName")} *</label>
                  <input id="co-last" autoComplete="family-name" placeholder="Smith" className={fieldCls(!!errors.shipping?.lastName)} {...register("shipping.lastName")} />
                  {errors.shipping?.lastName && <span className={errCls}>{errors.shipping.lastName.message}</span>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="co-addr1" className="field-label">{t("address")} *</label>
                  <input id="co-addr1" autoComplete="address-line1" placeholder="14 Station Road" className={fieldCls(!!errors.shipping?.address1)} {...register("shipping.address1")} />
                  {errors.shipping?.address1 && <span className={errCls}>{errors.shipping.address1.message}</span>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="co-addr2" className="field-label">
                    {t("apartment")} <span className="font-normal normal-case text-ink-subtle">({t("optional")})</span>
                  </label>
                  <input id="co-addr2" autoComplete="address-line2" placeholder="Unit 3" className="field" {...register("shipping.address2")} />
                </div>
                <div>
                  <label htmlFor="co-city" className="field-label">{t("city")} *</label>
                  <input id="co-city" autoComplete="address-level2" placeholder="Leeds" className={fieldCls(!!errors.shipping?.city)} {...register("shipping.city")} />
                  {errors.shipping?.city && <span className={errCls}>{errors.shipping.city.message}</span>}
                </div>
                <div>
                  <label htmlFor="co-province" className="field-label">
                    {t("province")} <span className="font-normal normal-case text-ink-subtle">({t("optional")})</span>
                  </label>
                  <input id="co-province" autoComplete="address-level1" className="field" {...register("shipping.province")} />
                </div>
                <div>
                  <label htmlFor="co-postcode" className="field-label">{t("postalCode")} *</label>
                  <input id="co-postcode" autoComplete="postal-code" placeholder="LS1 4AP" className={`${fieldCls(!!errors.shipping?.postalCode)} uppercase`} {...register("shipping.postalCode")} />
                  {errors.shipping?.postalCode && <span className={errCls}>{errors.shipping.postalCode.message}</span>}
                </div>
                <div>
                  <label htmlFor="co-country" className="field-label">{t("country")} *</label>
                  <select id="co-country" autoComplete="country" className={fieldCls(!!errors.shipping?.country)} {...register("shipping.country")}>
                    <option value="">{t("selectCountry")}</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                  {errors.shipping?.country && <span className={errCls}>{errors.shipping.country.message}</span>}
                </div>
              </fieldset>

              <fieldset className="m-0 p-0 border-0">
                <legend className="field-label mb-2">{t("shippingMethod")}</legend>
                <div className="border-2 border-line-strong divide-y divide-line">
                  {SHIPPING_METHODS.map((m) => {
                    const isSelected = selectedMethod === m.key;
                    const price = shippingCost(m.key, discountedSubtotal);
                    return (
                      <label
                        key={m.key}
                        className={`flex items-center gap-3.5 px-4 py-3 cursor-pointer transition-colors ${
                          isSelected ? "bg-brand-soft" : "bg-surface hover:bg-surface-1"
                        }`}
                      >
                        <input type="radio" value={m.key} className="sr-only peer" {...register("shippingMethod")} />
                        <span
                          className={`w-5 h-5 shrink-0 flex items-center justify-center border-2 border-line-strong peer-focus-visible:outline-2 peer-focus-visible:outline-link ${
                            isSelected ? "bg-coal text-hivis" : "bg-surface"
                          }`}
                          aria-hidden="true"
                        >
                          {isSelected && <Check size={12} />}
                        </span>
                        <Truck size={18} className="shrink-0 text-ink-muted" />
                        <span className="flex-1 min-w-0">
                          <span className="block font-semibold text-sm text-ink">{methodName(m.key)}</span>
                          <span className="block font-mono text-xs text-ink-muted">{t("workingDays", { range: zone.days[m.key], zone: t(`zones.${zone.key}`) })}</span>
                        </span>
                        <span className={`font-display font-extrabold text-lg tabular-nums ${price === 0 ? "text-success" : "text-ink"}`}>
                          {price === 0 ? t("free") : money(price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.shippingMethod && <span className={errCls}>{errors.shippingMethod.message}</span>}
              </fieldset>

              <div className="flex gap-3 flex-wrap">
                <button type="button" onClick={() => setStep(0)} className="btn-line">
                  <ArrowLeft size={18} /> {t("back")}
                </button>
                <button type="button" onClick={goNext} className="btn-yellow flex-1">
                  {t("nextReview")} <ArrowRight size={18} />
                </button>
              </div>
            </StepBlock>

            {/* 03 — Check & pay */}
            <StepBlock index={2} title={steps[2]} state={stateOf(2)} changeLabel={t("change")}>
              {payntData ? (
                <div className="flex flex-col gap-5">
                  <div className="p-4 border-2 border-line-strong bg-surface-1">
                    <div className="flex items-center justify-between text-xs font-mono text-ink-muted mb-1">
                      <span>ORDER #{payntData.orderNumber}</span>
                      <span className="font-bold text-ink text-sm">{money(grandTotal)}</span>
                    </div>
                    <p className="text-xs text-ink-muted m-0">
                      Enter your card details below to complete payment via SetoPay / PayNT.
                    </p>
                  </div>

                  <PayntWidget
                    checkoutId={payntData.checkoutId}
                    scriptUrl={payntData.scriptUrl}
                    integrity={payntData.integrity}
                    shopperResultUrl={payntData.shopperResultUrl}
                    locale={locale}
                  />

                  <div className="pt-2 border-t border-line">
                    <button
                      type="button"
                      onClick={() => setPayntData(null)}
                      className="btn-line text-xs py-2 px-3 flex items-center gap-1.5"
                    >
                      <ArrowLeft size={14} /> {t("back")}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <table className="w-full border-collapse text-sm">
                    <caption className="text-left field-label">{t("itemsHeading")}</caption>
                    <tbody>
                      {cart.items.map((item) => (
                        <tr key={item.id} className="border-t border-line first:border-t-2 first:border-line-strong">
                          <td className="py-2.5 pr-3 font-mono text-xs text-ink-muted whitespace-nowrap align-top">
                            {t("qtyTimes", { qty: item.quantity })}
                          </td>
                          <td className="py-2.5 pr-3 align-top">
                            <span className="font-semibold text-ink line-clamp-2 [overflow-wrap:anywhere]">{item.name}</span>
                            {item.variantName && <span className="block text-xs text-ink-muted">{item.variantName}</span>}
                          </td>
                          <td className="py-2.5 text-right font-mono tabular-nums whitespace-nowrap align-top">
                            {money(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("acceptedPolicies")}
                        className="w-5 h-5 mt-0.5 shrink-0 cursor-pointer accent-coal"
                      />
                      <span className="text-sm leading-normal [&_a]:font-semibold [&_a]:underline [&_a]:decoration-2 [&_a]:decoration-hivis [&_a]:underline-offset-2 hover:[&_a]:decoration-ink">
                        {t.rich("acceptPolicies", {
                          terms: (chunks) => <Link href="/policies/terms" target="_blank">{chunks}</Link>,
                          privacy: (chunks) => <Link href="/policies/privacy" target="_blank">{chunks}</Link>,
                        })}
                        {" *"}
                      </span>
                    </label>
                    {errors.acceptedPolicies && <span className={errCls}>{t("acceptPoliciesRequired")}</span>}
                  </div>

                  <div className="flex items-baseline justify-between gap-4 border-t-2 border-line-strong pt-3">
                    <span className="u-cond font-extrabold text-lg">{t("total")}</span>
                    <span className="font-display font-extrabold text-2xl tabular-nums">{money(grandTotal)}</span>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button type="button" onClick={() => setStep(1)} className="btn-line" disabled={submitting}>
                      <ArrowLeft size={18} /> {t("back")}
                    </button>
                    <button type="submit" className="btn-yellow flex-1" disabled={submitting} aria-busy={submitting}>
                      {submitting ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
                          {t("processing")}
                        </>
                      ) : (
                        <>
                          <Lock size={18} /> {t("placeOrder")}
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </StepBlock>
          </ol>
        </form>

        {/* Summary panel */}
        <aside className="border-2 border-line-strong bg-surface lg:sticky lg:top-[calc(var(--header-height)+var(--announcement-height)+1rem)]">
          <div className="flex items-baseline justify-between gap-3 px-5 py-3 bg-coal">
            <h2 className="m-0 text-xl text-hivis">{t("orderSummary")}</h2>
            <span className="font-mono text-xs text-on-dark tabular-nums">{tc("itemCount", { count: cart.itemCount })}</span>
          </div>

          {amountToFreeShipping > 0 && (
            <div className="px-5 py-3 border-b border-line bg-surface-1">
              <p className="m-0 mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                <Truck size={16} />
                {tc("freeDeliveryRemaining", { amount: money(amountToFreeShipping) })}
              </p>
              <div className="grid grid-cols-10 gap-0.5" aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className={`h-2 border border-line-strong ${i < meterFilled ? "bg-hivis" : "bg-surface"}`} />
                ))}
              </div>
            </div>
          )}

          <ul className="list-none m-0 px-5 py-2 border-b border-line">
            {cart.items.map((item) => (
              <li key={item.id} className="flex items-baseline gap-2.5 py-1.5 text-xs">
                <span className="font-mono text-ink-subtle tabular-nums shrink-0">{item.quantity}×</span>
                <span className="flex-1 min-w-0 truncate text-ink-muted">{item.name}</span>
                <span className="font-mono font-semibold tabular-nums shrink-0">{money(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          {/* Discount */}
          <div className="px-5 py-4 border-b border-line">
            {discount ? (
              <div className="flex items-center gap-2.5 border-2 border-success px-3 py-2 text-sm">
                <Tag size={16} className="shrink-0 text-success" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink">{t("discountOff", { percent: discount.percent })}</div>
                  <div className="font-mono text-xs text-ink-muted">
                    {discount.type === "welcome" ? t("welcomeDiscount") : t("codeLabel", { code: discount.code })}
                  </div>
                </div>
                {discount.source === "code" && (
                  <button
                    type="button"
                    onClick={removeDiscount}
                    aria-label={t("removeDiscount")}
                    className="flex p-1 bg-transparent border-0 cursor-pointer text-ink-muted hover:text-danger"
                  >
                    <XIcon size={16} />
                  </button>
                )}
              </div>
            ) : (
              <div>
                <label htmlFor="co-promo" className="field-label">{t("promoLabel")}</label>
                <div className="flex">
                  <input
                    id="co-promo"
                    type="text"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyPromo(); } }}
                    placeholder="NEWS-XXXXXX"
                    className="field font-mono tracking-wide !border-r-0"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    disabled={!promoInput.trim() || applyingPromo}
                    className="btn-ink shrink-0 !min-h-[44px]"
                  >
                    {applyingPromo ? "…" : t("promoApply")}
                  </button>
                </div>
                {promoError && <span className={errCls}>{promoError}</span>}
              </div>
            )}
          </div>

          <dl className="m-0 px-5 py-3 text-sm">
            <div className="flex justify-between gap-4 py-1.5">
              <dt className="text-ink-muted">{t("subtotal")}</dt>
              <dd className="m-0 font-mono tabular-nums">{money(cart.subtotal)}</dd>
            </div>
            {discount && (
              <div className="flex justify-between gap-4 py-1.5 text-success">
                <dt>{t("discount", { percent: discount.percent })}</dt>
                <dd className="m-0 font-mono font-semibold tabular-nums">−{money(discountAmount)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 py-1.5">
              <dt className="text-ink-muted">{t("delivery")}</dt>
              <dd className={`m-0 font-mono tabular-nums ${finalShipping === 0 ? "text-success font-semibold" : ""}`}>
                {finalShipping > 0 ? money(finalShipping) : t("free")}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5">
              <dt className="text-ink-muted">{t("tax")}</dt>
              <dd className="m-0 font-mono tabular-nums">{money(taxOnDiscounted)}</dd>
            </div>
          </dl>

          <div className="flex items-baseline justify-between gap-4 px-5 py-3 bg-hivis text-coal border-y-2 border-coal">
            <span className="u-cond font-extrabold text-lg">{t("total")}</span>
            <span className="font-display font-extrabold text-2xl tabular-nums">{money(grandTotal)}</span>
          </div>

          <ul className="list-none m-0 px-5 py-3 flex flex-col gap-1.5 text-xs text-ink-subtle">
            <li className="flex items-center gap-1.5"><ShieldCheck size={14} />{t("secureNote")}</li>
            <li className="flex items-center gap-1.5"><Lock size={14} />{t("privacyNote")}</li>
          </ul>

          <MerchantInfo title={t("merchantInfo")} />
        </aside>
      </div>
    </div>
  );
}

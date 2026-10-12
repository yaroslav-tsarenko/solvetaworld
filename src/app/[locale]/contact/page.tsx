"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validators/contact";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { Link } from "@/i18n/routing";
import { COMPANY } from "@/lib/company";
import { toast } from "sonner";
import { PaperPlaneTilt, CheckSquare, ArrowRight } from "@phosphor-icons/react";

const TOPICS = ["general", "support", "warranty", "business"] as const;

function StepTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <legend className="flex items-center gap-3 mb-3 p-0">
      <span className="w-9 h-9 flex items-center justify-center bg-hivis text-coal font-display font-extrabold border-2 border-coal">{n}</span>
      <span className="font-display font-bold uppercase text-[1.2rem] tracking-wide text-ink">{children}</span>
    </legend>
  );
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const nav = useTranslations("nav");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      toast.success(t("success"));
    } catch {
      toast.error(t("failed"));
    } finally {
      setLoading(false);
    }
  };

  const errorCls = "block mt-1 text-xs font-semibold text-danger";

  return (
    <div className="max-w-container mx-auto px-4 lg:px-6 pb-20">
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("title") }]} />

      <header className="pb-5 mb-8 border-b-4 border-line-strong grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
        <div>
          <h1 className="m-0 text-[3.25rem] max-sm:text-[2.25rem] leading-none text-ink">{t("title")}</h1>
          <p className="m-0 mt-3 text-[1.0625rem] text-ink-muted max-w-[60ch]">{t("subtitle")}</p>
        </div>
        <Link href="/faq" className="btn-line !min-h-10 !text-base self-start md:self-end">
          {t("faqLink")} <ArrowRight size={16} />
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-12 items-start">
        {/* Reach-us sheet */}
        <aside className="border-2 border-line-strong lg:sticky lg:top-[calc(var(--header-height)+var(--deptbar-height)+1rem)]">
          <p className="m-0 px-4 py-3 bg-coal text-hivis font-display font-bold uppercase tracking-wider">{t("reachTitle")}</p>
          <dl className="m-0">
            <div className="px-4 py-3 border-b border-line">
              <dt className="font-display uppercase tracking-wide text-xs text-ink-subtle">{t("byEmail")}</dt>
              <dd className="m-0 mt-0.5">
                <a href={`mailto:${COMPANY.email}`} className="font-semibold text-link underline underline-offset-2 break-all">{COMPANY.email}</a>
                <span className="block text-xs text-ink-muted mt-0.5">{t("emailReply")}</span>
              </dd>
            </div>
            {COMPANY.phone && (
              <div className="px-4 py-3 border-b border-line">
                <dt className="font-display uppercase tracking-wide text-xs text-ink-subtle">{t("byPhone")}</dt>
                <dd className="m-0 mt-0.5">
                  <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="font-display font-extrabold text-2xl text-ink tabular-nums">{COMPANY.phone}</a>
                  <span className="block text-xs text-ink-muted mt-0.5">{t("phoneHours")}</span>
                </dd>
              </div>
            )}
            <div className="px-4 py-3 border-b border-line">
              <dt className="font-display uppercase tracking-wide text-xs text-ink-subtle">{t("hoursTitle")}</dt>
              <dd className="m-0 mt-0.5 text-sm">
                <table className="w-full text-sm">
                  <tbody>
                    <tr><td className="py-0.5">{t("weekdays")}</td><td className="py-0.5 text-right font-semibold tabular-nums">9:00–18:00</td></tr>
                    <tr><td className="py-0.5">{t("saturday")}</td><td className="py-0.5 text-right font-semibold tabular-nums">10:00–14:00</td></tr>
                  </tbody>
                </table>
              </dd>
            </div>
            <div className="px-4 py-3 bg-surface-1">
              <dt className="font-display uppercase tracking-wide text-xs text-ink-subtle">{t("registered")}</dt>
              <dd className="m-0 mt-0.5 text-sm leading-relaxed">
                <strong className="block">{COMPANY.name}</strong>
                {t("companyNo")} {COMPANY.companyNumber}
                <br />
                {COMPANY.registeredOffice}
              </dd>
            </div>
          </dl>
        </aside>

        {/* Enquiry form */}
        <section className="border-2 border-line-strong bg-surface p-6 sm:p-8" aria-labelledby="enquiry-title">
          <h2 id="enquiry-title" className="sr-only">{t("formTitle")}</h2>
          {submitted ? (
            <div className="flex flex-col items-start gap-4 py-6">
              <span className="w-14 h-14 flex items-center justify-center bg-hivis text-coal border-2 border-coal">
                <CheckSquare size={32} />
              </span>
              <p className="m-0 font-display font-extrabold uppercase text-[2rem] leading-none">{t("sentTitle")}</p>
              <p className="m-0 text-ink-muted max-w-[52ch]">{t("success")}</p>
              <button
                type="button"
                className="btn-ink"
                onClick={() => {
                  reset();
                  setSelectedTopic("");
                  setSubmitted(false);
                }}
              >
                {t("sendAnother")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
              <fieldset className="m-0 p-0 border-0">
                <StepTitle n="01">{t("stepTopic")}</StepTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup">
                  {TOPICS.map((key) => {
                    const label = t(`topic_${key}`);
                    const on = selectedTopic === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => {
                          setSelectedTopic(key);
                          setValue("subject", label, { shouldValidate: true });
                        }}
                        className={`flex items-center gap-3 h-12 px-3 text-left text-sm font-semibold border-2 cursor-pointer ${
                          on ? "bg-hivis text-coal border-coal" : "bg-surface text-ink border-line hover:border-line-strong"
                        }`}
                      >
                        <span className={`w-4 h-4 border-2 ${on ? "bg-coal border-coal" : "border-line-strong"}`} aria-hidden="true" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="m-0 p-0 border-0">
                <StepTitle n="02">{t("stepDetails")}</StepTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="field-label">{t("name")}</span>
                    <input className="field" autoComplete="name" {...register("name")} />
                    {errors.name && <span className={errorCls}>{errors.name.message}</span>}
                  </label>
                  <label className="block">
                    <span className="field-label">{t("email")}</span>
                    <input className="field" type="email" autoComplete="email" {...register("email")} />
                    {errors.email && <span className={errorCls}>{errors.email.message}</span>}
                  </label>
                </div>
              </fieldset>

              <fieldset className="m-0 p-0 border-0">
                <StepTitle n="03">{t("stepMessage")}</StepTitle>
                <label className="block mb-4">
                  <span className="field-label">{t("subject")}</span>
                  <input className="field" placeholder={t("subjectHint")} {...register("subject")} />
                  {errors.subject && <span className={errorCls}>{errors.subject.message}</span>}
                </label>
                <label className="block">
                  <span className="field-label">{t("message")}</span>
                  <textarea className="field resize-y leading-relaxed" rows={6} placeholder={t("messageHint")} {...register("message")} />
                  {errors.message && <span className={errorCls}>{errors.message.message}</span>}
                </label>
              </fieldset>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t-2 border-line-strong">
                <button type="submit" disabled={loading} className="btn-yellow !min-h-[52px] !px-8 !text-[1.2rem] mt-4">
                  <PaperPlaneTilt size={20} /> {loading ? t("sending") : t("send")}
                </button>
                <p className="m-0 mt-4 text-xs text-ink-muted max-w-[48ch]">{t("privacyNote")}</p>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

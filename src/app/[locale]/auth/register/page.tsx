"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react";
import { COUNTRIES } from "@/lib/countries";
import { AuthCounter, FieldError, PasswordField } from "../_components/AuthCounter";

type StrengthKey = "strengthWeak" | "strengthFair" | "strengthGood" | "strengthStrong";

/** Length-based strength: 1–4 filled bars, or 0 when empty. */
function getPasswordStrength(password: string): { bars: number; key: StrengthKey | null; tone: string } {
  if (password.length === 0) return { bars: 0, key: null, tone: "" };
  if (password.length < 6) return { bars: 1, key: "strengthWeak", tone: "bg-danger" };
  if (password.length < 10) return { bars: 2, key: "strengthFair", tone: "bg-warning" };
  if (password.length < 14) return { bars: 3, key: "strengthGood", tone: "bg-success" };
  return { bars: 4, key: "strengthStrong", tone: "bg-success" };
}

const STEP_KEYS = ["stepYou", "stepContact", "stepAddress", "stepPassword"] as const;
const LAST_STEP = STEP_KEYS.length - 1;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
  acceptedPolicies: boolean;
}

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  country: "",
  postalCode: "",
  dateOfBirth: "",
  password: "",
  confirmPassword: "",
  acceptedPolicies: false,
};

export default function RegisterPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  const selectedCountry = COUNTRIES.find((c) => c.code === form.country);
  const phoneHint = selectedCountry ? selectedCountry.phone : "+44";

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function validateStep(s: number): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (s === 0) {
      if (!form.firstName.trim()) errs.firstName = t("errFirstName");
      if (!form.lastName.trim()) errs.lastName = t("errLastName");
      if (!form.dateOfBirth) errs.dateOfBirth = t("errDob");
      else {
        const dob = new Date(form.dateOfBirth);
        const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        if (age < 18) errs.dateOfBirth = t("errAge");
      }
    } else if (s === 1) {
      if (!form.email.trim()) errs.email = t("errEmail");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t("errEmailInvalid");
      if (!form.phone.trim()) errs.phone = t("errPhone");
    } else if (s === 2) {
      if (!form.street.trim()) errs.street = t("errStreet");
      if (!form.city.trim()) errs.city = t("errCity");
      if (!form.country) errs.country = t("errCountry");
      if (!form.postalCode.trim()) errs.postalCode = t("errPostal");
    } else if (s === 3) {
      if (!form.password) errs.password = t("errPassword");
      else if (form.password.length < 6) errs.password = t("passwordTooShort");
      if (form.password !== form.confirmPassword) errs.confirmPassword = t("passwordsMismatch");
      if (!form.acceptedPolicies) errs.acceptedPolicies = t("errPolicies");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, LAST_STEP));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Enter on an earlier step advances instead of submitting.
    if (step < LAST_STEP) {
      goNext();
      return;
    }
    if (!validateStep(LAST_STEP)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          street: form.street,
          city: form.city,
          country: form.country,
          postalCode: form.postalCode,
          dateOfBirth: form.dateOfBirth,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("registerFailed"));
      toast.success(t("registerOk"));
      window.location.href = `/${locale}/account`;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("registerFailed"));
    } finally {
      setLoading(false);
    }
  };

  /** Props shared by every plain text input: id, value binding, error wiring. */
  const fieldProps = (field: keyof FormData) => ({
    id: `reg-${field}`,
    value: form[field] as string,
    onChange: set(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `reg-${field}-err` : undefined,
    className: `field ${errors[field] ? "border-danger!" : ""}`,
  });

  const label = (field: keyof FormData, text: string) => (
    <label htmlFor={`reg-${field}`} className="field-label">
      {text} <span aria-hidden="true">*</span>
    </label>
  );

  const err = (field: keyof FormData) => <FieldError id={`reg-${field}-err`} message={errors[field]} />;

  const navRow = (
    <div className="flex gap-3 mt-2">
      {step > 0 && (
        <button type="button" className="btn-line" onClick={goBack}>
          <ArrowLeft size={16} /> {t("back")}
        </button>
      )}
      {step < LAST_STEP ? (
        <button type="button" className="btn-yellow flex-1" onClick={goNext}>
          {t("next")} <ArrowRight size={16} />
        </button>
      ) : (
        <button type="submit" className="btn-yellow flex-1" disabled={loading} aria-busy={loading}>
          {loading ? t("working") : t("registerSubmit")}
        </button>
      )}
    </div>
  );

  return (
    <AuthCounter code={t("formCodeRegister")} title={t("registerTitle")} lead={t("registerSubtitle")}>
      {/* Numbered step strip */}
      <ol className="list-none m-0 p-0 mb-6 grid grid-cols-4 border-2 border-line-strong" aria-label={t("stepCounter", { current: step + 1, total: STEP_KEYS.length })}>
        {STEP_KEYS.map((key, i) => {
          const isActive = i === step;
          const isDone = i < step;
          return (
            <li key={key} className={i > 0 ? "border-l-2 border-line-strong" : ""}>
              <button
                type="button"
                onClick={() => isDone && setStep(i)}
                disabled={!isDone && !isActive}
                aria-current={isActive ? "step" : undefined}
                className={`w-full h-full flex flex-col items-start gap-0.5 px-2.5 py-2 text-left border-0 font-display uppercase ${
                  isActive
                    ? "bg-hivis text-coal"
                    : isDone
                      ? "bg-coal text-white cursor-pointer hover:bg-coal-2"
                      : "bg-surface text-ink-subtle cursor-default"
                }`}
              >
                <span className="flex items-center gap-1 text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                  {isDone && <Check size={12} />}
                </span>
                <span className="text-sm sm:text-base font-extrabold leading-none truncate max-w-full">{t(key)}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="u-cond m-0 mb-4 text-sm font-bold text-ink-muted">
        {t("stepCounter", { current: step + 1, total: STEP_KEYS.length })} — {t(STEP_KEYS[step])}
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {step === 0 && (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                {label("firstName", t("firstName"))}
                <input type="text" autoComplete="given-name" {...fieldProps("firstName")} />
                {err("firstName")}
              </div>
              <div>
                {label("lastName", t("lastName"))}
                <input type="text" autoComplete="family-name" {...fieldProps("lastName")} />
                {err("lastName")}
              </div>
            </div>
            <div className="sm:max-w-[16rem]">
              {label("dateOfBirth", t("dateOfBirth"))}
              <input type="date" autoComplete="bday" {...fieldProps("dateOfBirth")} />
              {err("dateOfBirth")}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              {label("email", t("email"))}
              <input type="email" autoComplete="email" placeholder={t("emailPlaceholder")} {...fieldProps("email")} />
              {err("email")}
            </div>
            <div>
              {label("phone", t("phone"))}
              <input type="tel" autoComplete="tel" placeholder={`${phoneHint} XX XXX XXXX`} {...fieldProps("phone")} />
              {err("phone")}
              {!form.country && <p className="m-0 mt-1.5 text-xs text-ink-subtle">{t("phoneCountryHint")}</p>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              {label("street", t("street"))}
              <input type="text" autoComplete="street-address" {...fieldProps("street")} />
              {err("street")}
            </div>
            <div className="grid sm:grid-cols-[minmax(0,1fr)_11rem] gap-5">
              <div>
                {label("city", t("city"))}
                <input type="text" autoComplete="address-level2" {...fieldProps("city")} />
                {err("city")}
              </div>
              <div>
                {label("postalCode", t("postalCode"))}
                <input type="text" autoComplete="postal-code" placeholder={t("postalPlaceholder")} {...fieldProps("postalCode")} />
                {err("postalCode")}
              </div>
            </div>
            <div>
              {label("country", t("country"))}
              <select autoComplete="country" {...fieldProps("country")}>
                <option value="">{t("selectCountry")}</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
              {err("country")}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              {label("password", t("password"))}
              <PasswordField
                id="reg-password"
                autoComplete="new-password"
                value={form.password}
                onChange={set("password")}
                placeholder={t("newPasswordPlaceholder")}
                invalid={!!errors.password}
                aria-describedby={errors.password ? "reg-password-err" : undefined}
              />
              {err("password")}
              {strength.key && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex gap-1 flex-1" aria-hidden="true">
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className={`h-2 flex-1 ${n <= strength.bars ? strength.tone : "bg-surface-2"}`} />
                    ))}
                  </div>
                  <span className="u-cond text-xs font-bold text-ink-muted shrink-0">
                    {t("strength")}: {t(strength.key)}
                  </span>
                </div>
              )}
            </div>

            <div>
              {label("confirmPassword", t("confirmPassword"))}
              <PasswordField
                id="reg-confirmPassword"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                placeholder={t("repeatPasswordPlaceholder")}
                invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "reg-confirmPassword-err" : undefined}
              />
              {err("confirmPassword")}
            </div>

            <div className={`border-2 p-4 ${errors.acceptedPolicies ? "border-danger" : "border-line"}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.acceptedPolicies}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setForm((prev) => ({ ...prev, acceptedPolicies: checked }));
                    setErrors((prev) => ({ ...prev, acceptedPolicies: undefined }));
                  }}
                  aria-invalid={errors.acceptedPolicies ? true : undefined}
                  aria-describedby={errors.acceptedPolicies ? "reg-acceptedPolicies-err" : undefined}
                  className="w-5 h-5 mt-0.5 shrink-0 cursor-pointer accent-coal"
                />
                <span className="text-sm text-ink leading-normal">
                  {t.rich("policiesAgree", {
                    terms: (chunks) => (
                      <Link href="/policies/terms" target="_blank" className="font-semibold text-link underline underline-offset-2">
                        {chunks}
                      </Link>
                    ),
                    privacy: (chunks) => (
                      <Link href="/policies/privacy" target="_blank" className="font-semibold text-link underline underline-offset-2">
                        {chunks}
                      </Link>
                    ),
                  })}
                </span>
              </label>
              {err("acceptedPolicies")}
            </div>
          </>
        )}

        {navRow}
      </form>

      <div className="mt-8 pt-5 border-t-2 border-line flex flex-wrap items-center justify-between gap-3">
        <span className="u-cond text-sm font-bold text-ink-muted">{t("hasAccount")}</span>
        <Link href="/auth/login" className="btn-line">
          {t("signIn")}
        </Link>
      </div>
    </AuthCounter>
  );
}

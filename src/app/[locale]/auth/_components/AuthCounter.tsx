"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeSlash } from "@phosphor-icons/react";

const PERKS = ["perkOrders", "perkAddress", "perkWishlist", "perkCheckout"] as const;

interface AuthCounterProps {
  /** Short code shown on the right of the form header ("Sign-in", "New account"…). */
  code: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}

/**
 * Two-part "counter" used by every auth page: the form on a white panel and,
 * beside it (below it on phones), an ink panel listing what an account is for.
 */
export function AuthCounter({ code, title, lead, children }: AuthCounterProps) {
  const t = useTranslations("auth");

  return (
    <div className="max-w-container mx-auto px-4 py-8 md:py-14">
      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] border-2 border-line-strong">
        <section className="bg-surface p-5 sm:p-8 md:p-10 min-w-0">
          <header className="sec-head">
            <h1 className="m-0 text-[2rem] sm:text-[2.5rem] text-ink">{title}</h1>
            <span className="u-cond shrink-0 border-2 border-line-strong px-2 py-0.5 text-xs font-bold text-ink">
              {code}
            </span>
          </header>
          {lead && <p className="m-0 mb-6 text-ink-muted max-w-[52ch]">{lead}</p>}
          <div className="max-w-[560px]">{children}</div>
        </section>

        <aside className="bg-coal text-white p-6 sm:p-8 md:p-10 flex flex-col gap-6 border-t-2 lg:border-t-0 lg:border-l-2 border-line-strong">
          <p className="u-cond m-0 text-sm font-bold text-hivis">{t("panelEyebrow")}</p>
          <p className="m-0 font-display font-extrabold uppercase text-[2rem] leading-[1.02] text-white">
            {t("panelTitle")}
          </p>
          <ol className="list-none m-0 p-0 border-t border-white/20">
            {PERKS.map((key, i) => (
              <li key={key} className="flex items-center gap-4 py-3 border-b border-white/20">
                <span className="w-9 h-9 shrink-0 flex items-center justify-center bg-hivis text-coal font-display font-extrabold text-lg">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.95rem] text-white">{t(key)}</span>
              </li>
            ))}
          </ol>
          <p className="m-0 mt-auto text-sm text-white/70">{t("panelNote")}</p>
        </aside>
      </div>
    </div>
  );
}

/** Inline field error, tied to its input via aria-describedby. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="m-0 mt-1.5 text-[0.8125rem] font-semibold text-danger">
      {message}
    </p>
  );
}

interface PasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
}

/** `.field` password input with a square show/hide toggle on its right edge. */
export function PasswordField({ invalid, className = "", ...props }: PasswordFieldProps) {
  const t = useTranslations("auth");
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={`field pr-12! ${invalid ? "border-danger!" : ""} ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t("hidePassword") : t("showPassword")}
        tabIndex={-1}
        className="absolute right-0 top-0 h-full w-11 flex items-center justify-center border-l-2 border-line text-ink-muted hover:text-ink hover:bg-surface-1 cursor-pointer bg-transparent"
      >
        {visible ? <EyeSlash size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

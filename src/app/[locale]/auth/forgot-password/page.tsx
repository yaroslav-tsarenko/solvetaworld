"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, EnvelopeSimple } from "@phosphor-icons/react";
import { toast } from "sonner";
import { AuthCounter } from "../_components/AuthCounter";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("genericError"));
      }
      setSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("genericError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCounter code={t("formCodeForgot")} title={t("forgotPasswordTitle")} lead={sent ? undefined : t("forgotPasswordSubtitle")}>
      {sent ? (
        <div role="status" className="flex items-start gap-4 border-2 border-line-strong bg-surface-1 p-5">
          <span className="w-11 h-11 shrink-0 flex items-center justify-center bg-hivis text-coal border-2 border-coal">
            <EnvelopeSimple size={22} />
          </span>
          <p className="m-0 text-ink leading-relaxed">{t("resetEmailSent")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="forgot-email" className="field-label">{t("email")}</label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t("emailPlaceholder")}
              className="field"
            />
          </div>
          <button type="submit" className="btn-yellow w-full" disabled={loading} aria-busy={loading}>
            {loading ? t("working") : t("sendResetLink")}
          </button>
        </form>
      )}

      <div className="mt-8 pt-5 border-t-2 border-line">
        <Link href="/auth/login" className="inline-flex items-center gap-2 u-cond text-sm font-bold text-ink hover:underline underline-offset-4 decoration-2 decoration-hivis">
          <ArrowLeft size={16} />
          {t("backToLogin")}
        </Link>
      </div>
    </AuthCounter>
  );
}

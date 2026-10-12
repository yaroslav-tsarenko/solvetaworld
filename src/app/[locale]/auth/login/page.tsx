"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "@phosphor-icons/react";
import { toast } from "sonner";
import { AuthCounter, PasswordField } from "../_components/AuthCounter";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("loginFailed"));
      toast.success(t("loginOk"));
      if (data.user?.role === "ADMIN" || data.user?.role === "SUPER_ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = `/${locale}/account`;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCounter code={t("formCodeLogin")} title={t("loginTitle")} lead={t("loginSubtitle")}>
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-5">
        <div>
          <label htmlFor="login-email" className="field-label">{t("email")}</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t("emailPlaceholder")}
            className="field"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="login-password" className="field-label">{t("password")}</label>
            <Link
              href="/auth/forgot-password"
              className="mb-1.5 text-[0.8125rem] font-semibold text-link hover:underline underline-offset-2"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <PasswordField
            id="login-password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t("passwordPlaceholder")}
          />
        </div>

        <button type="submit" className="btn-yellow w-full mt-1" disabled={loading} aria-busy={loading}>
          {loading ? t("working") : t("signIn")}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="mt-8 pt-5 border-t-2 border-line flex flex-wrap items-center justify-between gap-3">
        <span className="u-cond text-sm font-bold text-ink-muted">{t("noAccount")}</span>
        <Link href="/auth/register" className="btn-line">
          {t("signUp")}
        </Link>
      </div>
    </AuthCounter>
  );
}

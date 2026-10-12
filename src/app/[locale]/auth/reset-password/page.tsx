"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Check, Warning } from "@phosphor-icons/react";
import { toast } from "sonner";
import { AuthCounter, PasswordField } from "../_components/AuthCounter";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("passwordsMismatch"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("passwordTooShort"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("genericError"));
      setSuccess(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("genericError"));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthCounter code={t("formCodeReset")} title={t("invalidResetLink")}>
        <div role="alert" className="flex items-start gap-4 border-2 border-danger p-5">
          <span className="w-11 h-11 shrink-0 flex items-center justify-center bg-danger text-white">
            <Warning size={22} />
          </span>
          <p className="m-0 text-ink leading-relaxed">{t("invalidResetLinkDesc")}</p>
        </div>
        <Link href="/auth/forgot-password" className="btn-yellow mt-6">
          {t("requestNewLink")}
        </Link>
      </AuthCounter>
    );
  }

  return (
    <AuthCounter code={t("formCodeReset")} title={t("resetPasswordTitle")} lead={success ? undefined : t("resetPasswordSubtitle")}>
      {success ? (
        <>
          <div role="status" className="flex items-start gap-4 border-2 border-line-strong bg-surface-1 p-5">
            <span className="w-11 h-11 shrink-0 flex items-center justify-center bg-hivis text-coal border-2 border-coal">
              <Check size={22} />
            </span>
            <p className="m-0 text-ink leading-relaxed">{t("passwordResetSuccess")}</p>
          </div>
          <Link href="/auth/login" className="btn-yellow mt-6">
            {t("signIn")}
          </Link>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="reset-password" className="field-label">{t("newPassword")}</label>
            <PasswordField
              id="reset-password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t("newPasswordPlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="reset-confirm" className="field-label">{t("confirmPassword")}</label>
            <PasswordField
              id="reset-confirm"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t("repeatPasswordPlaceholder")}
            />
          </div>
          <button type="submit" className="btn-yellow w-full mt-1" disabled={loading} aria-busy={loading}>
            {loading ? t("working") : t("resetPassword")}
          </button>
        </form>
      )}
    </AuthCounter>
  );
}

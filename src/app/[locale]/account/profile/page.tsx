"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "@/lib/validators/profile";
import { useAuth } from "@/providers/AuthProvider";
import { LockSimple } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function ProfilePage() {
  const t = useTranslations("account");
  const common = useTranslations("common");
  const { user, refresh } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            reset({ name: data.user.name || "", phone: data.user.phone || "" });
          }
        });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user?.id, email: user?.email, name: data.name }),
      });
      await refresh();
      toast.success(t("profileSaved"));
    } catch {
      toast.error(t("profileFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="sec-head">
        <h1 className="m-0 text-[2rem] text-ink">{t("editProfile")}</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[44rem] border-2 border-line-strong"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-[12rem_minmax(0,1fr)] border-b border-line">
          <label htmlFor="profile-email" className="field-label m-0! px-4 pt-4 sm:py-4 sm:bg-surface-1 sm:border-r sm:border-line">
            {t("fieldEmail")}
          </label>
          <div className="px-4 py-3">
            <div className="relative">
              <input
                id="profile-email"
                value={user?.email || ""}
                readOnly
                aria-describedby="profile-email-note"
                className="field font-mono pr-10! bg-surface-1! text-ink-muted! cursor-not-allowed"
              />
              <LockSimple size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
            </div>
            <p id="profile-email-note" className="m-0 mt-1.5 text-xs text-ink-subtle">{t("emailLocked")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[12rem_minmax(0,1fr)] border-b border-line">
          <label htmlFor="profile-name" className="field-label m-0! px-4 pt-4 sm:py-4 sm:bg-surface-1 sm:border-r sm:border-line">
            {t("fieldName")}
          </label>
          <div className="px-4 py-3">
            <input
              id="profile-name"
              autoComplete="name"
              {...register("name")}
              aria-invalid={errors.name ? true : undefined}
              className={`field ${errors.name ? "border-danger!" : ""}`}
            />
            {errors.name && <p className="m-0 mt-1.5 text-[0.8125rem] font-semibold text-danger">{errors.name.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[12rem_minmax(0,1fr)] border-b-2 border-line-strong">
          <label htmlFor="profile-phone" className="field-label m-0! px-4 pt-4 sm:py-4 sm:bg-surface-1 sm:border-r sm:border-line">
            {t("fieldPhone")}
          </label>
          <div className="px-4 py-3">
            <input id="profile-phone" type="tel" autoComplete="tel" {...register("phone")} className="field" />
          </div>
        </div>

        <div className="flex justify-end px-4 py-3 bg-surface-1">
          <button type="submit" className="btn-yellow" disabled={loading} aria-busy={loading}>
            {loading ? common("loading") : common("save")}
          </button>
        </div>
      </form>
    </div>
  );
}

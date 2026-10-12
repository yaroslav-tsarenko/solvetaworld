"use client";

import { useAuth } from "@/providers/AuthProvider";
import { AccountSidebar } from "@/components/account/AccountSidebar/AccountSidebar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const locale = useLocale();
  const nav = useTranslations("nav");
  const t = useTranslations("account");

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = `/${locale}/auth/login`;
    }
  }, [loading, user, locale]);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="max-w-container mx-auto px-4 pb-16">
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("title") }]} />
      <AccountSidebar />
      <div className="pt-8 min-w-0">{children}</div>
    </div>
  );
}

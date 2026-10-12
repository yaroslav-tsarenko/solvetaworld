"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin } from "@phosphor-icons/react";
import { useAuth } from "@/providers/AuthProvider";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { COUNTRIES } from "@/lib/countries";

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string | null;
  city: string;
  province?: string | null;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
}

/** Read-only list of the addresses stored on the signed-in account. */
export default function AddressesPage() {
  const t = useTranslations("account");
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        const list: Address[] = Array.isArray(data.user?.addresses) ? data.user.addresses : [];
        // Default first, then in the order they were stored.
        setAddresses([...list].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)));
      })
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const countryName = (code: string) => COUNTRIES.find((c) => c.code === code)?.name || code;

  return (
    <div>
      <div className="sec-head">
        <h1 className="m-0 text-[2rem] text-ink">{t("addresses")}</h1>
        {addresses.length > 0 && <p className="m-0 text-sm text-ink-muted">{t("addressesLead")}</p>}
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          title={t("noAddresses")}
          subtitle={t("noAddressesSubtitle")}
          icon={<MapPin size={34} />}
        />
      ) : (
        <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {addresses.map((a, i) => (
            <li key={a.id} className={`border-2 flex flex-col ${a.isDefault ? "border-line-strong" : "border-line"}`}>
              <div className="flex items-center justify-between gap-3 px-4 py-2 border-b-2 border-inherit bg-surface-1">
                <span className="font-mono text-xs text-ink-subtle">{String(i + 1).padStart(2, "0")}</span>
                {a.isDefault && (
                  <span className="u-cond px-2 py-0.5 bg-hivis text-coal border-2 border-coal text-xs font-bold">
                    {t("defaultAddress")}
                  </span>
                )}
              </div>
              <address className="not-italic px-4 py-3 text-sm leading-relaxed text-ink">
                <strong className="font-semibold">{a.firstName} {a.lastName}</strong><br />
                {a.address1}<br />
                {a.address2 && <>{a.address2}<br /></>}
                {a.city}{a.province ? `, ${a.province}` : ""}<br />
                <span className="font-mono">{a.postalCode}</span><br />
                {countryName(a.country)}
                {a.phone && <><br /><span className="font-mono text-ink-muted">{a.phone}</span></>}
              </address>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Heart } from "@phosphor-icons/react";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";

type GridProduct = React.ComponentProps<typeof ProductGrid>["products"][number];

export default function WishlistPage() {
  const t = useTranslations("account");
  const [items, setItems] = useState<GridProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        setItems(
          Array.isArray(data) ? data.map((item: { product: GridProduct }) => item.product) : []
        );
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="sec-head">
        <h1 className="m-0 text-[2rem] text-ink">{t("wishlist")}</h1>
        {items.length > 0 && (
          <span className="u-cond text-sm font-bold text-ink-muted">{t("savedCount", { count: items.length })}</span>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={t("emptyWishlist")}
          subtitle={t("emptyWishlistSubtitle")}
          actionLabel={t("browseCatalog")}
          actionHref="/catalog"
          icon={<Heart size={34} />}
        />
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}

"use client";

import { ProductCard } from "@/components/product/ProductCard/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  brand?: string | null;
  price: number | string;
  comparePrice?: number | string | null;
  quantity?: number;
  lowStockAlert?: number;
  images?: { url: string; alt?: string | null }[];
}

interface ProductGridProps {
  products: Product[];
  /** Columns at the widest breakpoint; listings with a filter rail use 4. */
  wide?: boolean;
}

export function ProductGrid({ products, wide = false }: ProductGridProps) {
  return (
    <ul
      className={`list-none m-0 p-0 grid grid-cols-2 sm:grid-cols-3 gap-3 max-sm:gap-2 min-w-0 ${
        wide ? "lg:grid-cols-4 xl:grid-cols-5" : "xl:grid-cols-4"
      }`}
    >
      {products.map((p) => (
        <li key={p.id} className="flex min-w-0 [&>article]:flex-1">
          <ProductCard
            id={p.id}
            name={p.name}
            slug={p.slug}
            sku={p.sku}
            brand={p.brand}
            price={Number(p.price)}
            comparePrice={p.comparePrice != null ? Number(p.comparePrice) : null}
            imageUrl={p.images?.[0]?.url}
            quantity={p.quantity}
            lowStockAlert={p.lowStockAlert}
          />
        </li>
      ))}
    </ul>
  );
}

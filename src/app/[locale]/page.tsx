import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/shared/SEO/JsonLd";
import { HomeHero, type HeroDepartment } from "@/components/home/HomeHero/HomeHero";
import { DepartmentIndex } from "@/components/home/DepartmentIndex/DepartmentIndex";
import { CounterTerms } from "@/components/home/CounterTerms/CounterTerms";
import { ProductRail } from "@/components/home/ProductRail/ProductRail";
import { ContactBand } from "@/components/home/ContactBand/ContactBand";
import { BrandIndex } from "@/components/home/BrandIndex/BrandIndex";
import { COMPANY } from "@/lib/company";
import {
  getSaleProducts,
  getNewProducts,
  getDeepStockProducts,
  type HomepageProduct,
} from "@/lib/homepage-products";

export const dynamic = "force-dynamic";

interface CatNode {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  _count: { products: number };
  children?: CatNode[];
}

function subtreeCount(c: CatNode): number {
  return (c._count?.products || 0) + (c.children || []).reduce((s, ch) => s + subtreeCount(ch), 0);
}

const EMPTY = {
  departments: [] as HeroDepartment[],
  lineCount: 0,
  deepStock: [] as HomepageProduct[],
  priceCuts: [] as HomepageProduct[],
  justIn: [] as HomepageProduct[],
  brands: [] as { name: string; count: number }[],
};

/**
 * The home page is assembled from catalogue data only (departments, products,
 * brand counts). It does not read the legacy admin-managed homepage blocks.
 */
async function getHomeData(): Promise<typeof EMPTY> {
  try {
    const countSelect = { _count: { select: { products: true } } };
    const productSelect = {
      id: true, name: true, slug: true, sku: true, brand: true,
      price: true, comparePrice: true, quantity: true, lowStockAlert: true,
      isFeatured: true, createdAt: true,
      images: { orderBy: { sortOrder: "asc" as const }, take: 1, select: { url: true, alt: true } },
    };
    const [tree, lineCount, sample, reduced, brandGroups] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true, parentId: null },
        select: {
          id: true, name: true, slug: true, imageUrl: true, ...countSelect,
          children: {
            where: { isActive: true },
            select: {
              id: true, name: true, slug: true, imageUrl: true, ...countSelect,
              children: { where: { isActive: true }, select: { id: true, name: true, slug: true, imageUrl: true, ...countSelect } },
            },
          },
        },
      }),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        select: productSelect,
        orderBy: { createdAt: "desc" },
        take: 500,
      }),
      // Marked-down lines are rare in the newest slice, so they get their own pool.
      prisma.product.findMany({
        where: { status: "ACTIVE", comparePrice: { not: null } },
        select: productSelect,
        orderBy: { updatedAt: "desc" },
        take: 120,
      }),
      prisma.product.groupBy({
        by: ["brand"],
        where: { status: "ACTIVE", brand: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { brand: "desc" } },
        take: 18,
      }),
    ]);

    const departments: HeroDepartment[] = (tree as CatNode[])
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug, imageUrl: c.imageUrl, total: subtreeCount(c) }))
      .filter((d) => d.total > 0)
      .sort((a, b) => b.total - a.total);

    const products: HomepageProduct[] = JSON.parse(JSON.stringify(sample));
    const reducedPool: HomepageProduct[] = JSON.parse(JSON.stringify(reduced));

    // Acquirer compliance: no product appears in two homepage rails. Rails
    // claim their picks in page order; later rails draw from what is left.
    const claimed = new Set<string>();
    const rest = () => products.filter((p) => !claimed.has(p.id));
    const claim = (picked: HomepageProduct[]) => {
      picked.forEach((p) => claimed.add(p.id));
      return picked;
    };
    const deepStock = claim(getDeepStockProducts(rest(), 12));
    const priceCuts = claim(getSaleProducts(reducedPool.filter((p) => !claimed.has(p.id)), 12));
    const justIn = claim(getNewProducts(rest(), 12));

    const brands = brandGroups
      .filter((b) => b.brand && b.brand.trim().length > 1)
      .map((b) => ({ name: b.brand as string, count: b._count._all }))
      .slice(0, 12);

    return { departments, lineCount, deepStock, priceCuts, justIn, brands };
  } catch (e) {
    console.error("Home data fetch error:", e);
    return EMPTY;
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [data, t] = await Promise.all([getHomeData(), getTranslations("home")]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Store",
              "@id": `${siteUrl}/#store`,
              name: "Solvetaworld",
              legalName: COMPANY.name,
              url: siteUrl,
              logo: `${siteUrl}/logo.svg`,
              email: COMPANY.email,
              ...(COMPANY.phone ? { telephone: COMPANY.phone } : {}),
              address: { "@type": "PostalAddress", streetAddress: COMPANY.addressLine, addressCountry: "GB" },
              description:
                "Online supplier of hand and power tools, ironmongery, garden machinery, cable, wiring and test equipment.",
            },
            {
              "@type": "WebSite",
              "@id": `${siteUrl}/#site`,
              url: siteUrl,
              name: "Solvetaworld",
              publisher: { "@id": `${siteUrl}/#store` },
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/${locale}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }}
      />

      <HomeHero departments={data.departments.slice(0, 3)} lineCount={data.lineCount} />
      <DepartmentIndex departments={data.departments.slice(0, 8)} />
      <CounterTerms />
      <ProductRail
        id="sw-rail-stock"
        index="R-01"
        title={t("railStockTitle")}
        note={t("railStockNote")}
        href="/catalog?inStock=true"
        products={data.deepStock}
      />
      <ContactBand />
      <ProductRail
        id="sw-rail-cuts"
        index="R-02"
        title={t("railCutsTitle")}
        note={t("railCutsNote")}
        href="/catalog?onSale=true"
        products={data.priceCuts}
        tone="panel"
      />
      <BrandIndex brands={data.brands} />
      <ProductRail
        id="sw-rail-new"
        index="R-03"
        title={t("railNewTitle")}
        note={t("railNewNote")}
        href="/catalog?sort=newest"
        products={data.justIn}
      />
      <div className="h-16" aria-hidden="true" />
    </>
  );
}

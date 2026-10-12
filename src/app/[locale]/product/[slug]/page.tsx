import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGallery } from "@/components/product/ProductGallery/ProductGallery";
import { ProductBuyBox } from "@/components/product/ProductBuyBox/ProductBuyBox";
import { ProductSpecSheet } from "@/components/product/ProductSpecSheet/ProductSpecSheet";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { JsonLd } from "@/components/shared/SEO/JsonLd";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

async function getCategoryChain(categoryId: string): Promise<{ name: string; slug: string }[]> {
  const chain: { name: string; slug: string }[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const cat: { name: string; slug: string; parentId: string | null } | null =
      await prisma.category.findUnique({
        where: { id: currentId },
        select: { name: true, slug: true, parentId: true },
      });
    if (!cat) break;
    chain.unshift({ name: cat.name, slug: cat.slug });
    currentId = cat.parentId;
  }

  return chain;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, metaTitle: true, metaDescription: true, shortDescription: true },
  });

  if (!product) return {};

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || product.name,
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.shortDescription || undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations("product");
  const nav = await getTranslations("nav");
  const listing = await getTranslations("listing");

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      categories: { include: { category: true } },
      variants: true,
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || product.status === "ARCHIVED") notFound();

  const primaryCategory = product.categories[0]?.category;
  const categoryChain = primaryCategory
    ? await getCategoryChain(primaryCategory.id)
    : [];

  const reviewCount = product.reviews.length;
  const avgRating = reviewCount > 0
    ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount
    : 0;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const characteristics = product.characteristics as Record<string, Record<string, string>> | null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription || product.name,
    sku: product.sku,
    gtin13: product.ean || product.gtin || undefined,
    image: product.images[0]?.url,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      price: Number(product.price),
      priceCurrency: "GBP",
      availability: product.quantity > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/${locale}/product/${product.slug}`,
    },
    ...(reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount,
      },
    }),
  };

  const breadcrumbItems = [
    { label: nav("home"), href: "/" },
    { label: listing("catalogueTitle"), href: "/catalog" },
    ...categoryChain.map((cat) => ({
      label: cat.name,
      href: `/catalog/${cat.slug}`,
    })),
    { label: product.name },
  ];

  const keyData = [
    ...(product.brand ? [{ label: t("brand"), value: product.brand }] : []),
    { label: t("sku"), value: product.sku },
    ...(product.ean ? [{ label: t("ean"), value: product.ean }] : []),
    { label: t("condition"), value: product.condition },
    ...(primaryCategory ? [{ label: t("category"), value: categoryChain.map((c) => c.name).join(" › ") }] : []),
  ];

  return (
    <div className="max-w-container mx-auto px-4 lg:px-6 pb-20">
      <JsonLd data={jsonLd} />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 xl:gap-12 items-start">
        <div className="min-w-0">
          <header className="mb-5 pb-4 border-b-4 border-line-strong">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2 text-sm">
              {product.brand && (
                <Link
                  href={`/catalog?brand=${encodeURIComponent(product.brand)}`}
                  className="bg-coal text-white font-display font-bold uppercase tracking-wide px-2 py-0.5 hover:bg-hivis hover:text-coal"
                >
                  {product.brand}
                </Link>
              )}
              <span className="font-mono text-ink-muted">{t("sku")} {product.sku}</span>
              {product.ean && <span className="font-mono text-ink-muted">{t("ean")} {product.ean}</span>}
              {reviewCount > 0 && (
                <a href="#rev-title" className="font-mono text-ink-muted underline underline-offset-2">
                  {avgRating.toFixed(1)}/5 · {t("reviewCount", { count: reviewCount })}
                </a>
              )}
            </div>
            <h1 className="m-0 text-[2.5rem] max-md:text-[1.9rem] leading-[1.02] text-ink [overflow-wrap:anywhere]">{product.name}</h1>
            {product.shortDescription && (
              <p className="m-0 mt-3 text-[1rem] text-ink-muted leading-relaxed max-w-[70ch]">{product.shortDescription}</p>
            )}
          </header>

          <ProductGallery images={product.images} productName={product.name} />

          <ProductSpecSheet
            keyData={keyData}
            description={product.description}
            characteristics={characteristics}
            reviews={product.reviews.map((r) => ({
              ...r,
              createdAt: r.createdAt.toISOString(),
            }))}
          />
        </div>

        <aside className="lg:sticky lg:top-[calc(var(--header-height)+var(--deptbar-height)+1rem)]">
          <ProductBuyBox
            id={product.id}
            name={product.name}
            slug={product.slug}
            sku={product.sku}
            price={Number(product.price)}
            comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
            quantity={product.quantity}
            lowStockAlert={product.lowStockAlert}
            imageUrl={product.images[0]?.url}
          />
        </aside>
      </div>
    </div>
  );
}
